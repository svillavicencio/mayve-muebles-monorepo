import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
  Toaster: vi.fn(() => null),
}));

// Mock api-client
vi.mock('../../lib/api-client', () => ({
  fetchCategories: vi.fn(),
  createCategory: vi.fn(),
  deleteCategory: vi.fn(),
}));

// Mock slugify
vi.mock('../../lib/slugify', () => ({
  slugify: vi.fn((name: string) => name.toLowerCase().replace(/\s+/g, '-')),
}));

import CategoryManager from './CategoryManager';
import { toast } from 'sonner';
import { fetchCategories, deleteCategory } from '../../lib/api-client';

const mockFetchCategories = fetchCategories as ReturnType<typeof vi.fn>;
const mockDeleteCategory = deleteCategory as ReturnType<typeof vi.fn>;
const mockToastSuccess = toast.success as ReturnType<typeof vi.fn>;
const mockToastError = toast.error as ReturnType<typeof vi.fn>;

const sampleCategories = [
  { id: 'cat-1', name: 'Sofás', slug: 'sofas' },
  { id: 'cat-2', name: 'Mesas', slug: 'mesas' },
];

describe('CategoryManager — toast feedback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchCategories.mockResolvedValue(sampleCategories);
    vi.spyOn(window, 'confirm').mockReturnValue(true);
  });

  it('shows a success toast after deleting a category', async () => {
    mockDeleteCategory.mockResolvedValue(undefined);
    render(<CategoryManager />);

    await waitFor(() => screen.getAllByText('Eliminar'));

    fireEvent.click(screen.getAllByText('Eliminar')[0]);

    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith('Categoría eliminada correctamente');
    });
  });

  it('shows a 409 error toast with the business message when category has products', async () => {
    const err = new Error('La categoría no puede eliminarse porque contiene productos') as any;
    err.status = 409;
    mockDeleteCategory.mockRejectedValue(err);
    render(<CategoryManager />);

    await waitFor(() => screen.getAllByText('Eliminar'));

    fireEvent.click(screen.getAllByText('Eliminar')[0]);

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        'No se puede eliminar: la categoría no está vacía',
      );
    });
  });

  it('shows a generic error toast for unexpected delete failures', async () => {
    const err = new Error('Network error') as any;
    err.status = 500;
    mockDeleteCategory.mockRejectedValue(err);
    render(<CategoryManager />);

    await waitFor(() => screen.getAllByText('Eliminar'));

    fireEvent.click(screen.getAllByText('Eliminar')[0]);

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('Error al eliminar la categoría');
    });
  });
});
