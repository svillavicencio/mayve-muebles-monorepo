import React from 'react';
import { render, screen } from '@testing-library/react';
import CategoryManager from '../CategoryManager';

vi.mock('../../../lib/api-client', () => ({
  fetchCategories: vi.fn().mockResolvedValue([
    { id: 'c1', name: 'Sillas', slug: 'sillas' },
  ]),
  createCategory: vi.fn(),
  deleteCategory: vi.fn(),
}));

vi.mock('../../../lib/slugify', () => ({
  slugify: vi.fn((v: string) => v.toLowerCase()),
}));

describe('CategoryManager — AUP-02 padding removal', () => {
  it('root div does NOT have p-8 in its className', async () => {
    const { container } = render(<CategoryManager />);
    await screen.findByText('Sillas');
    const rootDiv = container.firstElementChild as HTMLElement;
    expect(rootDiv.className).not.toContain('p-8');
  });
});

describe('CategoryManager — AUP-07 button height fix', () => {
  it('Añadir button does NOT have h-[38px] in its className', async () => {
    const { container } = render(<CategoryManager />);
    await screen.findByText('Sillas');
    const btn = screen.getByRole('button', { name: /añadir/i });
    expect(btn.className).not.toContain('h-[38px]');
  });
});
