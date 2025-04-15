"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import InvoiceSettingsPage from "./invoice-settings/page";
// import PaymentSettingsPage from "../payments/page";
// import AppearanceSettingsPage from "../appearance/page";

export default function SettingsTabs() {
  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-semibold mb-6">Settings</h1>
      <Tabs defaultValue="invoice" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="invoice">Invoice</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="invoice">
          <InvoiceSettingsPage />
        </TabsContent>

        <TabsContent value="payments">
          <div className="p-4 border rounded bg-muted text-sm text-muted-foreground">
            Payment Settings coming soon.
          </div>
        </TabsContent>

        <TabsContent value="appearance">
          <div className="p-4 border rounded bg-muted text-sm text-muted-foreground">
            Appearance Settings coming soon.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
