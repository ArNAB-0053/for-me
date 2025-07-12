"use client";

import { useEffect, useState } from "react";
import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { TransactionsTable } from "@/components/sidebar/data-table";
import { SectionCards } from "@/components/sidebar/section-cards";
import { Loader2 } from "lucide-react";

const currentUserId = "r1fs7b70-5r1b-4e34-bc94-5w61837c9b2e";

export default function Page() {
  const [userData, setUserData] = useState<{ investedMoney: number; currentMoney: number } | null>(null);
  const [userTransactions, setUserTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch totals for current user
        const totalsRes = await fetch(`/api/totals/${currentUserId}`);
        const totalsData = await totalsRes.json();

        // console.log("TotalData: ", totalsData)

        const currentUserData = totalsData.data;

        setUserData(currentUserData);

        // Fetch transactions for current user
        const transactionsRes = await fetch(`/api/transactions/${currentUserId}`);
        const transactionsData = await transactionsRes.json();
        const currentUserTransactions = transactionsData.data
        // console.log("transactionsData: ", currentUserTransactions)

        setUserTransactions(currentUserTransactions);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh] gap-y-1">
        <Loader2 className="animate-spin w-8 h-8 text-muted-foreground aspect-square" />
        <span className="text-xl text-muted-foreground">Loading...</span>
      </div>
    );
  }

  if (!userData) {
    return <div className="text-red-500">User data not found</div>;
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
          <SectionCards
            data={{
              investedMoney: userData.investedMoney,
              currentMoney: userData.currentMoney,
            }}
          />
          <div>
            <ChartAreaInteractive data={userTransactions} />
          </div>
          <div className="mt-6">
            <TransactionsTable data={userTransactions} />
          </div>
        </div>
      </div>
    </div>
  );
}
