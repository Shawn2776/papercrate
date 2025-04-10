"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import {
  fetchInvoices,
  selectInvoices,
  selectInvoicesError,
  selectInvoicesLoading,
} from "@/lib/redux/slices/invoicesSlice";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@clerk/nextjs";

export default function DashboardPage() {
  const { user } = useUser();

  const firstName = user?.firstName || "there";

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const invoices = useSelector(selectInvoices);
  const loading = useSelector(selectInvoicesLoading);
  const error = useSelector(selectInvoicesError);

  useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch]);

  const thisMonthTotal = invoices
    .filter((inv) => {
      const date = new Date(inv.createdAt);
      const now = new Date();
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, inv) => sum + Number(inv.amount.replace(/[^0-9.-]+/g, "")), 0)
    .toFixed(2);

  const unpaidTotal = invoices
    .filter((inv) => inv.status !== "Paid")
    .reduce((sum, inv) => sum + Number(inv.amount.replace(/[^0-9.-]+/g, "")), 0)
    .toFixed(2);

  return (
    <main className="p-4 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">
          Welcome back{firstName ? `, ${firstName}` : ""}!
        </h1>
        <p className="text-muted-foreground">
          Manage your invoices and clients.
        </p>
      </div>

      <Button
        className="w-full text-lg py-6"
        onClick={() => router.push("/dashboard/invoices/new")}
      >
        + Create Invoice
      </Button>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Unpaid Total
            </CardTitle>
          </CardHeader>
          <CardContent className="text-lg font-bold">
            ${unpaidTotal}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent className="text-lg font-bold">
            ${thisMonthTotal}
          </CardContent>
        </Card>
      </div>

      {/* Recent Invoices */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Recent Invoices</h2>

        {loading && (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        )}

        {error && (
          <p className="text-sm text-red-500">
            Error loading invoices: {error}
          </p>
        )}

        {!loading && !error && invoices.length === 0 && (
          <p className="text-sm text-muted-foreground">No invoices found.</p>
        )}

        <div className="space-y-2">
          {invoices.slice(0, 5).map((invoice) => (
            <Card
              key={invoice.id}
              className="cursor-pointer hover:shadow-sm transition"
              onClick={() => router.push(`/dashboard/invoices/${invoice.id}`)}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold">
                    {invoice.customer || "Unknown"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(invoice.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{invoice.amount}</div>
                  <Badge
                    variant={
                      invoice.status === "Paid" ? "default" : "destructive"
                    }
                  >
                    {invoice.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
