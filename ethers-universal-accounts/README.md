# Universal Account Tutorial

This tutorial demonstrates how to integrate Particle Network's Universal Accounts into your dApp. Universal Accounts provide a seamless cross-chain experience by abstracting away the complexity of managing multiple chain-specific accounts.

> Find a full breakdown the [How-to guide](https://developers.particle.network/universal-accounts/cha/how-to/provider).

## Features

1. **Wallet Connection**
   - Connect with MetaMask
   - Handle wallet state and events

2. **Universal Account Creation**
   - Initialize Universal Account with user's EOA
   - Configure account settings

3. **Account Information**
   - View EVM Smart Account address
   - View Solana Smart Account address
   - Check account balances across chains

4. **Cross-Chain Transactions**
   - Execute a simple USDT purchase
   - Handle transaction states and errors
   - View transaction details

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

## Learning Steps

1. **Connect Wallet**
   - The app starts by requesting MetaMask connection
   - User's EOA address is captured and displayed

2. **Initialize Universal Account**
   - A Universal Account instance is created using the connected wallet
   - Account configuration is set up

3. **View Account Information**
   - The app fetches and displays both EVM and Solana account addresses
   - Account balances are retrieved and shown

4. **Execute Transactions**
   - Users can initiate a simple USDT purchase
   - Transaction progress and results are clearly displayed

## Important Notes

- This is a testnet application
- Make sure you have MetaMask installed
- The app uses Particle Network's Universal Account SDK
- All transactions are simulated with small amounts

## Resources

- [Particle Network Documentation](https://developers.particle.network/intro/introduction)
- [Universal Accounts Overview](https://developers.particle.network/universal-accounts/cha/overview)

