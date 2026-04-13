import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { ProductCatalog } from '../ProductCatalog';
import type { Product, Category } from '@mayve/shared';

// Mock api-client
vi.mock('../../lib/api-client', () => ({
  fetchProducts: vi.fn(),
  fetchCategories: vi.fn(),
}));

import { fetchProducts, fetchCategories } from '../../lib/api-client';

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Silla Rústica',
    slug: 'silla-rustica',
    description: 'Desc',
    price: 1200,
    categoryId: 'cat-salas',
    leadTime: 15,
    isCustomizable: true,
    listPrice: 1400,
    cashDiscountPrice: 1100,
    inStock: true,
    requiresAssembly: false,
    isFeatured: false,
    images: [],
  },
  {
    id: '2',
    name: 'Mesa de Pino',
    slug: 'mesa-de-pino',
    description: 'Desc',
    price: 3000,
    categoryId: 'cat-comedores',
    leadTime: 20,
    isCustomizable: false,
    listPrice: 3500,
    cashDiscountPrice: 2800,
    inStock: false,
    requiresAssembly: true,
    isFeatured: false,
    images: [],
  },
];

const mockCategories: Category[] = [
  { id: 'cat-salas', name: 'Salas', slug: 'salas' },
  { id: 'cat-comedores', name: 'Comedores', slug: 'comedores' },
];

describe('ProductCatalog', () => {
  beforeEach(() => {
    vi.mocked(fetchProducts).mockResolvedValue(mockProducts);
    vi.mocked(fetchCategories).mockResolvedValue(mockCategories);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state on initial mount before data arrives', () => {
    // Return a never-resolving promise to keep it loading
    vi.mocked(fetchProducts).mockReturnValue(new Promise(() => {}));
    vi.mocked(fetchCategories).mockReturnValue(new Promise(() => {}));
    render(<ProductCatalog />);
    expect(screen.getByText(/curando piezas/i)).toBeInTheDocument();
  });

  it('fetches products and categories on mount and renders all products', async () => {
    render(<ProductCatalog />);
    await waitFor(() => {
      expect(screen.getByText('Silla Rústica')).toBeInTheDocument();
      expect(screen.getByText('Mesa de Pino')).toBeInTheDocument();
    });
    expect(fetchProducts).toHaveBeenCalledTimes(1);
    expect(fetchCategories).toHaveBeenCalledTimes(1);
  });

  it('renders FilterPanel with category names after data loads', async () => {
    render(<ProductCatalog />);
    await waitFor(() => {
      expect(screen.getByText('Salas')).toBeInTheDocument();
      expect(screen.getByText('Comedores')).toBeInTheDocument();
    });
  });

  it('shows error state when products fetch fails', async () => {
    vi.mocked(fetchProducts).mockRejectedValue(new Error('Network error'));
    render(<ProductCatalog />);
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('filtering by category reduces the products shown in the grid', async () => {
    render(<ProductCatalog />);
    await waitFor(() => expect(screen.getByText('Silla Rústica')).toBeInTheDocument());

    // Click the "Salas" category chip in FilterPanel
    const salasCheckbox = screen.getByLabelText('Salas');
    fireEvent.click(salasCheckbox);

    // Only the Salas product should remain
    expect(screen.getByText('Silla Rústica')).toBeInTheDocument();
    expect(screen.queryByText('Mesa de Pino')).not.toBeInTheDocument();
  });

  it('mobile filter button shows count of active filter types', async () => {
    render(<ProductCatalog />);
    await waitFor(() => expect(screen.getByText('Silla Rústica')).toBeInTheDocument());

    // No active filters initially — button shows "Filtros" without count
    const initialBtn = screen.queryByRole('button', { name: /filtros \(\d\)/i });
    expect(initialBtn).not.toBeInTheDocument();

    // Activate one filter
    fireEvent.click(screen.getByLabelText('Salas'));

    // Button inside filter-header should show count
    await waitFor(() => {
      const header = screen.getByTestId('filter-header');
      const btn = header.querySelector('button');
      expect(btn).toHaveAccessibleName(/filtros \(1\)/i);
    });
  });

  it('mobile filter button has w-full class', async () => {
    render(<ProductCatalog />);
    await waitFor(() => expect(screen.getByText('Silla Rústica')).toBeInTheDocument());
    const header = screen.getByTestId('filter-header');
    const btn = header.querySelector('button');
    expect(btn).not.toBeNull();
    expect(btn).toHaveClass('w-full');
  });

  it('filter button is in static header, not floating', async () => {
    render(<ProductCatalog />);
    await waitFor(() => expect(screen.getByText('Silla Rústica')).toBeInTheDocument());

    const header = screen.getByTestId('filter-header');
    expect(header).toBeInTheDocument();

    const btn = header.querySelector('button');
    expect(btn).not.toBeNull();
    expect(btn!.className).not.toMatch(/fixed/);
  });
});
