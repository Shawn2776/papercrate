"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCustomerSchema } from "@/lib/schemas/customer";
import { useDispatch, useSelector } from "react-redux";
import { createCustomer } from "@/lib/redux/slices/customersSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { z } from "zod";

export default function CustomerModal({ onClose, onSave }) {
  const dispatch = useDispatch();
  const business = useSelector((state) => state.business.item);
  const businessId = business?.id;

  const form = useForm({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      notes: "",
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = form;

  const onSubmit = async (values) => {
    if (!businessId) {
      alert("Missing business ID.");
      return;
    }

    try {
      const result = await dispatch(
        createCustomer({ ...values, businessId })
      ).unwrap();

      onSave?.(result);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to create customer.");
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input {...register("name")} placeholder="Name" />
            <Input {...register("email")} placeholder="Email" />
            <Input {...register("phone")} placeholder="Phone" />
            <Input {...register("addressLine1")} placeholder="Address Line 1" />
            <Input {...register("addressLine2")} placeholder="Address Line 2" />
            <Input {...register("city")} placeholder="City" />
            <Input {...register("state")} placeholder="State" />
            <Input {...register("postalCode")} placeholder="Postal Code" />
            <Input {...register("country")} placeholder="Country" />
            <Textarea
              {...register("notes")}
              placeholder="Notes"
              className="col-span-2"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
