import { classMerge } from './classMerge';

describe('classMerge', () => {
  describe('base cases', () => {
    it('should return empty string when no arguments provided', () => {
      expect(classMerge()).toBe('');
    });

    it('should return the same class when single argument provided', () => {
      expect(classMerge('h-4 w-auto')).toBe('h-4 w-auto');
    });

    it('should handle undefined arguments', () => {
      expect(classMerge(undefined)).toBe('');
      expect(classMerge('h-4', undefined)).toBe('h-4');
      expect(classMerge(undefined, 'w-4')).toBe('w-4');
    });
  });

  describe('basic class merging', () => {
    it('should merge non-conflicting classes', () => {
      const result = classMerge('h-4 w-4', 'bg-red-500 text-white');
      expect(result).toBe('h-4 w-4 bg-red-500 text-white');
    });

    it('should override conflicting height classes', () => {
      const result = classMerge('h-4', 'h-6');
      expect(result).toBe('h-6');
    });

    it('should override conflicting width classes', () => {
      const result = classMerge('w-auto', 'w-4');
      expect(result).toBe('w-4');
    });

    it('should handle complex merging with multiple conflicts', () => {
      const result = classMerge('h-4 w-auto text-lg', 'h-6 bg-blue-500');
      expect(result).toContain('w-auto');
      expect(result).toContain('text-lg');
      expect(result).toContain('h-6');
      expect(result).toContain('bg-blue-500');
      expect(result).not.toContain('h-4');
    });
  });

  describe('recursive merging with multiple arguments', () => {
    it('should merge three arguments correctly', () => {
      const result = classMerge('h-4', 'h-6', 'h-8');
      expect(result).toBe('h-8');
    });

    it('should merge multiple arguments with different properties', () => {
      const result = classMerge('h-4 w-4', 'bg-red-500', 'h-6 text-white');
      expect(result).toContain('w-4');
      expect(result).toContain('bg-red-500');
      expect(result).toContain('h-6');
      expect(result).toContain('text-white');
      expect(result).not.toContain('h-4');
    });

    it('should handle many arguments', () => {
      const result = classMerge('h-4', 'w-4', 'bg-red-500', 'text-white', 'p-4');
      expect(result).toBe('h-4 w-4 bg-red-500 text-white p-4');
    });
  });

  describe('text utilities', () => {
    it('should handle text size conflicts', () => {
      expect(classMerge('text-lg', 'text-xl')).toBe('text-xl');
      expect(classMerge('text-xs', 'text-9xl')).toBe('text-9xl');
    });

    it('should not conflict text size with text color', () => {
      const result = classMerge('text-lg', 'text-red-500');
      expect(result).toContain('text-lg');
      expect(result).toContain('text-red-500');
    });

    it('should handle text alignment conflicts', () => {
      expect(classMerge('text-left', 'text-center')).toBe('text-center');
      expect(classMerge('text-start', 'text-end')).toBe('text-end');
    });

    it('should handle text transform conflicts', () => {
      expect(classMerge('text-uppercase', 'text-lowercase')).toBe('text-lowercase');
      expect(classMerge('text-capitalize', 'text-normal')).toBe('text-normal');
    });

    it('should handle text wrap conflicts', () => {
      expect(classMerge('text-wrap', 'text-nowrap')).toBe('text-nowrap');
      expect(classMerge('text-ellipsis', 'text-clip')).toBe('text-clip');
    });

    it('should override text color conflicts', () => {
      expect(classMerge('text-red-500', 'text-blue-700')).toBe('text-blue-700');
    });

    it('should handle mixed text properties without conflicts', () => {
      const result = classMerge('text-lg text-red-500', 'text-center');
      expect(result).toContain('text-lg');
      expect(result).toContain('text-red-500');
      expect(result).toContain('text-center');
    });
  });

  describe('padding and margin utilities', () => {
    it('should handle padding conflicts', () => {
      expect(classMerge('p-4', 'p-6')).toBe('p-6');
    });

    it('should handle directional padding conflicts', () => {
      expect(classMerge('px-4', 'px-6')).toBe('px-6');
      expect(classMerge('py-4', 'py-6')).toBe('py-6');
      expect(classMerge('pt-4', 'pt-6')).toBe('pt-6');
      expect(classMerge('pb-4', 'pb-6')).toBe('pb-6');
      expect(classMerge('pl-4', 'pl-6')).toBe('pl-6');
      expect(classMerge('pr-4', 'pr-6')).toBe('pr-6');
    });

    it('should not conflict different padding directions', () => {
      const result = classMerge('px-4', 'py-6');
      expect(result).toContain('px-4');
      expect(result).toContain('py-6');
    });

    it('should handle margin conflicts', () => {
      expect(classMerge('m-4', 'm-6')).toBe('m-6');
    });

    it('should handle directional margin conflicts', () => {
      expect(classMerge('mx-4', 'mx-6')).toBe('mx-6');
      expect(classMerge('my-4', 'my-6')).toBe('my-6');
    });

    it('should handle mixed padding and margin', () => {
      const result = classMerge('p-4 m-4', 'px-6 my-6');
      expect(result).toContain('px-6');
      expect(result).toContain('my-6');
      expect(result).toContain('p-4');
      expect(result).toContain('m-4');
    });
  });

  describe('position utilities', () => {
    it('should handle position conflicts', () => {
      expect(classMerge('absolute', 'relative')).toBe('relative');
      expect(classMerge('fixed', 'sticky')).toBe('sticky');
      expect(classMerge('relative', 'static')).toBe('static');
    });

    it('should combine position with other utilities', () => {
      const result = classMerge('absolute h-4', 'relative w-6');
      expect(result).toContain('relative');
      expect(result).toContain('h-4');
      expect(result).toContain('w-6');
      expect(result).not.toContain('absolute');
    });
  });

  describe('border utilities', () => {
    it('should not override base border class', () => {
      expect(classMerge('border', 'border-2')).toBe('border border-2');
    });
  });

  describe('pointer-events utilities', () => {
    it('should handle pointer-events conflicts', () => {
      expect(classMerge('pointer-events-none', 'pointer-events-auto')).toBe('pointer-events-auto');
      expect(classMerge('pointer-events-auto', 'pointer-events-none')).toBe('pointer-events-none');
    });
  });

  describe('arbitrary values', () => {
    it('should handle arbitrary height values', () => {
      expect(classMerge('h-4', 'h-[20px]')).toBe('h-[20px]');
      expect(classMerge('h-[20px]', 'h-4')).toBe('h-4');
    });

    it('should handle arbitrary width values', () => {
      expect(classMerge('w-auto', 'w-[100%]')).toBe('w-[100%]');
    });

    it('should handle arbitrary values with other utilities', () => {
      const result = classMerge('h-4 w-auto', 'h-[calc(100vh-2rem)]');
      expect(result).toContain('w-auto');
      expect(result).toContain('h-[calc(100vh-2rem)]');
      expect(result).not.toContain('h-4');
    });
  });

  describe('edge cases', () => {
    it('should handle empty strings', () => {
      expect(classMerge('', '')).toBe('');
      expect(classMerge('h-4', '')).toBe('h-4');
      expect(classMerge('', 'w-4')).toBe('w-4');
    });

    it('should handle extra whitespace', () => {
      const result = classMerge('h-4  w-4', '  bg-red-500  ');
      expect(result).toBe('h-4 w-4 bg-red-500');
    });

    it('should maintain order of non-conflicting classes', () => {
      const result = classMerge('a-1 b-2 c-3', 'd-4 e-5');
      expect(result).toBe('a-1 b-2 c-3 d-4 e-5');
    });

    it('should handle single character classes', () => {
      const result = classMerge('p-4', 'm-4');
      expect(result).toContain('p-4');
      expect(result).toContain('m-4');
    });
  });

  describe('real-world scenarios', () => {
    it('should handle component variant merging', () => {
      const baseClasses = 'px-4 py-2 rounded text-white bg-blue-500';
      const variantClasses = 'bg-red-500 text-lg';
      const result = classMerge(baseClasses, variantClasses);

      expect(result).toContain('px-4');
      expect(result).toContain('py-2');
      expect(result).toContain('rounded');
      expect(result).toContain('bg-red-500');
      expect(result).toContain('text-lg');
      expect(result).toContain('text-white');
      expect(result).not.toContain('bg-blue-500');
    });

    it('should handle responsive class merging', () => {
      const result = classMerge('h-4 md:h-6', 'lg:h-8');
      expect(result).toContain('h-4');
      expect(result).toContain('md:h-6');
      expect(result).toContain('lg:h-8');
    });

    it('should handle complex button styling', () => {
      const base = 'inline-flex items-center justify-center rounded-md text-sm font-medium';
      const variant = 'bg-primary text-primary-foreground hover:bg-primary/90';
      const size = 'h-10 px-4 py-2';
      const override = 'h-12 px-6';

      const result = classMerge(base, variant, size, override);

      expect(result).toContain('inline-flex');
      expect(result).toContain('bg-primary');
      expect(result).toContain('h-12');
      expect(result).toContain('px-6');
      expect(result).toContain('py-2');
      expect(result).not.toContain('h-10');
      expect(result).not.toContain('px-4');
    });
  });
});
