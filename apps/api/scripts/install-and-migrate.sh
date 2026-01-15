#!/bin/sh
set -e

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
# Get the project root (parent of scripts directory)
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Change to project root
cd "$PROJECT_ROOT"

echo "Enabling corepack..."
corepack enable

echo "Installing dependencies..."
yarn

echo "Running TypeORM migration..."
npx typeorm-ts-node-commonjs migration:run -d src/config/typeorm.ts

echo "Migration completed successfully!"