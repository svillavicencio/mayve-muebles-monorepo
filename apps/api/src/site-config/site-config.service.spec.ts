import { Test, TestingModule } from '@nestjs/testing';
import { SiteConfigService } from './site-config.service';
import { PrismaService } from '../common/prisma/prisma.service';

describe('SiteConfigService', () => {
  let service: SiteConfigService;
  let prisma: { siteConfig: { findFirst: jest.Mock; create: jest.Mock; update: jest.Mock } };

  const mockConfig = {
    id: 'test-uuid',
    whatsapp: '',
    email: '',
    cashDiscount: 10,
    announcementBanner: null,
    instagramUrl: '',
    address: '',
    googleMapsUrl: '',
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    prisma = {
      siteConfig: {
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SiteConfigService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<SiteConfigService>(SiteConfigService);
  });

  describe('getConfig', () => {
    it('returns existing config including new social and location fields', async () => {
      prisma.siteConfig.findFirst.mockResolvedValue(mockConfig);
      const result = await service.getConfig();
      expect(result).toEqual(mockConfig);
    });

    it('creates default config with instagramUrl, address, and googleMapsUrl when none exists', async () => {
      prisma.siteConfig.findFirst.mockResolvedValue(null);
      prisma.siteConfig.create.mockResolvedValue(mockConfig);

      await service.getConfig();

      expect(prisma.siteConfig.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          instagramUrl: '',
          address: '',
          googleMapsUrl: '',
        }),
      });
    });
  });

  describe('updateConfig', () => {
    it('updates instagramUrl, address, and googleMapsUrl', async () => {
      prisma.siteConfig.findFirst.mockResolvedValue(mockConfig);
      const updatedConfig = {
        ...mockConfig,
        instagramUrl: 'https://instagram.com/mayvemuebles',
        address: 'José León Suárez 4062, Lanús Oeste',
        googleMapsUrl: 'https://maps.google.com/?q=test',
      };
      prisma.siteConfig.update.mockResolvedValue(updatedConfig);

      const result = await service.updateConfig({
        instagramUrl: 'https://instagram.com/mayvemuebles',
        address: 'José León Suárez 4062, Lanús Oeste',
        googleMapsUrl: 'https://maps.google.com/?q=test',
      });

      expect(result.instagramUrl).toBe('https://instagram.com/mayvemuebles');
      expect(result.address).toBe('José León Suárez 4062, Lanús Oeste');
      expect(result.googleMapsUrl).toBe('https://maps.google.com/?q=test');
    });

    it('uses the id from body for the WHERE clause to always update the correct record', async () => {
      prisma.siteConfig.update.mockResolvedValue(mockConfig);

      await service.updateConfig({
        id: 'test-uuid',
        updatedAt: new Date(),
        whatsapp: '5491100000000',
      });

      expect(prisma.siteConfig.update).toHaveBeenCalledWith({
        where: { id: 'test-uuid' },
        data: { whatsapp: '5491100000000' },
      });
      // findFirst should NOT be called when id is present in body
      expect(prisma.siteConfig.findFirst).not.toHaveBeenCalled();
    });

    it('falls back to getConfig when no id is provided in body', async () => {
      prisma.siteConfig.findFirst.mockResolvedValue(mockConfig);
      prisma.siteConfig.update.mockResolvedValue(mockConfig);

      await service.updateConfig({ whatsapp: '5491100000000' });

      expect(prisma.siteConfig.update).toHaveBeenCalledWith({
        where: { id: mockConfig.id },
        data: { whatsapp: '5491100000000' },
      });
    });
  });
});
