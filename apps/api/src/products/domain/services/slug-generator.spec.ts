import { SlugGenerator } from './slug-generator';

describe('SlugGenerator', () => {
  let generator: SlugGenerator;

  beforeEach(() => {
    generator = new SlugGenerator();
  });

  it('should generate a slug from a simple name', () => {
    const input = 'Silla Roble';
    const expected = 'silla-roble';
    expect(generator.generate(input)).toBe(expected);
  });

  it('should handle accents and special characters', () => {
    const input = 'Sillón Ergonómico & Elegante';
    const expected = 'sillon-ergonomico-elegante';
    expect(generator.generate(input)).toBe(expected);
  });

  it('should handle multiple spaces and trim hyphens', () => {
    const input = '  Mesa   de  Comedor  ';
    const expected = 'mesa-de-comedor';
    expect(generator.generate(input)).toBe(expected);
  });

  it('should handle uppercase characters', () => {
    const input = 'SILLA DE MADERA';
    const expected = 'silla-de-madera';
    expect(generator.generate(input)).toBe(expected);
  });
});
