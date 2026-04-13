/**
 * ProductGrid spec — updated to match the presentational interface
 * (products and isLoading as props, no internal fetch).
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductGrid } from './ProductGrid';
import React from 'react';

const mockProducts = [
  {
    id: '1', name: 'Product 1', slug: 'prod-1', price: 100, description: 'Desc',
    materials: 'Wood', images: ['/p1.jpg'], leadTime: 0, isCustomizable: false,
    listPrice: 0, cashDiscountPrice: 0, inStock: true, requiresAssembly: false,
    categoryId: 'cat1', isFeatured: false,
  },
  {
    id: '2', name: 'Product 2', slug: 'prod-2', price: 200, description: 'Desc',
    materials: 'Metal', images: ['/p2.jpg'], leadTime: 0, isCustomizable: false,
    listPrice: 0, cashDiscountPrice: 0, inStock: true, requiresAssembly: false,
    categoryId: 'cat2', isFeatured: false,
  },
];

describe('ProductGrid', () => {
  it('renders loading state when isLoading is true', () => {
    render(<ProductGrid products={[]} isLoading={true} />);
    const loadingEl = screen.getByText(/curando piezas/i);
    expect(loadingEl).toBeDefined();
    expect(loadingEl.className).toContain('text-secondary');
    expect(loadingEl.className).toContain('font-serif');
    expect(loadingEl.className).toContain('p-8');
  });

  it('renders products from props in a grid layout', () => {
    const { container } = render(<ProductGrid products={mockProducts} isLoading={false} />);
    expect(screen.getByText('Product 1')).toBeDefined();
    expect(screen.getByText('Product 2')).toBeDefined();
    const grid = container.querySelector('.grid');
    expect(grid).toBeDefined();
    expect(grid?.className).toContain('grid-cols-1');
    expect(grid?.className).toContain('md:grid-cols-2');
    expect(grid?.className).toContain('lg:grid-cols-3');
  });

  it('renders custom title when provided', () => {
    render(<ProductGrid products={mockProducts} isLoading={false} title="Featured Selection" />);
    const heading = screen.getByText('Featured Selection');
    expect(heading).toBeDefined();
    expect(heading.tagName).toBe('H2');
  });

  it('renders empty state message when products array is empty and not loading', () => {
    render(<ProductGrid products={[]} isLoading={false} />);
    expect(screen.getByText(/no encontramos productos con esos filtros/i)).toBeDefined();
  });

  it('renders all products passed via props', () => {
    render(<ProductGrid products={mockProducts} isLoading={false} />);
    const cards = screen.getAllByRole('heading', { level: 3 });
    expect(cards).toHaveLength(2);
  });
});
