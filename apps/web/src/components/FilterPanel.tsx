import React from 'react';
import type { Dispatch } from 'react';
import type { Category } from '@mayve/shared';
import type { FilterAction, ProductFilters } from '../lib/filter-products';
import { INITIAL_FILTERS } from '../lib/filter-products';
import { PriceRangeSlider } from './PriceRangeSlider';

interface FilterPanelProps {
  categories: Category[];
  filters: ProductFilters;
  priceRange: [number, number] | null;
  dispatch: Dispatch<FilterAction>;
}

function isFiltersActive(filters: ProductFilters): boolean {
  return (
    filters.categories.length > 0 ||
    filters.priceRange !== null ||
    filters.customizableOnly ||
    filters.inStockOnly
  );
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  categories,
  filters,
  priceRange,
  dispatch,
}) => {
  const filtersActive = isFiltersActive(filters);

  return (
    <div className="bg-surface-container-low rounded-sm p-6 flex flex-col gap-6">
      {/* Category filter */}
      <div>
        <p className="label-caps text-secondary opacity-60 mb-3">Categoría</p>
        <div className="flex flex-col gap-2">
          {categories.map((category) => (
            <label key={category.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.categories.includes(category.id)}
                onChange={() => dispatch({ type: 'TOGGLE_CATEGORY', categoryId: category.id })}
                className="accent-secondary"
                aria-label={category.name}
              />
              <span className="text-sm text-primary/80">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price range filter */}
      {priceRange !== null && (
        <div>
          <p className="label-caps text-secondary opacity-60 mb-3">Precio</p>
          <PriceRangeSlider
            min={priceRange[0]}
            max={priceRange[1]}
            value={filters.priceRange ?? priceRange}
            onChangeMin={(v) => dispatch({ type: 'SET_PRICE_RANGE', range: [v, (filters.priceRange ?? priceRange)[1]] })}
            onChangeMax={(v) => dispatch({ type: 'SET_PRICE_RANGE', range: [(filters.priceRange ?? priceRange)[0], v] })}
          />
        </div>
      )}

      {/* Customizable toggle */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.customizableOnly}
            onChange={() => dispatch({ type: 'TOGGLE_CUSTOMIZABLE' })}
            className="accent-secondary"
            aria-label="Personalizable"
          />
          <span className="text-sm text-primary/80">Personalizable</span>
        </label>
      </div>

      {/* In-stock toggle */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={() => dispatch({ type: 'TOGGLE_IN_STOCK' })}
            className="accent-secondary"
            aria-label="Solo disponibles"
          />
          <span className="text-sm text-primary/80">Solo disponibles</span>
        </label>
      </div>

      {/* Clear all */}
      {filtersActive && (
        <button
          type="button"
          onClick={() => dispatch({ type: 'CLEAR_ALL' })}
          className="text-secondary underline text-xs label-caps self-start"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
};
