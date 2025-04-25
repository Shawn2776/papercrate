"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user } = useUser();
  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleClick = () => {
    router.push("/customers/new");
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
        <Card className="sm:col-span-2">
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>
            {products.length > 0 ? (
              <ul className="space-y-2">
                {products.map((product) => (
                  <li key={product.id}>
                    <strong>{product.name}</strong> – ${product.price}
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                <Button onClick={handleClick}>Add Product</Button>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Customer List */}
        <Card className="sm:col-span-2">
          <CardHeader>
            <CardTitle>Customers</CardTitle>
          </CardHeader>
          <CardContent>
            {customers.length > 0 ? (
              <ul className="space-y-2">
                {customers.map((customer) => (
                  <li key={customer.id}>
                    <strong>{customer.name}</strong> –{" "}
                    {customer.email || "No email"}
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                <Button onClick={handleClick}>Add Customer</Button>
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
