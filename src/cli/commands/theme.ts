import { formatHex, oklch, parse } from 'culori';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { logger } from '../utils/logger.js';

/**
 * Generate 11 shades (50-950) from a base color using OKLCH
 * This creates a perceptually uniform color scale
 */
function generateColorShades(baseColor: string): Record<string, string> {
  // Parse the input color to OKLCH
  const parsed = parse(baseColor);
  if (!parsed) {
    throw new Error(`Invalid color: ${baseColor}`);
  }

  const color = oklch(parsed);
  if (!color) {
    throw new Error(`Could not convert color to OKLCH: ${baseColor}`);
  }

  const { l: baseLightness, c: baseChroma, h: baseHue } = color;

  // Define target lightness values for each shade
  // These create a perceptually balanced scale from light to dark
  const lightnessMap: Record<number, number> = {
    50: 0.97,  // Very light
    100: 0.94,
    200: 0.88,
    300: 0.78,
    400: 0.68,
    500: 0.58, // Base/medium
    600: 0.48,
    700: 0.38,
    800: 0.28,
    900: 0.20,
    950: 0.13, // Very dark
  };

  const shades: Record<string, string> = {};

  for (const [shade, targetLightness] of Object.entries(lightnessMap)) {
    // Adjust chroma based on lightness to avoid muddy colors
    // Reduce chroma at very light and very dark ends
    let adjustedChroma = baseChroma;
    if (targetLightness > 0.9) {
      adjustedChroma = baseChroma * 0.3;
    } else if (targetLightness < 0.2) {
      adjustedChroma = baseChroma * 0.5;
    }

    const shadeColor = {
      mode: 'oklch' as const,
      l: targetLightness,
      c: adjustedChroma,
      h: baseHue,
    };

    // Convert back to hex
    shades[shade] = formatHex(shadeColor);
  }

  return shades;
}

/**
 * Update or add a color palette in styles.css
 */
function updateStylesCSS(
  stylesPath: string,
  colorName: string,
  shades: Record<string, string>
): void {
  if (!existsSync(stylesPath)) {
    throw new Error(`styles.css not found at: ${stylesPath}`);
  }

  let content = readFileSync(stylesPath, 'utf-8');

  // Generate the color variable lines
  const colorLines = Object.entries(shades)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([shade, hex]) => `  --color-${colorName}-${shade}: ${hex};`)
    .join('\n');

  // Check if this color already exists
  const colorPattern = new RegExp(
    `  --color-${colorName}-\\d+:.*?;`,
    'g'
  );

  if (colorPattern.test(content)) {
    // Replace existing color
    logger.info(`Updating existing ${colorName} color palette...`);

    // Find all lines for this color
    const lines = content.split('\n');
    const filteredLines = lines.filter(
      (line) => !line.trim().startsWith(`--color-${colorName}-`)
    );

    // Find the @theme block and insert the new colors
    const themeStart = filteredLines.findIndex((line) => line.includes('@theme'));
    if (themeStart === -1) {
      throw new Error('Could not find @theme block in styles.css');
    }

    // Find the first custom color definition or closing brace
    let insertIndex = themeStart + 1;
    for (let i = themeStart + 1; i < filteredLines.length; i++) {
      if (filteredLines[i].trim().startsWith('--color-') || filteredLines[i].trim() === '}') {
        insertIndex = i;
        break;
      }
    }

    // Insert the new color lines
    filteredLines.splice(insertIndex, 0, `  /* ${colorName} color palette */`, colorLines, '');
    content = filteredLines.join('\n');
  } else {
    // Add new color after @theme {
    logger.info(`Adding new ${colorName} color palette...`);

    const themeBlockMatch = content.match(/@theme\s*\{/);
    if (!themeBlockMatch) {
      throw new Error('Could not find @theme block in styles.css');
    }

    const insertPosition = (themeBlockMatch.index ?? 0) + themeBlockMatch[0].length;
    const newContent =
      content.slice(0, insertPosition) +
      `\n  /* ${colorName} color palette */\n` +
      colorLines +
      '\n' +
      content.slice(insertPosition);

    content = newContent;
  }

  writeFileSync(stylesPath, content, 'utf-8');
}

/**
 * Set a color theme with automatic shade generation
 */
export async function setColorCommand(
  colorName: string,
  colorValue: string
): Promise<void> {
  try {
    logger.info(`Setting ${colorName} color to ${colorValue}...`);

    // Get the styles.css path
    const stylesPath = join(process.cwd(), 'src', 'styles.css');

    // Generate shades
    logger.info('Generating color shades...');
    const shades = generateColorShades(colorValue);

    // Update styles.css
    updateStylesCSS(stylesPath, colorName, shades);

    logger.success(`✓ ${colorName} color palette created with 11 shades!`);
    logger.info('\nGenerated shades:');
    Object.entries(shades)
      .sort(([a], [b]) => Number(a) - Number(b))
      .forEach(([shade, hex]) => {
        console.log(`  ${colorName}-${shade}: ${hex}`);
      });
  } catch (err) {
    logger.error(
      `Failed to set color: ${err instanceof Error ? err.message : String(err)}`
    );
    process.exit(1);
  }
}
