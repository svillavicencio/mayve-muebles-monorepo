import React from 'react';
import { render, screen } from '@testing-library/react';
import ProductTable from '../ProductTable';
import type { Product } from '@mayve/shared';

vi.mock('../../../lib/api-client', () => ({
  fetchProducts: vi.fn().mockResolvedValue([
    {
      id: 'p1',
      name: 'Silla Roble',
      slug: 'silla-roble',
      description: 'Descripción',
      price: 1200,
      listPrice: 1400,
      cashDiscountPrice: 1100,
      categoryId: 'cat-1',
      category: { id: 'cat-1', name: 'Sillas', slug: 'sillas' },
      inStock: true,
      isFeatured: false,
      images: [],
      leadTime: 15,
      isCustomizable: false,
      requiresAssembly: false,
      materials: '',
      dimensions: '',
    },
    {
      id: 'p2',
      name: 'Mesa Nogal',
      slug: 'mesa-nogal',
      description: 'Descripción',
      price: 2400,
      listPrice: 2800,
      cashDiscountPrice: 2200,
      categoryId: 'cat-2',
      category: { id: 'cat-2', name: 'Mesas', slug: 'mesas' },
      inStock: false,
      isFeatured: false,
      images: [],
      leadTime: 20,
      isCustomizable: false,
      requiresAssembly: false,
      materials: '',
      dimensions: '',
    },
  ]),
  deleteProduct: vi.fn(),
}));

describe('ProductTable — AUP-02 padding removal', () => {
  it('header toolbar div does NOT have p-6 in its className', async () => {
    const { container } = render(<ProductTable />);
    // wait for async data load
    await screen.findByText(/Productos/i);
    // The header toolbar is the first child of the main relative div
    const mainDiv = container.firstChild as HTMLElement;
    const headerDiv = mainDiv.querySelector('div') as HTMLElement | null;
    expect(headerDiv).toBeTruthy();
    expect(headerDiv!.className).not.toContain('p-6');
  });
});

describe('ProductTable — AUP-06 semantic stock badge colors', () => {
  it('inStock badge has text-primary and NOT text-green-600', async () => {
    render(<ProductTable />);
    const badges = await screen.findAllByText('En Stock');
    badges.forEach(badge => {
      expect(badge.className).toContain('text-primary');
      expect(badge.className).not.toContain('text-green-600');
    });
  });

  it('out-of-stock badge uses design token and NOT text-red-500', async () => {
    render(<ProductTable />);
    const badges = await screen.findAllByText('Agotado');
    badges.forEach(badge => {
      expect(badge.className).not.toContain('text-red-500');
      // Uses text-secondary/60 design token — no raw red palette class
    });
  });
});
