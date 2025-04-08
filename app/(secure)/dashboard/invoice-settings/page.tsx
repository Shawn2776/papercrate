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

interface Settings {
  layout: "modern" | "classic" | "minimal";
  primaryColor: string;
  includeCustomerInfo: boolean;
  includePaymentTerms: boolean;
  includeDueDate: boolean;
  includeNotes: boolean;
}

export default function InvoiceSettingsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    layout: "modern",
    primaryColor: "#3b82f6",
    includeCustomerInfo: true,
    includePaymentTerms: true,
    includeDueDate: true,
    includeNotes: true,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/tenant/invoice-settings");
        if (!res.ok) throw new Error("Failed to load settings");
        const data = await res.json();
        setSettings((prev) => ({ ...prev, ...data }));
      } catch (err) {
        console.error("Failed to fetch invoice settings", err);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = <K extends keyof Settings>(
    field: K,
    value: Settings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch("/api/tenant/invoice-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setLoading(false);

    if (res.ok) {
      router.refresh();
    } else {
      const error = await res.json();
      console.error("Error saving settings", error);
    }
  };

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
          <Input
            type="color"
            value={settings.primaryColor}
            onChange={(e) => handleChange("primaryColor", e.target.value)}
            className="w-20 h-10 p-0 border-none"
          />
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
