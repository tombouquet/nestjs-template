import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { swaggerSetup } from './config/swagger';
import { Server } from 'http';
import { AddressInfo } from 'net';
import { corsSetup } from './config/cors';

dotenv.config({
  path: `.${process.env.NODE_ENV ?? 'development'}.env`,
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // Apply logger first
  app.useLogger(app.get(Logger));

  // Apply Swagger
  swaggerSetup(app);

  // Apply CORS
  corsSetup(app);

  // Apply validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Start the server
  const port = Number(process.env.PORT ?? 4000);
  const host = process.env.HOST ?? '0.0.0.0';
  const server = (await app.listen(port, host)) as Server;
  const address = server.address() as AddressInfo;
  const url =
    typeof address === 'string'
      ? address
      : `http://${address.address === '::' || address.address === '::1' || address.address === '0.0.0.0' ? 'localhost' : address.address}:${address.port}`;

  app.get(Logger).log(`Application is running on: ${url}`);
}

void bootstrap();
