"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required."),
  price: z
    .string()
    .refine((val) => !isNaN(Number(val)), "Valid price is required."),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  imageUrl: z.string().optional(),
  description: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface AddProductSheetProps {
  onProductCreated?: (product: any) => void;
}

export default function AddProductSheet({
  onProductCreated,
}: AddProductSheetProps) {
  const [open, setOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = async (data: ProductFormData) => {
    setFormError(null);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, price: parseFloat(data.price) }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Failed to create product.");
      }

      const product = await res.json();
      onProductCreated?.(product);
      reset();
      setOpen(false);
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button type="button" variant="outline">
          + Add Product
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px]">
        <SheetHeader>
          <SheetTitle>Add New Product</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="price">Price</Label>
            <Input type="number" step="0.01" {...register("price")} />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="sku">SKU</Label>
            <Input {...register("sku")} />
          </div>

          <div>
            <Label htmlFor="barcode">Barcode</Label>
            <Input {...register("barcode")} />
          </div>

          <div>
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input {...register("imageUrl")} />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input {...register("description")} />
          </div>

          {formError && <p className="text-sm text-red-500">{formError}</p>}

          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
