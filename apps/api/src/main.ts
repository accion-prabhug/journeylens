import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { resolve } from 'node:path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: 'http://localhost:3001',
  });

  const screenshotsDirectory = resolve(
    __dirname,
    '../../../storage/screenshots',
  );

  app.useStaticAssets(screenshotsDirectory, {
    prefix: '/screenshots/',
  });

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();