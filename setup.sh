#!/bin/bash

# Foundry + Next.js + Database Template Setup Script

echo "🚀 Setting up Foundry + Next.js + Database Template..."

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to compare version numbers
version_ge() {
    printf '%s\n%s\n' "$2" "$1" | sort -V -C
}

# Function to check if port is available
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        return 1
    else
        return 0
    fi
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
    echo "✅ Frontend dependencies installed successfully with pnpm"
else
    echo "❌ Frontend directory not found"
    exit 1
fi

# Setup database
echo "🗄️ Setting up database..."
echo "  Generating Prisma client..."
if ! pnpm run db:generate; then
    echo "❌ Failed to generate Prisma client"
    exit 1
fi

echo "  Pushing database schema..."
if ! pnpm run db:push; then
    echo "❌ Failed to push database schema"
    exit 1
fi

echo "  Seeding database with sample data..."
if ! pnpm run db:seed; then
    echo "❌ Failed to seed database"
    exit 1
fi

echo "✅ Database setup complete"
cd ..

# Check if Anvil is already running
if check_port 8545; then
    echo "🔗 Starting Anvil local blockchain..."
    # Start Anvil in background
    anvil --port 8545 > anvil.log 2>&1 &
    ANVIL_PID=$!
    echo "  Anvil PID: $ANVIL_PID"
    
    # Wait for Anvil to start
    echo "  Waiting for Anvil to start..."
    sleep 3
    
    if ! check_port 8545; then
        echo "✅ Anvil started successfully on port 8545"
    else
        echo "❌ Failed to start Anvil"
        exit 1
    fi
else
    echo "⚠️  Port 8545 is already in use (Anvil might be running)"
fi

# Deploy contracts
echo "🚀 Deploying contracts..."
DEPLOY_OUTPUT=$(forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast 2>&1)

if [ $? -eq 0 ]; then
    echo "✅ Contracts deployed successfully"
    
    # Extract contract address from deployment output
    CONTRACT_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep -o '0x[a-fA-F0-9]\{40\}' | tail -1)
    
    if [ -n "$CONTRACT_ADDRESS" ]; then
        echo "  Contract deployed at: $CONTRACT_ADDRESS"
        
        # Update contract address in frontend
        echo "📝 Updating contract address in frontend..."
        cd frontend
        
        # Update contracts.ts file
        if [ -f "lib/contracts.ts" ]; then
            # Create a backup
            cp lib/contracts.ts lib/contracts.ts.backup
            
            # Update the contract address
            sed -i.tmp "s/0x[a-fA-F0-9]\{40\}/$CONTRACT_ADDRESS/g" lib/contracts.ts
            rm lib/contracts.ts.tmp
            
            echo "✅ Contract address updated in lib/contracts.ts"
        fi
        
        # Create/update .env.local file
        echo "NEXT_PUBLIC_CONTRACT_ADDRESS=$CONTRACT_ADDRESS" > .env.local
        echo "✅ Contract address saved to .env.local"
        
        cd ..
    else
        echo "⚠️  Could not extract contract address from deployment output"
    fi
else
    echo "❌ Failed to deploy contracts"
    echo "$DEPLOY_OUTPUT"
    exit 1
fi

echo "✅ Setup complete!"
echo ""
echo "🎯 Your development environment is ready!"
echo ""
echo "📝 What was set up:"
echo "  ✅ Foundry dependencies installed"
echo "  ✅ Smart contracts compiled"
echo "  ✅ Frontend dependencies installed"
echo "  ✅ Database configured and seeded"
echo "  ✅ Local blockchain started (Anvil)"
echo "  ✅ Contracts deployed and configured"
echo ""
echo "🚀 Next steps:"
echo "1. Start the frontend development server:"
echo "   cd frontend && pnpm dev"
echo ""
echo "2. Open your browser to http://localhost:3000"
echo ""
echo "📋 Useful commands:"
echo "  • View database: cd frontend && pnpm run db:studio"
echo "  • Check Anvil logs: tail -f anvil.log"
echo "  • Stop Anvil: pkill -f anvil"
echo "  • Reset database: cd frontend && pnpm run db:reset"
echo ""
echo "🔗 Contract Address: $CONTRACT_ADDRESS"
echo "🗄️  Database: frontend/dev.db (SQLite)"
