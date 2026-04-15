import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SupabaseModule } from '../common/supabase/supabase.module';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [SupabaseModule],
  controllers: [AuthController],
  providers: [AuthService, SupabaseAuthGuard, JwtAuthGuard],
  exports: [AuthService],
})
export class AuthModule {}
