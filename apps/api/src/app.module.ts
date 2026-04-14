import { Module } from '@nestjs/common';
import { join, resolve } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { SiteConfigModule } from './site-config/site-config.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      // This is the absolute path we verified earlier
      rootPath: resolve('/home/flow/dev/personal-projects/mayve-muebles/apps/api/public'),
      serveRoot: '/',
    }),
    PrismaModule,
    ProductsModule,
    AuthModule,
    SiteConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
