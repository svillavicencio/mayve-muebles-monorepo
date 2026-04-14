import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';

vi.mock('sonner', () => ({
  Toaster: vi.fn(() => null),
}));

import { AdminToaster } from './AdminToaster';
import { Toaster } from 'sonner';

const MockToaster = Toaster as ReturnType<typeof vi.fn>;

describe('AdminToaster', () => {
  it('renders without errors', () => {
    const { container } = render(<AdminToaster />);
    expect(container).toBeDefined();
  });

  it('passes toastOptions with minimum 12px font-size to Toaster', () => {
    MockToaster.mockClear();
    render(<AdminToaster />);
    const props = MockToaster.mock.calls[0][0] as Record<string, unknown>;
    expect(props.toastOptions).toEqual(
      expect.objectContaining({ style: expect.objectContaining({ fontSize: '12px' }) }),
    );
  });

  it('passes richColors prop to Toaster', () => {
    MockToaster.mockClear();
    render(<AdminToaster />);
    const props = MockToaster.mock.calls[0][0] as Record<string, unknown>;
    expect(props.richColors).toBe(true);
  });
});
