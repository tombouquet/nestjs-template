#!/bin/sh
set -e

echo "Enabling corepack..."
corepack enable

echo "Installing dependencies..."
yarn

echo "Current directory: $(pwd)"
echo "Listing node_modules/typeorm:"
ls -la node_modules/typeorm/ || echo "typeorm directory not found"

echo "Running TypeORM migration..."
npx typeorm-ts-node-commonjs migration:run -d src/config/typeorm.ts

echo "Migration completed successfully!"