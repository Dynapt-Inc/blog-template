#!/bin/bash

# Setup script for new blog instances
# This ensures CSS and dependencies are properly configured

echo "Setting up blog instance..."

# Build the blog-shell package
echo "Building blog-shell package..."
cd ../blog-generator/packages/blog-shell
npm install
npm run build

# Return to blog directory
cd ../../blog-template

# Copy the processed CSS to the blog
echo "Setting up CSS..."
cp node_modules/@caleblawson/blog-shell/dist/styles/globals.css src/app/globals.css

# Install dependencies
echo "Installing dependencies..."
npm install

echo "Blog setup complete!"
echo ""
echo "To start development:"
echo "  npm run dev"


