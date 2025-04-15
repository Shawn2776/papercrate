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
import { getErrorMessage } from "@/lib/functions/getErrorMessage";

const customerSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Valid email is required."),
  phone: z.string().min(1, "Phone is required."),
  address: z.string().optional(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

export interface AddCustomerSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCustomerCreated: (newCustomer: { id: number; name: string }) => void;
}

export default function AddCustomerSheet({
  onCustomerCreated,
}: AddCustomerSheetProps) {
  const [open, setOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
  });

  const onSubmit = async (data: CustomerFormData) => {
    setFormError(null);
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Failed to create customer.");
      }

      const customer = await res.json();
      onCustomerCreated?.(customer);
      reset();
      setOpen(false);
    } catch (err) {
      setFormError(getErrorMessage(err));
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button type="button" variant="outline">
          + Add Customer
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px]">
        <SheetHeader>
          <SheetTitle>Add New Customer</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input type="email" {...register("email")} />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input type="tel" {...register("phone")} />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input {...register("address")} />
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
