import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductCard } from './ProductCard';
import React from 'react';

const mockProduct = {
  id: '1',
  name: 'Silla Nórdica',
  slug: 'silla-nordica',
  description: 'Una silla elegante',
  materials: 'Madera de Roble',
  dimensions: '50x50x90',
  price: 15000,
  categoryId: 'cat1',
  images: ['/test.jpg'],
};

describe('ProductCard', () => {
  it('should render product name and price', () => {
    const { container } = render(<ProductCard product={mockProduct as any} />);
    
    expect(screen.getByText('Silla Nórdica')).toBeDefined();
    // Using regex to handle potential line breaks or spaces in currency formatting
    expect(screen.getByText(/\$?\s?15\.000/)).toBeDefined();
    expect(screen.getByText(/Madera de Roble/i)).toBeDefined();

    // The Curated Gallery class assertions
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('bg-surface-container-lowest');
    expect(card.className).toContain('rounded-sm');
    expect(card.className).toContain('overflow-hidden');
    expect(card.className).toContain('shadow-ambient');
  });

  it('should have a link with Tailwind classes', () => {
    render(<ProductCard product={mockProduct as any} />);
    const link = screen.getByRole('link', { name: /explorar pieza/i });
    expect(link.getAttribute('href')).toBe('/products/silla-nordica');
    expect(link.className).toContain('btn-primary');
    expect(link.className).toContain('w-full');
    expect(link.className).toContain('py-4');
  });

  it('should have mobile-first responsive classes', () => {
    const { container } = render(<ProductCard product={mockProduct as any} />);

    const contentDiv = container.querySelector('.p-4') as HTMLElement;
    expect(contentDiv).toBeDefined();
    expect(contentDiv.className).toContain('p-4');
    expect(contentDiv.className).toContain('md:p-6');
    expect(contentDiv.className).toContain('lg:p-8');

    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading.className).toContain('text-lg');
    expect(heading.className).toContain('md:text-2xl');

    const link = screen.getByRole('link', { name: /explorar pieza/i });
    expect(link.className).toContain('min-h-[44px]');
  });
});
