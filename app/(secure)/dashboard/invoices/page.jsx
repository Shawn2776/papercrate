"use client";

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
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInvoices } from "@/lib/redux/slices/invoicesSlice";

export default function InvoicesPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const invoices = useSelector((state) => state.invoices.items);
  const loading = useSelector((state) => state.invoices.loading);

  const handleNewInvoice = () => {
    router.push("/dashboard/invoices/new");
  };

  useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch]);

  if (loading) return <p className="p-4">Loading Invoices...</p>;

  return (
    <Card className="rounded-none shadow-sm hover:shadow-md transition max-w-[98%] mx-auto mt-5">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Invoices</CardTitle>
          <Button className="rounded-none" onClick={handleNewInvoice}>
            New Invoice
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {invoices.length > 0 ? (
          <Table>
            <TableCaption>A list of your invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Due</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {invoices.map((invoice) => (
                <TableRow
                  key={invoice.id}
                  className="cursor-pointer hover:bg-muted/50 transition"
                  onClick={() =>
                    router.push(`/dashboard/invoices/${invoice.id}`)
                  }
                >
                  <TableCell className="font-medium">
                    {invoice.number}
                  </TableCell>
                  <TableCell>{invoice.status}</TableCell>
                  <TableCell>{invoice.customer?.name || "Unknown"}</TableCell>
                  <TableCell>{invoice.dueDate?.split("T")[0]}</TableCell>
                  <TableCell className="text-right">
                    ${parseFloat(invoice.amount).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground mb-4">
              No invoices found. Create your first invoice!
            </p>
            <Button onClick={handleNewInvoice}>New Invoice</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
