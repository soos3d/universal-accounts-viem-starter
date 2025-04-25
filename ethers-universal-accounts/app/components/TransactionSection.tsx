import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TransactionFeePreview, TransactionFeeDetails } from "./TransactionFeePreview";

interface TransactionSectionProps {
  isTransferring: boolean;
  transactionError: string;
  transactionUrl: string;
  onBuyClick: () => void;
  feeDetails: TransactionFeeDetails | null;
  showFeePreview: boolean;
}

/**
 * TransactionSection Component
 * Handles the transaction UI including:
 * - Buy button
 * - Loading state
 * - Error display
 * - Transaction success with link
 */
export function TransactionSection({
  isTransferring,
  transactionError,
  transactionUrl,
  onBuyClick,
  feeDetails,
  showFeePreview,
}: TransactionSectionProps) {
  return (
    <div className="mt-6 space-y-4">
      <TransactionFeePreview 
        feeDetails={feeDetails} 
        isVisible={showFeePreview} 
      />

      <Button
        onClick={onBuyClick}
        disabled={isTransferring}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        {isTransferring ? "Processing Transaction..." : "Buy BNB ($0.1)"}      
      </Button>

      {transactionError && (
        <Alert variant="destructive" className="bg-red-900/30 border-red-800 text-red-400">
          <AlertTitle>Transaction Error</AlertTitle>
          <AlertDescription>
            {transactionError}
          </AlertDescription>
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
  );
}
