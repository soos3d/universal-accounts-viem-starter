import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  TransactionFeePreview,
  TransactionFeeDetails,
} from "./TransactionFeePreview";
import { Card, CardFooter } from "@/components/ui/card";

interface TransactionSectionProps {
  isTransferring: boolean;
  transactionError: string;
  transactionUrl: string;
  onBuyClick: () => Promise<void>;
  onContinueTransaction: () => Promise<void>;
  onCancelTransaction: () => void;
  feeDetails: TransactionFeeDetails | null;
  showFeePreview: boolean;
  isPreparing: boolean;
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
  onContinueTransaction,
  onCancelTransaction,
  feeDetails,
  showFeePreview,
  isPreparing,
}: TransactionSectionProps) {
  return (
    <div className="mt-6 space-y-4">
      {/* Fee Preview with Continue/Cancel buttons */}
      {showFeePreview && (
        <Card className="bg-gray-800 border-gray-700">
          <TransactionFeePreview feeDetails={feeDetails} isVisible={true} />
          <CardFooter className="flex justify-between gap-4 pt-0 pb-4 px-4">
            <Button
              onClick={onCancelTransaction}
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
              disabled={isTransferring}
            >
              Cancel
            </Button>
            <Button
              onClick={onContinueTransaction}
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isTransferring}
            >
              {isTransferring ? "Processing..." : "Continue"}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Initial Buy Button */}
      {!showFeePreview && (
        <Button
          onClick={onBuyClick}
          disabled={isPreparing || isTransferring}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {isPreparing ? "Calculating Fees..." : "Get 1 USDT on Avalanche"}
        </Button>
      )}

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
  );
}
