'use client';

import { UserButton, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MapPin, Mail, Building, Phone, Globe } from "lucide-react";

export default function DashboardPage() {
  const { user } = useUser();
  const router = useRouter();

  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [loadingBusiness, setLoadingBusiness] = useState(true);
  const [loadingData, setLoadingData] = useState(true);

  const handleClick = () => {
    router.push("/dashboard/products/new");
  };

  const handleNewCustomer = () => {
    router.push("/dashboard/customers/new");
  };

  // Fetch business info
  useEffect(() => {
    async function fetchBusiness() {
      try {
        const res = await fetch("/api/business");
        if (res.status === 404) {
          router.push("/setup-business");
          return;
        }
        const data = await res.json();
        console.log("📦 Business data from API:", data);
        setBusiness(data);
      } catch (error) {
        console.error("Error fetching business:", error);
        router.push("/setup-business");
      } finally {
        setLoadingBusiness(false);
      }
    }

    fetchBusiness();
  }, [router]);

  // Fetch products and customers
  useEffect(() => {
    async function fetchProductsAndCustomers() {
      try {
        const [productsRes, customersRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/customers"),
        ]);

        if (!productsRes.ok || !customersRes.ok) {
          throw new Error("Failed to fetch products or customers");
        }

        const productsData = await productsRes.json();
        const customersData = await customersRes.json();

        setProducts(productsData);
        setCustomers(customersData);
      } catch (error) {
        console.error("Error fetching products/customers:", error);
      } finally {
        setLoadingData(false);
      }
    }

    fetchProductsAndCustomers();
  }, []);

  if (loadingBusiness || loadingData) {
    return <p className="p-4">Loading dashboard...</p>;
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
            {/* Name & Email */}
            <div className="flex items-start gap-2">
              <Building className="w-4 h-4 mt-1 text-muted-foreground" />
              <div>
                <p className="font-medium">{business.name}</p>
                <p className="text-muted-foreground">{business.email}</p>
              </div>
            </div>

            {/* Phone */}
            {business.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <p>
                  {business.phone
                    .replace(/\D/g, "")
                    .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")}
                </p>
              </div>
            )}

            {/* Address */}
            {(business.addressLine1 || business.city || business.state) && (
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

            {/* Website */}
            {business.website && (
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

            {/* Edit Button */}
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
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="default">
              Create Invoice
            </Button>
          </CardContent>
        </Card>

        {/* Recent Invoices */}
        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <p>No invoices yet.</p>
          </CardContent>
        </Card>

        {/* Product List */}
        <Card className="sm:col-span-3">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Products</CardTitle>
              <Button
                variant="outline"
                className="rounded-none hover:cursor-pointer hover:bg-gray-100"
                onClick={handleClick}
              >
                Add Product
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {products.length > 0 ? (
              <Table>
                <TableCaption>A list of your recent products.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow
                      key={product.id}
                      className="cursor-pointer hover:bg-muted/50 transition"
                      onClick={() =>
                        router.push(`/dashboard/products/${product.id}`)
                      }
                    >
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
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
              <p>
                <Button onClick={handleClick}>Add Product</Button>
              </p>
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
                className="rounded-none hover:cursor-pointer hover:bg-gray-100"
                onClick={handleNewCustomer}
              >
                Add Customer
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {customers.length > 0 ? (
              <Table>
                <TableCaption>A list of your recent customers.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead className="text-right">Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">
                        {customer.name}
                      </TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>
                        {customer.phone
                          .replace(/\D/g, "")
                          .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")}
                      </TableCell>
                      <TableCell className="text-right">
                        {customer.billingAddressLine1}, {customer.billingCity},{" "}
                        {customer.billingState}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p>
                <Button onClick={handleNewCustomer}>Add Customer</Button>
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
