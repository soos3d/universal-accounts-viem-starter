import { useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
        <Button onClick={onConnect} disabled={isConnecting} className="w-full">
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      ) : (
        <div className="space-y-4">
          <Card className="border-gray-700 bg-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Connected EOA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-mono text-sm text-gray-200 break-all">
                {walletAddress}
              </div>
            </CardContent>
          </Card>
          <Button
            onClick={onDisconnect}
            className="w-full bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            Disconnect Wallet
          </Button>
        </div>
      )}
    </div>
  );
}
