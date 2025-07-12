import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

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

interface FinanceFormProps {
  userTransactions: Transaction[];
  onSubmitTransaction: (transaction: Transaction) => void;
  currentUserId: string;
  categories: string[];
}

const FinanceForm = ({
  userTransactions,
  onSubmitTransaction,
  currentUserId,
  categories,
}: FinanceFormProps) => {
  // Initialize formData with default values
  const [formData, setFormData] = useState<Transaction>({
    type: "credit",
    amount: 0,
    reason: "",
    category: "Income",
    date: new Date().toISOString().slice(0, 10), // Default to today's date
    time: new Date().toTimeString().slice(0, 5), // Default to current time
    givenToSomeone: false,
    personName: "",
    isPending: false,
    thoughts: "",
    userid: currentUserId,
  });

  // Update formData if editing a transaction
  useEffect(() => {
    if (userTransactions.length > 0) {
      setFormData({
        ...userTransactions[0],
        // Ensure defaults are maintained for undefined fields
        type: userTransactions[0].type || "credit",
        amount: userTransactions[0].amount || 0,
        reason: userTransactions[0].reason || "",
        category: userTransactions[0].category || "Income",
        date: userTransactions[0].date || new Date().toISOString().slice(0, 10),
        time: userTransactions[0].time || new Date().toTimeString().slice(0, 5),
        givenToSomeone: userTransactions[0].givenToSomeone || false,
        personName: userTransactions[0].personName || "",
        isPending: userTransactions[0].isPending || false,
        thoughts: userTransactions[0].thoughts || "",
        userid: currentUserId,
      });
    }
  }, [userTransactions, currentUserId]);

  const handleChange = (field: keyof Transaction, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ensure all required fields are included, even with default values
    const transactionData: Transaction = {
      type: formData.type || "credit",
      amount: formData.amount || 0,
      reason: formData.reason || "",
      category: formData.category || "Income",
      date: formData.date || new Date().toISOString().slice(0, 10),
      time: formData.time || new Date().toTimeString().slice(0, 5),
      givenToSomeone: formData.givenToSomeone || false,
      personName: formData.personName || "",
      isPending: formData.isPending || false,
      thoughts: formData.thoughts || "",
      userid: currentUserId,
    };
    onSubmitTransaction(transactionData);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-3xl font-black">
          {userTransactions.length > 0 ? "Edit Transaction" : "Add Transaction"}
        </CardTitle>
        <CardDescription>
          Track your financial transactions with detailed information.
        </CardDescription>
      </CardHeader>

      <Separator />

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-x-12 gap-y-5 md:grid-cols-1 lg:grid-cols-2">
            {/* Transaction Type */}
            <div className="space-y-2 lg:col-span-2">
              <Label htmlFor="type">Transaction Type</Label>
              <CardDescription className="text-sm text-muted-foreground">
                Select whether this is money received (Credit) or spent (Debit).
              </CardDescription>
              <Select
                value={formData.type || "credit"}
                onValueChange={(value) =>
                  handleChange("type", value as "credit" | "debit")
                }
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit">
                    <div className="flex items-center gap-2">
                      <IconTrendingUp className="size-4" /> Credit
                    </div>
                  </SelectItem>
                  <SelectItem value="debit">
                    <div className="flex items-center gap-2">
                      <IconTrendingDown className="size-4" /> Debit
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <CardDescription className="text-sm text-muted-foreground">
                Enter the transaction amount (e.g., 500.00).
              </CardDescription>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={formData.amount ?? ""}
                onChange={(e) => {
                  const value = e.target.valueAsNumber;
                  handleChange("amount", isNaN(value) ? "" : value);
                }}
                placeholder="Enter amount"
                className="tabular-nums"
              />
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <CardDescription className="text-sm text-muted-foreground">
                Provide a brief reason for the transaction (e.g., "Monthly rent").
              </CardDescription>
              <Input
                id="reason"
                value={formData.reason || ""}
                onChange={(e) => handleChange("reason", e.target.value)}
                placeholder="e.g., Cashback, Rent"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <CardDescription className="text-sm text-muted-foreground">
                Choose a category to organize your transaction.
              </CardDescription>
              <Select
                value={formData.category || "Income"}
                onValueChange={(value) => handleChange("category", value)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date & Time */}
            <div className="space-y-2">
              <Label htmlFor="dateTime">Date & Time</Label>
              <CardDescription className="text-sm text-muted-foreground">
                Select the date and time of the transaction.
              </CardDescription>
              <Input
                id="dateTime"
                type="datetime-local"
                value={
                  formData.date && formData.time
                    ? `${formData.date}T${formData.time}`
                    : new Date().toISOString().slice(0, 16)
                }
                onChange={(e) => {
                  const [date, time] = e.target.value.split("T");
                  handleChange("date", date);
                  handleChange("time", time);
                }}
              />
            </div>

            {/* Given to Someone */}
            <div className="space-y-2">
              <div className="flex items-start justify-center flex-col gap-2">
                <span className="flex items-center gap-x-2">
                  <Switch
                    id="givenToSomeone"
                    checked={formData.givenToSomeone || false}
                    onCheckedChange={(checked) =>
                      handleChange("givenToSomeone", checked)
                    }
                  />
                  <Label htmlFor="givenToSomeone">Given to Someone</Label>
                </span>
                <CardDescription className="text-sm text-muted-foreground">
                  Toggle if this transaction involves another person (e.g., a loan).
                </CardDescription>
              </div>
              {formData.givenToSomeone && (
                <Input
                  id="personName"
                  value={formData.personName || ""}
                  onChange={(e) => handleChange("personName", e.target.value)}
                  placeholder="Enter name"
                />
              )}
            </div>

            {/* Status (Conditional) */}
            {formData.givenToSomeone && (
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <CardDescription className="text-sm text-muted-foreground">
                  Indicate if the loan or payment is pending or cleared.
                </CardDescription>
                <Select
                  value={formData.isPending ? "Pending" : "Cleared"}
                  onValueChange={(value) =>
                    handleChange("isPending", value === "Pending")
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cleared">Cleared</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Thoughts */}
          <div className="space-y-2 pt-10">
            <Label htmlFor="thoughts">Thoughts (Optional)</Label>
            <CardDescription className="text-sm text-muted-foreground">
              Add optional notes or thoughts about this transaction.
            </CardDescription>
            <Textarea
              id="thoughts"
              value={formData.thoughts || ""}
              onChange={(e) => handleChange("thoughts", e.target.value)}
              placeholder="Add any additional notes or thoughts"
              rows={4}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between gap-2 mt-10">
          <Button variant="outline" type="button">
            Cancel
          </Button>
          <Button type="submit">Save Transaction</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default FinanceForm;