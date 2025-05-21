import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FaDollarSign } from "react-icons/fa";

interface InvestmentData {
  investedMoney: number;
  currentMoney: number;
}

interface StatsCardProps {
  title: string;
  value: string | number;
  trend?: number;
  description: string;
  showTrendBadge?: boolean;
  showComparisonBadge?: boolean;
  comparisonValue?: number;
}

function formatNumber(value: number): string {
  return Number.isInteger(value) ? value.toString() : value.toFixed(2);
}

function formatPercentage(value: number): string {
  return `${value > 0 ? "+" : ""}${Number.isInteger(value) ? value.toString() : value.toFixed(2)}%`;
}

function StatsCard({
  title,
  value,
  trend,
  description,
  showTrendBadge = false,
  showComparisonBadge = false,
  comparisonValue,
}: StatsCardProps) {
  const isPositive = trend !== undefined ? trend >= 0 : false;
  const TrendIcon = isPositive ? IconTrendingUp : IconTrendingDown;
  const trendColor = isPositive ? "text-green-500" : "text-red-500";

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardDescription className="text-sm font-medium text-muted-foreground">
          {title}
        </CardDescription>
        <CardTitle className="flex items-baseline gap-2">
          <span className="flex items-center text-2xl font-semibold">
            <FaDollarSign className="mr-1 h-4 w-4 opacity-70" />
            {typeof value === "number" ? formatNumber(value) : value}
          </span>
          
          {showComparisonBadge && comparisonValue !== undefined && (
            <Badge 
              variant="outline"
              className={`ml-2 ${trendColor} border-muted bg-transparent`}
            >
              <TrendIcon className="mr-1 h-3 w-3" />
              {formatPercentage(trend!)}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardFooter className="pt-0">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{description}</span>
          {showTrendBadge && trend !== undefined && (
            <Badge
              variant="outline"
              className={`${trendColor} border-muted bg-transparent`}
            >
              <TrendIcon className="mr-1 h-3 w-3" />
              {formatPercentage(trend)}
            </Badge>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

function calculateUserStats(userData: InvestmentData) {
  const profit = userData.currentMoney - userData.investedMoney;
  const profitPercentage = (profit / userData.investedMoney) * 100;
  const isProfitable = profit >= 0;

  return {
    invested: userData.investedMoney,
    current: userData.currentMoney,
    profit,
    profitPercentage,
    isProfitable,
  };
}

export function SectionCards({ data }: { data: InvestmentData }) {
  const stats = calculateUserStats(data);

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-3 @5xl/main:grid-cols-3">
      <StatsCard
        title="Registered Amount"
        value={stats.invested}
        description="Initial investment amount"
      />

      <StatsCard
        title="Current Value"
        value={stats.current}
        trend={stats.profitPercentage}
        description={`Value ${stats.isProfitable ? "increased" : "decreased"}`}
        showComparisonBadge={true}
        comparisonValue={stats.invested}
      />

      <StatsCard
        title="Net Change"
        value={stats.profit}
        description={`${stats.isProfitable ? "Profit" : "Loss"} amount`}
        showTrendBadge={true}
        trend={stats.profitPercentage}
      />
    </div>
  );
}