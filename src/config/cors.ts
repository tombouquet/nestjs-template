import { INestApplication } from '@nestjs/common';

export const corsSetup = (app: INestApplication) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const productionOrigins = [
    /\.cobolt\.work$/,
    'https://creative-hub-production-frontend-894784203112.australia-southeast1.run.app',
    'https://creative-hub-staging-frontend-894784203112.australia-southeast1.run.app',
  ];

  app.enableCors({
    origin: isProduction ? productionOrigins : ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-app-source'],
    credentials: false,
  });
};
