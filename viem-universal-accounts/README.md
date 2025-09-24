# Universal Account Tutorial with Viem

This tutorial demonstrates how to integrate Particle Network's Universal Accounts into your dApp using viem for wallet connection. Universal Accounts provide a seamless cross-chain experience by abstracting away the complexity of managing multiple chain-specific accounts.

> Find a full breakdown in the [Universal Account SDK Documentation](https://docs.particle.network/developers/universal-account-sdk).

## Features

1. **Wallet Connection with Viem**
   - Connect with MetaMask using viem
   - Handle wallet state and events
   - Manage wallet reconnection

2. **Universal Account Creation**
   - Initialize Universal Account with user's EOA
   - Configure account settings

3. **Account Information**
   - View EVM Smart Account address
   - View Solana Smart Account address
   - Check account balances across chains

4. **Universal Transactions**
   - Execute a simple USDT request on Avalanche
   - Handle transaction states and errors
   - View transaction details on Universal Explorer

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

2. Configure environment variables:

   First, create a project in the [Particle Dashboard](https://dashboard.particle.network/) to get the required credentials.

   Create a .env file in the root of the ethers-universal-accounts directory and add the following variables:

   ```bash
   NEXT_PUBLIC_PROJECT_ID=""
   NEXT_PUBLIC_CLIENT_KEY=""
   NEXT_PUBLIC_APP_ID=""
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the tutorial.

## Implementation Guide

1. **Connect Wallet with Viem**
   - The app uses viem's `createWalletClient` to connect to MetaMask
   - User's EOA address is captured and stored in state
   - Wallet connection is managed with proper error handling

2. **Initialize Universal Account**
   - A Universal Account instance is created using the connected wallet as the owner
   - Account configuration includes slippage settings and universal gas options
   - The SDK handles the creation and management of smart accounts

3. **View Account Information**
   - The app fetches and displays both EVM and Solana smart account addresses
   - Token balances across all chains are retrieved and shown in a unified view
   - A detailed portfolio breakdown is available showing tokens by chain

4. **Execute Universal Transactions**
   - Users can request test USDT on Avalanche
   - The transaction flow demonstrates:
     - Creating a universal transaction
     - Signing with the connected wallet
     - Sending the transaction through Universal Account
     - Viewing transaction results

## Project Structure

- `app/page.tsx` - Main component with wallet connection and Universal Account logic
- `app/components/WalletConnection.tsx` - Handles wallet connection UI and state
- `app/components/AccountInfo.tsx` - Displays account addresses and balances
- `app/components/Portfolio.tsx` - Shows detailed token breakdown by chain

## Important Notes

- This is a testnet application
- Make sure you have MetaMask installed
- The app uses Particle Network's Universal Account SDK with viem for wallet connection
- All transactions are simulated with small amounts

## Resources

- [Universal Account SDK Documentation](https://docs.particle.network/developers/universal-account-sdk)
- [Viem Documentation](https://viem.sh/)
- [Particle Network Dashboard](https://dashboard.particle.network/)
