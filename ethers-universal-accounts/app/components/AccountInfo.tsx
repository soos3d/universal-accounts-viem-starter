import { IAssetsResponse } from "@GDdark/universal-account";

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
  return (
    <div className="space-y-6">
      {primaryAssets && (
        <div className="p-4 bg-blue-900/30 rounded-lg border border-blue-800">
          <h4 className="text-sm font-medium text-blue-300 mb-2">
            Universal Account Balance
          </h4>
          <div className="font-mono text-2xl font-semibold text-blue-400">
            ${Number(primaryAssets?.totalAmountInUSD || 0).toFixed(3)}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {/* EVM Smart Account */}
        <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
          <div className="mb-2">
            <h4 className="text-sm font-medium text-gray-300">EVM Address</h4>
          </div>
          <div className="font-mono text-sm text-gray-200 break-all">
            {accountInfo.evmSmartAccount}
          </div>
        </div>

        {/* Solana Smart Account */}
        <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
          <div className="mb-2">
            <h4 className="text-sm font-medium text-gray-300">Solana Address</h4>
          </div>
          <div className="font-mono text-sm text-gray-200 break-all">
            {accountInfo.solanaSmartAccount}
          </div>
        </div>
      </div>
    </div>
  );
}
