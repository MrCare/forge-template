# Contributing to Foundry + Next.js Template

Thank you for your interest in contributing to this template! 

## Development Setup

1. Clone the repository
2. Run the setup script: `chmod +x setup.sh && ./setup.sh`
3. Start development:
   ```bash
   # Terminal 1: Start Anvil
   anvil
   
   # Terminal 2: Deploy contracts
   forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast
   
   # Terminal 3: Start frontend
   npm run dev
   ```

## Project Structure

- `contracts/` - Solidity smart contracts
- `script/` - Foundry deployment scripts
- `test/` - Smart contract tests
- `frontend/` - Next.js application
- `frontend/components/` - React components
- `frontend/lib/` - Utilities and configurations

## Making Changes

1. For contract changes, update tests and ensure they pass
2. For frontend changes, ensure TypeScript compilation succeeds
3. Follow the existing code style and patterns
4. Update documentation if needed

## Pull Requests

- Provide clear description of changes
- Include relevant tests
- Ensure all checks pass
