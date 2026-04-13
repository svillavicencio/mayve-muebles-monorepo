import { filterProducts, derivePriceRange, INITIAL_FILTERS } from '../filter-products';
import type { ProductFilters } from '../filter-products';
import type { Product } from '@mayve/shared';

// Minimal Product factory — only the fields filterProducts cares about
function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'prod-1',
    name: 'Silla Rústica',
    slug: 'silla-rustica',
    description: 'Descripción',
    price: 1200,
    categoryId: 'cat-1',
    leadTime: 15,
    isCustomizable: false,
    listPrice: 1400,
    cashDiscountPrice: 1100,
    inStock: true,
    requiresAssembly: false,
    isFeatured: false,
    images: [],
    ...overrides,
  };
}

// Shared fixture products
const products: Product[] = [
  makeProduct({ id: '1', categoryId: 'cat-salas', cashDiscountPrice: 500, isCustomizable: true, inStock: true }),
  makeProduct({ id: '2', categoryId: 'cat-comedores', cashDiscountPrice: 1200, isCustomizable: false, inStock: true }),
  makeProduct({ id: '3', categoryId: 'cat-dormitorios', cashDiscountPrice: 3000, isCustomizable: true, inStock: false }),
  makeProduct({ id: '4', categoryId: 'cat-salas', cashDiscountPrice: 800, isCustomizable: false, inStock: false }),
];

// ─── filterProducts ────────────────────────────────────────────────────────────

describe('filterProducts', () => {
  describe('no active filters', () => {
    it('returns all products when all filters are at defaults', () => {
      const result = filterProducts(products, INITIAL_FILTERS);
      expect(result).toHaveLength(4);
      expect(result.map(p => p.id)).toEqual(['1', '2', '3', '4']);
    });

    it('returns empty array when product list is empty', () => {
      const result = filterProducts([], INITIAL_FILTERS);
      expect(result).toHaveLength(0);
    });
  });

  describe('category filter', () => {
    it('returns only products in the selected category', () => {
      const filters: ProductFilters = { ...INITIAL_FILTERS, categories: ['cat-salas'] };
      const result = filterProducts(products, filters);
      expect(result).toHaveLength(2);
      expect(result.every(p => p.categoryId === 'cat-salas')).toBe(true);
    });

    it('returns products from ANY selected category (OR logic)', () => {
      const filters: ProductFilters = { ...INITIAL_FILTERS, categories: ['cat-salas', 'cat-comedores'] };
      const result = filterProducts(products, filters);
      expect(result).toHaveLength(3);
      expect(result.map(p => p.id)).toContain('1');
      expect(result.map(p => p.id)).toContain('2');
      expect(result.map(p => p.id)).toContain('4');
    });

    it('applies no category restriction when categories array is empty', () => {
      const filters: ProductFilters = { ...INITIAL_FILTERS, categories: [] };
      const result = filterProducts(products, filters);
      expect(result).toHaveLength(4);
    });
  });

  describe('price range filter', () => {
    it('returns only products within the inclusive price range', () => {
      const filters: ProductFilters = { ...INITIAL_FILTERS, priceRange: [600, 1500] };
      const result = filterProducts(products, filters);
      expect(result).toHaveLength(2);
      expect(result.map(p => p.cashDiscountPrice)).toEqual(
        expect.arrayContaining([800, 1200])
      );
    });

    it('includes products at both inclusive bounds', () => {
      const filters: ProductFilters = { ...INITIAL_FILTERS, priceRange: [500, 3000] };
      const result = filterProducts(products, filters);
      expect(result).toHaveLength(4);
    });

    it('applies no price restriction when priceRange is null', () => {
      const filters: ProductFilters = { ...INITIAL_FILTERS, priceRange: null };
      const result = filterProducts(products, filters);
      expect(result).toHaveLength(4);
    });
  });

  describe('customizableOnly filter', () => {
    it('returns only customizable products when toggle is true', () => {
      const filters: ProductFilters = { ...INITIAL_FILTERS, customizableOnly: true };
      const result = filterProducts(products, filters);
      expect(result).toHaveLength(2);
      expect(result.every(p => p.isCustomizable === true)).toBe(true);
    });

    it('returns all products when customizableOnly is false', () => {
      const filters: ProductFilters = { ...INITIAL_FILTERS, customizableOnly: false };
      const result = filterProducts(products, filters);
      expect(result).toHaveLength(4);
    });
  });

  describe('inStockOnly filter', () => {
    it('returns only in-stock products when toggle is true', () => {
      const filters: ProductFilters = { ...INITIAL_FILTERS, inStockOnly: true };
      const result = filterProducts(products, filters);
      expect(result).toHaveLength(2);
      expect(result.every(p => p.inStock === true)).toBe(true);
    });

    it('returns all products when inStockOnly is false', () => {
      const filters: ProductFilters = { ...INITIAL_FILTERS, inStockOnly: false };
      const result = filterProducts(products, filters);
      expect(result).toHaveLength(4);
    });
  });

  describe('combined filters (AND logic)', () => {
    it('combines category + price (AND) — only products meeting both conditions', () => {
      const filters: ProductFilters = {
        ...INITIAL_FILTERS,
        categories: ['cat-salas'],
        priceRange: [600, 1000],
      };
      const result = filterProducts(products, filters);
      // Only product 4 (cat-salas, price 800) satisfies both
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('4');
    });

    it('combines all four filter types simultaneously', () => {
      const filters: ProductFilters = {
        categories: ['cat-salas', 'cat-comedores'],
        priceRange: [400, 1300],
        customizableOnly: true,
        inStockOnly: true,
      };
      // cat-salas AND price [400,1300] AND customizable AND inStock
      // Product 1: cat-salas, price 500, customizable ✓, inStock ✓ → PASS
      // Product 2: cat-comedores, price 1200, not customizable → FAIL (customizable)
      // Product 4: cat-salas, price 800, not customizable → FAIL (customizable)
      const result = filterProducts(products, filters);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('returns empty when no products match active filters', () => {
      const filters: ProductFilters = {
        ...INITIAL_FILTERS,
        categories: ['cat-salas'],
        inStockOnly: true,
        customizableOnly: false,
        priceRange: [2000, 5000],
      };
      // cat-salas products have prices 500, 800 — neither is in [2000, 5000]
      const result = filterProducts(products, filters);
      expect(result).toHaveLength(0);
    });
  });
});

// ─── derivePriceRange ─────────────────────────────────────────────────────────

describe('derivePriceRange', () => {
  it('returns [min, max] from valid cashDiscountPrice values', () => {
    const prods = [
      makeProduct({ cashDiscountPrice: 500 }),
      makeProduct({ cashDiscountPrice: 1200 }),
      makeProduct({ cashDiscountPrice: 3000 }),
    ];
    const result = derivePriceRange(prods);
    expect(result).toEqual([500, 3000]);
  });

  it('excludes products with cashDiscountPrice of 0 from the range', () => {
    const prods = [
      makeProduct({ cashDiscountPrice: 0 }),
      makeProduct({ cashDiscountPrice: 500 }),
      makeProduct({ cashDiscountPrice: 3000 }),
    ];
    const result = derivePriceRange(prods);
    expect(result).toEqual([500, 3000]);
  });

  it('returns null when all products have falsy prices', () => {
    const prods = [
      makeProduct({ cashDiscountPrice: 0 }),
      makeProduct({ cashDiscountPrice: 0 }),
    ];
    const result = derivePriceRange(prods);
    expect(result).toBeNull();
  });

  it('returns null when fewer than 2 products have valid prices', () => {
    const prods = [
      makeProduct({ cashDiscountPrice: 1200 }),
      makeProduct({ cashDiscountPrice: 0 }),
    ];
    const result = derivePriceRange(prods);
    expect(result).toBeNull();
  });

  it('returns [price, price] when all products have the same valid price', () => {
    const prods = [
      makeProduct({ cashDiscountPrice: 1200 }),
      makeProduct({ cashDiscountPrice: 1200 }),
    ];
    const result = derivePriceRange(prods);
    expect(result).toEqual([1200, 1200]);
  });

  it('returns null for empty product list', () => {
    const result = derivePriceRange([]);
    expect(result).toBeNull();
  });
});
