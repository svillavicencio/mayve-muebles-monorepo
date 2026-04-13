import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ActiveFilters } from '../ActiveFilters';
import { INITIAL_FILTERS } from '../../lib/filter-products';
import type { Category } from '@mayve/shared';

const categories: Category[] = [
  { id: 'cat-salas', name: 'Salas', slug: 'salas' },
  { id: 'cat-comedores', name: 'Comedores', slug: 'comedores' },
];

describe('ActiveFilters', () => {
  let dispatch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    dispatch = vi.fn();
  });

  it('renders nothing when no filters are active', () => {
    const { container } = render(
      <ActiveFilters filters={INITIAL_FILTERS} categories={categories} dispatch={dispatch} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders category chip with the category name (not ID)', () => {
    render(
      <ActiveFilters
        filters={{ ...INITIAL_FILTERS, categories: ['cat-salas'] }}
        categories={categories}
        dispatch={dispatch}
      />
    );
    expect(screen.getByText('Salas')).toBeInTheDocument();
    // Should show name, not ID
    expect(screen.queryByText('cat-salas')).not.toBeInTheDocument();
  });

  it('renders chips for all selected categories', () => {
    render(
      <ActiveFilters
        filters={{ ...INITIAL_FILTERS, categories: ['cat-salas', 'cat-comedores'] }}
        categories={categories}
        dispatch={dispatch}
      />
    );
    expect(screen.getByText('Salas')).toBeInTheDocument();
    expect(screen.getByText('Comedores')).toBeInTheDocument();
  });

  it('renders price range chip when priceRange is set', () => {
    render(
      <ActiveFilters
        filters={{ ...INITIAL_FILTERS, priceRange: [500, 3000] }}
        categories={categories}
        dispatch={dispatch}
      />
    );
    expect(screen.getByText(/\$500/)).toBeInTheDocument();
    expect(screen.getByText(/\$3\.000/)).toBeInTheDocument();
  });

  it('renders Personalizable chip when customizableOnly is true', () => {
    render(
      <ActiveFilters
        filters={{ ...INITIAL_FILTERS, customizableOnly: true }}
        categories={categories}
        dispatch={dispatch}
      />
    );
    expect(screen.getByText('Personalizable')).toBeInTheDocument();
  });

  it('renders En stock chip when inStockOnly is true', () => {
    render(
      <ActiveFilters
        filters={{ ...INITIAL_FILTERS, inStockOnly: true }}
        categories={categories}
        dispatch={dispatch}
      />
    );
    expect(screen.getByText('En stock')).toBeInTheDocument();
  });

  it('Limpiar filtros button is visible when at least one filter is active', () => {
    render(
      <ActiveFilters
        filters={{ ...INITIAL_FILTERS, inStockOnly: true }}
        categories={categories}
        dispatch={dispatch}
      />
    );
    expect(screen.getByRole('button', { name: /limpiar filtros/i })).toBeInTheDocument();
  });

  it('clicking Limpiar filtros dispatches CLEAR_ALL', () => {
    render(
      <ActiveFilters
        filters={{ ...INITIAL_FILTERS, customizableOnly: true }}
        categories={categories}
        dispatch={dispatch}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /limpiar filtros/i }));
    expect(dispatch).toHaveBeenCalledWith({ type: 'CLEAR_ALL' });
  });
});
