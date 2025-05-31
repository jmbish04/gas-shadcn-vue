#!/bin/bash

# Development Environment Setup Script
# Run this script to set up your development environment

echo "🚀 Setting up Vue + Google Apps Script development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi

# Install dependencies
echo "📦 Installing project dependencies..."
pnpm install

# Check if clasp is installed globally
if ! command -v clasp &> /dev/null; then
    echo "📦 Installing Google Apps Script CLI (clasp)..."
    npm install -g @google/clasp
fi

# Create .env file for development if it doesn't exist
if [ ! -f .env ]; then
    echo "🔧 Creating .env file for development..."
    cat > .env << EOL
# Development environment variables
VITE_APP_NAME="Vue GAS App"
VITE_APP_VERSION="1.0.0"
VITE_ENVIRONMENT="development"
EOL
    echo "✅ Created .env file"
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Get your Gemini API key from https://makersuite.google.com/app/apikey"
echo "2. Run 'clasp login' to authenticate with Google Apps Script"
echo "3. Run 'pnpm dev' to start the development server"
echo "4. Run 'pnpm run build:gas' to build for Apps Script deployment"
echo ""
echo "📖 See DEPLOYMENT.md for detailed deployment instructions."
