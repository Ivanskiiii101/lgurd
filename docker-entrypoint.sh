#!/bin/sh
set -e

echo "Waiting for database to be ready..."
# Wait for database to be healthy (docker-compose healthcheck handles this)
sleep 3

echo "Pushing database schema..."
prisma db push --accept-data-loss || {
  echo "Schema push failed, trying to continue..."
}

echo "Seeding database (if needed)..."
prisma db seed || echo "Seed completed or skipped"

echo "Starting application..."
exec node server.js
