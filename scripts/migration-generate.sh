#!/bin/bash
# If a migration name is provided, use it. Otherwise, use the current date and time.
if [ -n "$1" ]; then
  MIGRATION_NAME="$1"
else
  MIGRATION_NAME="Migration"
fi
MIGRATION_PATH="src/migrations/$MIGRATION_NAME"
npx typeorm-ts-node-commonjs migration:generate -d src/config/typeorm.ts $MIGRATION_PATH