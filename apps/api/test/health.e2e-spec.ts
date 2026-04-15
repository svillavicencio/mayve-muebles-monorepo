import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { HealthCheckError } from '@nestjs/terminus';
import request from 'supertest';
import { HealthModule } from '../src/health/health.module';
import { PrismaHealthIndicator } from '../src/health/indicators/prisma.health';

const mockPrismaIndicator = {
  isHealthy: jest.fn(),
};

describe('HealthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HealthModule],
    })
      .overrideProvider(PrismaHealthIndicator)
      .useValue(mockPrismaIndicator)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /health', () => {
    it('returns 200 with status ok when DB is up', async () => {
      mockPrismaIndicator.isHealthy.mockResolvedValue({
        prisma: { status: 'up' },
      });

      const response = await request(app.getHttpServer()).get('/health');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
      expect(response.body.info.prisma.status).toBe('up');
      expect(response.body.error).toEqual({});
      expect(response.body.details.prisma.status).toBe('up');
    });

    it('returns 503 with status error when DB is down', async () => {
      mockPrismaIndicator.isHealthy.mockRejectedValue(
        new HealthCheckError(
          'Prisma check failed',
          { prisma: { status: 'down', message: 'connection refused' } },
        ),
      );

      const response = await request(app.getHttpServer()).get('/health');

      expect(response.status).toBe(503);
      expect(response.body.status).toBe('error');
      expect(response.body.error.prisma.status).toBe('down');
      expect(response.body.details.prisma.status).toBe('down');
    });

    it('is accessible without auth headers (REQ-1)', async () => {
      mockPrismaIndicator.isHealthy.mockResolvedValue({
        prisma: { status: 'up' },
      });

      const response = await request(app.getHttpServer()).get('/health');

      expect(response.status).not.toBe(401);
      expect(response.status).not.toBe(403);
      expect(response.status).toBe(200);
    });
  });
});
