import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { resolve } from 'node:path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like curl) or any localhost/127.0.0.1 origin
      if (
        !origin ||
        /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
      ) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  const screenshotsDirectory = resolve(
    __dirname,
    '../../../storage/screenshots',
  );

  app.useStaticAssets(screenshotsDirectory, {
    prefix: '/screenshots/',
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`JourneyLens API is listening on http://localhost:${port}`);
}

void bootstrap();
