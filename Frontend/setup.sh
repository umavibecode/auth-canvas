#!/usr/bin/env bash
# Quick Start Guide for Integrated Auth Canvas Project

echo "🚀 Auth Canvas - Integrated Full-Stack Project"
echo "================================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ npm version: $(npm -v)"
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. Please edit it with your GitHub OAuth credentials."
    echo ""
    echo "To get GitHub OAuth credentials:"
    echo "1. Go to GitHub Settings > Developer settings > OAuth apps"
    echo "2. Create a new OAuth application"
    echo "3. Set Authorization callback URL to: http://localhost:5173/api/auth/github-callback"
    echo "4. Copy Client ID and Client Secret to .env"
    echo ""
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "  1. Edit .env file with your configuration:"
echo "     - GITHUB_CLIENT_ID"
echo "     - GITHUB_CLIENT_SECRET"
echo "     - JWT_SECRET (optional, will use default in dev)"
echo ""
echo "  2. Start the development server:"
echo "     npm run dev"
echo ""
echo "  3. Open your browser:"
echo "     http://localhost:5173"
echo ""
echo "📚 Documentation:"
echo "  - INTEGRATION_GUIDE.md - Full integration documentation"
echo "  - MIGRATION_GUIDE.md - Migration from separate projects"
echo "  - API endpoints in src/routes/api/auth/"
echo ""
