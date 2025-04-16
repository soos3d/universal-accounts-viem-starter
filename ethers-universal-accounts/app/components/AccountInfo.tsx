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
        <div className="p-4 bg-gray-800/30 rounded-xl space-y-2 backdrop-blur-sm border border-emerald-500/20">
          <h4 className="text-lg font-semibold text-emerald-300">
            Universal Account Balance
          </h4>
          <div className="p-3 bg-gray-900/50 rounded-lg font-mono text-2xl font-bold text-center text-emerald-400">
            ${Number(primaryAssets?.totalAmountInUSD || 0).toFixed(3)}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {/* EVM Smart Account */}
        <div className="p-4 bg-gray-800/30 rounded-xl space-y-2 backdrop-blur-sm border border-purple-500/20">
          <div className="flex items-center space-x-2">
            <h4 className="text-lg font-semibold text-purple-300">EVM</h4>
          </div>
          <div className="p-3 bg-gray-900/50 rounded-lg break-all font-mono text-sm">
            {accountInfo.evmSmartAccount}
          </div>
        </div>

        {/* Solana Smart Account */}
        <div className="p-4 bg-gray-800/30 rounded-xl space-y-2 backdrop-blur-sm border border-pink-500/20">
          <div className="flex items-center space-x-2">
            <h4 className="text-lg font-semibold text-pink-300">Solana</h4>
          </div>
          <div className="p-3 bg-gray-900/50 rounded-lg break-all font-mono text-sm">
            {accountInfo.solanaSmartAccount}
          </div>
        </div>
      </div>
    </div>
  );
}
