"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MapPin, Mail, Building, Phone, Globe, Plus } from "lucide-react";

import { fetchCustomers } from "@/lib/redux/slices/customersSlice";
import { fetchProducts } from "@/lib/redux/slices/productsSlice";
import { fetchServices } from "@/lib/redux/slices/servicesSlice";
import { fetchBusiness } from "@/lib/redux/slices/businessSlice";
import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";
import { fetchInvoices } from "@/lib/redux/slices/invoicesSlice";

export default function DashboardPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const dispatch = useDispatch();

  // ✅ Pull from Redux
  const business = useSelector((state) => state.business.item);
  const loadingBusiness = useSelector((state) => state.business.loading);

  const customers = useSelector((state) => state.customers.items);
  const loadingCustomers = useSelector((state) => state.customers.loading);

  const products = useSelector((state) => state.products.items);
  const loadingProducts = useSelector((state) => state.products.loading);

  const services = useSelector((state) => state.services.items);
  const loadingServices = useSelector((state) => state.services.loading);

  const invoices = useSelector((state) => state.invoices.items);
  const loading = useSelector((state) => state.invoices.loading);

  const handleNewCustomer = () => router.push("/dashboard/customers/new");
  const handleNewProduct = () => router.push("/dashboard/products/new");
  const handleNewService = () => router.push("/dashboard/services/new");

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    dispatch(fetchBusiness());
    dispatch(fetchCustomers());
    dispatch(fetchProducts());
    dispatch(fetchServices());
    dispatch(fetchInvoices());
  }, [isLoaded, isSignedIn, dispatch]);

  if (!isLoaded || !isSignedIn) return <div className="p-4">Loading...</div>;

  if (
    loadingBusiness ||
    loadingCustomers ||
    loadingProducts ||
    loadingServices
  ) {
    return (
      <div className="p-4">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto py-12 px-4 space-y-6">
      <h1 className="text-2xl font-semibold">
        Welcome,{" "}
        {user?.firstName || user?.primaryEmailAddress?.emailAddress || "there"}!
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Business Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Business</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <Building className="w-4 h-4 mt-1 text-muted-foreground shrink-0" />
              <div className="flex flex-col flex-1 min-w-0">
                <p className="font-medium">{business?.name}</p>
                <p className="text-muted-foreground text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                  {business?.email}
                </p>
              </div>
            </div>

            {business?.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <p>
                  {business.phone
                    ?.replace(/\D/g, "")
                    ?.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")}
                </p>
              </div>
            )}

            {(business?.addressLine1 || business?.city || business?.state) && (
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 text-muted-foreground" />
                <div>
                  <p>
                    {business.addressLine1}
                    {business.addressLine2 ? `, ${business.addressLine2}` : ""}
                  </p>
                  <p>
                    {business.city}, {business.state} {business.postalCode}
                  </p>
                </div>
              </div>
            )}

            {business?.website && (
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <a
                  href={business.website}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {business.website.replace(/^https?:\/\//, "")}
                </a>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => router.push("/dashboard/business/edit")}
              >
                Edit Business
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="flex items-center justify-start gap-2"
                onClick={() => router.push("/dashboard/invoices/new")}
              >
                <Plus className="w-4 h-4" />
                Invoice
              </Button>

              <Button
                variant="outline"
                className="flex items-center justify-start gap-2"
                onClick={handleNewProduct}
              >
                <Plus className="w-4 h-4" />
                Product
              </Button>

              <Button
                variant="outline"
                className="flex items-center justify-start gap-2"
                onClick={handleNewService}
              >
                <Plus className="w-4 h-4" />
                Service
              </Button>

              <Button
                variant="outline"
                className="flex items-center justify-start gap-2"
                onClick={handleNewCustomer}
              >
                <Plus className="w-4 h-4" />
                Customer
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Invoices */}
        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            {invoices.length > 0 ? (
              <Table>
                <TableCaption>Recent invoices.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.slice(0, 5).map((invoice) => (
                    <TableRow
                      key={invoice.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() =>
                        router.push(`/dashboard/invoices/${invoice.id}`)
                      }
                    >
                      <TableCell>{invoice.number}</TableCell>
                      <TableCell className="capitalize text-sm">
                        {invoice.status.toLowerCase().replace("_", " ")}
                      </TableCell>
                      <TableCell className="text-right">
                        ${Number(invoice.amount).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/dashboard/invoices/new")}
              >
                Create Your First Invoice
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Customer List */}
        <Card className="sm:col-span-3">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Customers</CardTitle>
              <Button
                variant="outline"
                className="rounded-none hover:bg-gray-100"
                onClick={() => router.push("/dashboard/customers")}
              >
                All Customers
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {customers.length > 0 ? (
              <Table>
                <TableCaption>Recent customers.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead className="text-right">Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>
                        {customer.phone
                          ? customer.phone
                              .replace(/\D/g, "")
                              .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")
                          : ""}
                      </TableCell>
                      <TableCell className="text-right">
                        {customer.address.split("\n").map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Button onClick={handleNewCustomer}>Add Customer</Button>
            )}
          </CardContent>
        </Card>

        {/* Product List */}
        <Card className="sm:col-span-3">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Products</CardTitle>
              <Button
                variant="outline"
                className="rounded-none hover:bg-gray-100"
                onClick={() => router.push("/dashboard/products")}
              >
                All Products
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {products.length > 0 ? (
              <Table>
                <TableCaption>Recent products.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow
                      key={product.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() =>
                        router.push(`/dashboard/products/${product.id}`)
                      }
                    >
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.description}</TableCell>
                      <TableCell>{product.unit}</TableCell>
                      <TableCell className="text-right">
                        ${product.price}
                      </TableCell>
                      <TableCell className="text-right">
                        {product.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        ${(product.price * product.quantity).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Button onClick={handleNewProduct}>Add Product</Button>
            )}
          </CardContent>
        </Card>

        {/* Services List */}
        <Card className="sm:col-span-3">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Services</CardTitle>
              <Button
                variant="outline"
                className="rounded-none hover:bg-gray-100"
                onClick={() => router.push("/dashboard/services")}
              >
                All Services
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {services.length > 0 ? (
              <Table>
                <TableCaption>Recent services.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead className="text-right">Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow
                      key={service.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() =>
                        router.push(`/dashboard/services/${service.id}`)
                      }
                    >
                      <TableCell>{service.name}</TableCell>
                      <TableCell>{service.description}</TableCell>
                      <TableCell>{service.unit}</TableCell>
                      <TableCell className="text-right">
                        ${service.rate}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Button onClick={handleNewService}>Add Service</Button>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
