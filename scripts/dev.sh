#!/usr/bin/env bash
set -e

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
MONGOD_BINARY="$ROOT_DIR/node_modules/.cache/mongodb-memory-server/mongod-x64-fedora-8.2.6"
DB_PATH="$ROOT_DIR/.mongodb/data"
MONGO_PORT=27017

echo "🚀 Starting MongoDB..."
$MONGOD_BINARY --dbpath "$DB_PATH" --port $MONGO_PORT --fork --logpath "$ROOT_DIR/.mongodb/mongod.log"

echo "🌱 Seeding database..."
cd "$ROOT_DIR" && pnpm run db:seed

echo "📡 Starting dev servers..."
cd "$ROOT_DIR" && pnpm run dev &

trap "echo 'Shutting down...'; kill %1; $MONGOD_BINARY --dbpath '$DB_PATH' --port $MONGO_PORT --shutdown" EXIT

wait
