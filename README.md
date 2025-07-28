# Foundry + Next.js + Database Template

📖 English | [🇨🇳 中文文档](README.zh-CN.md)

A full-stack, production-ready template for building decentralized applications with Foundry, Next.js, and database integration.

## Features

- 🔧 **Foundry** - Fast, portable and modular toolkit for Ethereum development
- ⚛️ **Next.js 14** - React framework with App Router
- 🗄️ **Prisma ORM** - Type-safe database client with SQLite & PostgreSQL support
- 🔗 **Viem** - TypeScript interface for Ethereum
- 🦄 **Wagmi** - React hooks for Ethereum
- 💳 **RainbowKit** - Best-in-class wallet connection
- 🎨 **shadcn/ui** - Beautiful and accessible UI components
- 🎯 **TypeScript** - Type safety across the stack
- 💅 **Tailwind CSS** - Utility-first CSS framework
- 📦 **pnpm** - Fast, disk space efficient package manager

## Prerequisites

- [Node.js](https://nodejs.org/) v18+ 
- [pnpm](https://pnpm.io/) v8+ (auto-installed if missing)
- [Foundry](https://getfoundry.sh/) - Install with `curl -L https://foundry.paradigm.xyz | bash && foundryup`
- [PostgreSQL](https://postgresql.org/) (optional, for production)

## Quick Start

```bash
# 1. Clone template
git clone <your-repo-url>
cd foundry-nextjs-template

# 2. Run setup (installs dependencies, sets up database, deploys contracts)
chmod +x setup.sh && ./setup.sh

# 3. Start frontend
cd frontend && pnpm dev
```

The setup script will automatically:
- Check and install prerequisites
- Install all dependencies
- Set up SQLite database with example data
- Start local blockchain (Anvil)
- Deploy smart contracts
- Configure contract addresses

after that you'll see:

![alt text](image.png)

## Project Structure

```
├── contracts/          # Smart contracts
├── script/            # Deployment scripts  
├── test/              # Contract tests
├── frontend/          # Next.js application
│   ├── app/           # App router pages
│   ├── components/    # React components
│   ├── lib/           # Utilities and configurations
│   ├── hooks/         # Custom React hooks
│   ├── prisma/        # Database schema and migrations
│   │   ├── schema.prisma    # Database schema
│   │   └── seed.ts          # Sample data seeder
│   └── scripts/       # Database utilities
├── foundry.toml       # Foundry configuration
├── setup.sh           # Automated setup script
├── package.json       # Root package.json with pnpm scripts
├── README.md          # English documentation
└── README.zh-CN.md    # Chinese documentation
```

## Database Configuration

This template includes **Prisma ORM** with support for both SQLite (development) and PostgreSQL (production).

### Default Setup (SQLite)
The template uses SQLite by default for easy development:
```bash
# Database file: frontend/dev.db
# Auto-configured during setup
```

### PostgreSQL Setup (Production)
For production or when you prefer PostgreSQL:

1. **Install PostgreSQL** (if not already installed):
   ```bash
   # macOS with Homebrew
   brew install postgresql
   brew services start postgresql
   
   # Ubuntu/Debian
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   sudo systemctl start postgresql
   
   # Create database and user
   sudo -u postgres psql
   CREATE DATABASE your_app_name;
   CREATE USER your_username WITH ENCRYPTED PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE your_app_name TO your_username;
   \q
   ```

2. **Switch to PostgreSQL**:
   ```bash
   cd frontend
   
   # Copy PostgreSQL schema
   cp prisma/schema.postgresql.prisma prisma/schema.prisma
   
   # Update .env file
   DATABASE_URL="postgresql://your_username:your_password@localhost:5432/your_app_name"
   
   # Apply schema and seed data
   pnpm run db:push
   pnpm run db:seed
   ```

### Database Commands
```bash
cd frontend

# Generate Prisma client
pnpm run db:generate

# Push schema to database (development)
pnpm run db:push

# Create and run migrations (production)
pnpm run db:migrate

# Seed database with sample data
pnpm run db:seed

# Open Prisma Studio (database GUI)
pnpm run db:studio

# Reset database
pnpm run db:reset
```

## Available Scripts

```bash
# Foundry
forge build           # Compile contracts
forge test            # Run tests
anvil                 # Start local node

# Frontend
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm lint             # Run ESLint

# Database (in frontend directory)
pnpm run db:generate  # Generate Prisma client
pnpm run db:push      # Push schema to database
pnpm run db:migrate   # Create and run migrations
pnpm run db:seed      # Seed database with sample data
pnpm run db:studio    # Open Prisma Studio
pnpm run db:reset     # Reset database

# Root scripts
pnpm setup            # Install all dependencies
pnpm clean            # Clean build artifacts
```

## Example Features

The template includes a **Simple Counter with Operation Tracking** that demonstrates database integration:

- **Operation Recording**: Counter operations (increment, decrement, set) are recorded to database
- **Operation History**: View total operation count and recent history
- **Data Persistence**: Operation data persists between sessions
- **Clean Interface**: Minimalist counter display with operation statistics

### API Endpoints

- `GET /api/stats` - Get counter operation statistics and history
- `POST /api/stats` - Record a new counter operation

### Database Schema

```prisma
model CounterOperation {
  id        String   @id @default(cuid())
  operation String   // "increment", "decrement", "set"
  value     Int?     // For set operations, stores the value
  timestamp DateTime @default(now())
}
```

## Development Workflow

1. **Smart Contracts** - Edit in `contracts/`, test with `forge test`
2. **Frontend** - React components in `frontend/components/`
3. **Database** - Modify schema in `frontend/prisma/schema.prisma`, then run `pnpm run db:push`
4. **Configuration** - Contract addresses auto-updated during setup
5. **Styling** - Use Tailwind classes and shadcn/ui components

## Adding UI Components

```bash
cd frontend
pnpm dlx shadcn-ui@latest add [component-name]
```

## Environment Variables

The template uses the following environment variables (auto-configured during setup):

```env
# Database (frontend/.env)
DATABASE_URL="file:./dev.db"  # SQLite (default)
# DATABASE_URL="postgresql://user:pass@localhost:5432/dbname"  # PostgreSQL

# Next.js (frontend/.env.local)
NEXT_PUBLIC_CONTRACT_ADDRESS="0x..."  # Auto-filled during setup
```

## Switching Database Providers

### From SQLite to PostgreSQL
```bash
cd frontend
./scripts/switch-db.sh postgresql
# Follow the prompts to configure PostgreSQL connection
pnpm run db:push
pnpm run db:seed
```

### From PostgreSQL to SQLite
```bash
cd frontend
./scripts/switch-db.sh sqlite
pnpm run db:push
pnpm run db:seed
```

## Production Deployment

1. **Database**: Set up PostgreSQL and configure `DATABASE_URL`
2. **Contracts**: Deploy to your target network
3. **Frontend**: Build and deploy with your preferred platform
4. **Environment**: Set production environment variables

```bash
# Build for production
cd frontend
pnpm run build

# Database migrations for production
pnpm run db:migrate
```

## License

MIT
