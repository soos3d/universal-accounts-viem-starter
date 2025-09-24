"use client";

import { useState, useEffect, useCallback } from "react";
import {
  UniversalAccount,
  IAssetsResponse,
  CHAIN_ID,
  SUPPORTED_TOKEN_TYPE,
} from "@particle-network/universal-account-sdk";
import { createWalletClient, custom, type Hex } from "viem";

import { AccountInfo } from "./components/AccountInfo";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function Home() {
  // ---------------- Wallet (simple) ----------------
  const [walletAddress, setWalletAddress] = useState<`0x${string}` | "">("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletClient, setWalletClient] = useState<ReturnType<
    typeof createWalletClient
  > | null>(null);

  const connectWallet = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      alert("Please install MetaMask to use this dApp!");
      return;
    }
    try {
      setIsConnecting(true);

      const client = createWalletClient({
        transport: custom(window.ethereum),
      });

      await client.requestAddresses();
      const [addr] = await client.getAddresses();
      if (!addr) throw new Error("No account returned by wallet.");

      setWalletClient(client);
      setWalletAddress(addr as `0x${string}`);
    } catch (err) {
      console.error("Error connecting wallet:", err);
      alert("Failed to connect wallet. Please try again.");
      setWalletClient(null);
      setWalletAddress("");
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    // Clear only local state (EOA wallets don't have a protocol-level disconnect)
    setWalletClient(null);
    setWalletAddress("");

    // Also clear app state
    setUniversalAccount(null);
    setPrimaryAssets(null);
    setAccountInfo(null);
    setTransactionUrl("");
    setTransactionError("");
    setIsTransferring(false);
  };

  const isConnected = !!walletAddress;

  // ---------------- Universal Account ----------------
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

  // TX state
  const [isTransferring, setIsTransferring] = useState(false);
  const [transactionUrl, setTransactionUrl] = useState("");
  const [transactionError, setTransactionError] = useState("");

  // Initialize UA when wallet connects; clear when it disconnects
  useEffect(() => {
    if (!walletAddress) {
      setUniversalAccount(null);
      setPrimaryAssets(null);
      setAccountInfo(null);
      return;
    }

    if (
      !process.env.NEXT_PUBLIC_PROJECT_ID ||
      !process.env.NEXT_PUBLIC_CLIENT_KEY ||
      !process.env.NEXT_PUBLIC_APP_ID
    ) {
      console.error(
        "NEXT_PUBLIC_PROJECT_ID, NEXT_PUBLIC_CLIENT_KEY or NEXT_PUBLIC_APP_ID is not configured"
      );
      setTransactionError(
        "Missing Particle Network configuration. Check your environment variables."
      );
      return;
    }

    try {
      const ua = new UniversalAccount({
        projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
        projectClientKey: process.env.NEXT_PUBLIC_CLIENT_KEY!,
        projectAppUuid: process.env.NEXT_PUBLIC_APP_ID!,
        ownerAddress: walletAddress,
        tradeConfig: {
          slippageBps: 100,
          universalGas: false,
          // usePrimaryTokens: [SUPPORTED_TOKEN_TYPE.SOL],
        },
      });
      setUniversalAccount(ua);
    } catch (error) {
      console.error("Error creating Universal Account:", error);
      setTransactionError("Failed to initialize Universal Account");
    }
  }, [walletAddress]);

  // Fetch UA addresses + balances once UA is ready
  const fetchSmartAccountAddresses = useCallback(async () => {
    if (!universalAccount || !walletAddress) return;

    try {
      const smartAccountOptions =
        await universalAccount.getSmartAccountOptions();

      setAccountInfo({
        ownerAddress: walletAddress,
        evmSmartAccount: smartAccountOptions.smartAccountAddress || "",
        solanaSmartAccount: smartAccountOptions.solanaSmartAccountAddress || "",
      });

      const assets = await universalAccount.getPrimaryAssets();
      setPrimaryAssets(assets);
    } catch (error) {
      console.error("Error fetching smart account info:", error);
      setTransactionError("Failed to retrieve account information");
    }
  }, [universalAccount, walletAddress]);

  useEffect(() => {
    fetchSmartAccountAddresses();
  }, [universalAccount, walletAddress, fetchSmartAccountAddresses]);

  // ---------------- Transaction (no reconnect attempts) ----------------
  const handleExecuteTransaction = async () => {
    if (!walletAddress) {
      setTransactionError("Please connect your wallet first.");
      return;
    }
    if (!walletClient) {
      setTransactionError("Wallet client not available. Connect again.");
      return;
    }
    if (!universalAccount) {
      setTransactionError(
        "Universal Account not initialized. Refresh and try again."
      );
      return;
    }

    try {
      setIsTransferring(true);
      setTransactionError("");
      setTransactionUrl("");

      // Request 0.2 USDT on Avalanche as a simple example
      const transaction = await universalAccount.createUniversalTransaction({
        chainId: CHAIN_ID.AVALANCHE_MAINNET,
        expectTokens: [{ type: SUPPORTED_TOKEN_TYPE.USDT, amount: "0.2" }],
        transactions: [],
      });

      const signature = await walletClient.signMessage({
        account: walletAddress as `0x${string}`,
        message: { raw: transaction.rootHash as Hex },
      });

      const result = await universalAccount.sendTransaction(
        transaction,
        signature
      );

      setTransactionUrl(
        `https://universalx.app/activity/details?id=${result.transactionId}`
      );

      // Refresh balances
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

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header with single toggle control */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Particle Network Universal Account Demo
              </h1>
              <p className="text-sm text-gray-400">Viem + Universal Account</p>
            </div>

            {!isConnected ? (
              <Button
                onClick={connectWallet}
                disabled={isConnecting}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            ) : (
              <Button
                onClick={disconnectWallet}
                variant="secondary"
                className="bg-gray-700 hover:bg-gray-600 text-white"
              >
                Disconnect
              </Button>
            )}
          </div>

          {/* Disconnected state */}
          {!isConnected && (
            <div className="max-w-2xl mx-auto">
              <Alert className="bg-blue-900/30 border-blue-800 text-blue-200">
                <AlertTitle>Wallet not connected</AlertTitle>
                <AlertDescription>
                  Click “Connect Wallet” to initialize your Universal Account.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Connected state */}
          {isConnected && accountInfo && (
            <div className="space-y-8">
              {/* Connected EOA summary */}
              <div className="rounded-2xl bg-gray-800/70 p-4 text-gray-200">
                <div className="text-sm opacity-80 mb-1">Connected EOA</div>
                <div className="font-mono text-sm break-all">
                  {walletAddress}
                </div>
              </div>

              {/* Account info + balances */}
              <AccountInfo
                accountInfo={accountInfo}
                primaryAssets={primaryAssets}
              />

              {/* Transaction section */}
              <div className="space-y-4">
                <Button
                  onClick={handleExecuteTransaction}
                  disabled={isTransferring}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {isTransferring
                    ? "Processing..."
                    : "Get 0.2 USDT on Avalanche"}
                </Button>

                {transactionError && (
                  <Alert
                    variant="destructive"
                    className="bg-red-900/30 border-red-800 text-red-400"
                  >
                    <AlertTitle>Transaction Error</AlertTitle>
                    <AlertDescription>{transactionError}</AlertDescription>
                  </Alert>
                )}

                {transactionUrl && !transactionError && (
                  <Alert className="bg-green-900/30 border-green-800 text-green-400">
                    <AlertTitle>Transaction Submitted!</AlertTitle>
                    <AlertDescription>
                      <a
                        href={transactionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                      >
                        View Transaction Details →
                      </a>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
