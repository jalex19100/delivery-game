#!/bin/bash

# Build script for Delivery Game

echo "🚚 Building Delivery Game assets..."

# Build with Vite
npm run build

# Create assets directory if it doesn't exist
mkdir -p public/assets/dist

# Copy built assets to public directory
echo "📁 Copying built assets..."
cp -r dist/* public/assets/dist/

# Clean up build directory
rm -rf dist

echo "✅ Build completed successfully!"
echo "📁 Assets available in: public/assets/dist/" 