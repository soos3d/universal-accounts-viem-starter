"use client";

import { useState, useEffect, useCallback } from "react";
import { ethers, getBytes } from "ethers";
import {
  UniversalAccount,
  IAssetsResponse,
  CHAIN_ID,
  SUPPORTED_TOKEN_TYPE,
} from "@particle-network/universal-account-sdk";

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
  const [feeDetails, setFeeDetails] = useState<any>(null);
  const [showFeePreview, setShowFeePreview] = useState<boolean>(false);
  const [isPreparing, setIsPreparing] = useState<boolean>(false);
  const [pendingTransaction, setPendingTransaction] = useState<any>(null);

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
    setFeeDetails(null);
    setShowFeePreview(false);
    setIsPreparing(false);
    setPendingTransaction(null);
  };

  /**
   * Step 2: Initialize Universal Account
   * Creates a new Universal Account instance when a wallet is connected
   */
  useEffect(() => {
    if (walletAddress) {
      if (!process.env.NEXT_PUBLIC_PROJECT_ID) {
        console.error("NEXT_PUBLIC_PROJECT_ID is not configured");
        return;
      }

      const ua = new UniversalAccount({
        projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
        projectClientKey: process.env.NEXT_PUBLIC_CLIENT_KEY!,
        projectAppUuid: process.env.NEXT_PUBLIC_APP_ID!,
        ownerAddress: walletAddress,
        // If not set it will use auto-slippage
        tradeConfig: {
          slippageBps: 100, // 1% slippage tolerance
          universalGas: true, // Prioritize PARTI token to pay for gas
          //usePrimaryTokens: [SUPPORTED_TOKEN_TYPE.SOL], // Specify token to use as source (only for swaps)
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
   * Prepare and show transaction fee preview
   * Step 1: Create the transaction and display fee preview
   */
  const handlePrepareTransaction = async () => {
    if (!universalAccount) return;

    try {
      // Reset states for new transaction
      setIsPreparing(true);
      setTransactionError("");
      setTransactionUrl("");
      setFeeDetails(null);
      setShowFeePreview(false);

      // Create and prepare the buy transaction
      const transaction = await universalAccount.createUniversalTransaction({
        chainId: CHAIN_ID.AVALANCHE_MAINNET,
        expectTokens: [
          {
            type: SUPPORTED_TOKEN_TYPE.USDT,
            amount: "1",
          },
        ],
        transactions: [],
      });

      console.log("Transaction created:", JSON.stringify(transaction, null, 2));

      // Save the transaction for later execution
      setPendingTransaction(transaction);

      // Extract fee details
      const feeQuote = transaction.feeQuotes[0];
      const fee = feeQuote.fees.totals;

      // Store fee details in state for display in the UI
      setFeeDetails({
        feeTokenAmountInUSD: fee.feeTokenAmountInUSD,
        gasFeeTokenAmountInUSD: fee.gasFeeTokenAmountInUSD,
        transactionServiceFeeTokenAmountInUSD:
          fee.transactionServiceFeeTokenAmountInUSD,
        transactionLPFeeTokenAmountInUSD: fee.transactionLPFeeTokenAmountInUSD,
      });

      // Show the fee preview
      setShowFeePreview(true);
    } catch (error) {
      console.error("Error preparing transaction:", error);
      setTransactionError(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    } finally {
      setIsPreparing(false);
    }
  };

  /**
   * Cancel the transaction
   * Clear all states and return to initial state
   */
  const handleCancelTransaction = () => {
    setShowFeePreview(false);
    setPendingTransaction(null);
    setFeeDetails(null);
    setTransactionError("");
  };

  /**
   * Execute the prepared transaction
   * Step 2: Sign and send the prepared transaction
   */
  const handleContinueTransaction = async () => {
    if (!universalAccount || !pendingTransaction) return;

    try {
      setIsTransferring(true);

      if (!window.ethereum) {
        throw new Error("MetaMask not found");
      }

      // Sign and send the prepared transaction
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(
        getBytes(pendingTransaction.rootHash)
      );

      const result = await universalAccount.sendTransaction(
        pendingTransaction,
        signature
      );
      console.log("Transaction sent:", result);

      setTransactionUrl(
        `https://universalx.app/activity/details?id=${result.transactionId}`
      );

      // Hide the fee preview after successful transaction
      setShowFeePreview(false);
      setPendingTransaction(null);

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
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-2">
              Universal Account Tutorial
            </h1>
            <p className="text-lg text-gray-400">
              Learn how to use Particle Network&apos;s Universal Accounts
            </p>
          </div>

          <div className="space-y-10">
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
                onBuyClick={handlePrepareTransaction}
                onContinueTransaction={handleContinueTransaction}
                onCancelTransaction={handleCancelTransaction}
                feeDetails={feeDetails}
                showFeePreview={showFeePreview}
                isPreparing={isPreparing}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
