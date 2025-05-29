// app > (secure) > dashboard > invoices > new > page.jsx
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
          }, 500);
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
        {/* ...rest of the header remains unchanged */}
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="p-4">Loading Invoices...</p>
        ) : items.length > 0 ? (
          <>{/* ...rest of the JSX remains unchanged */}</>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground mb-4">
              No invoices found. Create your first invoice!
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
