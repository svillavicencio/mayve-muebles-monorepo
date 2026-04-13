import { Product, Category } from './product.entity';

const baseArgs = [
  'id-1',
  'Silla Rústica',
  'silla-rustica',
  'Descripción de silla',
  1200,
  'cat-1',
  15,
  true,
  1400,
  1100,
  true,
  false,
] as const;

describe('Product entity', () => {
  describe('category field', () => {
    it('is undefined when no category is passed', () => {
      const product = new Product(...baseArgs);
      expect(product.category).toBeUndefined();
    });

    it('exposes the category when passed as last argument', () => {
      const category = new Category('cat-1', 'Salas', 'salas');
      const product = new Product(
        ...baseArgs,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        [],
        false,
        category,
      );
      expect(product.category).toBe(category);
      expect(product.category?.id).toBe('cat-1');
      expect(product.category?.name).toBe('Salas');
    });
  });
});
