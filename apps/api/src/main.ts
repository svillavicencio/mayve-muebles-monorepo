import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { DomainExceptionFilter } from './common/filters/domain-exception.filter';

async function bootstrap() {
  console.log('API CWD:', process.cwd());
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalFilters(new DomainExceptionFilter());

  const frontendUrl = process.env.FRONTEND_URL;
  const origins = ['http://localhost:4321', 'http://127.0.0.1:4321'];
  if (frontendUrl) {
    origins.push(frontendUrl);
    // Agregamos también la versión sin trailing slash por las dudas
    if (frontendUrl.endsWith('/')) {
      origins.push(frontendUrl.slice(0, -1));
    }
  }

  app.enableCors({
    origin: origins,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
