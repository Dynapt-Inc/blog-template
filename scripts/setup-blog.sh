#!/bin/bash

# Setup script for new blog instances
# This ensures CSS and dependencies are properly configured

echo "Setting up blog instance..."

# Check if we're in a development environment with blog-generator
if [ -d "../blog-generator/packages/blog-shell" ]; then
    echo "Building blog-shell package locally..."
    cd ../blog-generator/packages/blog-shell
    npm install
    npm run build

    # Return to blog directory
    cd ../../../blog-template

    # Install dependencies first to get the built package
    echo "Installing dependencies..."
    if npm ci; then
        echo "Dependencies installed successfully with clean install"
    else
        echo "Lock file out of sync, updating dependencies..."
        npm install
        echo "Dependencies updated successfully"
    fi

    # Copy the processed CSS to the blog
    echo "Setting up CSS..."
    cp node_modules/@caleblawson/blog-shell/dist/styles/globals.css src/app/globals.css
else
    echo "Using published @caleblawson/blog-shell package..."
    # Install dependencies with lock file sync handling
    echo "Installing dependencies..."
    if npm ci; then
        echo "Dependencies installed successfully with clean install"
    else
        echo "Lock file out of sync, updating dependencies..."
        npm install
        echo "Dependencies updated successfully"
    fi
fi

echo "Blog setup complete!"
echo ""
echo "To start development:"
echo "  npm run dev"


