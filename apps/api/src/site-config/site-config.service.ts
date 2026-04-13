import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

export interface SiteConfig {
  whatsapp: string;
  email: string;
  cashDiscount: number;
  announcementBanner?: string | null;
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
        },
      });
    }
    return config;
  }

  async updateConfig(data: Partial<SiteConfig>) {
    const config = await this.getConfig();
    return this.prisma.siteConfig.update({
      where: { id: config.id },
      data,
    });
  }
}
