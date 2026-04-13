import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProductGrid } from '../ProductGrid';
import type { Product } from '@mayve/shared';

const makeProduct = (id: string, name: string): Product => ({
  id,
  name,
  slug: id,
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
});

describe('ProductGrid', () => {
  it('renders a product card for each product in the array', () => {
    const products = [
      makeProduct('1', 'Silla Rústica'),
      makeProduct('2', 'Mesa de Pino'),
      makeProduct('3', 'Sofá Artesanal'),
    ];
    render(<ProductGrid products={products} isLoading={false} />);
    expect(screen.getByText('Silla Rústica')).toBeInTheDocument();
    expect(screen.getByText('Mesa de Pino')).toBeInTheDocument();
    expect(screen.getByText('Sofá Artesanal')).toBeInTheDocument();
  });

  it('shows loading text when isLoading is true', () => {
    render(<ProductGrid products={[]} isLoading={true} />);
    expect(screen.getByText(/curando piezas/i)).toBeInTheDocument();
  });

  it('shows empty state message when products is empty and not loading', () => {
    render(<ProductGrid products={[]} isLoading={false} />);
    expect(
      screen.getByText(/no encontramos productos con esos filtros/i)
    ).toBeInTheDocument();
  });

  it('does not show empty state while loading', () => {
    render(<ProductGrid products={[]} isLoading={true} />);
    expect(
      screen.queryByText(/no encontramos productos con esos filtros/i)
    ).not.toBeInTheDocument();
  });
});
