import React from 'react';
import type { Dispatch } from 'react';
import type { Category } from '@mayve/shared';
import type { FilterAction, ProductFilters } from '../lib/filter-products';

interface ActiveFiltersProps {
  filters: ProductFilters;
  categories: Category[];
  dispatch: Dispatch<FilterAction>;
}

function formatPrice(value: number): string {
  return `$${value.toLocaleString('es-AR')}`;
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({ filters, categories, dispatch }) => {
  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.priceRange !== null ||
    filters.customizableOnly ||
    filters.inStockOnly;

  if (!hasActiveFilters) return null;

  const categoryNames = filters.categories.map((id) => {
    const cat = categories.find((c) => c.id === id);
    return { id, name: cat?.name ?? id };
  });

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      {categoryNames.map(({ id, name }) => (
        <span
          key={id}
          className="px-3 py-1 rounded-full bg-surface-variant text-xs label-caps flex items-center gap-2"
        >
          {name}
        </span>
      ))}

      {filters.priceRange && (
        <span className="px-3 py-1 rounded-full bg-surface-variant text-xs label-caps flex items-center gap-2">
          {formatPrice(filters.priceRange[0])} — {formatPrice(filters.priceRange[1])}
        </span>
      )}

      {filters.customizableOnly && (
        <span className="px-3 py-1 rounded-full bg-surface-variant text-xs label-caps flex items-center gap-2">
          Personalizable
        </span>
      )}

      {filters.inStockOnly && (
        <span className="px-3 py-1 rounded-full bg-surface-variant text-xs label-caps flex items-center gap-2">
          En stock
        </span>
      )}

      <button
        type="button"
        onClick={() => dispatch({ type: 'CLEAR_ALL' })}
        className="text-secondary underline text-xs label-caps"
      >
        Limpiar filtros
      </button>
    </div>
  );
};
