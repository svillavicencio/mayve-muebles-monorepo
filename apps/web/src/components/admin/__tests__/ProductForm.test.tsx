import React from 'react';
import { render, waitFor } from '@testing-library/react';
import ProductForm from '../ProductForm';

// Mock api-client to avoid network calls
vi.mock('../../../lib/api-client', () => ({
  fetchCategories: vi.fn().mockResolvedValue([]),
  fetchProducts: vi.fn().mockResolvedValue([]),
  createProduct: vi.fn(),
  updateProduct: vi.fn(),
}));

vi.mock('../../../lib/slugify', () => ({
  slugify: vi.fn((v: string) => v.toLowerCase()),
}));

describe('ProductForm — AUP-02 padding removal', () => {
  it('root form element does NOT have p-8 in its className', async () => {
    const { container } = render(<ProductForm />);
    // Wait for form to appear after loading state resolves
    await waitFor(() => {
      const form = container.querySelector('form');
      expect(form).toBeTruthy();
    });
    const form = container.querySelector('form');
    expect(form!.className).not.toContain('p-8');
  });
});
