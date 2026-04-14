/**
 * Unit tests for PrismaProductRepository — no real DB needed.
 * Tests the category-include behavior introduced in the product-filter-panel feature.
 */

const mockFindMany = jest.fn();
const mockFindUnique = jest.fn();

jest.mock('@mayve/database', () => ({
  PrismaClient: jest.fn(() => ({
    product: {
      findMany: mockFindMany,
      findUnique: mockFindUnique,
      count: jest.fn(),
      create: jest.fn(),
    },
    category: { findMany: jest.fn() },
  })),
}));

import { PrismaProductRepository } from './prisma-product.repository';

function makeRepository(overrides: Record<string, any> = {}): PrismaProductRepository {
  const mockPrismaService = {
    product: {
      findMany: mockFindMany,
      findUnique: mockFindUnique,
      count: jest.fn(),
      create: jest.fn(),
    },
    category: { findMany: jest.fn() },
    ...overrides,
  };
  return new PrismaProductRepository(mockPrismaService as any);
}

const baseProductRow = {
  id: 'prod-1',
  name: 'Silla Rústica',
  slug: 'silla-rustica',
  description: 'Una silla de pino macizo',
  price: '1200',
  categoryId: 'cat-1',
  leadTime: 15,
  isCustomizable: true,
  listPrice: '1400',
  cashDiscountPrice: '1100',
  inStock: true,
  requiresAssembly: false,
  materials: null,
  dimensions: null,
  structure: null,
  finish: null,
  fabric: null,
  shippingWeight: null,
  images: [],
  isFeatured: false,
};

describe('PrismaProductRepository - category include', () => {
  let repository: PrismaProductRepository;

  beforeEach(() => {
    mockFindMany.mockReset();
    repository = makeRepository();
  });

  it('maps category to a Category entity when product has category data', async () => {
    mockFindMany.mockResolvedValue([
      {
        ...baseProductRow,
        category: { id: 'cat-1', name: 'Salas', slug: 'salas' },
      },
    ]);

    const products = await repository.findProducts();

    expect(products).toHaveLength(1);
    expect(products[0].category).toBeDefined();
    expect(products[0].category?.id).toBe('cat-1');
    expect(products[0].category?.name).toBe('Salas');
    expect(products[0].category?.slug).toBe('salas');
  });

  it('maps category to undefined when product has no category (null)', async () => {
    mockFindMany.mockResolvedValue([{ ...baseProductRow, category: null }]);

    const products = await repository.findProducts();

    expect(products).toHaveLength(1);
    expect(products[0].category).toBeUndefined();
  });
});
