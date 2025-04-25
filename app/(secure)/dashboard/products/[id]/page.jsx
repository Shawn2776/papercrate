"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [original, setOriginal] = useState(null); // for cancel
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
      setOriginal(product); // save the current state
    }
  };

  const handleCancel = () => {
    setProduct(original); // revert to saved version
    setIsEditing(false);
  };

  if (!product) return <p className="p-4">Loading product...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>
            <h1>
              <label className="block text-sm font-medium mb-1 sr-only">
                Product Name
              </label>
              {isEditing ? (
                <Input
                  value={product.name}
                  onChange={(e) =>
                    setProduct({ ...product, name: e.target.value })
                  }
                  required
                />
              ) : (
                <p>{product.name}</p>
              )}
            </h1>
          </CardTitle>
          <CardDescription>
            <div>
              <label className="block text-sm font-medium mb-1 sr-only">
                Description
              </label>
              {isEditing ? (
                <Input
                  value={product.description || ""}
                  onChange={(e) =>
                    setProduct({ ...product, description: e.target.value })
                  }
                />
              ) : (
                <p>{product.description || <em>No description</em>}</p>
              )}
            </div>
          </CardDescription>
          <CardContent>
            {/* PRICE */}
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium mb-1">PRICE</label>
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
                  required
                />
              ) : (
                <p>${product.price}</p>
              )}
            </div>

            {/* UNIT */}
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium mb-1">UNIT</label>
              {isEditing ? (
                <Input
                  value={product.unit}
                  onChange={(e) =>
                    setProduct({ ...product, unit: e.target.value })
                  }
                  required
                />
              ) : (
                <p>{product.unit}</p>
              )}
            </div>

            {/* QUANTITY */}
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium mb-1">QUANTITY</label>
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
                  required
                />
              ) : (
                <p>{product.quantity}</p>
              )}
            </div>

            {/* ACTION BUTTONS */}
            {isEditing ? (
              <div className="flex gap-4">
                <Button type="button" onClick={handleSave}>
                  Save
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="text-muted-foreground"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
            )}
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
}
