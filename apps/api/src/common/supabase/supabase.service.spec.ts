import { SupabaseService } from './supabase.service';

const mockCreateClient = jest.fn().mockReturnValue({ auth: {} });

jest.mock('@supabase/supabase-js', () => ({
  createClient: (...args: any[]) => mockCreateClient(...args),
}));

describe('SupabaseService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.SUPABASE_URL = 'http://localhost:54321';
    process.env.SUPABASE_ANON_KEY = 'test-anon-key';
  });

  it('creates and exposes a Supabase client', () => {
    const service = new SupabaseService();
    expect(service.client).toBeDefined();
  });

  it('initializes the client with the env vars', () => {
    new SupabaseService();
    expect(mockCreateClient).toHaveBeenCalledWith(
      'http://localhost:54321',
      'test-anon-key',
    );
  });
});
