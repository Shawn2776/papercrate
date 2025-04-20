"use client";

import {
  useForm,
  useFieldArray,
  Controller,
  SubmitHandler,
} from "react-hook-form";
import { useMemo, useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";

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
  selectTaxRates,
  fetchTaxRates,
} from "@/lib/redux/slices/taxRatesSlice";
import {
  fetchDiscounts,
  selectDiscounts,
} from "@/lib/redux/slices/discountsSlice";
import { fetchStatuses } from "@/lib/redux/slices/statusesSlice";
import { selectCurrentTenant } from "@/lib/redux/slices/tenantSlice";

import AddCustomerSheet from "@/components/customers/AddCustomerSheet";
import AddProductSheet from "@/components/products/AddProductSheet";

import {
  InvoiceFormValues,
  invoiceFormSchema,
} from "@/lib/schemas/invoiceSchema";
import { InvoiceStatus } from "@prisma/client";

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
  const taxRates = useAppSelector(selectTaxRates);
  const discounts = useAppSelector(selectDiscounts);
  const tenant = useAppSelector(selectCurrentTenant);

  useEffect(() => {
    dispatch(fetchCustomers());
    dispatch(fetchProducts());
    dispatch(fetchDiscounts());
    dispatch(fetchTaxRates());
    dispatch(fetchStatuses());
  }, [dispatch]);

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      customerId: "",
      status: InvoiceStatus.PENDING,
      taxRateId: "",
      taxExempt: false,
      lineItems: [{ productId: "", quantity: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lineItems",
  });

  const watchLineItems = watch("lineItems");
  const taxExempt = watch("taxExempt");
  const selectedTaxRateId = watch("taxRateId");

  const productMap = useMemo(() => {
    const mapped = Object.fromEntries(
      products.map((p) => [String(p.id), { ...p, price: Number(p.price) }])
    );
    console.log("📦 Full productMap:", mapped);
    return mapped;
  }, [products]);

  const subtotal: number = useMemo(() => {
    return watchLineItems.reduce((sum: number, item, idx) => {
      const prod = productMap[item.productId];
      const price = typeof prod?.price === "number" ? prod.price : 0;
      return sum + price * item.quantity;
    }, 0);
  }, [watchLineItems, productMap]);

  const taxRate = useMemo(() => {
    if (taxExempt) return 0;
    const rate = taxRates.find((t) => t.id === Number(selectedTaxRateId));
    return rate?.rate ?? 0;
  }, [selectedTaxRateId, taxExempt, taxRates]);

  const tax = (subtotal * taxRate) / 100;
  const balanceDue = subtotal + tax;

  const primaryColor = tenant?.InvoiceSettings?.[0]?.primaryColor ?? "#1E3A8A";

  const submitForm: SubmitHandler<InvoiceFormValues> = (data) => {
    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      className="bg-white text-black max-w-3xl mx-auto p-10 rounded-md shadow-md"
    >
      <div className="flex justify-between border-b pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">
            {tenant?.name ?? "Your Company"}
          </h1>
          {tenant?.addressLine1 && <p>{tenant.addressLine1}</p>}
          {tenant?.addressLine2 && <p>{tenant.addressLine2}</p>}
          {tenant?.city && (
            <p>
              {tenant.city}, {tenant.state} {tenant.zip}
            </p>
          )}
          {tenant?.email && <p>{tenant.email}</p>}
          {tenant?.website && <p>{tenant.website}</p>}
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
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(InvoiceStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="my-6 border-b pb-6">
        <h3 className="font-medium text-muted-foreground mb-1">Bill To:</h3>
        <Controller
          control={control}
          name="customerId"
          render={({ field }) => (
            <Select
              onValueChange={(val) => {
                if (val === "__add_new__") setShowAddCustomer(true);
                else field.onChange(val);
              }}
              value={field.value}
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
                <SelectItem value="__add_new__">➕ Add Customer</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <AddCustomerSheet
        open={showAddCustomer}
        onOpenChange={setShowAddCustomer}
        onCustomerCreated={(newCustomer) => {
          dispatch(addCustomer(newCustomer));
          setValue("customerId", String(newCustomer.id));
        }}
      />

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
            const watchedProductId = watch(`lineItems.${idx}.productId`);
            const quantity = watch(`lineItems.${idx}.quantity`);
            const product = productMap[watchedProductId];
            const unitPrice =
              typeof product?.price === "number" ? product.price : 0;
            const lineTotal = unitPrice * (quantity ?? 0);

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
                        value={field.value}
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
                <td className="p-2 text-right">${lineTotal.toFixed(2)}</td>
                <td className="p-2 text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(idx)}
                    className="text-red-500"
                  >
                    ✕
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <AddProductSheet
        open={showAddProduct}
        onOpenChange={setShowAddProduct}
        onProductCreated={(newProduct) => {
          dispatch(
            addProduct({
              ...newProduct,
              price:
                typeof newProduct.price === "number"
                  ? newProduct.price
                  : Number(newProduct.price),
            })
          );
        }}
      />

      <Button
        type="button"
        onClick={() => append({ productId: "", quantity: 1 })}
        className="mb-4"
      >
        + Add Line Item
      </Button>

      <div className="flex justify-end w-full sm:w-1/2 ml-auto text-sm space-y-2 mt-6">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {!taxExempt && (
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

      <div className="text-center text-muted-foreground text-sm mt-4">
        <p>Thank you for your business!</p>
        <p className="italic">Payment is due upon receipt.</p>
      </div>

      <Button type="submit" disabled={loading} className="w-full mt-6">
        {loading ? "Creating..." : "Create Invoice"}
      </Button>
    </form>
  );
}
