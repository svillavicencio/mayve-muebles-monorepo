/**
 * Tests for the shared ProductSchema — verifies category field is optional and validates correctly.
 */
import { ProductSchema } from '@mayve/shared';

const validProduct = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  name: 'Silla Rústica',
  slug: 'silla-rustica',
  description: 'Una silla de pino macizo',
  price: 1200,
  leadTime: 15,
  isCustomizable: true,
  listPrice: 1400,
  cashDiscountPrice: 1100,
  inStock: true,
  requiresAssembly: false,
  isFeatured: false,
  categoryId: '550e8400-e29b-41d4-a716-446655440001',
  images: [],
};

describe('ProductSchema — category field', () => {
  it('parses successfully without category field (backward compatible)', () => {
    const result = ProductSchema.parse(validProduct);
    expect(result.id).toBe(validProduct.id);
    expect(result.name).toBe(validProduct.name);
  });

  it('parses successfully with a valid category object', () => {
    const productWithCategory = {
      ...validProduct,
      category: {
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: 'Salas',
        slug: 'salas',
      },
    };
    const result = ProductSchema.parse(productWithCategory);
    expect(result.category?.id).toBe('550e8400-e29b-41d4-a716-446655440002');
    expect(result.category?.name).toBe('Salas');
    expect(result.category?.slug).toBe('salas');
  });
});
