"use client";

import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import {
  UniversalAccount,
  IAssetsResponse,
  CHAIN_ID,
} from "@GDdark/universal-account";

// Components
import { WalletConnection } from "./components/WalletConnection";
import { AccountInfo } from "./components/AccountInfo";
import { TransactionSection } from "./components/TransactionSection";

/**
 * Universal Account Tutorial App
 *
 * This app demonstrates the key features of Particle Network's Universal Accounts:
 * 1. Wallet Connection - Connect with MetaMask
 * 2. Account Creation - Initialize a Universal Account
 * 3. Account Info - View EVM and Solana addresses
 * 4. Simple Transaction - Buy BNB using the Universal Account
 */
export default function Home() {
  // State for wallet connection
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  // State for Universal Account
  const [universalAccount, setUniversalAccount] =
    useState<UniversalAccount | null>(null);
  const [primaryAssets, setPrimaryAssets] = useState<IAssetsResponse | null>(
    null
  );
  const [accountInfo, setAccountInfo] = useState<{
    ownerAddress: string;
    evmSmartAccount: string;
    solanaSmartAccount: string;
  } | null>(null);

  // State for transactions
  const [isTransferring, setIsTransferring] = useState<boolean>(false);
  const [transactionUrl, setTransactionUrl] = useState<string>("");
  const [transactionError, setTransactionError] = useState<string>("");

  /**
   * Step 1: Connect Wallet
   * Handles the connection to MetaMask and requests account access
   */
  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask to use this dApp!");
      return;
    }

    try {
      setIsConnecting(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const accounts = await provider.listAccounts();
      setWalletAddress(accounts[0].address);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Failed to connect wallet. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  /**
   * Handle wallet disconnection
   * Resets all states to their initial values
   */
  const disconnectWallet = () => {
    setWalletAddress("");
    setUniversalAccount(null);
    setPrimaryAssets(null);
    setAccountInfo(null);
    setTransactionUrl("");
    setTransactionError("");
  };

  /**
   * Step 2: Initialize Universal Account
   * Creates a new Universal Account instance when a wallet is connected
   */
  useEffect(() => {
    if (walletAddress) {
      if (!process.env.NEXT_PUBLIC_UA_PROJECT_ID) {
        console.error("NEXT_PUBLIC_UA_PROJECT_ID is not configured");
        return;
      }

      const ua = new UniversalAccount({
        projectId: process.env.NEXT_PUBLIC_UA_PROJECT_ID,
        ownerAddress: walletAddress,
        tradeConfig: {
          universalGas: false, // Don't use PARTI token for gas
        },
      });

      console.log("Universal Account initialized", ua);
      setUniversalAccount(ua);
    } else {
      setUniversalAccount(null);
    }
  }, [walletAddress]);

  /**
   * Step 3: Fetch Account Information
   * Retrieves account addresses and balances when the Universal Account is initialized
   */
  const fetchSmartAccountAddresses = useCallback(async () => {
    if (!universalAccount || !walletAddress) return;

    try {
      const smartAccountOptions =
        await universalAccount.getSmartAccountOptions();
      console.log("Smart account options:", smartAccountOptions);

      setAccountInfo({
        ownerAddress: walletAddress,
        evmSmartAccount: smartAccountOptions.smartAccountAddress || "",
        solanaSmartAccount: smartAccountOptions.solanaSmartAccountAddress || "",
      });

      // After getting the smart account addresses, fetch primary assets
      const assets = await universalAccount.getPrimaryAssets();
      console.log("Primary assets:", assets);
      setPrimaryAssets(assets);
    } catch (error) {
      console.error("Error fetching smart account addresses:", error);
    }
  }, [universalAccount, walletAddress, setAccountInfo, setPrimaryAssets]);

  useEffect(() => {
    fetchSmartAccountAddresses();
  }, [universalAccount, walletAddress, fetchSmartAccountAddresses]);

  /**
   * Handle a simple buy transaction using the Universal Account.
   * This demonstrates cross-chain transactions and account abstraction capabilities.
   */
  const handleBuyTransaction = async () => {
    if (!universalAccount) return;

    try {
      setIsTransferring(true);
      setTransactionError("");
      setTransactionUrl("");

      // Create and execute the buy transaction
      const transaction = await universalAccount.createBuyTransaction({
        token: {
          chainId: CHAIN_ID.BSC_MAINNET,
          address: "0x0000000000000000000000000000000000000000", // Native BNB
        },
        amountInUSD: "0.1",
      });

      if (!window.ethereum) {
        throw new Error("MetaMask not found");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(transaction.rootHash);

      const result = await universalAccount.sendTransaction(
        transaction,
        signature
      );
      console.log("Transaction sent:", result);

      setTransactionUrl(
        `https://universalx.app/activity/details?id=${result.transactionId}`
      );

      // Refresh balances after transaction
      const assets = await universalAccount.getPrimaryAssets();
      setPrimaryAssets(assets);
    } catch (error) {
      console.error("Error executing transaction:", error);
      setTransactionError(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Universal Account Tutorial
            </h1>
            <p className="mt-2 text-gray-400">
              Learn how to use Particle Network&apos;s Universal Accounts
            </p>
          </div>

          <div className="space-y-8">
            {/* Step 1: Wallet Connection */}
            <WalletConnection
              walletAddress={walletAddress}
              isConnecting={isConnecting}
              onWalletUpdate={setWalletAddress}
              onConnect={connectWallet}
              onDisconnect={disconnectWallet}
            />

            {/* Step 2: Account Info */}
            {walletAddress && accountInfo && (
              <AccountInfo
                accountInfo={accountInfo}
                primaryAssets={primaryAssets}
              />
            )}

            {/* Step 3: Transaction Section */}
            {walletAddress && accountInfo && (
              <TransactionSection
                isTransferring={isTransferring}
                transactionError={transactionError}
                transactionUrl={transactionUrl}
                onBuyClick={handleBuyTransaction}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
