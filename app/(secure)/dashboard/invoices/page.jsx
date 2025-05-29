// app>(secure)>dashboard>invoices>page.jsx
"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  queryInvoices,
  setInvoiceQuery,
} from "@/lib/redux/slices/invoicesSlice";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

import { MoreVertical, ArrowUp, ArrowDown } from "lucide-react";
import { utils, writeFile } from "xlsx";

export default function InvoicesPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { items, total, loading, query } = useSelector(
    (state) => state.invoices
  );
  const { page, pageSize, search, sort } = query;

  const [visibleColumns, setVisibleColumns] = useState({
    status: true,
    customer: true,
    dueDate: true,
    amount: true,
    balance: true,
    actions: true,
  });

  useEffect(() => {
    const checkLimits = async () => {
      try {
        const res = await fetch("/api/invoices/limit");
        const data = await res.json();

        if (!data?.allowed) {
          toast("Invoice Limit Reached", {
            description:
              "You’ve reached your invoice limit for your current plan.",
            action: {
              label: "Upgrade",
              onClick: () => router.push("/dashboard/settings/billing"),
            },
          });

          setTimeout(() => {
            router.replace("/dashboard/invoices");
          }, 2000); // give toast 2 seconds to show
        }
      } catch (err) {
        console.error("Invoice limit check failed:", err);
      }
    };

    checkLimits();
    dispatch(queryInvoices(query));
  }, [dispatch, query, router]);

  const totalPages = pageSize === "all" ? 1 : Math.ceil(total / pageSize);

  const toggleColumn = (col) => {
    setVisibleColumns((prev) => ({ ...prev, [col]: !prev[col] }));
  };

  const handleSearchChange = (e) => {
    if (search !== e.target.value) {
      dispatch(setInvoiceQuery({ search: e.target.value, page: 1 }));
    }
  };

  const handlePageSizeChange = (value) => {
    const newPageSize = value === "all" ? "all" : parseInt(value);
    if (pageSize !== newPageSize) {
      dispatch(setInvoiceQuery({ pageSize: newPageSize, page: 1 }));
    }
  };

  const handleSort = (field) => {
    if (field === "balanceDue") return; // Prevent sorting on virtual field
    const [currentField, currentOrder] = sort.split("_");
    const newOrder =
      currentField === field && currentOrder === "asc" ? "desc" : "asc";
    const newSort = `${field}_${newOrder}`;
    if (sort !== newSort) {
      dispatch(setInvoiceQuery({ sort: newSort }));
    }
  };

  const getSortIndicator = (field) => {
    const [currentField, currentOrder] = sort.split("_");
    if (currentField !== field) return null;
    return currentOrder === "asc" ? (
      <ArrowUp className="inline w-3 h-3 ml-1" />
    ) : (
      <ArrowDown className="inline w-3 h-3 ml-1" />
    );
  };

  const handlePageChange = (delta) => {
    if (
      page + delta > 0 &&
      (pageSize === "all" || page + delta <= totalPages)
    ) {
      dispatch(setInvoiceQuery({ page: page + delta }));
    }
  };

  const handleExportCSV = () => {
    const data = items.map((inv) => ({
      Number: inv.number,
      Status: inv.status,
      Customer: inv.customer?.name || "Unknown",
      DueDate: inv.dueDate?.split("T")[0],
      Amount: parseFloat(inv.amount).toFixed(2),
      BalanceDue: (
        inv.balanceDue ?? inv.amount - (inv.amountPaid || 0)
      ).toFixed(2),
    }));

    const sheet = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, sheet, "Invoices");
    writeFile(wb, "invoices.csv");
  };

  const handleExportPDF = () => {
    // Placeholder for PDF export
  };

  return (
    <Card className="rounded-none shadow-sm hover:shadow-md transition max-w-[98%] mx-auto mt-5">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Invoices</CardTitle>
          <Button onClick={() => router.push("/dashboard/invoices/new")}>
            New Invoice
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4">
          <Input
            type="text"
            placeholder="Search invoices..."
            value={search}
            onChange={handleSearchChange}
            className="w-full sm:max-w-sm"
          />
          <div className="ml-auto flex gap-2 flex-wrap justify-end">
            {Object.keys(visibleColumns).map((col) => (
              <label
                key={col}
                className="text-sm text-muted-foreground flex items-center space-x-1"
              >
                <input
                  type="checkbox"
                  checked={visibleColumns[col]}
                  onChange={() => toggleColumn(col)}
                />
                <span className="capitalize">
                  {col === "balance" ? "Balance Due" : col}
                </span>
              </label>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <p className="p-4">Loading Invoices...</p>
        ) : items.length > 0 ? (
          <>
            <Table>
              <TableCaption>A list of your invoices.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead
                    onClick={() => handleSort("number")}
                    className="cursor-pointer"
                    aria-sort={
                      sort.startsWith("number") ? sort.split("_")[1] : undefined
                    }
                  >
                    # {getSortIndicator("number")}
                  </TableHead>
                  {visibleColumns.status && (
                    <TableHead
                      onClick={() => handleSort("status")}
                      className="cursor-pointer"
                      aria-sort={
                        sort.startsWith("status")
                          ? sort.split("_")[1]
                          : undefined
                      }
                    >
                      Status {getSortIndicator("status")}
                    </TableHead>
                  )}
                  {visibleColumns.customer && (
                    <TableHead
                      onClick={() => handleSort("customer")}
                      className="cursor-pointer"
                      aria-sort={
                        sort.startsWith("customer")
                          ? sort.split("_")[1]
                          : undefined
                      }
                    >
                      Customer {getSortIndicator("customer")}
                    </TableHead>
                  )}
                  {visibleColumns.dueDate && (
                    <TableHead
                      onClick={() => handleSort("dueDate")}
                      className="cursor-pointer"
                      aria-sort={
                        sort.startsWith("dueDate")
                          ? sort.split("_")[1]
                          : undefined
                      }
                    >
                      Due {getSortIndicator("dueDate")}
                    </TableHead>
                  )}
                  {visibleColumns.amount && (
                    <TableHead
                      onClick={() => handleSort("amount")}
                      className="cursor-pointer text-right"
                      aria-sort={
                        sort.startsWith("amount")
                          ? sort.split("_")[1]
                          : undefined
                      }
                    >
                      Amount {getSortIndicator("amount")}
                    </TableHead>
                  )}
                  {visibleColumns.balance && (
                    <TableHead className="text-right">Balance Due</TableHead>
                  )}
                  {visibleColumns.actions && (
                    <TableHead className="text-right">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((invoice) => {
                  const balanceDue =
                    invoice.balanceDue ??
                    parseFloat(invoice.amount) - (invoice.amountPaid || 0);

                  return (
                    <TableRow
                      key={invoice.id}
                      className="hover:bg-muted/50 transition"
                    >
                      <TableCell className="font-medium">
                        {invoice.number}
                      </TableCell>
                      {visibleColumns.status && (
                        <TableCell>{invoice.status}</TableCell>
                      )}
                      {visibleColumns.customer && (
                        <TableCell>
                          {invoice.customer?.name || "Unknown"}
                        </TableCell>
                      )}
                      {visibleColumns.dueDate && (
                        <TableCell>{invoice.dueDate?.split("T")[0]}</TableCell>
                      )}
                      {visibleColumns.amount && (
                        <TableCell className="text-right">
                          ${parseFloat(invoice.amount).toFixed(2)}
                        </TableCell>
                      )}
                      {visibleColumns.balance && (
                        <TableCell className="text-right">
                          ${balanceDue.toFixed(2)}
                        </TableCell>
                      )}
                      {visibleColumns.actions && (
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                aria-label="Invoice actions"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {invoice.status === "DRAFT" && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    router.push(
                                      `/dashboard/invoices/edit/${invoice.id}/`
                                    )
                                  }
                                >
                                  Edit
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() =>
                                  window.open(
                                    `/dashboard/invoices/${invoice.id}`,
                                    "_blank"
                                  )
                                }
                              >
                                View Invoice
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  window.open(
                                    `/api/invoices/${invoice.id}/pdf`,
                                    "_blank"
                                  )
                                }
                              >
                                Download PDF
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {pageSize !== "all" && (
              <div className="flex justify-between items-center mt-4">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(-1)}
                  disabled={page <= 1}
                >
                  Previous
                </Button>
                <p>
                  Page {page} of {totalPages}
                </p>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(1)}
                  disabled={page >= totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground mb-4">
              {search
                ? "No invoices match your search."
                : "No invoices found. Create your first invoice!"}
            </p>
            <Button onClick={() => router.push("/dashboard/invoices/new")}>
              New Invoice
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
