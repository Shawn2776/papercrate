"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { Product } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectCurrentTenant } from "@/lib/redux/slices/tenantSlice";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required."),
  price: z
    .string()
    .refine((val) => !isNaN(Number(val)), "Valid price is required."),
  description: z.string().optional(),
  unit: z.string().optional(),
  stockQuantity: z.coerce.number().int().min(0, "Must be 0 or more").optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface CreatedProduct {
  id: number;
  name: string;
  price: number;
  sku: string;
  barcode: string;
  qrCodeUrl?: string;
}

interface AddProductSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductCreated?: (product: Pick<Product, "id" | "name" | "price">) => void;
}

export default function AddProductSheet({
  open,
  onOpenChange,
  onProductCreated,
}: AddProductSheetProps) {
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [createdProduct, setCreatedProduct] = useState<CreatedProduct | null>(
    null
  );
  const [formError, setFormError] = useState<string | null>(null);
  const tenant = useAppSelector(selectCurrentTenant);

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
        body: JSON.stringify({
          ...data,
          price: parseFloat(data.price),
          tenantId: tenant?.id,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Failed to create product.");
      }

      const product = await res.json();
      setCreatedProduct(product);
      setSuccessModalOpen(true);
      onProductCreated?.(product);
      reset();
      onOpenChange(false);
    } catch (err) {
      setFormError(getErrorMessage(err));
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="w-full max-w-sm p-4 overflow-y-auto max-h-screen"
        >
          <SheetHeader>
            <SheetTitle>Add New Product</SheetTitle>
          </SheetHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="price">Price</Label>
              <Input id="price" {...register("price")} />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input id="description" {...register("description")} />
            </div>

            <div>
              <Label htmlFor="unit">Unit</Label>
              <Input id="unit" {...register("unit")} />
            </div>

            <div>
              <Label htmlFor="stockQuantity">Stock Quantity</Label>
              <Input
                id="stockQuantity"
                type="number"
                {...register("stockQuantity", { valueAsNumber: true })}
              />
              {errors.stockQuantity && (
                <p className="text-sm text-red-500">
                  {errors.stockQuantity.message}
                </p>
              )}
            </div>

            {formError && <p className="text-sm text-red-500">{formError}</p>}

            <div className="sticky bottom-0 bg-white pt-4 pb-6 z-10">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      <Dialog open={successModalOpen} onOpenChange={setSuccessModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Product Created 🎉</DialogTitle>
          </DialogHeader>
          {createdProduct && (
            <div className="space-y-2 text-sm">
              <p>
                <strong>Name:</strong> {createdProduct.name}
              </p>
              <p>
                <strong>SKU:</strong> {createdProduct.sku ?? "Generated"}
              </p>
              <p>
                <strong>Barcode:</strong>{" "}
                {createdProduct.barcode ?? "Generated"}
              </p>
              {createdProduct.qrCodeUrl && (
                <div>
                  <p>
                    <strong>QR Code:</strong>
                  </p>
                  <Image
                    src={createdProduct.qrCodeUrl}
                    alt="QR Code"
                    width={32}
                    height={32}
                  />
                </div>
              )}
            </div>
          )}
          <div className="pt-4 flex justify-end">
            <Button onClick={() => setSuccessModalOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
