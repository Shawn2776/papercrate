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
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getErrorMessage } from "@/lib/functions/getErrorMessage";
import { Product } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required."),
  price: z
    .string()
    .refine((val) => !isNaN(Number(val)), "Valid price is required."),
  description: z.string().optional(),
  imageUrl: z
    .string()
    .url()
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)),
  unit: z.string().optional(),
  category: z.string().optional(),
  variant: z.string().optional(),
  tags: z.string().optional(), // comma-separated
  stockQuantity: z.coerce.number().int().min(0).optional(),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface AddProductSheetProps {
  onProductCreated?: (product: Pick<Product, "id" | "name" | "price">) => void;
}

interface CreatedProduct {
  id: number;
  name: string;
  price: number;
  sku: string;
  barcode: string;
  qrCodeUrl?: string;
}

export default function AddProductSheet({
  onProductCreated,
}: AddProductSheetProps) {
  const [open, setOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [createdProduct, setCreatedProduct] = useState<CreatedProduct | null>(
    null
  );

  const [formError, setFormError] = useState<string | null>(null);

  const {
    // register,
    handleSubmit,
    reset,
    // formState: { errors, isSubmitting },
    formState: { isSubmitting },
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
      setCreatedProduct(product);
      setSuccessModalOpen(true);
      onProductCreated?.(product);
      reset();
      setOpen(false);
    } catch (err) {
      setFormError(getErrorMessage(err));
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button type="button" variant="outline">
            + Add Product
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-full max-w-sm p-4 overflow-y-auto max-h-screen"
        >
          <SheetHeader>
            <SheetTitle>Add New Product</SheetTitle>
          </SheetHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            {/* form fields (unchanged) */}

            {formError && <p className="text-sm text-red-500">{formError}</p>}

            {/* Sticky Save button */}
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
                  <img
                    src={createdProduct.qrCodeUrl}
                    alt="QR Code"
                    className="w-32 h-32"
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
