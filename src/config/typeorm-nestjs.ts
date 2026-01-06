import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenv.config({
  path: `.${process.env.NODE_ENV ?? 'development'}.env`,
});

export function getTypeOrmConfig(): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    url: process.env.DATABASE_URL as string,
    entities: [path.join(__dirname, '..', 'entities', '*.entity{.ts,.js}')],
    migrations: [path.join(__dirname, '..', 'migrations', '*.{ts,js}')],
    namingStrategy: new SnakeNamingStrategy(),
    synchronize: false,
    logging: false,
  };
}

export const typeOrmConfig = getTypeOrmConfig();
