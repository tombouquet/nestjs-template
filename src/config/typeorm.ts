import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenv.config({
  path: `.${process.env.NODE_ENV ?? 'development'}.env`,
});

const entities = [path.join(__dirname, '..', 'entities', '*.entity{.ts,.js}')];
const migrations = [path.join(__dirname, '..', 'migrations', '*.{ts,js}')];

const AppDataSource = new DataSource({
  entities,
  migrations,
  type: 'postgres',
  url: process.env.DATABASE_URL,
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: false,
});

export default AppDataSource;
