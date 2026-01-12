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
  const port = process.env.PORT ?? 4000;
  const server = (await app.listen(port)) as Server;
  const address = server.address() as AddressInfo;
  const host =
    typeof address === 'string'
      ? address
      : `http://${address.address === '::' ? 'localhost' : address.address}:${address.port.toString()}`;

  app.get(Logger).log(`Application is running on: ${host}`);
}

void bootstrap();
