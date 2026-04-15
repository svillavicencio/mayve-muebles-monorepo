import { AuthService } from './auth.service';

const mockSignInWithPassword = jest.fn();

const mockSupabaseService = {
  client: {
    auth: {
      signInWithPassword: mockSignInWithPassword,
    },
  },
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService(mockSupabaseService as any);
  });

  describe('validateUser', () => {
    it('returns user and access_token on successful Supabase login', async () => {
      mockSignInWithPassword.mockResolvedValue({
        data: {
          user: { id: 'uuid-1', email: 'admin@test.com' },
          session: { access_token: 'supabase-jwt-token' },
        },
        error: null,
      });

      const result = await service.validateUser('admin@test.com', 'password123');

      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: 'admin@test.com',
        password: 'password123',
      });
      expect(result).toEqual({
        user: { id: 'uuid-1', email: 'admin@test.com' },
        access_token: 'supabase-jwt-token',
      });
    });

    it('returns null when Supabase returns an error', async () => {
      mockSignInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid login credentials' },
      });

      const result = await service.validateUser('bad@test.com', 'wrong');

      expect(result).toBeNull();
    });

    it('returns null when session is missing', async () => {
      mockSignInWithPassword.mockResolvedValue({
        data: { user: { id: 'uuid-1' }, session: null },
        error: null,
      });

      const result = await service.validateUser('admin@test.com', 'password123');

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('returns the access_token from session data', async () => {
      const result = await service.login({ access_token: 'token-abc' });
      expect(result).toEqual({ access_token: 'token-abc' });
    });
  });
});
