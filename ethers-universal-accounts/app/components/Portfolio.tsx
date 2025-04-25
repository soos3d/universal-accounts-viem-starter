import { IAssetsResponse } from "@GDdark/universal-account";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowUpRight,
  ChevronDown,
  Wallet,
  Database,
  BarChart3,
} from "lucide-react";

interface PortfolioProps {
  primaryAssets: IAssetsResponse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Helper function to get chain name based on chainId
function getChainNameById(chainId: number): string {
  const chains: Record<number, string> = {
    1: "Ethereum",
    56: "BNB Chain",
    42161: "Arbitrum One",
    10: "Optimism (OP)",
    137: "Polygon",
    43114: "Avalanche",
    8453: "Base",
    59144: "Linea",
    81457: "Blast",
    80094: "Berachain",
    169: "Manta Pacific",
    34443: "Mode",
    146: "Sonic",
    1030: "Conflux eSpace",
    4200: "Merlin",
    101: "Solana",
  };

  return chains[chainId] || `Chain ID: ${chainId}`;
}

export function Portfolio({
  primaryAssets,
  open,
  onOpenChange,
}: PortfolioProps) {
  if (!primaryAssets || !primaryAssets.assets.length) {
    return null;
  }

  // Get total balance and generate percentage for each asset
  const totalBalance = Number(primaryAssets?.totalAmountInUSD || 0);
  const assetsWithPercentage = primaryAssets.assets.map((asset) => ({
    ...asset,
    percentage: totalBalance > 0 ? (asset.amountInUSD / totalBalance) * 100 : 0,
  }));

  // Sort assets by value (highest first)
  const sortedAssets = [...assetsWithPercentage].sort(
    (a, b) => b.amountInUSD - a.amountInUSD
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[85vh] overflow-y-auto bg-gray-900 border-gray-700/50 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white flex items-center gap-2">
            <Wallet className="h-5 w-5 text-blue-400" />
            <span>Portfolio Details</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Total Balance Card */}
          <div className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 rounded-xl p-6 border border-blue-800/50 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-blue-300" />
              <h3 className="text-sm font-medium text-blue-300">
                Total Balance
              </h3>
            </div>
            <div className="font-mono text-3xl font-bold text-white">
              ${totalBalance.toFixed(2)}
            </div>
          </div>

          {/* Assets Overview */}
          <Card className="bg-gray-800/80 border-gray-700/50 shadow-md overflow-hidden">
            <CardHeader className="pb-2 border-b border-gray-700/50">
              <CardTitle className="text-md font-semibold text-gray-100 flex items-center gap-2">
                <Database className="h-4 w-4 text-blue-400" />
                <span>Assets Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-gray-800/90">
                  <TableRow className="hover:bg-transparent border-gray-700/50">
                    <TableHead className="text-gray-300">Asset</TableHead>
                    <TableHead className="text-gray-300">Amount</TableHead>
                    <TableHead className="text-right text-gray-300">
                      Value (USD)
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedAssets.map((asset, index) => {
                    const isPositive = asset.amountInUSD > 0;
                    return (
                      <TableRow
                        key={index}
                        className={`hover:bg-gray-700/30 border-gray-700/30 ${
                          isPositive ? "" : "opacity-60"
                        }`}
                      >
                        <TableCell className="font-medium py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center text-xs">
                              {asset.tokenType.substring(0, 1).toUpperCase()}
                            </div>
                            <span className="font-medium text-gray-100">
                              {asset.tokenType.toUpperCase()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {asset.amount > 0 ? asset.amount.toFixed(6) : "0"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-col items-end">
                            <span
                              className={`font-medium ${
                                isPositive ? "text-green-400" : "text-gray-400"
                              }`}
                            >
                              ${asset.amountInUSD.toFixed(2)}
                            </span>
                            {isPositive && (
                              <span className="text-xs text-gray-400">
                                {asset.percentage.toFixed(1)}%
                              </span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Chain Distribution */}
          <Card className="bg-gray-800/80 border-gray-700/50 shadow-md">
            <CardHeader className="pb-2 border-b border-gray-700/50">
              <CardTitle className="text-md font-semibold text-gray-100 flex items-center gap-2">
                <ArrowUpRight className="h-4 w-4 text-blue-400" />
                <span>Chain Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Accordion type="single" collapsible className="w-full">
                {sortedAssets
                  .filter((asset) => asset.amountInUSD > 0)
                  .map((asset, index) => (
                    <AccordionItem
                      key={index}
                      value={`asset-${index}`}
                      className="border-b border-gray-700/50 px-4 py-1 last:border-0"
                    >
                      <AccordionTrigger className="hover:bg-gray-700/30 hover:no-underline py-3 rounded-md px-2 -mx-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs">
                            {asset.tokenType.substring(0, 1).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-100">
                            {asset.tokenType.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-400 ml-1">
                            ${asset.amountInUSD.toFixed(2)}
                          </span>
                        </div>
                        <ChevronDown className="h-4 w-4 text-gray-400 shrink-0 transition-transform duration-200" />
                      </AccordionTrigger>
                      <AccordionContent className="pt-1 pb-3">
                        <div className="space-y-3 rounded-md bg-gray-700/20 p-3">
                          {asset.chainAggregation
                            .filter((chain) => chain.amountInUSD > 0)
                            .map((chain, chainIndex) => (
                              <div
                                key={chainIndex}
                                className="flex justify-between items-center text-sm p-2 rounded-md bg-gray-700/30 hover:bg-gray-700/50 transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant="outline"
                                    className="text-xs bg-gray-800/50 text-blue-300 border-blue-800/50 px-2 py-0.5"
                                  >
                                    {getChainNameById(chain.token.chainId)}
                                  </Badge>
                                  <span className="text-gray-200">
                                    {chain.amount.toFixed(6)}{" "}
                                    {asset.tokenType.toUpperCase()}
                                  </span>
                                </div>
                                <span className="font-medium text-green-400">
                                  ${chain.amountInUSD.toFixed(2)}
                                </span>
                              </div>
                            ))}
                          {asset.chainAggregation.filter(
                            (chain) => chain.amountInUSD > 0
                          ).length === 0 && (
                            <div className="text-center text-gray-400 text-sm py-2">
                              No assets on any chains
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
              </Accordion>
              {sortedAssets.filter((asset) => asset.amountInUSD > 0).length ===
                0 && (
                <div className="text-center text-gray-400 text-sm py-6">
                  No assets available
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
