import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { SiteConfigModule } from './site-config/site-config.module';

@Module({
  imports: [ProductsModule, AuthModule, SiteConfigModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
