"use client";

import { useEffect, useState } from "react";
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

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  fetchCustomers,
  selectCustomers,
  addCustomer,
} from "@/lib/redux/slices/customersSlice";
import {
  fetchProducts,
  selectProducts,
  addProduct,
} from "@/lib/redux/slices/productsSlice";
import {
  fetchDiscounts,
  selectDiscounts,
} from "@/lib/redux/slices/discountsSlice";
import {
  fetchTaxRates,
  selectTaxRates,
} from "@/lib/redux/slices/taxRatesSlice";
import {
  fetchStatuses,
  selectStatuses,
} from "@/lib/redux/slices/statusesSlice";

import { invoiceFormSchema, InvoiceFormValues } from "@/lib/schemas/invoice";
import { InvoiceStatus } from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  onSubmit: (data: InvoiceFormValues) => void;
  loading?: boolean;
}

type AddProductSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductCreated: (product: {
    id: number;
    name: string;
    price: number;
    // add other fields if needed
  }) => void;
};

export default function NewInvoiceForm({ onSubmit, loading }: Props) {
  const dispatch = useAppDispatch();

  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [productRowIndex, setProductRowIndex] = useState<number | null>(null);

  const customers = useAppSelector(selectCustomers);
  const products = useAppSelector(selectProducts);
  const discounts = useAppSelector(selectDiscounts);
  const taxRates = useAppSelector(selectTaxRates);
  const statuses = useAppSelector(selectStatuses);

  useEffect(() => {
    dispatch(fetchCustomers());
    dispatch(fetchProducts());
    dispatch(fetchDiscounts());
    dispatch(fetchTaxRates());
    dispatch(fetchStatuses());
  }, [dispatch]);

  const {
    control,
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      customerId: "",
      status: InvoiceStatus.PENDING,
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

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      className="space-y-8 max-w-4xl mx-auto p-8 bg-muted/50 shadow-lg rounded-xl"
    >
      <h2 className="text-2xl font-semibold mb-6">New Invoice</h2>

      {/* Customer */}
      <div>
        <label className="font-medium mb-2 block">Customer</label>
        <Controller
          control={control}
          name="customerId"
          render={({ field }) => (
            <Select
              onValueChange={(val) => {
                if (val === "__add_new__") {
                  setShowAddCustomer(true);
                } else {
                  field.onChange(val);
                }
              }}
              value={field.value ?? undefined}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
                <SelectItem value="__add_new__">➕ Add New Customer</SelectItem>
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

      <AddCustomerSheet
        open={showAddCustomer}
        onOpenChange={setShowAddCustomer}
        onCustomerCreated={(newCustomer) => {
          dispatch(addCustomer(newCustomer));
          setValue("customerId", String(newCustomer.id));
        }}
      />

      {/* Line Items */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Line Items</h3>

        {fields.map((field, idx) => (
          <div key={field.id} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Controller
              control={control}
              name={`lineItems.${idx}.productId`}
              render={({ field }) => (
                <Select
                  onValueChange={(val) => {
                    if (val === "__add_new__") {
                      setProductRowIndex(idx);
                      setShowAddProduct(true);
                    } else {
                      field.onChange(val);
                    }
                  }}
                  value={field.value ?? undefined}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="__add_new__">
                      ➕ Add New Product
                    </SelectItem>
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

      <AddProductSheet
        open={showAddProduct}
        onOpenChange={setShowAddProduct}
        onProductCreated={(newProduct) => {
          const parsedProduct = {
            ...newProduct,
            price:
              typeof newProduct.price === "number"
                ? newProduct.price
                : parseFloat(newProduct.price.toString()),
          };

          dispatch(addProduct(parsedProduct));

          if (productRowIndex !== null) {
            setValue(
              `lineItems.${productRowIndex}.productId`,
              String(parsedProduct.id)
            );
            setProductRowIndex(null);
          }
        }}
      />

      {/* Tax */}
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
                {Object.values(InvoiceStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.replace(/_/g, " ").toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Special Notes */}
      <div>
        <label className="font-medium block mb-1">
          Special Notes & Instructions
        </label>
        <Textarea
          {...register("specialNotes")}
          placeholder="Write a thank-you note, payment terms, or special instructions..."
          className="min-h-[100px]"
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Creating..." : "Create Invoice"}
      </Button>
    </form>
  );
}
