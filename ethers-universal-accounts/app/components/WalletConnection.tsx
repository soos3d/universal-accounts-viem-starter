import { useEffect, useCallback } from "react";
import { ethers } from "ethers";

interface WalletConnectionProps {
  walletAddress: string;
  isConnecting: boolean;
  onWalletUpdate: (address: string) => void;
  onConnect: () => void;
  onDisconnect: () => void;
}

/**
 * WalletConnection Component
 * Handles the wallet connection logic and UI for connecting/disconnecting MetaMask
 */
export function WalletConnection({
  walletAddress,
  isConnecting,
  onWalletUpdate,
  onConnect,
  onDisconnect,
}: WalletConnectionProps) {
  const updateWalletAddress = useCallback(async () => {
    if (typeof window.ethereum === "undefined") return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();
      onWalletUpdate(accounts.length > 0 ? accounts[0].address : "");
    } catch (error) {
      console.error("Error updating wallet address:", error);
      onWalletUpdate("");
    }
  }, [onWalletUpdate]);

  useEffect(() => {
    // Check if already connected
    updateWalletAddress();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", updateWalletAddress);
    }

    // Cleanup listeners on unmount
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", updateWalletAddress);
      }
    };
  }, [updateWalletAddress]);

  return (
    <div className="space-y-4">
      {!walletAddress ? (
        <button
          onClick={onConnect}
          disabled={isConnecting}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold
                   hover:from-blue-600 hover:to-purple-700 transition-all duration-200 ease-in-out
                   disabled:opacity-50 disabled:cursor-not-allowed w-full"
        >
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </button>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-gray-800/30 rounded-xl space-y-2 backdrop-blur-sm border border-blue-500/20">
            <div className="flex items-center space-x-2">
              <h4 className="text-lg font-semibold text-blue-300">
                Connected Wallet
              </h4>
            </div>
            <div className="p-3 bg-gray-900/50 rounded-lg break-all font-mono text-sm">
              {walletAddress}
            </div>
          </div>
          <button
            onClick={onDisconnect}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg font-semibold
                     hover:from-red-600 hover:to-pink-700 transition-all duration-200 ease-in-out w-full"
          >
            Disconnect Wallet
          </button>
        </div>
      )}
    </div>
  );
}
