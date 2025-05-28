"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProductSchema } from "@/lib/schemas/product";
import { createServiceSchema } from "@/lib/schemas/service";
import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "@/lib/redux/slices/productsSlice";
import { createService } from "@/lib/redux/slices/servicesSlice";

export default function AddProductServiceModal({ onClose, onSave }) {
  const dispatch = useDispatch();
  const businessId = useSelector((state) => state.business.item?.id);
  const [tab, setTab] = useState("product");

  const productForm = useForm({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      quantity: "",
      unit: "",
    },
  });

  const serviceForm = useForm({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      name: "",
      description: "",
      rate: "",
      unit: "",
    },
  });

  const handleProductSubmit = async (values) => {
    if (!businessId) return alert("Missing business ID");
    try {
      const result = await dispatch(
        createProduct({ ...values, businessId })
      ).unwrap();
      onSave?.(result);
      onClose();
    } catch (err) {
      alert("Failed to create product");
    }
  };

  const handleServiceSubmit = async (values) => {
    if (!businessId) return alert("Missing business ID");
    try {
      const result = await dispatch(
        createService({ ...values, businessId })
      ).unwrap();
      onSave?.(result);
      onClose();
    } catch (err) {
      alert("Failed to create service");
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Product or Service</DialogTitle>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="product">Product</TabsTrigger>
            <TabsTrigger value="service">Service</TabsTrigger>
          </TabsList>

          <TabsContent value="product">
            <form
              onSubmit={productForm.handleSubmit(handleProductSubmit)}
              className="space-y-3"
            >
              <Input {...productForm.register("name")} placeholder="Name" />
              <Input
                {...productForm.register("price")}
                type="number"
                step="0.01"
                placeholder="Price"
              />
              <Input
                {...productForm.register("quantity")}
                type="number"
                placeholder="Quantity"
              />
              <Input
                {...productForm.register("unit")}
                placeholder="Unit (e.g. piece, lb)"
              />
              <Textarea
                {...productForm.register("description")}
                placeholder="Description (optional)"
              />
              <DialogFooter>
                <Button type="submit">Save Product</Button>
              </DialogFooter>
            </form>
          </TabsContent>

          <TabsContent value="service">
            <form
              onSubmit={serviceForm.handleSubmit(handleServiceSubmit)}
              className="space-y-3"
            >
              <Input {...serviceForm.register("name")} placeholder="Name" />
              <Input
                {...serviceForm.register("rate")}
                type="number"
                step="0.01"
                placeholder="Rate"
              />
              <Input
                {...serviceForm.register("unit")}
                placeholder="Unit (e.g. hour, job)"
              />
              <Textarea
                {...serviceForm.register("description")}
                placeholder="Description (optional)"
              />
              <DialogFooter>
                <Button type="submit">Save Service</Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
