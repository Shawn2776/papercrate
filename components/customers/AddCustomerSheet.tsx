// components/customers/AddCustomerSheet.tsx
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
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  customerSchema,
  CustomerFormValues,
} from "@/lib/schemas/customerSchema";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { NormalizedCustomer } from "@/lib/types";

import { useAppSelector } from "@/lib/redux/hooks";
import { selectCurrentTenant } from "@/lib/redux/slices/tenantSlice";

export interface AddCustomerSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCustomerCreated: (customer: NormalizedCustomer) => void;
}

export default function AddCustomerSheet({
  open,
  onOpenChange,
  onCustomerCreated,
}: AddCustomerSheetProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const tenant = useAppSelector(selectCurrentTenant);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
  });

  const onSubmit = async (data: CustomerFormValues) => {
    setFormError(null);
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          tenantId: tenant?.id,
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      const customer: NormalizedCustomer = await res.json();
      onCustomerCreated(customer);
      reset();
      onOpenChange(false);
    } catch (err) {
      setFormError(getErrorMessage(err));
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[500px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add New Customer</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <Input {...register("name")} />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" {...register("email")} />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="col-span-2">
              <Label>Phone</Label>
              <Input type="tel" {...register("phone")} />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label className="text-muted-foreground text-sm">
              Billing Address
            </Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <Input
                {...register("billingAddressLine1")}
                placeholder="Address Line 1"
              />
              <Input
                {...register("billingAddressLine2")}
                placeholder="Address Line 2"
              />
              <Input {...register("billingCity")} placeholder="City" />
              <Input {...register("billingState")} placeholder="State" />
              <Input {...register("billingZip")} placeholder="ZIP" />
            </div>
          </div>

          <div>
            <Label className="text-muted-foreground text-sm">
              Shipping Address
            </Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <Input
                {...register("shippingAddressLine1")}
                placeholder="Address Line 1"
              />
              <Input
                {...register("shippingAddressLine2")}
                placeholder="Address Line 2"
              />
              <Input {...register("shippingCity")} placeholder="City" />
              <Input {...register("shippingState")} placeholder="State" />
              <Input {...register("shippingZip")} placeholder="ZIP" />
            </div>
          </div>

          <div>
            <Label>Notes</Label>
            <Textarea
              {...register("notes")}
              placeholder="Additional info, comments, etc."
              rows={3}
            />
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
