"use client"
import React from "react";

import data from "@/lib/finance.json";
import totals from "@/lib/totals.json";
import { InvestmentTransactionPage } from "@/components/manage-finance/manage-page";

const page = () => {
  return (
    <div className="bg-background px-4 lg:px-6 py-4 overflow-hidden rounded-tl-3xl lg:py-6">
      <InvestmentTransactionPage
        transactions={data}
        onSubmitTransaction={(data) => console.log("Transaction:", data)}
        onSubmitInitialInvestment={(amount) =>
          console.log("Initial Investment:", amount)
        }
      />
    </div>
  );
};

export default page;
