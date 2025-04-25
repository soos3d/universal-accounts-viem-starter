import { useState } from "react";
import { IAssetsResponse } from "@GDdark/universal-account";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Portfolio } from "./Portfolio";
import { Eye } from "lucide-react";

interface AccountInfoProps {
  accountInfo: {
    ownerAddress: string;
    evmSmartAccount: string;
    solanaSmartAccount: string;
  };
  primaryAssets: IAssetsResponse | null;
}

/**
 * AccountInfo Component
 * Displays the Universal Account information including:
 * - Total balance in USD
 * - EVM Smart Account address
 * - Solana Smart Account address
 */

export function AccountInfo({ accountInfo, primaryAssets }: AccountInfoProps) {
  const [portfolioOpen, setPortfolioOpen] = useState(false);

  return (
    <div className="space-y-6">
      {primaryAssets && (
        <>
          <Card className="bg-blue-900/30 border-blue-800">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-blue-300">
                Universal Account Balance
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="border p-2 text-blue-300 hover:text-blue-100 hover:bg-blue-800/50"
                onClick={() => setPortfolioOpen(true)}
              >
                <span className="text-sm">Portfolio</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="font-mono text-2xl font-semibold text-blue-400">
                ${Number(primaryAssets?.totalAmountInUSD || 0).toFixed(2)}
              </div>
            </CardContent>
          </Card>

          {primaryAssets && (
            <Portfolio
              primaryAssets={primaryAssets}
              open={portfolioOpen}
              onOpenChange={setPortfolioOpen}
            />
          )}
        </>
      )}

      <div className="grid grid-cols-1 gap-4">
        {/* EVM Smart Account */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              EVM Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-sm text-gray-200 break-all">
              {accountInfo.evmSmartAccount}
            </div>
          </CardContent>
        </Card>

        {/* Solana Smart Account */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Solana Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-sm text-gray-200 break-all">
              {accountInfo.solanaSmartAccount}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
