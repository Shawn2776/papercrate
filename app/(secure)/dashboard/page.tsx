import { prisma } from "@/lib/prisma";
import { getDbUserOrRedirect } from "@/lib/functions/getDbUserOrRedirect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const user = await getDbUserOrRedirect();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">
        Welcome back, {user.name || "there"}!
      </h1>
      <p className="text-muted-foreground">Here’s your latest activity.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Invoices</CardTitle>
          </CardHeader>
          <CardContent>Coming soon</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>Coming soon</CardContent>
        </Card>
      </div>
    </div>
  );
}
