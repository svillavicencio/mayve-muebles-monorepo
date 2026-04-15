import { Test, TestingModule } from '@nestjs/testing';
import { HealthCheckService } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { PrismaHealthIndicator } from './indicators/prisma.health';

describe('HealthController', () => {
  let controller: HealthController;
  let healthCheckService: jest.Mocked<Pick<HealthCheckService, 'check'>>;
  let prismaIndicator: jest.Mocked<Pick<PrismaHealthIndicator, 'isHealthy'>>;

  beforeEach(async () => {
    healthCheckService = {
      check: jest.fn(),
    };

    prismaIndicator = {
      isHealthy: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: HealthCheckService, useValue: healthCheckService },
        { provide: PrismaHealthIndicator, useValue: prismaIndicator },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('check', () => {
    it('calls health.check with an array and returns its result', async () => {
      const expectedResult = {
        status: 'ok' as const,
        info: { prisma: { status: 'up' as const } },
        error: {},
        details: { prisma: { status: 'up' as const } },
      };
      healthCheckService.check.mockResolvedValue(expectedResult);

      const result = await controller.check();

      expect(healthCheckService.check).toHaveBeenCalledTimes(1);
      expect(healthCheckService.check).toHaveBeenCalledWith(
        expect.arrayContaining([expect.any(Function)]),
      );
      expect(result).toEqual(expectedResult);
    });

    it('the callback passed to health.check calls prisma.isHealthy("prisma")', async () => {
      const upResult = { prisma: { status: 'up' as const } };
      prismaIndicator.isHealthy.mockResolvedValue(upResult);
      healthCheckService.check.mockImplementation(async (checks) => {
        for (const check of checks) {
          await check();
        }
        return {
          status: 'ok' as const,
          info: upResult,
          error: {},
          details: upResult,
        };
      });

      await controller.check();

      expect(prismaIndicator.isHealthy).toHaveBeenCalledWith('prisma');
    });
  });
});
