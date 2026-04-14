import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

export interface SiteConfig {
  whatsapp: string;
  email: string;
  cashDiscount: number;
  announcementBanner?: string | null;
  instagramUrl: string;
  address: string;
  googleMapsUrl: string;
}

@Injectable()
export class SiteConfigService {
  constructor(private readonly prisma: PrismaService) {}

  async getConfig() {
    let config = await this.prisma.siteConfig.findFirst();
    if (!config) {
      // Create a default config if none exists
      config = await this.prisma.siteConfig.create({
        data: {
          whatsapp: '',
          email: '',
          cashDiscount: 10,
          instagramUrl: '',
          address: '',
          googleMapsUrl: '',
        },
      });
    }
    return config;
  }

  async updateConfig(data: Record<string, unknown>) {
    const { id: bodyId, updatedAt: _updatedAt, ...safeData } = data;
    const targetId = typeof bodyId === 'string' ? bodyId : (await this.getConfig()).id;
    return this.prisma.siteConfig.update({
      where: { id: targetId },
      data: safeData,
    });
  }
}
