#!/bin/bash

# Foundry + Next.js Template Setup Script

echo "🚀 Setting up Foundry + Next.js Template..."

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to compare version numbers
version_ge() {
    printf '%s\n%s\n' "$2" "$1" | sort -V -C
}

echo "🔍 Checking prerequisites..."

# Check Node.js
if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version | sed 's/v//')
REQUIRED_NODE_VERSION="18.0.0"

if ! version_ge "$NODE_VERSION" "$REQUIRED_NODE_VERSION"; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please upgrade to Node.js 18+ from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $NODE_VERSION (required: $REQUIRED_NODE_VERSION+)"

# Check npm
if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

NPM_VERSION=$(npm --version)
echo "✅ npm $NPM_VERSION"

# Check pnpm (preferred package manager)
if ! command_exists pnpm; then
    echo "⚠️  pnpm is not installed. Installing pnpm globally..."
    npm install -g pnpm
    if ! command_exists pnpm; then
        echo "❌ Failed to install pnpm. Please install it manually: npm install -g pnpm"
        exit 1
    fi
fi

PNPM_VERSION=$(pnpm --version)
echo "✅ pnpm $PNPM_VERSION"

# Check Foundry
if ! command_exists forge; then
    echo "❌ Foundry is not installed. Please install Foundry from https://getfoundry.sh/"
    echo "Run: curl -L https://foundry.paradigm.xyz | bash"
    echo "Then: foundryup"
    exit 1
fi

FORGE_VERSION=$(forge --version | grep -o 'forge [0-9.]*' | awk '{print $2}')
echo "✅ Foundry (forge) $FORGE_VERSION"

# Check if anvil is available
if ! command_exists anvil; then
    echo "❌ Anvil is not available. Please make sure Foundry is properly installed."
    exit 1
fi

echo "✅ All prerequisites met!"
echo ""

# Initialize git if not already initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing git repository..."
    git init
fi

# Install Foundry dependencies
echo "📦 Installing Foundry dependencies..."
echo "  Installing forge-std..."
if ! forge install foundry-rs/forge-std; then
    echo "❌ Failed to install forge-std"
    exit 1
fi

echo "  Installing OpenZeppelin contracts..."
if ! forge install OpenZeppelin/openzeppelin-contracts; then
    echo "❌ Failed to install OpenZeppelin contracts"
    exit 1
fi

# Build contracts
echo "🔨 Building contracts..."
if ! forge build; then
    echo "❌ Failed to build contracts"
    exit 1
fi
echo "✅ Contracts built successfully"

# Install frontend dependencies
echo "📦 Installing frontend dependencies with pnpm..."
if [ -d "frontend" ]; then
    cd frontend
    if ! pnpm install; then
        echo "❌ Failed to install frontend dependencies with pnpm"
        exit 1
    fi
    cd ..
    echo "✅ Frontend dependencies installed successfully with pnpm"
else
    echo "❌ Frontend directory not found"
    exit 1
fi

echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Start Anvil: anvil"
echo "2. Deploy contracts: forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast"
echo "3. Update contract address in frontend/lib/contracts.ts"
echo "4. Start frontend: cd frontend && pnpm dev"
