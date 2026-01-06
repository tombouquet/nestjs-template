import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';

export const swaggerSetup = (app: INestApplication) => {
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (_controllerKey: string, methodKey: string) =>
      methodKey,
  };

  const config = new DocumentBuilder()
    .setTitle('Creative Hub API')
    .setDescription('This is the API for the Creative Hub project.')
    .setVersion('1.0')
    .addTag('Creative Hub')
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, documentFactory);

  // Write Swagger JSON to file
  const document = documentFactory();
  const outputPath = path.resolve(process.cwd(), 'swagger-spec.json');
  fs.writeFileSync(outputPath, JSON.stringify(document, null, 2), {
    encoding: 'utf8',
  });
};
