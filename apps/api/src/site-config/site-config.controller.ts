import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { SiteConfigService } from './site-config.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('site-config')
export class SiteConfigController {
  constructor(private readonly siteConfigService: SiteConfigService) {}

  @Get()
  async getSiteConfig() {
    return this.siteConfigService.getConfig();
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateSiteConfig(@Body() body: any) {
    return this.siteConfigService.updateConfig(body);
  }
}
