"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { IconFilter, IconSearch, IconX, IconClock } from "@tabler/icons-react";
import {
  CheckCircle2Icon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ColumnsIcon,
  MoreVerticalIcon,
} from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Separator } from "@radix-ui/react-dropdown-menu";

// Custom DateRangePicker component
function DateRangePicker({
  selected,
  onSelect,
  className,
}: {
  selected?: DateRange;
  onSelect?: (range: DateRange | undefined) => void;
  className?: string;
}) {
  const [date, setDate] = React.useState<DateRange | undefined>(selected);

  React.useEffect(() => {
    onSelect?.(date);
  }, [date, onSelect]);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

interface Transaction {
  userid: string;
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

const columns: ColumnDef<Transaction>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <div className="font-medium">
        {format(new Date(row.original.date), "dd MMM yyyy")}
        <div className="text-muted-foreground text-xs">{row.original.time}</div>
      </div>
    ),
    sortingFn: (rowA, rowB) =>
      new Date(rowB.original.date).getTime() -
      new Date(rowA.original.date).getTime(),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <Badge
        variant={row.original.type === "credit" ? "success" : "destructive"}
      >
        {row.original.type.toUpperCase()}
      </Badge>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <div className="font-medium">₹{row.original.amount.toLocaleString()}</div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "reason",
    header: "Description",
    cell: ({ row }) => (
      <div>
        <div>{row.original.reason}</div>
        {row.original.givenToSomeone && row.original.personName && (
          <div className="text-muted-foreground text-xs">
            To: {row.original.personName}
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.isPending ? "destructive" : "success"}>
        {row.original.isPending ? (
          <>
            <IconClock className="mr-1 h-3 w-3" />
            Pending
          </>
        ) : (
          <>
            <CheckCircle2Icon className="mr-1 h-3 w-3" />
            Completed
          </>
        )}
      </Badge>
    ),
  },
  {
    id: "actions",
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
            size="icon"
          >
            <MoreVerticalIcon />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export function TransactionsTable({
  data: initialData,
  onlyTable = false,
}: {
  data: Transaction[];
  onlyTable?: boolean;
}) {
  const [data] = React.useState(() =>
    initialData.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  );
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "date", desc: true }, // Default: newest to oldest
  ]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [transactionType, setTransactionType] = React.useState<string>("all");
  const [showLoansOnly, setShowLoansOnly] = React.useState(false);
  const [showPendingOnly, setShowPendingOnly] = React.useState(false);

  const filteredData = React.useMemo(() => {
    return data.filter((transaction) => {
      if (dateRange?.from && dateRange?.to) {
        const transactionDate = new Date(transaction.date);
        if (
          transactionDate < dateRange.from ||
          transactionDate > dateRange.to
        ) {
          return false;
        }
      }
      if (
        searchTerm &&
        !transaction.reason.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !transaction.thoughts
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) &&
        !transaction.personName.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }
      if (transactionType !== "all" && transaction.type !== transactionType) {
        return false;
      }
      if (showLoansOnly && transaction.category !== "Loan") {
        return false;
      }
      if (showLoansOnly && showPendingOnly && !transaction.isPending) {
        return false;
      }
      return true;
    });
  }, [
    data,
    searchTerm,
    dateRange,
    transactionType,
    showLoansOnly,
    showPendingOnly,
  ]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
    },
    getRowId: (row) => `${row.userid}-${row.date}-${row.time}`,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "flex flex-col gap-4 md:flex-row md:items-center md:justify-between",
          onlyTable && "hidden"
        )}
      >
        <div className="relative w-full md:w-64">
          <IconSearch className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search transactions..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2"
              onClick={() => setSearchTerm("")}
            >
              <IconX className="h-3 w-3" />
            </Button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <IconFilter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div>
                  <Label className="mb-3">Date Range</Label>
                  <DateRangePicker
                    onSelect={setDateRange}
                    selected={dateRange}
                  />
                </div>
                <div>
                  <Label className="mb-3">Transaction Type</Label>
                  <Select
                    value={transactionType}
                    onValueChange={setTransactionType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Transactions</SelectItem>
                      <SelectItem value="credit">Credits</SelectItem>
                      <SelectItem value="debit">Debits</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="loans-only"
                    checked={showLoansOnly}
                    onCheckedChange={(checked) =>
                      setShowLoansOnly(checked as boolean)
                    }
                  />
                  <Label htmlFor="loans-only">Show Loans Only</Label>
                </div>
                {showLoansOnly && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pending-only"
                      checked={showPendingOnly}
                      onCheckedChange={(checked) =>
                        setShowPendingOnly(checked as boolean)
                      }
                    />
                    <Label htmlFor="pending-only">Show Pending Only</Label>
                  </div>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setDateRange(undefined);
                    setTransactionType("all");
                    setShowLoansOnly(false);
                    setShowPendingOnly(false);
                    setColumnVisibility({});
                    setSorting([{ id: "date", desc: true }]);
                    setRowSelection({});
                    table.setPageIndex(0);
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ColumnsIcon />
                Columns
                <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {(column.columnDef.header as string) !== "" ||
                    (column.columnDef.header as string) !== null
                      ? (column.columnDef.header as string)
                      : "..."}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div
        className={cn(
          "flex items-center justify-between",
          onlyTable && "hidden"
        )}
      >
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 50, 100].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">rows per page</span>
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(
                      header.column.getCanSort() && "cursor-pointer",
                      header.column.getIsSorted() && "bg-muted/50"
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {(header.column.id === "date" &&
                        {
                          asc: <ChevronDownIcon className="h-4 w-4" />,
                          desc: (
                            <ChevronDownIcon className="h-4 w-4 rotate-180" />
                          ),
                        }[header.column.getIsSorted() as string]) ??
                        null}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeftIcon />
            <span className="sr-only">Go to first page</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon />
            <span className="sr-only">Go to previous page</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon />
            <span className="sr-only">Go to next page</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRightIcon />
            <span className="sr-only">Go to last page</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
