import { Module } from '@nestjs/common';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { SiteConfigModule } from './site-config/site-config.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
    }),
    PrismaModule,
    HealthModule,
    ProductsModule,
    AuthModule,
    SiteConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
