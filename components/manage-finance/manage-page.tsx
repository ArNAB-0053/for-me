"use client";

import { useState } from "react";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import totals from "@/lib/totals.json";
import FinanceForm from "./finance-form";
import { TransactionsTable } from "../sidebar/data-table";
import { ExternalLink } from "lucide-react";

interface TransactionFormData {
  userid?: string;
  type: "credit" | "debit";
  amount: number;
  reason: string;
  category: string;
  givenToSomeone: boolean;
  personName: string;
  isPending: boolean;
  date: string;
  time: string;
  thoughts: string;
}

interface InvestmentData {
  userid: string;
  investedMoney: number;
  currentMoney: number;
}

interface InvestmentTransactionPageProps {
  transactions: TransactionFormData[];
  onSubmitTransaction: (data: TransactionFormData) => void;
  onSubmitInitialInvestment: (amount: number) => void;
}

const categories = [
  "Income",
  "Housing",
  "Transport",
  "Food",
  "Shopping",
  "Utilities",
  "Entertainment",
  "Other",
];

const currentUserId = "u001";

export function InvestmentTransactionPage({
  transactions,
  onSubmitTransaction,
  onSubmitInitialInvestment,
}: InvestmentTransactionPageProps) {
  const userTransactions = transactions.filter(
    (transaction) => transaction.userid === currentUserId
  );
  const userData = totals.find(
    (data: InvestmentData) => data.userid === currentUserId
  ) || { investedMoney: 0, currentMoney: 0 };
  const [initialInvestment, setInitialInvestment] = useState<number>(0);

  const handleInitialInvestmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initialInvestment > 0) {
      onSubmitInitialInvestment(initialInvestment);
      setInitialInvestment(0);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Registered Amount Card or Initial Investment Input */}
      {userData.investedMoney > 0 ? (
        <div className="w-full flex items-start justify-between gap-x-6">
          <Card className="w-1/2">
            <CardHeader>
              <CardDescription>Registered Amount</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                ${userData.investedMoney.toFixed(2)}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Current Balance: ${userData.currentMoney.toFixed(2)}
                {userData.currentMoney >= userData.investedMoney ? (
                  <IconTrendingUp className="size-4" />
                ) : (
                  <IconTrendingDown className="size-4" />
                )}
              </div>
              <div className="text-muted-foreground">
                {userTransactions.length} transactions recorded
              </div>
            </CardFooter>
          </Card>

          <div className="flex-1 relative overflow-hidden rounded-lg border h-44">
            <TransactionsTable data={transactions} onlyTable />

            <div className="w-full h-full absolute bg-black/40 backdrop-blur-[2px] z-40 left-0 top-0"></div>

            <div className="absolute z-40 left-1/2 top-1/2 -translate-x-1/2 flex items-center justify-center flex-col gap-y-2">
              <p>View the transaction record</p>
              <Button className="w-fit bg-secondary border  hover:bg-secondary/80">
                View
                <ExternalLink />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full flex">
          <Card className="w-1/2">
            <CardHeader>
              <CardTitle>Add Initial Investment</CardTitle>
              <CardDescription>
                Enter your initial investment amount to start tracking.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleInitialInvestmentSubmit}>
              <CardContent className="space-y-2 mt-5">
                <Label htmlFor="initialInvestment">Initial Investment</Label>
                <Input
                  id="initialInvestment"
                  type="number"
                  min="0"
                  step="0.01"
                  value={initialInvestment}
                  onChange={(e) =>
                    setInitialInvestment(parseFloat(e.target.value) || 0)
                  }
                  placeholder="Enter initial investment amount"
                  className="tabular-nums"
                />
              </CardContent>
              <CardFooter className="flex justify-center mt-6 gap-2">
                <Button type="submit">Save Investment</Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}

      <FinanceForm
        handleInputChange={handleInputChange}
        userTransactions={userTransactions}
        onSubmitTransaction={onSubmitTransaction}
        currentUserId={currentUserId}
        categories={categories}
      />
    </div>
  );

  function handleInputChange(
    field: keyof TransactionFormData,
    value: string | number | boolean
  ) {
    // Update the first transaction or create a new one
    const updatedTransaction = {
      ...userTransactions[0],
      [field]: value,
      userid: currentUserId,
    };
    onSubmitTransaction(updatedTransaction);
  }
}
