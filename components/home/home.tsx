"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Hero from "./hero";
import { FaWallet } from "react-icons/fa";
import { IoBarChart } from "react-icons/io5";
import { IconType } from "react-icons";

interface CardContainerProps {
  cardTitle: string;
  cardDescription: string;
  title: string;
  description: string;
  icon: IconType;
  order1: number;
  order2: number;
  btnText: string;
}

const CardContainer = ({
  cardTitle,
  cardDescription,
  title,
  description,
  icon: Icon,
  order1 = 1,
  order2 = 2,
  btnText,
}: CardContainerProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-8 lg:gap-x-12 w-full">
      <Card
        className={`order-${order2} lg:order-${order1} relative overflow-hidden bg-card/60 border shadow-md hover:shadow-lg transition`}
      >
        <div className="absolute right-0 border-l border-foreground/40 dark:bg-background/70 top-0 h-full w-1/2 lg:w-1/3 p-5 flex items-center justify-center opacity-20 pointer-events-none">
          <Icon className="w-full h-[80%] text-primary scale-x-[-1]" />
        </div>
        <CardHeader>
          <CardTitle className="text-xl relative z-10">{cardTitle}</CardTitle>
        </CardHeader>
        {/* <Separator className="w-[70%] " /> */}

        <div className="h-[1px] bg-border w-full lg:w-2/3" />

        <CardContent className="text-muted-foreground relative z-10 w-full lg:w-2/3">
          {cardDescription}
          <div className="mt-6">
            <Button variant="default">{btnText}</Button>
          </div>
        </CardContent>
      </Card>

      <div
        className={`order-${order1} lg:order-${order2} flex flex-col justify-center`}
      >
        <h2 className="text-2xl font-semibold mb-2">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-start px-6 py-12 space-y-24">
      <Hero />

      <Separator className="w-full my-32" />

      <section className="flex flex-col gap-y-20 w-full">
        <CardContainer
          icon={FaWallet}
          cardTitle="Add Transaction"
          cardDescription="Quickly log your income or expenses with category, date, and amount."
          title="Simple Expense Logging"
          description="Stay on top of your finances by logging every income or expense entry with a few clicks. Categorize easily, add notes, and track patterns."
          order1={1}
          order2={2}
          btnText="Add Entry"
        />

        <CardContainer
          icon={IoBarChart}
          cardTitle="View Monthly Report"
          cardDescription="Browse your finances month by month with visual breakdowns."
          title="Visual Financial Reports"
          description="Get a monthly breakdown of your income and expenses. Our intuitive charts help you understand spending habits and save more effectively."
          order1={2}
          order2={1}
          btnText="View Reports"
        />
      </section>

      <footer className="text-center text-sm text-muted-foreground mt-16">
        Built with ❤️ using Next.js & ShadCN. Secure & private for your personal
        use.
      </footer>
    </main>
  );
}
