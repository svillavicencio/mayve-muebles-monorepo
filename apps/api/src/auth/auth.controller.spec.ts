import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';

const mockValidateUser = jest.fn();
const mockLogin = jest.fn();

const mockAuthService = {
  validateUser: mockValidateUser,
  login: mockLogin,
};

describe('AuthController', () => {
  let controller: AuthController;
  let mockResponse: { cookie: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new AuthController(mockAuthService as any);
    mockResponse = { cookie: jest.fn() };
  });

  describe('POST /auth/login', () => {
    it('sets an httpOnly cookie with the Supabase access_token on successful login', async () => {
      mockValidateUser.mockResolvedValue({
        user: { id: 'uuid-1', email: 'admin@test.com' },
        access_token: 'supabase-jwt-token',
      });
      mockLogin.mockResolvedValue({ access_token: 'supabase-jwt-token' });

      await controller.login(
        { email: 'admin@test.com', password: 'pass123' },
        mockResponse as any,
      );

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'access_token',
        'supabase-jwt-token',
        expect.objectContaining({ httpOnly: true }),
      );
    });

    it('returns 200 with user profile on successful login', async () => {
      mockValidateUser.mockResolvedValue({
        user: { id: 'uuid-1', email: 'admin@test.com' },
        access_token: 'supabase-jwt-token',
      });
      mockLogin.mockResolvedValue({ access_token: 'supabase-jwt-token' });

      const result = await controller.login(
        { email: 'admin@test.com', password: 'pass123' },
        mockResponse as any,
      );

      expect(result).toEqual({
        message: 'Login successful',
        user: { id: 'uuid-1', email: 'admin@test.com' },
      });
    });

    it('throws UnauthorizedException when credentials are invalid', async () => {
      mockValidateUser.mockResolvedValue(null);

      await expect(
        controller.login(
          { email: 'bad@test.com', password: 'wrong' },
          mockResponse as any,
        ),
      ).rejects.toThrow(UnauthorizedException);

      expect(mockResponse.cookie).not.toHaveBeenCalled();
    });
  });
});
