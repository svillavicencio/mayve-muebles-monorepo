import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { SupabaseAuthGuard } from './supabase-auth.guard';

const mockGetUser = jest.fn();

const mockSupabaseService = {
  client: {
    auth: {
      getUser: mockGetUser,
    },
  },
};

function buildContext(options: {
  cookies?: Record<string, string>;
  authHeader?: string;
}): ExecutionContext {
  const request = {
    cookies: options.cookies ?? {},
    headers: {
      authorization: options.authHeader,
    },
  };

  return {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as unknown as ExecutionContext;
}

describe('SupabaseAuthGuard', () => {
  let guard: SupabaseAuthGuard;

  beforeEach(() => {
    jest.clearAllMocks();
    guard = new SupabaseAuthGuard(mockSupabaseService as any);
  });

  describe('canActivate', () => {
    it('returns true and sets request.user when cookie token is valid', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: 'user-uuid-1', email: 'admin@test.com' } },
        error: null,
      });

      const ctx = buildContext({ cookies: { access_token: 'valid-jwt' } });
      const request = ctx.switchToHttp().getRequest() as any;

      const result = await guard.canActivate(ctx);

      expect(result).toBe(true);
      expect(mockGetUser).toHaveBeenCalledWith('valid-jwt');
      expect(request.user).toEqual({ userId: 'user-uuid-1', email: 'admin@test.com' });
    });

    it('throws UnauthorizedException("Missing access token") when no token present and does NOT call getUser', async () => {
      const ctx = buildContext({});

      await expect(guard.canActivate(ctx)).rejects.toThrow(
        new UnauthorizedException('Missing access token'),
      );
      expect(mockGetUser).not.toHaveBeenCalled();
    });

    it('throws UnauthorizedException("Invalid or expired token") when Supabase returns an error', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'JWT expired' },
      });

      const ctx = buildContext({ cookies: { access_token: 'expired-jwt' } });

      await expect(guard.canActivate(ctx)).rejects.toThrow(
        new UnauthorizedException('Invalid or expired token'),
      );
      expect(mockGetUser).toHaveBeenCalledWith('expired-jwt');
    });

    it('returns true when token is provided via Authorization Bearer header (no cookie)', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: 'user-uuid-2', email: 'bearer@test.com' } },
        error: null,
      });

      const ctx = buildContext({ authHeader: 'Bearer bearer-token-xyz' });
      const request = ctx.switchToHttp().getRequest() as any;

      const result = await guard.canActivate(ctx);

      expect(result).toBe(true);
      expect(mockGetUser).toHaveBeenCalledWith('bearer-token-xyz');
      expect(request.user).toEqual({ userId: 'user-uuid-2', email: 'bearer@test.com' });
    });
  });
});
