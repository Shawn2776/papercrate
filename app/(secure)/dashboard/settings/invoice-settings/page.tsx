"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useHasPermission } from "@/lib/functions/userHasPermission";
import { Permission } from "@prisma/client";
import { toast } from "sonner";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectCurrentTenant } from "@/lib/redux/slices/tenantSlice";
import { getErrorMessage } from "@/lib/functions/getErrorMessage";

interface Settings {
  layout: "modern" | "classic" | "minimal";
  primaryColor: string;
  includeCustomerInfo: boolean;
  includePaymentTerms: boolean;
  includeDueDate: boolean;
  includeNotes: boolean;
  defaultNotes: string;
}

export default function InvoiceSettingsPage() {
  const router = useRouter();
  const hasPermission = useHasPermission(Permission.MANAGE_BILLING);
  const { permissions, loading: authLoading } = useAppSelector(
    (state) => state.auth
  );
  const currentTenant = useAppSelector(selectCurrentTenant);
  const activeTenantId = currentTenant?.id;

  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    layout: "modern",
    primaryColor: "#3b82f6",
    includeCustomerInfo: true,
    includePaymentTerms: true,
    includeDueDate: true,
    includeNotes: true,
    defaultNotes: "",
  });

  useEffect(() => {
    if (authLoading || !hasPermission || !activeTenantId) return;

    const fetchSettings = async () => {
      console.log("🔎 Fetching for tenant:", activeTenantId);

      try {
        console.log("Fetching settings for tenant:", activeTenantId);
        const res = await fetch("/api/tenant/invoice-settings", {
          headers: {
            "x-tenant-id": activeTenantId,
          },
        });

        if (!res.ok) {
          const contentType = res.headers.get("content-type") || "";
          const errorMessage = contentType.includes("application/json")
            ? (await res.json()).error
            : await res.text();

          console.error("Fetch failed:", res.status, errorMessage);
          throw new Error(errorMessage || "Failed to load settings");
        }

        const data = await res.json();
        console.log("Loaded invoice settings:", data);
        setSettings((prev) => ({ ...prev, ...data }));
      } catch (err) {
        console.error("Failed to fetch invoice settings", err);
      }
    };

    fetchSettings();
  }, [hasPermission, authLoading, activeTenantId]);

  const handleChange = <K extends keyof Settings>(
    field: K,
    value: Settings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!activeTenantId) return;
    setLoading(true);

    const isValidHex = /^#[0-9a-fA-F]{6}$/.test(settings.primaryColor);
    if (!isValidHex) {
      toast.error(
        "Primary color must be a valid 6-digit hex color (e.g., #3b82f6)"
      );
      setLoading(false);
      return;
    }

    try {
      console.log("Submitting settings:", settings);
      const res = await fetch("/api/tenant/invoice-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-tenant-id": activeTenantId,
        },
        body: JSON.stringify(settings),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Error saving settings", error);
        throw new Error("Failed to update settings");
      }

      toast.success("Invoice settings updated!");
      router.refresh();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  if (!hasPermission) {
    return (
      <div className="max-w-xl mx-auto mt-20 text-center">
        <h2 className="text-xl font-semibold">Access Denied</h2>
        <p className="text-muted-foreground mt-2">
          You don’t have permission to view or update invoice settings.
        </p>
      </div>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto mt-10">
      <CardHeader>
        <h2 className="text-2xl font-semibold">Invoice Settings</h2>
        <p className="text-muted-foreground text-sm">
          Customize the appearance and fields of your invoices
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Invoice Style</Label>
          <Select
            value={settings.layout}
            onValueChange={(val) =>
              handleChange("layout", val as Settings["layout"])
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="modern">Modern</SelectItem>
              <SelectItem value="classic">Classic</SelectItem>
              <SelectItem value="minimal">Minimal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Primary Color</Label>
          <div className="flex items-center gap-2">
            <Input
              type="color"
              value={settings.primaryColor}
              onChange={(e) => handleChange("primaryColor", e.target.value)}
              className="w-12 h-12 p-0 border rounded"
            />
            <span>{settings.primaryColor}</span>
          </div>
        </div>

        <div className="grid gap-2">
          <Label className="flex items-center justify-between">
            Include Customer Info
            <Switch
              checked={settings.includeCustomerInfo}
              onCheckedChange={(val) =>
                handleChange("includeCustomerInfo", val)
              }
            />
          </Label>
          <Label className="flex items-center justify-between">
            Include Payment Terms
            <Switch
              checked={settings.includePaymentTerms}
              onCheckedChange={(val) =>
                handleChange("includePaymentTerms", val)
              }
            />
          </Label>
          <Label className="flex items-center justify-between">
            Include Due Date
            <Switch
              checked={settings.includeDueDate}
              onCheckedChange={(val) => handleChange("includeDueDate", val)}
            />
          </Label>
          <Label className="flex items-center justify-between">
            Include Notes Section
            <Switch
              checked={settings.includeNotes}
              onCheckedChange={(val) => handleChange("includeNotes", val)}
            />
          </Label>
        </div>

        <div>
          <Label htmlFor="defaultNotes">Default Notes</Label>
          <textarea
            id="defaultNotes"
            value={settings.defaultNotes}
            onChange={(e) => handleChange("defaultNotes", e.target.value)}
            rows={4}
            className="w-full mt-1 p-2 border rounded-md bg-background text-sm"
            placeholder="Thank you for your business! Payment due in 15 days."
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-4"
        >
          {loading ? "Saving..." : "Save Settings"}
        </Button>
      </CardContent>
    </Card>
  );
}
