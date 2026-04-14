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
  app.enableCors({
    origin: ['http://localhost:4321', 'http://127.0.0.1:4321'],
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
