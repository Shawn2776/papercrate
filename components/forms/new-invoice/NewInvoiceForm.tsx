"use client";

import { useState, useEffect } from "react";
import {
  useForm,
  useFieldArray,
  Controller,
  SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import AddCustomerSheet from "@/components/customers/AddCustomerSheet";
import AddProductSheet from "@/components/products/AddProductSheet";
import {
  invoiceFormSchema,
  InvoiceFormValues,
  Customer,
  Product,
  Discount,
  TaxRate,
} from "@/lib/schemas";

interface Props {
  customers: Customer[];
  products: Product[];
  discounts: Discount[];
  taxRates: TaxRate[];
  statuses: string[];
  onSubmit: (data: InvoiceFormValues) => void;
  loading?: boolean;
}

export default function NewInvoiceForm({
  customers,
  products,
  discounts,
  taxRates,
  statuses,
  onSubmit,
  loading,
}: Props) {
  const [customerList, setCustomerList] = useState(customers);
  const [productList, setProductList] = useState(products);

  const {
    control,
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      customerId: "",
      status: statuses[0] || "PENDING",
      lineItems: [{ productId: "", quantity: 1, discountId: "" }],
      taxRateId: "",
      taxExempt: false,
      taxExemptId: "",
    },
  });

  const { fields, append } = useFieldArray({
    control,
    name: "lineItems",
  });

  const isTaxExempt = watch("taxExempt");

  const submitForm: SubmitHandler<InvoiceFormValues> = (data) => {
    onSubmit(data);
  };

  useEffect(() => {
    setCustomerList(customers);
  }, [customers]);

  useEffect(() => {
    setProductList(products);
  }, [products]);

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      className="space-y-8 max-w-4xl mx-auto p-8 bg-muted/50 shadow-lg rounded-xl"
    >
      <h2 className="text-2xl font-semibold mb-6">New Invoice</h2>

      {/* Customer */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="font-medium">Customer</label>
          <AddCustomerSheet
            onCustomerCreated={(newCustomer) => {
              setCustomerList((prev) => [...prev, newCustomer]);
              setValue("customerId", String(newCustomer.id));
            }}
          />
        </div>
        <Controller
          control={control}
          name="customerId"
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              value={field.value ?? undefined}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select customer" />
              </SelectTrigger>
              <SelectContent>
                {customerList.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.customerId && (
          <p className="text-red-500 text-sm mt-1">
            {errors.customerId.message}
          </p>
        )}
      </div>

      {/* Line Items */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Line Items</h3>
          <AddProductSheet
            onProductCreated={(newProduct) =>
              setProductList((prev) => [...prev, newProduct])
            }
          />
        </div>

        {fields.map((field, idx) => (
          <div key={field.id} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Controller
              control={control}
              name={`lineItems.${idx}.productId`}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? undefined}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Product" />
                  </SelectTrigger>
                  <SelectContent>
                    {productList.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            <Input
              {...register(`lineItems.${idx}.quantity`, {
                valueAsNumber: true,
              })}
              type="number"
              min={1}
              placeholder="Qty"
            />

            <Controller
              control={control}
              name={`lineItems.${idx}.discountId`}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? undefined}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Discount" />
                  </SelectTrigger>
                  <SelectContent>
                    {discounts.map((d) => (
                      <SelectItem key={d.id} value={String(d.id)}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        ))}

        <Button
          type="button"
          onClick={() => append({ productId: "", quantity: 1, discountId: "" })}
        >
          + Add Line Item
        </Button>
      </div>

      {/* Tax Section */}
      <div className="pt-4 border-t">
        <label className="font-medium">Tax Options</label>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            {...register("taxExempt")}
            className="size-4"
          />
          <span>Invoice is tax-exempt</span>
        </div>

        {isTaxExempt ? (
          <Input
            {...register("taxExemptId")}
            placeholder="Exemption Certificate or Business Tax ID"
          />
        ) : (
          <Controller
            control={control}
            name="taxRateId"
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value ?? undefined}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tax rate" />
                </SelectTrigger>
                <SelectContent>
                  {taxRates.map((t) => (
                    <SelectItem key={t.id} value={String(t.id)}>
                      {t.name} ({t.rate}%)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        )}
      </div>

      {/* Status */}
      <div>
        <label className="font-medium">Status</label>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              value={field.value ?? undefined}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s.replace(/_/g, " ").toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Creating..." : "Create Invoice"}
      </Button>
    </form>
  );
}
