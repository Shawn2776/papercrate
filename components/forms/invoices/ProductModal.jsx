"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "@/lib/redux/slices/productsSlice";
import { createProductSchema } from "@/lib/schemas/product";
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

export default function ProductModal({ onClose, onSave }) {
  const dispatch = useDispatch();
  const business = useSelector((state) => state.business.item);
  const businessId = business?.id;

  const form = useForm({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      quantity: "",
      unit: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = async (values) => {
    if (!businessId) {
      alert("Missing business ID");
      return;
    }

    try {
      const result = await dispatch(
        createProduct({ ...values, businessId })
      ).unwrap();

      onSave?.(result);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to create product.");
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <Input {...register("name")} placeholder="Product Name" />
          <Input
            {...register("price")}
            type="number"
            step="0.01"
            placeholder="Price"
          />
          <Input
            {...register("quantity")}
            type="number"
            placeholder="Quantity"
          />
          <Input
            {...register("unit")}
            placeholder="Unit (e.g. piece, hour, lb)"
          />
          <Textarea
            {...register("description")}
            placeholder="Description (optional)"
          />

          <DialogFooter className="mt-4">
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
