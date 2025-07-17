"use client";

import { useParams } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function CustomerPage() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [original, setOriginal] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetch(`/api/customers/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCustomer(data);
        setOriginal(data);
      });
  }, [id]);

  const handleSave = async () => {
    const res = await fetch(`/api/customers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        addressLine1: customer.addressLine1,
        addressLine2: customer.addressLine2,
        city: customer.city,
        state: customer.state,
        postalCode: customer.postalCode,
        country: customer.country,
      }),
    });

    if (res.ok) {
      setIsEditing(false);
      setOriginal(customer);
    }
  };

  const handleCancel = () => {
    setCustomer(original);
    setIsEditing(false);
  };

  if (!customer) return <p className="p-4">Loading customer...</p>;

  const initials = customer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const created = new Date(customer.createdAt);
  const updated = new Date(customer.updatedAt);
  const hasBeenUpdated = created.getTime() !== updated.getTime();

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <Link href="/dashboard/customers" className="inline-block mb-4">
        <Button variant="ghost" className="rounded-none">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Customers
        </Button>
      </Link>

      <Card className="p-6 rounded-none space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-xl font-bold text-white">
            {initials}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{customer.name}</h2>
            <div className="text-sm text-muted-foreground">
              Status:{" "}
              <span className={customer.deleted ? "text-red-500" : "text-green-600"}>
                {customer.deleted ? "Deleted" : "Active"}
              </span>
            </div>
          </div>
          {!isEditing && (
            <Button size="sm" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
          <EditableField
            label="Email"
            value={customer.email}
            isEditing={isEditing}
            onChange={(val) => setCustomer({ ...customer, email: val })}
          />
          <EditableField
            label="Phone"
            value={formatPhone(customer.phone)}
            rawValue={customer.phone}
            isEditing={isEditing}
            onChange={(val) => setCustomer({ ...customer, phone: val })}
          />
          <EditableField
            label="Full Address"
            value={formatFullAddress(customer)}
            rawValue={formatFullAddress(customer)}
            isEditing={isEditing}
            multiline
            onChange={(val) => setCustomer({ ...customer, ...parseAddressInput(val) })}
          />
          <div>
            <span className="text-muted-foreground block">Created</span>
            <span>{formatDate(customer.createdAt)}</span>
          </div>
          {hasBeenUpdated && (
            <div>
              <span className="text-muted-foreground block">Updated</span>
              <span>{formatDate(customer.updatedAt)}</span>
            </div>
          )}
        </div>

        {isEditing && (
          <div className="flex justify-end gap-2 pt-4">
            <Button onClick={handleSave}>Save</Button>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}

function EditableField({ label, value, rawValue, onChange, isEditing, multiline }) {
  const textareaRef = useRef(null);
  const inputValue = isEditing ? (rawValue ?? value ?? "") : (value ?? "");

  useLayoutEffect(() => {
    if (!isEditing || !textareaRef.current) return;
    const el = textareaRef.current;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    requestAnimationFrame(() => {
      try {
        el.setSelectionRange(start, end);
      } catch {}
    });
  }, [inputValue, isEditing]);

  return (
    <div>
      <span className="text-muted-foreground block mb-1">{label}</span>
      {isEditing ? (
        multiline ? (
          <Textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => onChange(e.target.value)}
            className="w-full"
          />
        ) : (
          <Input value={inputValue} onChange={(e) => onChange(e.target.value)} className="w-full" />
        )
      ) : (
        <div className="whitespace-pre-wrap">{typeof value === "string" ? value : <em>N/A</em>}</div>
      )}
    </div>
  );
}

function formatPhone(phone) {
  const digits = (phone || "").replace(/\D/g, "");
  if (digits.length !== 10) return phone || "";
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function formatDate(date) {
  return new Date(date).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatFullAddress(c) {
  const lines = [c.addressLine1, c.addressLine2, [c.city, c.state, c.postalCode].filter(Boolean).join(", "), c.country];
  return lines.filter(Boolean).join("\n");
}

function parseAddressInput(text) {
  const lines = text.split("\n").map((line) => line.trim());
  const [line1, line2, cityStateZip, country] = lines;
  let city = "",
    state = "",
    postalCode = "";
  if (cityStateZip) {
    const parts = cityStateZip.split(",");
    city = parts[0]?.trim();
    const stateZip = parts[1]?.trim().split(" ");
    state = stateZip?.[0] || "";
    postalCode = stateZip?.[1] || "";
  }
  return {
    addressLine1: line1 || "",
    addressLine2: line2 || "",
    city,
    state,
    postalCode,
    country: country || "",
  };
}
