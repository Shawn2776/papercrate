"use client";

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

export default function DashboardPage() {
  const { user } = useUser();
  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleClick = () => {
    router.push("/dashboard/products/new");
  };

  const handleNewCustomer = () => {
    router.push("/dashboard/customers/new");
  };

  useEffect(() => {
    fetch("/api/business/me")
      .then((res) => {
        if (res.status === 404) {
          router.push("/setup-business");
        } else {
          return res.json();
        }
      })
      .then((data) => {
        if (data) setBusiness(data);
      })
      .catch(() => {
        router.push("/setup-business");
      })
      .finally(() => {
        setLoading(false);
      });

    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });

    fetch("/api/customers")
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data);
      })
      .catch((error) => {
        console.error("Error fetching customers:", error);
      });
  }, [router]);

  if (loading) return <p className="p-4">Loading dashboard...</p>;

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
            <CardTitle>Your Business</CardTitle>
          </CardHeader>
          <CardContent>
            {business ? (
              <>
                <p>
                  <strong>Name:</strong> {business.name}
                </p>
                <p>
                  <strong>Email:</strong> {business.email}
                </p>
                <Button className="mt-4" variant="outline">
                  Edit Business
                </Button>
              </>
            ) : (
              <p>Loading business info...</p>
            )}
          </CardContent>
        </Card>

        {/* Create Invoice */}
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
                    <TableHead className="w-[100px]">Invoice</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>unit</TableHead>
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
                    <TableHead className="w-[100px]">Customer Name</TableHead>
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
                        {customer.address.split("\n").map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
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
      </div>
    </main>
  );
}
