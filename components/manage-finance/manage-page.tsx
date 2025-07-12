"use client";

import { useEffect, useState } from "react";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import FinanceForm from "./finance-form";
import { toast } from "sonner";

// Updated to match FinanceForm's Transaction interface
interface Transaction {
  type?: "credit" | "debit";
  amount?: number;
  reason?: string;
  category?: string;
  date?: string;
  time?: string;
  givenToSomeone?: boolean;
  personName?: string;
  isPending?: boolean;
  thoughts?: string;
  userid?: string;
}

interface InvestmentData {
  userid: string;
  investedMoney: number;
  currentMoney: number;
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

const currentUserId = "r1fs7b70-5r1b-4e34-bc94-5w61837c9b2e";

export function InvestmentTransactionPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userData, setUserData] = useState<InvestmentData>({
    userid: currentUserId,
    investedMoney: 0,
    currentMoney: 0,
  });
  const [initialInvestment, setInitialInvestment] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transactionsRes, totalsRes] = await Promise.all([
          fetch(`/api/transactions/${currentUserId}`).then((res) => res.json()),
          fetch(`/api/totals/${currentUserId}`).then((res) => res.json()),
        ]);
        setTransactions(transactionsRes.data || []);
        setUserData(totalsRes.data || { userid: currentUserId, investedMoney: 0, currentMoney: 0 });
      } catch (err) {
        toast.error("Failed to fetch data");
      }
    };
    fetchData();
  }, []);

  const handleInitialInvestmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (initialInvestment <= 0) {
      toast.error("Please enter a valid investment amount");
      return;
    }

    const promise = new Promise(async (resolve, reject) => {
      try {
        const res = await fetch("/api/totals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userid: currentUserId,
            investedMoney: initialInvestment,
            currentMoney: initialInvestment,
          }),
        });
        const data = await res.json();
        if (data.success) {
          resolve(data);
        } else {
          reject(new Error(data.error || "Failed to save investment"));
        }
      } catch (err) {
        reject(err);
      }
    });

    toast.promise(promise, {
      loading: "Saving initial investment...",
      success: (data: any) => {
        setUserData(data.data);
        setInitialInvestment(0);
        return "Initial investment saved successfully";
      },
      error: (err) => `Error: ${err.message}`,
    });
  };

  const handleTransactionSubmit = async (transaction: Transaction) => {
    // Validate required fields
    if (!transaction.type) {
      toast.error("Transaction type is required");
      return;
    }
    
    if (!transaction.amount || transaction.amount <= 0) {
      toast.error("Transaction amount must be greater than 0");
      return;
    }

    // Convert Transaction to the format expected by the API
    const transactionData = {
      userid: currentUserId,
      type: transaction.type,
      amount: transaction.amount,
      reason: transaction.reason || "",
      category: transaction.category || "Other",
      date: transaction.date || new Date().toISOString().split('T')[0],
      time: transaction.time || new Date().toTimeString().split(' ')[0],
      givenToSomeone: transaction.givenToSomeone || false,
      personName: transaction.personName || "",
      isPending: transaction.isPending || false,
      thoughts: transaction.thoughts || "",
    };

    const promise = new Promise(async (resolve, reject) => {
      try {
        const res = await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(transactionData),
        });
        const data = await res.json();
        if (data.success) {
          resolve(data);
        } else {
          reject(new Error(data.error || "Failed to add transaction"));
        }
      } catch (err) {
        reject(err);
      }
    });

    toast.promise(promise, {
      loading: "Adding transaction...",
      success: (data: any) => {
        setUserData(data.newTotals);
        setTransactions((prev) => [...prev, transactionData]);
        return "Transaction added successfully";
      },
      error: (err) => `Error: ${err.message}`,
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* Registered Amount Card or Initial Investment Input */}
      {userData.investedMoney > 0 ? (
        <div className="w-full flex items-start justify-between gap-x-6">
          <Card className="w-1/2 max-lg:w-full">
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
                  <IconTrendingUp className="size-4 text-green-600" />
                ) : (
                  <IconTrendingDown className="size-4 text-red-600" />
                )}
              </div>
              <div className="text-muted-foreground">
                {transactions.length} transactions recorded
              </div>
            </CardFooter>
          </Card>
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
        userTransactions={transactions}
        onSubmitTransaction={handleTransactionSubmit}
        currentUserId={currentUserId}
        categories={categories}
      />
    </div>
  );
}