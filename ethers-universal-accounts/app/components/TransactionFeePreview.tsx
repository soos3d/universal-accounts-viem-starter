import { formatUnits } from "ethers";

export interface TransactionFeeDetails {
  feeTokenAmountInUSD: bigint;
  gasFeeTokenAmountInUSD: bigint;
  transactionServiceFeeTokenAmountInUSD: bigint;
  transactionLPFeeTokenAmountInUSD: bigint;
}

interface TransactionFeePreviewProps {
  feeDetails: TransactionFeeDetails | null;
  isVisible: boolean;
}

/**
 * TransactionFeePreview Component
 * Displays a breakdown of transaction fees before executing the transaction
 */
export function TransactionFeePreview({
  feeDetails,
  isVisible,
}: TransactionFeePreviewProps) {
  if (!isVisible || !feeDetails) return null;

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-4">
      <h3 className="text-gray-300 font-medium mb-3 text-sm">Transaction Fee Preview</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-xs">Total Fee</span>
          <span className="text-white font-medium">
            ${formatUnits(feeDetails.feeTokenAmountInUSD, 18)}
          </span>
        </div>
        
        <div className="h-px bg-gray-700 my-2"></div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-xs">Gas Fee</span>
          <span className="text-gray-300 text-sm">
            ${formatUnits(feeDetails.gasFeeTokenAmountInUSD, 18)}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-xs">Service Fee</span>
          <span className="text-gray-300 text-sm">
            ${formatUnits(feeDetails.transactionServiceFeeTokenAmountInUSD, 18)}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-xs">LP Fee</span>
          <span className="text-gray-300 text-sm">
            ${formatUnits(feeDetails.transactionLPFeeTokenAmountInUSD, 18)}
          </span>
        </div>
      </div>
    </div>
  );
}
