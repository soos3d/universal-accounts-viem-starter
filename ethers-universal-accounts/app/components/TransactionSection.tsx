interface TransactionSectionProps {
  isTransferring: boolean;
  transactionError: string;
  transactionUrl: string;
  onBuyClick: () => void;
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
}: TransactionSectionProps) {
  return (
    <div className="mt-6 space-y-4">
      <button
        onClick={onBuyClick}
        disabled={isTransferring}
        className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg font-semibold
                 hover:from-green-600 hover:to-emerald-700 transition-all duration-200 ease-in-out
                 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg w-full"
      >
        {isTransferring ? "Processing Transaction..." : "Buy BNB ($0.1)"}
      </button>

      {transactionError && (
        <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-sm">
          {transactionError}
        </div>
      )}

      {transactionUrl && !transactionError && (
        <div className="space-y-2">
          <div className="text-green-400 font-semibold">
            Transaction Submitted!
          </div>
          <a
            href={transactionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline text-sm"
          >
            View Transaction Details
          </a>
        </div>
      )}
    </div>
  );
}
