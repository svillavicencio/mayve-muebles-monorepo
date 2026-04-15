import { HealthCheckError } from '@nestjs/terminus';
import { PrismaHealthIndicator } from './prisma.health';

const mockPrismaService = {
  $queryRaw: jest.fn(),
};

describe('PrismaHealthIndicator', () => {
  let indicator: PrismaHealthIndicator;

  beforeEach(() => {
    jest.clearAllMocks();
    indicator = new PrismaHealthIndicator(mockPrismaService as any);
  });

  describe('isHealthy', () => {
    it('returns { prisma: { status: "up" } } when $queryRaw resolves', async () => {
      mockPrismaService.$queryRaw.mockResolvedValueOnce([{ '?column?': 1 }]);

      const result = await indicator.isHealthy('prisma');

      expect(result).toEqual({ prisma: { status: 'up' } });
    });

    it('throws HealthCheckError with down status when $queryRaw rejects', async () => {
      mockPrismaService.$queryRaw.mockRejectedValueOnce(new Error('boom'));

      await expect(indicator.isHealthy('prisma')).rejects.toBeInstanceOf(
        HealthCheckError,
      );

      try {
        await indicator.isHealthy('prisma');
      } catch (error) {
        expect(error).toBeInstanceOf(HealthCheckError);
        const healthError = error as HealthCheckError;
        expect(healthError.causes).toEqual({
          prisma: { status: 'down', message: 'boom' },
        });
      }
    });
  });
});
