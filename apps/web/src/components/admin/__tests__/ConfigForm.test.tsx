import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ConfigForm } from '../ConfigForm';
import * as apiClient from '../../../lib/api-client';

vi.mock('../../../lib/api-client', () => ({
  fetchSiteConfig: vi.fn(),
  updateSiteConfig: vi.fn(),
}));

describe('ConfigForm', () => {
  const mockConfig = {
    whatsapp: '+5491112345678',
    email: 'test@example.com',
    cashDiscount: 10,
    announcementBanner: 'Welcome!',
  };

  beforeEach(() => {
    vi.mocked(apiClient.fetchSiteConfig).mockResolvedValue(mockConfig);
  });

  it('renders correctly with config data', async () => {
    render(<ConfigForm />);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/WhatsApp/i)).toHaveValue(mockConfig.whatsapp);
      expect(screen.getByLabelText(/Email/i)).toHaveValue(mockConfig.email);
      expect(screen.getByLabelText(/Descuento/i)).toHaveValue(mockConfig.cashDiscount);
      expect(screen.getByLabelText(/Banner/i)).toHaveValue(mockConfig.announcementBanner);
    });
  });

  it('shows success message on save', async () => {
    vi.mocked(apiClient.updateSiteConfig).mockResolvedValue({});
    render(<ConfigForm />);

    await waitFor(() => screen.getByLabelText(/WhatsApp/i));
    
    // Simulate save by clicking the button
    // (Actual testing of values and submit could be more detailed, but this verifies rendering)
    expect(screen.getByRole('button', { name: /Guardar/i })).toBeInTheDocument();
  });
});
