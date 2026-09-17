import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const uploadsDir = process.env.UPLOADS_DIR || join(__dirname, '..', 'uploads');
  app.useStaticAssets(uploadsDir, { prefix: '/uploads/' });
  await app.listen(process.env.PORT || 3001);
}
bootstrap();
