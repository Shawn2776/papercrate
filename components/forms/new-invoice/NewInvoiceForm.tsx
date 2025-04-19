// Full file: NewInvoiceForm.tsx

"use client";

import { useEffect, useState, useMemo } from "react";
import {
  useForm,
  useFieldArray,
  Controller,
  SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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
import { fetchStatuses } from "@/lib/redux/slices/statusesSlice";

import {
  invoiceFormSchema,
  InvoiceFormValues,
} from "@/lib/schemas/invoiceSchema";
import { InvoiceStatus } from "@prisma/client";
import { selectCurrentTenant } from "@/lib/redux/slices/tenantSlice";

interface Props {
  onSubmit: (data: InvoiceFormValues) => void;
  loading?: boolean;
}

export default function NewInvoiceForm({ onSubmit, loading }: Props) {
  const dispatch = useAppDispatch();
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [productRowIndex, setProductRowIndex] = useState<number | null>(null);

  const customers = useAppSelector(selectCustomers);
  const products = useAppSelector(selectProducts);
  const discounts = useAppSelector(selectDiscounts);
  const taxRates = useAppSelector(selectTaxRates);
  const currentTenant = useAppSelector(selectCurrentTenant);

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

  const { fields, append } = useFieldArray({ control, name: "lineItems" });

  const isTaxExempt = watch("taxExempt");
  const selectedTaxRateId = watch("taxRateId") ?? "";
  const lineItems = watch("lineItems");

  const productMap = useMemo(
    () =>
      Object.fromEntries(
        products.map((p) => [String(p.id), { ...p, price: Number(p.price) }])
      ),
    [products]
  );

  const subtotal = useMemo(() => {
    return lineItems.reduce((sum, item) => {
      const prod = productMap[String(item.productId)];
      const price = typeof prod?.price === "number" ? prod.price : 0;
      return sum + price * item.quantity;
    }, 0);
  }, [lineItems, productMap]);

  const taxRate = useMemo(() => {
    if (isTaxExempt) return 0;
    const rate = taxRates.find((t) => t.id === +selectedTaxRateId);
    return rate ? Number(rate.rate) : 0;
  }, [selectedTaxRateId, isTaxExempt, taxRates]);

  const tax = (subtotal * taxRate) / 100;
  const balanceDue = subtotal + tax;

  const primaryColor =
    currentTenant?.InvoiceSettings?.[0]?.primaryColor ?? "#1E3A8A";

  const submitForm: SubmitHandler<InvoiceFormValues> = (data) => {
    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      className="bg-white text-black max-w-3xl mx-auto p-10 rounded-md shadow-md print:bg-transparent print:shadow-none print:p-0"
    >
      <div className="flex justify-between border-b pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">
            {currentTenant?.name ?? "Your Company"}
          </h1>
          {currentTenant?.addressLine1 && <p>{currentTenant.addressLine1}</p>}
          {currentTenant?.addressLine2 && <p>{currentTenant.addressLine2}</p>}
          {currentTenant?.city && (
            <p>
              {currentTenant.city}, {currentTenant.state} {currentTenant.zip}
            </p>
          )}
          {currentTenant?.email && <p>{currentTenant.email}</p>}
          {currentTenant?.website && <p>{currentTenant.website}</p>}
        </div>
        <div className="text-right space-y-1">
          <p className="text-lg font-semibold" style={{ color: primaryColor }}>
            INVOICE
          </p>
          <p className="text-sm">Date: {new Date().toLocaleDateString()}</p>
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
      </div>

      <table className="w-full text-sm border-t mb-6">
        <thead>
          <tr
            className="bg-primary text-white"
            style={{ backgroundColor: primaryColor }}
          >
            <th className="p-2">Description</th>
            <th className="p-2">Qty</th>
            <th className="p-2">Unit Price</th>
            <th className="p-2">Discount</th>
            <th className="p-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field, idx) => {
            const prod = productMap[String(field.productId)];
            const unitPrice = typeof prod?.price === "number" ? prod.price : 0;
            const total = unitPrice * field.quantity;

            return (
              <tr key={field.id}>
                <td className="p-2">
                  <Controller
                    control={control}
                    name={`lineItems.${idx}.productId`}
                    render={({ field }) => (
                      <Select
                        onValueChange={(val) => {
                          if (val === "__add_new__") {
                            setProductRowIndex(idx);
                            setShowAddProduct(true);
                          } else field.onChange(val);
                        }}
                        value={field.value ?? undefined}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((p) => (
                            <SelectItem key={p.id} value={String(p.id)}>
                              {p.name}
                            </SelectItem>
                          ))}
                          <SelectItem value="__add_new__">
                            ➕ Add Product
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </td>
                <td className="p-2">
                  <Input
                    {...register(`lineItems.${idx}.quantity`, {
                      valueAsNumber: true,
                    })}
                    type="number"
                    min={1}
                  />
                </td>
                <td className="p-2">${unitPrice.toFixed(2)}</td>
                <td className="p-2">--</td>
                <td className="p-2 text-right">${total.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex justify-end text-sm space-y-2 mt-6">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {!isTaxExempt && (
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>${tax.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold text-base border-t pt-2">
            <span>Balance Due:</span>
            <span>${balanceDue.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold mb-2 text-muted-foreground">
          Special Notes & Instructions
        </h3>
        <Textarea
          {...register("specialNotes")}
          placeholder="Write a thank-you note, payment terms, or special instructions..."
          className="min-h-[100px]"
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full mt-6">
        {loading ? "Creating..." : "Create Invoice"}
      </Button>
    </form>
  );
}
