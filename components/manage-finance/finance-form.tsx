import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

interface Transaction {
  type?: 'credit' | 'debit';
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
    handleInputChange: (field: keyof Transaction, value: any) => void;
    categories: string[];
}

const FinanceForm = ({userTransactions, onSubmitTransaction, currentUserId, handleInputChange, categories}: FinanceFormProps) => {
  return (
    <Card className="w-full">
        <CardHeader>
          <CardTitle className='text-3xl font-black'>
            {userTransactions.length > 0
              ? "Edit Transaction"
              : "Add Transaction"}
          </CardTitle>
          <CardDescription>
            Track your financial transactions with detailed information.
          </CardDescription>
        </CardHeader>

              <Separator/>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmitTransaction({
              ...userTransactions[0],
              userid: currentUserId,
            });
          }}
        >
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-x-12 gap-y-5 md:grid-cols-1 lg:grid-cols-2">
              {/* Type */}
              <div className="space-y-2 lg:col-span-2">
                <Label htmlFor="type">Transaction Type</Label>
                <CardDescription className="text-sm text-muted-foreground">
                  Select whether this is money received (Credit) or spent
                  (Debit).
                </CardDescription>
                <Select
                  value={userTransactions[0]?.type || "credit"}
                  onValueChange={(value) =>
                    handleInputChange("type", value as "credit" | "debit")
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
              <div className="space-y-2 ">
                <Label htmlFor="amount">Amount</Label>
                <CardDescription className="text-sm text-muted-foreground">
                  Enter the transaction amount (e.g., 500.00).
                </CardDescription>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={userTransactions[0]?.amount || 0}
                  onChange={(e) =>
                    handleInputChange("amount", parseFloat(e.target.value) || 0)
                  }
                  placeholder="Enter amount"
                  className="tabular-nums"
                />
              </div>

              {/* Reason */}
              <div className="space-y-2">
                <Label htmlFor="reason">Reason</Label>
                <CardDescription className="text-sm text-muted-foreground">
                  Provide a brief reason for the transaction (e.g., "Monthly
                  rent").
                </CardDescription>
                <Input
                  id="reason"
                  value={userTransactions[0]?.reason || ""}
                  onChange={(e) => handleInputChange("reason", e.target.value)}
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
                  value={userTransactions[0]?.category || "Income"}
                  onValueChange={(value) =>
                    handleInputChange("category", value)
                  }
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
                    userTransactions[0]?.date && userTransactions[0]?.time
                      ? `${userTransactions[0].date}T${userTransactions[0].time}`
                      : new Date().toISOString().slice(0, 16)
                  }
                  onChange={(e) => {
                    const [date, time] = e.target.value.split("T");
                    handleInputChange("date", date);
                    handleInputChange("time", time);
                  }}
                />
              </div>

              {/* Given to Someone */}
              <div className="space-y-2">
                <div className="flex items-start justify-center flex-col gap-2">
                  <span className="flex items-center gap-x-2">
                    <Switch
                      id="givenToSomeone"
                      checked={userTransactions[0]?.givenToSomeone || false}
                      onCheckedChange={(checked) =>
                        handleInputChange("givenToSomeone", checked)
                      }
                    />
                    <Label htmlFor="givenToSomeone">Given to Someone</Label>
                  </span>
                  <CardDescription className="text-sm text-muted-foreground">
                    Toggle if this transaction involves another person (e.g., a
                    loan).
                  </CardDescription>
                </div>
                {userTransactions[0]?.givenToSomeone && (
                  <Input
                    id="personName"
                    value={userTransactions[0]?.personName || ""}
                    onChange={(e) =>
                      handleInputChange("personName", e.target.value)
                    }
                    placeholder="Enter name"
                  />
                )}
              </div>

              {/* Status (Conditional) */}
              {userTransactions[0]?.givenToSomeone && (
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <CardDescription className="text-sm text-muted-foreground">
                    Indicate if the loan or payment is pending or cleared.
                  </CardDescription>
                  <Select
                    value={
                      userTransactions[0]?.isPending ? "Pending" : "Cleared"
                    }
                    onValueChange={(value) =>
                      handleInputChange("isPending", value === "Pending")
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

            {/* Thoughts (Full Width) */}
            <div className="space-y-2 pt-10">
              <Label htmlFor="thoughts">Thoughts (Optional)</Label>
              <CardDescription className="text-sm text-muted-foreground">
                Add optional notes or thoughts about this transaction.
              </CardDescription>
              <Textarea
                id="thoughts"
                value={userTransactions[0]?.thoughts || ""}
                onChange={(e) => handleInputChange("thoughts", e.target.value)}
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
  )
}

export default FinanceForm