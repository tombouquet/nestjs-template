import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

export const swaggerSetup = (app: INestApplication) => {
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (_controllerKey: string, methodKey: string) =>
      methodKey,
  };

  const config = new DocumentBuilder()
    .setTitle('NestJS Template API')
    .setDescription('This is the API for the NestJS Template project.')
    .setVersion('1.0')
    .addTag('NestJS Template')
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, options);

  // Create the Swagger document
  const document = documentFactory();

  // Setup Swagger UI (optional - can be removed if only using Scalar)
  SwaggerModule.setup('api', app, documentFactory);

  // Create endpoint to serve Swagger JSON spec
  app
    .getHttpAdapter()
    .get('/swagger-spec.json', (_req: Request, res: Response) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(document);
    });

  // Write Swagger JSON to file for external tools
  const outputPath = path.resolve(process.cwd(), 'swagger-spec.json');
  fs.writeFileSync(outputPath, JSON.stringify(document, null, 2), {
    encoding: 'utf8',
  });

  // Setup Scalar API Reference
  app.use(
    '/reference',
    apiReference({
      spec: {
        url: '/swagger-spec.json',
      },
      showDeveloperTools: 'never',
    }),
  );
};
