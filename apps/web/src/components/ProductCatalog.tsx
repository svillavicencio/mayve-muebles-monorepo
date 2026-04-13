import React, { useEffect, useReducer, useState, useMemo } from 'react';
import type { Product, Category } from '@mayve/shared';
import { fetchProducts, fetchCategories } from '../lib/api-client';
import {
  filterReducer,
  filterProducts,
  derivePriceRange,
  INITIAL_FILTERS,
} from '../lib/filter-products';
import { ProductGrid } from './ProductGrid';
import { FilterPanel } from './FilterPanel';
import { ActiveFilters } from './ActiveFilters';
import { MobileFilterDrawer } from './MobileFilterDrawer';

export const ProductCatalog: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, dispatch] = useReducer(filterReducer, INITIAL_FILTERS);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchProducts<Product[]>(),
      fetchCategories<Category[]>(),
    ])
      .then(([prods, cats]) => {
        setProducts(prods);
        setCategories(cats);
      })
      .catch((err) => setError(err.message ?? 'Error al cargar los productos'))
      .finally(() => setLoading(false));
  }, []);

  const priceRange = useMemo(() => derivePriceRange(products), [products]);
  const filteredProducts = useMemo(
    () => filterProducts(products, filters),
    [products, filters]
  );

  const activeFilterCount = [
    filters.categories.length > 0,
    filters.priceRange !== null,
    filters.customizableOnly,
    filters.inStockOnly,
  ].filter(Boolean).length;

  if (error) {
    return (
      <div className="text-center p-8 md:p-16 font-serif text-secondary opacity-60">
        Error al cargar los productos. Por favor intentá de nuevo.
      </div>
    );
  }

  const filterPanel = (
    <FilterPanel
      categories={categories}
      filters={filters}
      priceRange={priceRange}
      dispatch={dispatch}
    />
  );

  return (
    <div>
      <div className="lg:flex lg:gap-12">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-[280px] shrink-0">
          {filterPanel}
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div data-testid="filter-header" className="flex items-center mb-4 lg:hidden">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="btn-primary px-4 py-2 min-h-[44px] w-full"
              aria-label={activeFilterCount > 0 ? `Filtros (${activeFilterCount})` : 'Filtros'}
            >
              {activeFilterCount > 0 ? `Filtros (${activeFilterCount})` : 'Filtros'}
            </button>
          </div>
          <ActiveFilters filters={filters} categories={categories} dispatch={dispatch} />
          <ProductGrid products={filteredProducts} isLoading={loading} />
        </div>
      </div>

      <MobileFilterDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        {filterPanel}
      </MobileFilterDrawer>
    </div>
  );
};
