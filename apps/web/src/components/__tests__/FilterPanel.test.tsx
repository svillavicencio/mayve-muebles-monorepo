import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterPanel } from '../FilterPanel';
import { INITIAL_FILTERS } from '../../lib/filter-products';
import type { Category } from '@mayve/shared';

const categories: Category[] = [
  { id: 'cat-salas', name: 'Salas', slug: 'salas' },
  { id: 'cat-comedores', name: 'Comedores', slug: 'comedores' },
];

describe('FilterPanel', () => {
  let dispatch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    dispatch = vi.fn();
  });

  it('renders category chips for each category', () => {
    render(
      <FilterPanel
        categories={categories}
        filters={INITIAL_FILTERS}
        priceRange={null}
        dispatch={dispatch}
      />
    );
    expect(screen.getByText('Salas')).toBeInTheDocument();
    expect(screen.getByText('Comedores')).toBeInTheDocument();
  });

  it('renders a checkbox for each category', () => {
    render(
      <FilterPanel
        categories={categories}
        filters={INITIAL_FILTERS}
        priceRange={null}
        dispatch={dispatch}
      />
    );
    expect(screen.getByLabelText('Salas')).toBeInTheDocument();
    expect(screen.getByLabelText('Comedores')).toBeInTheDocument();
  });

  it('category chip is checked when its id is in filters.categories', () => {
    render(
      <FilterPanel
        categories={categories}
        filters={{ ...INITIAL_FILTERS, categories: ['cat-salas'] }}
        priceRange={null}
        dispatch={dispatch}
      />
    );
    const salasCheckbox = screen.getByLabelText('Salas');
    expect(salasCheckbox).toBeChecked();
    const comedoresCheckbox = screen.getByLabelText('Comedores');
    expect(comedoresCheckbox).not.toBeChecked();
  });

  it('clicking a category chip dispatches TOGGLE_CATEGORY', () => {
    render(
      <FilterPanel
        categories={categories}
        filters={INITIAL_FILTERS}
        priceRange={null}
        dispatch={dispatch}
      />
    );
    const salasCheckbox = screen.getByLabelText('Salas');
    fireEvent.click(salasCheckbox);
    expect(dispatch).toHaveBeenCalledWith({ type: 'TOGGLE_CATEGORY', categoryId: 'cat-salas' });
  });

  it('shows price range slider when priceRange is provided', () => {
    render(
      <FilterPanel
        categories={categories}
        filters={INITIAL_FILTERS}
        priceRange={[500, 5000]}
        dispatch={dispatch}
      />
    );
    const sliders = screen.getAllByRole('slider');
    expect(sliders).toHaveLength(2);
  });

  it('hides price range slider when priceRange is null', () => {
    render(
      <FilterPanel
        categories={categories}
        filters={INITIAL_FILTERS}
        priceRange={null}
        dispatch={dispatch}
      />
    );
    expect(screen.queryAllByRole('slider')).toHaveLength(0);
  });

  it('customizable toggle reflects filters.customizableOnly state', () => {
    render(
      <FilterPanel
        categories={categories}
        filters={{ ...INITIAL_FILTERS, customizableOnly: true }}
        priceRange={null}
        dispatch={dispatch}
      />
    );
    const toggle = screen.getByLabelText(/personalizable/i);
    expect(toggle).toBeChecked();
  });

  it('clicking customizable toggle dispatches TOGGLE_CUSTOMIZABLE', () => {
    render(
      <FilterPanel
        categories={categories}
        filters={INITIAL_FILTERS}
        priceRange={null}
        dispatch={dispatch}
      />
    );
    const toggle = screen.getByLabelText(/personalizable/i);
    fireEvent.click(toggle);
    expect(dispatch).toHaveBeenCalledWith({ type: 'TOGGLE_CUSTOMIZABLE' });
  });

  it('in-stock toggle reflects filters.inStockOnly state', () => {
    render(
      <FilterPanel
        categories={categories}
        filters={{ ...INITIAL_FILTERS, inStockOnly: true }}
        priceRange={null}
        dispatch={dispatch}
      />
    );
    const toggle = screen.getByLabelText(/solo disponibles/i);
    expect(toggle).toBeChecked();
  });

  it('clicking in-stock toggle dispatches TOGGLE_IN_STOCK', () => {
    render(
      <FilterPanel
        categories={categories}
        filters={INITIAL_FILTERS}
        priceRange={null}
        dispatch={dispatch}
      />
    );
    const toggle = screen.getByLabelText(/solo disponibles/i);
    fireEvent.click(toggle);
    expect(dispatch).toHaveBeenCalledWith({ type: 'TOGGLE_IN_STOCK' });
  });

  it('Limpiar filtros button is visible when a filter is active', () => {
    render(
      <FilterPanel
        categories={categories}
        filters={{ ...INITIAL_FILTERS, categories: ['cat-salas'] }}
        priceRange={null}
        dispatch={dispatch}
      />
    );
    expect(screen.getByText(/limpiar filtros/i)).toBeInTheDocument();
  });

  it('Limpiar filtros button is NOT visible when no filters are active', () => {
    render(
      <FilterPanel
        categories={categories}
        filters={INITIAL_FILTERS}
        priceRange={null}
        dispatch={dispatch}
      />
    );
    expect(screen.queryByText(/limpiar filtros/i)).not.toBeInTheDocument();
  });

  it('clicking Limpiar filtros dispatches CLEAR_ALL', () => {
    render(
      <FilterPanel
        categories={categories}
        filters={{ ...INITIAL_FILTERS, customizableOnly: true }}
        priceRange={null}
        dispatch={dispatch}
      />
    );
    fireEvent.click(screen.getByText(/limpiar filtros/i));
    expect(dispatch).toHaveBeenCalledWith({ type: 'CLEAR_ALL' });
  });
});
