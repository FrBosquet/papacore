module.exports = function ({ types: t }) {
  return {
    name: 'transform-imports-exports',
    visitor: {
      Program(path) {
        // Initialize exports array in program state
        path.traverse({
          ExportNamedDeclaration(exportPath) {
            if (!path.exportsList) path.exportsList = [];

            if (exportPath.node.declaration) {
              // export const foo = ... or export function bar() {}
              if (t.isVariableDeclaration(exportPath.node.declaration)) {
                exportPath.node.declaration.declarations.forEach((declarator) => {
                  if (t.isIdentifier(declarator.id)) {
                    path.exportsList.push(declarator.id.name);
                  }
                });
              } else if (t.isFunctionDeclaration(exportPath.node.declaration) || t.isClassDeclaration(exportPath.node.declaration)) {
                if (exportPath.node.declaration.id) {
                  path.exportsList.push(exportPath.node.declaration.id.name);
                }
              }
            } else if (exportPath.node.specifiers) {
              // export { foo, bar }
              exportPath.node.specifiers.forEach((spec) => {
                path.exportsList.push(spec.exported.name);
              });
            }
          },
          ExportDefaultDeclaration(exportPath) {
            if (!path.exportsList) path.exportsList = [];
            path.exportsList.push('default');
          }
        });

        // Add return statement at the end if there are exports
        if (path.exportsList && path.exportsList.length > 0) {
          const returnStatement = t.returnStatement(
            t.objectExpression(
              path.exportsList.map((name) =>
                t.objectProperty(
                  t.identifier(name),
                  t.identifier(name),
                  false,
                  true // shorthand
                )
              )
            )
          );
          path.node.body.push(returnStatement);
        }
      },

      // Transform: import { foo } from './file'
      // To: const { foo } = await dc.require('./file')
      ImportDeclaration(path) {
        // Skip type-only imports (import type { ... } or import { type ... })
        if (path.node.importKind === 'type') {
          path.remove();
          return;
        }

        const source = path.node.source.value;

        // Remove all imports from 'react' - everything is available on dc global
        if (source === 'react') {
          path.remove();
          return;
        }

        const specifiers = path.node.specifiers;

        // Filter out type-only specifiers and unused imports
        const valueSpecifiers = specifiers.filter(spec => {
          if (t.isImportSpecifier(spec)) {
            // Remove if it's explicitly a type import
            if (spec.importKind === 'type') {
              return false;
            }

            // Check if the import is actually used in the code
            const binding = path.scope.getBinding(spec.local.name);
            if (!binding) return false;

            // If all references are in type positions, it's a type-only import
            const hasValueReference = binding.referencePaths.some(refPath => {
              // Check if this reference is in a type annotation position
              const parent = refPath.parent;

              // Type annotations, type parameters, etc.
              if (t.isTSTypeReference(parent) ||
                  t.isTSTypeAnnotation(parent) ||
                  t.isTSTypeParameterInstantiation(parent) ||
                  t.isTSQualifiedName(parent)) {
                return false;
              }

              return true;
            });

            return hasValueReference;
          }
          return true;
        });

        if (valueSpecifiers.length === 0) {
          // All imports were type-only, remove the entire import
          path.remove();
          return;
        }

        // Build the destructuring pattern or identifier
        let id;

        const defaultImport = valueSpecifiers.find((s) => t.isImportDefaultSpecifier(s));
        const namedImports = valueSpecifiers.filter((s) => t.isImportSpecifier(s));
        const namespaceImport = valueSpecifiers.find((s) => t.isImportNamespaceSpecifier(s));

        if (namespaceImport) {
          // import * as foo from './file'
          id = namespaceImport.local;
        } else if (namedImports.length > 0 && !defaultImport) {
          // import { foo, bar } from './file'
          id = t.objectPattern(
            namedImports.map((spec) =>
              t.objectProperty(
                t.identifier(spec.imported.name),
                spec.local,
                false,
                spec.imported.name === spec.local.name
              )
            )
          );
        } else if (defaultImport && namedImports.length === 0) {
          // import foo from './file'
          // Assuming default export is in a 'default' property
          id = t.objectPattern([
            t.objectProperty(
              t.identifier('default'),
              defaultImport.local
            )
          ]);
        } else {
          // Mixed: import foo, { bar } from './file'
          // This is complex - for now, use the default import name
          id = defaultImport.local;
        }

        const requireCall = t.awaitExpression(
          t.callExpression(
            t.memberExpression(t.identifier('dc'), t.identifier('require')),
            [t.stringLiteral(source)]
          )
        );

        const varDeclaration = t.variableDeclaration('const', [
          t.variableDeclarator(id, requireCall),
        ]);

        path.replaceWith(varDeclaration);
      },

      // Remove export keywords from declarations
      ExportNamedDeclaration(path) {
        if (path.node.declaration) {
          path.replaceWith(path.node.declaration);
        } else if (path.node.specifiers.length > 0) {
          // export { foo, bar } - remove this statement
          path.remove();
        }
      },

      // Remove export default, but keep the declaration
      ExportDefaultDeclaration(path) {
        // export default foo -> const default = foo
        const declaration = path.node.declaration;

        if (t.isExpression(declaration)) {
          const varDeclaration = t.variableDeclaration('const', [
            t.variableDeclarator(t.identifier('default'), declaration),
          ]);
          path.replaceWith(varDeclaration);
        } else {
          // Function or class declaration
          path.replaceWith(declaration);
        }
      },
    },
  };
};
