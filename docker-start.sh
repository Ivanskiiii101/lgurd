#!/bin/bash

# Setup script to prepare and start Docker Compose

echo "🚀 L'GURD E-Commerce - Docker Setup"
echo ""

# Check if .env.local exists, create if not
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    ./setup-env.sh
    echo ""
    echo "⚠️  Please edit .env.local with your API keys before continuing."
    echo "   Press Enter to continue anyway, or Ctrl+C to exit and edit .env.local"
    read
fi

echo "🐳 Starting Docker Compose..."
echo ""

# Start Docker Compose
docker-compose up --build
