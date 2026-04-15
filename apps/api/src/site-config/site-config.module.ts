import { Module } from '@nestjs/common';
import { SiteConfigService } from './site-config.service';
import { SiteConfigController } from './site-config.controller';
import { SupabaseModule } from '../common/supabase/supabase.module';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';

@Module({
  imports: [SupabaseModule],
  providers: [SiteConfigService, SupabaseAuthGuard, JwtAuthGuard],
  controllers: [SiteConfigController],
  exports: [SiteConfigService],
})
export class SiteConfigModule {}
