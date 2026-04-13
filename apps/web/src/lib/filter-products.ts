import type { Product } from '@mayve/shared';

export type FilterAction =
  | { type: 'TOGGLE_CATEGORY'; categoryId: string }
  | { type: 'SET_PRICE_RANGE'; range: [number, number] }
  | { type: 'TOGGLE_CUSTOMIZABLE' }
  | { type: 'TOGGLE_IN_STOCK' }
  | { type: 'REMOVE_FILTER'; filter: 'category'; value: string }
  | { type: 'REMOVE_FILTER'; filter: 'priceRange' }
  | { type: 'REMOVE_FILTER'; filter: 'customizableOnly' }
  | { type: 'REMOVE_FILTER'; filter: 'inStockOnly' }
  | { type: 'CLEAR_ALL' };

export interface ProductFilters {
  categories: string[];
  priceRange: [number, number] | null;
  customizableOnly: boolean;
  inStockOnly: boolean;
}

export const INITIAL_FILTERS: ProductFilters = {
  categories: [],
  priceRange: null,
  customizableOnly: false,
  inStockOnly: false,
};

export function filterReducer(state: ProductFilters, action: FilterAction): ProductFilters {
  switch (action.type) {
    case 'TOGGLE_CATEGORY': {
      const exists = state.categories.includes(action.categoryId);
      return {
        ...state,
        categories: exists
          ? state.categories.filter((id) => id !== action.categoryId)
          : [...state.categories, action.categoryId],
      };
    }
    case 'SET_PRICE_RANGE':
      return { ...state, priceRange: action.range };
    case 'TOGGLE_CUSTOMIZABLE':
      return { ...state, customizableOnly: !state.customizableOnly };
    case 'TOGGLE_IN_STOCK':
      return { ...state, inStockOnly: !state.inStockOnly };
    case 'REMOVE_FILTER':
      if (action.filter === 'category') {
        return { ...state, categories: state.categories.filter((id) => id !== action.value) };
      }
      if (action.filter === 'priceRange') return { ...state, priceRange: null };
      if (action.filter === 'customizableOnly') return { ...state, customizableOnly: false };
      if (action.filter === 'inStockOnly') return { ...state, inStockOnly: false };
      return state;
    case 'CLEAR_ALL':
      return INITIAL_FILTERS;
    default:
      return state;
  }
}

export function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  return products.filter((product) => {
    if (filters.categories.length > 0 && !filters.categories.includes(product.categoryId)) {
      return false;
    }
    if (
      filters.priceRange !== null &&
      (product.cashDiscountPrice < filters.priceRange[0] ||
        product.cashDiscountPrice > filters.priceRange[1])
    ) {
      return false;
    }
    if (filters.customizableOnly && !product.isCustomizable) {
      return false;
    }
    if (filters.inStockOnly && !product.inStock) {
      return false;
    }
    return true;
  });
}

export function derivePriceRange(products: Product[]): [number, number] | null {
  const validPrices = products
    .map((p) => p.cashDiscountPrice)
    .filter((price) => price > 0);
  if (validPrices.length < 2) return null;
  return [Math.min(...validPrices), Math.max(...validPrices)];
}
