import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { TransactionsTable } from "@/components/sidebar/data-table";
import { SectionCards } from "@/components/sidebar/section-cards";

import data from "@/lib/finance.json";
import totals from "@/lib/totals.json";

// Get the current user ID (in a real app, this would come from auth/session)
const currentUserId = "u001"; // Example - replace with your actual user ID lookup

export default function Page() {
  // Find the current user's data
  const userData = totals.find(user => user.userid === currentUserId);
  
  // Filter transactions for the current user
  const userTransactions = data.filter(transaction => transaction.userid === currentUserId);

  if (!userData) {
    return <div>User data not found</div>;
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards data={{
            investedMoney: userData.investedMoney,
            currentMoney: userData.currentMoney
          }} />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive data={userTransactions} />
          </div>
          <div className="mt-6 px-4 lg:px-6">
            <TransactionsTable data={userTransactions} />
          </div>
        </div>
      </div>
    </div>
  );
}