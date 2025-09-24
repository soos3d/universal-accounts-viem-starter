"use client";

import { formatUnits } from "ethers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

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

  // Format fee values to fixed decimals for better readability
  const formatFee = (value: bigint) => {
    return parseFloat(formatUnits(value, 18)).toFixed(4);
  };

  return (
    <Card className="bg-gray-800 border-gray-700 mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-300">
          Transaction Fee Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-xs">Total Fee</span>
          <Badge variant="outline" className="text-white bg-gray-700/50 font-medium">
            ${formatFee(feeDetails.feeTokenAmountInUSD)}
          </Badge>
        </div>

        <Separator className="bg-gray-700" />

        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-xs">Gas Fee</span>
          <span className="text-gray-300 text-xs">
            ${formatFee(feeDetails.gasFeeTokenAmountInUSD)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-xs">Service Fee</span>
          <span className="text-gray-300 text-xs">
            ${formatFee(feeDetails.transactionServiceFeeTokenAmountInUSD)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-xs">LP Fee</span>
          <span className="text-gray-300 text-xs">
            ${formatFee(feeDetails.transactionLPFeeTokenAmountInUSD)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
