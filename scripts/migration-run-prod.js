#!/usr/bin/env node

const path = require('path');

// Get the directory where the script is located
const scriptDir = __dirname;
// Get the project root (parent of scripts directory)
const projectRoot = path.resolve(scriptDir, '..');

// Change to project root
process.chdir(projectRoot);

// Try to load the DataSource from compiled JS first, fallback to TypeScript
let AppDataSource;
try {
  // Try compiled version first (production)
  AppDataSource = require(
    path.join(projectRoot, 'dist', 'src', 'config', 'typeorm.js'),
  ).default;
} catch (e) {
  // Fallback to TypeScript version (development or if source files available)
  try {
    require('ts-node/register');
    require('tsconfig-paths/register');
    AppDataSource = require(
      path.join(projectRoot, 'src', 'config', 'typeorm.ts'),
    ).default;
  } catch (e2) {
    console.error('Failed to load TypeORM DataSource:', e2.message);
    process.exit(1);
  }
}

async function runMigrations() {
  try {
    console.log('Initializing database connection...');
    await AppDataSource.initialize();

    console.log('Running TypeORM migrations...');
    const migrations = await AppDataSource.runMigrations();

    if (migrations.length === 0) {
      console.log('No pending migrations found.');
    } else {
      console.log(`Successfully ran ${migrations.length} migration(s):`);
      migrations.forEach((migration) => {
        console.log(`  - ${migration.name}`);
      });
    }

    await AppDataSource.destroy();
    console.log('Migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error.message);
    console.error(error);
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    process.exit(1);
  }
}

runMigrations();
