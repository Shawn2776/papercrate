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

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [original, setOriginal] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setOriginal(data);
      });
  }, [id]);

  const handleSave = async () => {
    const res = await fetch("/api/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        unit: product.unit,
        quantity: product.quantity,
      }),
    });

    if (res.ok) {
      setIsEditing(false);
      setOriginal(product);
    }
  };

  const handleCancel = () => {
    setProduct(original);
    setIsEditing(false);
  };

  if (!product) return <p className="p-4">Loading product...</p>;

  const inventoryValue = (product.price * product.quantity).toFixed(2);

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <Card className="rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden">
        {/* Header image / emoji */}
        <div className="relative h-36 bg-muted flex items-center justify-center text-6xl">
          <span role="img" aria-label="product">
            {product.emoji || "🥤"}
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
                value={product.name}
                onChange={(e) =>
                  setProduct({ ...product, name: e.target.value })
                }
                required
              />
            ) : (
              product.name
            )}
          </CardTitle>
          <CardDescription>
            {isEditing ? (
              <Input
                value={product.description || ""}
                onChange={(e) =>
                  setProduct({ ...product, description: e.target.value })
                }
              />
            ) : (
              product.description || (
                <em className="text-muted">No description</em>
              )
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Price */}
          <div className="flex justify-between">
            <span className="text-muted-foreground font-medium">Price</span>
            {isEditing ? (
              <Input
                type="number"
                step="0.01"
                value={product.price || 0}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-24 text-right"
              />
            ) : (
              <span className="text-right font-medium text-green-600">
                ${Number(product.price).toFixed(2)}
              </span>
            )}
          </div>

          {/* Unit */}
          <div className="flex justify-between">
            <span className="text-muted-foreground font-medium">Unit</span>
            {isEditing ? (
              <Input
                value={product.unit}
                onChange={(e) =>
                  setProduct({ ...product, unit: e.target.value })
                }
                className="w-24 text-right"
              />
            ) : (
              <span className="text-right">{product.unit}</span>
            )}
          </div>

          {/* Quantity */}
          <div className="flex justify-between">
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
          </div>

          {/* Inventory Value */}
          <div className="flex justify-between pt-4 border-t mt-4">
            <span className="font-medium text-muted-foreground">
              Inventory Value
            </span>
            <span className="font-semibold">${inventoryValue}</span>
          </div>

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
