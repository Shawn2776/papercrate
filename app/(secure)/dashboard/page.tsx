"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

const mockInvoices = [
  {
    id: "INV-001",
    customer: "XYZ Corp",
    date: "2025-04-08",
    total: "$152.00",
    status: "Paid",
  },
  {
    id: "INV-002",
    customer: "Main Street Office",
    date: "2025-04-05",
    total: "$80.00",
    status: "Paid",
  },
  {
    id: "INV-003",
    customer: "Kootenai Dental",
    date: "2025-04-02",
    total: "$274.00",
    status: "Paid",
  },
  {
    id: "INV-004",
    customer: "Main Street Office",
    date: "2025-03-30",
    total: "$159.00",
    status: "Paid",
  },
  {
    id: "INV-005",
    customer: "Kootenai Dental",
    date: "2025-03-27",
    total: "$209.00",
    status: "Paid",
  },
];

export default function DashboardPage() {
  const router = useRouter();

  return (
    <main className="p-4 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Welcome back, Cathy!</h1>
        <p className="text-muted-foreground">
          Manage your cleaning invoices and clients.
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
          <CardContent className="text-lg font-bold">$0.00</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent className="text-lg font-bold">$865.00</CardContent>
        </Card>
      </div>

      {/* Recent Invoices */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Recent Invoices</h2>
        <div className="space-y-2">
          {mockInvoices.slice(0, 5).map((invoice) => (
            <Card
              key={invoice.id}
              className="cursor-pointer hover:shadow-sm transition"
              onClick={() => router.push(`/dashboard/invoices/${invoice.id}`)}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold">{invoice.customer}</div>
                  <div className="text-sm text-muted-foreground">
                    {invoice.date}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{invoice.total}</div>
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
