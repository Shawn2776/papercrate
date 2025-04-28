"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function CustomerPage() {
  const { id } = useParams();
  const router = useRouter();
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
    const res = await fetch("/api/customers/${id}", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
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

  // const inventoryValue = (product.price * product.quantity).toFixed(2);

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <Link href="/dashboard/customers" className="inline-block mb-4">
        <Button variant="ghost" className="rounded-none">
          <ChevronLeft /> Back to Customers
        </Button>
      </Link>
      <Card className="rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden">
        {/* Header image / emoji */}
        <div className="relative h-36 bg-muted flex items-center justify-center text-6xl">
          <span role="img" aria-label="product">
            {customer.emoji || "🥤"}
          </span>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              className="absolute top-3 right-3 text-xs"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          )}
        </div>

        <CardHeader className="pb-2">
          <CardTitle className="text-xl">
            {isEditing ? (
              <Input
                value={customer.name}
                onChange={(e) =>
                  setCustomer({ ...customer, name: e.target.value })
                }
                required
              />
            ) : (
              customer.name
            )}
          </CardTitle>
          <CardDescription>
            {isEditing ? (
              <Input
                value={customer.email || ""}
                onChange={(e) =>
                  setCustomer({ ...customer, description: e.target.value })
                }
              />
            ) : (
              customer.email || <em className="text-muted">No Email</em>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Price */}
          <div className="flex justify-between">
            <span className="text-muted-foreground font-medium">Phone</span>
            {isEditing ? (
              <Input
                type="text"
                value={
                  customer.phone
                    .replace(/\D/g, "")
                    .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3") || ""
                }
                onChange={(e) =>
                  setCustomer({
                    ...customer,
                    phone: e.target.value || "",
                  })
                }
                className="w-24 text-right"
              />
            ) : (
              <span className="text-right font-medium text-green-600">
                {customer.phone
                  .replace(/\D/g, "")
                  .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3") || (
                  <em className="text-muted">No Phone</em>
                )}
              </span>
            )}
          </div>

          {/* Unit */}
          <div className="flex justify-between">
            <span className="text-muted-foreground font-medium">Address</span>
            {isEditing ? (
              <Input
                value={customer.address || ""}
                onChange={(e) =>
                  setCustomer({ ...customer, address: e.target.value })
                }
                className="w-24 text-right"
              />
            ) : (
              <span className="text-right">{customer.address}</span>
            )}
          </div>

          {/* Quantity */}
          {/* <div className="flex justify-between">
            <span className="text-muted-foreground font-medium">Quantity</span>
            {isEditing ? (
              <Input
                type="number"
                value={product.quantity || 0}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setProduct({
                    ...product,
                    quantity: isNaN(val) ? product.quantity : val,
                  });
                }}
                className="w-24 text-right"
              />
            ) : (
              <span className="text-right">{product.quantity}</span>
            )}
          </div> */}

          {/* Inventory Value */}
          {/* <div className="flex justify-between pt-4 border-t mt-4">
            <span className="font-medium text-muted-foreground">
              Inventory Value
            </span>
            <span className="font-semibold">${inventoryValue}</span>
          </div> */}

          {/* Save / Cancel */}
          {isEditing && (
            <div className="flex justify-end gap-2 pt-4">
              <Button onClick={handleSave}>Save</Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
