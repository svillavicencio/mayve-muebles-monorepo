import React from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
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

describe('ProductForm — Task 4: Form Expansion', () => {
  it('should render materials textarea and dimensions input', async () => {
    render(<ProductForm />);
    
    // Wait for form to load
    await waitFor(() => {
      expect(screen.queryByText(/Cargando/)).not.toBeInTheDocument();
    });

    // Check for materials field
    const materialsLabel = screen.getByText(/Materiales/i);
    expect(materialsLabel).toBeInTheDocument();
    const materialsInput = screen.getByRole('textbox', { name: /Materiales/i });
    expect(materialsInput).toBeInTheDocument();
    expect(materialsInput.tagName.toLowerCase()).toBe('textarea');

    // Check for dimensions field
    const dimensionsLabel = screen.getByText(/Dimensiones/i);
    expect(dimensionsLabel).toBeInTheDocument();
    const dimensionsInput = screen.getByRole('textbox', { name: /Dimensiones/i });
    expect(dimensionsInput).toBeInTheDocument();
    expect(dimensionsInput.tagName.toLowerCase()).toBe('input');
  });

  it('should update state when materials and dimensions are typed', async () => {
    const { container } = render(<ProductForm />);
    
    await waitFor(() => {
      expect(screen.queryByText(/Cargando/)).not.toBeInTheDocument();
    });

    const materialsInput = screen.getByRole('textbox', { name: /Materiales/i }) as HTMLTextAreaElement;
    const dimensionsInput = screen.getByRole('textbox', { name: /Dimensiones/i }) as HTMLInputElement;

    // Type in materials
    const testMaterials = 'Madera de roble, Tapizado en lino';
    fireEvent.change(materialsInput, { target: { name: 'materials', value: testMaterials } });
    expect(materialsInput.value).toBe(testMaterials);

    // Type in dimensions
    const testDimensions = '180x90x75 cm';
    fireEvent.change(dimensionsInput, { target: { name: 'dimensions', value: testDimensions } });
    expect(dimensionsInput.value).toBe(testDimensions);
  });
});
