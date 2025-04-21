"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useState, useMemo, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { InvoiceStatus } from "@prisma/client";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  selectCustomers,
  addCustomer,
  fetchInvoiceCustomers,
} from "@/lib/redux/slices/customersSlice";
import {
  selectProducts,
  addProduct,
  fetchInvoiceProducts,
} from "@/lib/redux/slices/productsSlice";
import { selectCurrentTenant } from "@/lib/redux/slices/tenantSlice";

import AddCustomerSheet from "@/components/customers/AddCustomerSheet";
import AddProductSheet from "@/components/products/AddProductSheet";

import {
  InvoiceFormValues,
  invoiceFormSchema,
} from "@/lib/schemas/invoiceSchema";

interface Props {
  onSubmit: (data: InvoiceFormValues) => void;
  loading?: boolean;
}

export default function UpdatedNewInvoiceForm({ onSubmit, loading }: Props) {
  const dispatch = useAppDispatch();
  const customers = useAppSelector(selectCustomers);
  const products = useAppSelector(selectProducts);
  const tenant = useAppSelector(selectCurrentTenant);

  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [productRowIndex, setProductRowIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!tenant?.id) return;
    dispatch(fetchInvoiceCustomers(tenant.id));
    dispatch(fetchInvoiceProducts(tenant.id));
  }, [dispatch, tenant?.id]);

  const {
    control,
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      customerId: "",
      status: InvoiceStatus.PENDING,
      invoiceDate: new Date().toISOString(),
      lineItems: [{ productId: "", quantity: 1 }],
      notes: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lineItems",
  });

  const watchLineItems = watch("lineItems");
  const invoiceDate = watch("invoiceDate");

  const productMap = useMemo(() => {
    return Object.fromEntries(
      products.map((p) => [String(p.id), { ...p, price: Number(p.price) }])
    );
  }, [products]);

  const subtotal = useMemo(() => {
    return watchLineItems.reduce((sum, item) => {
      const product = productMap[item.productId];
      const price = product?.price || 0;
      return sum + price * item.quantity;
    }, 0);
  }, [watchLineItems, productMap]);

  const primaryColor = tenant?.InvoiceSettings?.[0]?.primaryColor ?? "#1E3A8A";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white text-black max-w-3xl mx-auto p-10 rounded-md shadow-md space-y-10"
    >
      {/* Header */}
      <div className="flex justify-between border-b pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">
            {tenant?.name ?? "Your Company"}
          </h1>
          {tenant?.addressLine1 && <p>{tenant.addressLine1}</p>}
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
          <p className="text-sm">Invoice #: (auto-generated)</p>
          <div className="flex flex-col items-end gap-2">
            <Controller
              control={control}
              name="invoiceDate"
              render={({ field }) => (
                <Input
                  type="date"
                  value={field.value?.split("T")[0] ?? ""}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) =>
                    field.onChange(new Date(e.target.value).toISOString())
                  }
                />
              )}
            />
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-32">
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
      </div>

      {/* Customer */}
      <div className="border-b pb-6">
        <h3 className="font-semibold text-muted-foreground mb-1">Bill To</h3>
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

      {/* Line Items */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border mb-6">
          <thead>
            <tr className="bg-blue-900 text-white">
              <th className="p-2 w-6"></th>
              <th className="p-2 text-left">Description</th>
              <th className="p-2 text-left w-20">Qty</th>
              <th className="p-2 text-left">Unit Price</th>
              <th className="p-2 text-left">Discount</th>
              <th className="p-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, idx) => {
              const product = productMap[field.productId];
              const quantity = watch(`lineItems.${idx}.quantity`);
              const unitPrice = product?.price ?? 0;
              const lineTotal = unitPrice * quantity;

              return (
                <tr key={field.id}>
                  <td className="p-2 w-6">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(idx)}
                    >
                      <TrashIcon className="h-4 w-4 text-destructive" />
                    </Button>
                  </td>
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
                  <td className="p-2 w-20">
                    <Input
                      type="number"
                      min={1}
                      {...register(`lineItems.${idx}.quantity`, {
                        valueAsNumber: true,
                      })}
                    />
                  </td>
                  <td className="p-2">${unitPrice.toFixed(2)}</td>
                  <td className="p-2">--</td>
                  <td className="p-2 text-right">${lineTotal.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Button
        type="button"
        onClick={() => append({ productId: "", quantity: 1 })}
      >
        + Add Line Item
      </Button>

      {/* Totals & Notes */}
      <div className="mt-10 flex justify-between w-full">
        <div className="w-full">
          <div className="flex flex-col w-full gap-6 pr-10 mt-5 h-full">
            <div className="w-full flex flex-col">
              <h3 className="text-sm font-semibold mb-2 text-muted-foreground">
                Special Notes & Instructions
              </h3>
              <Textarea
                rows={4}
                {...register("notes")}
                placeholder="Write a thank-you note, payment terms, or special instructions..."
              />
            </div>
          </div>
        </div>
        <div className="w-full sm:w-1/2 space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax:</span>
            <span>$0.00</span>
          </div>
          <div className="flex justify-between font-semibold text-base border-t pt-2">
            <span>Balance Due:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="text-center text-muted-foreground text-sm mt-4">
        <p>Thank you for your business!</p>
        <p className="italic">Payment is due upon receipt.</p>
      </div>

      <Button type="submit" className="w-full mt-6" disabled={loading}>
        {loading ? "Creating..." : "Create Invoice"}
      </Button>

      <AddCustomerSheet
        open={showAddCustomer}
        onOpenChange={setShowAddCustomer}
        onCustomerCreated={(newCustomer) => {
          dispatch(addCustomer(newCustomer));
          setValue("customerId", String(newCustomer.id));
        }}
      />

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
          if (productRowIndex !== null) {
            setValue(
              `lineItems.${productRowIndex}.productId`,
              String(newProduct.id)
            );
            setProductRowIndex(null);
          }
        }}
      />
    </form>
  );
}
