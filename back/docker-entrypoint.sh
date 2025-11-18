#!/bin/sh
set -e

echo "Waiting for database to be ready..."
sleep 5

echo "Running database migrations..."
npm run migration:run

echo "Starting application..."
exec npm run start:prod