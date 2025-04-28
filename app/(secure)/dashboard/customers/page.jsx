"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function CustomersPage() {
  const { user } = useUser();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleNewCustomer = () => {
    router.push("/dashboard/customers/new");
  };

  useEffect(() => {
    fetch("/api/customers")
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data);
      })
      .catch((error) => {
        console.error("Error fetching customers:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-4">Loading Customers...</p>;

  return (
    <Card className="rounded-2xl shadow-sm hover:shadow-md transition max-w-2xl mx-auto mt-5">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Customers</CardTitle>
          <Button className="rounded-none" onClick={handleNewCustomer}>
            Add Customer
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {customers.length > 0 ? (
          <Table>
            <TableCaption>A list of your customers.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                {/* <TableHead>Description</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Inventory Value</TableHead> */}
              </TableRow>
            </TableHeader>

            <TableBody>
              {customers.map((customer) => (
                <TableRow
                  key={customer.id}
                  className="cursor-pointer hover:bg-muted/50 transition"
                  onClick={() =>
                    router.push(`/dashboard/customers/${customer.id}`)
                  }
                >
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  {/* <TableCell>{product.description}</TableCell>
                  <TableCell>{product.unit}</TableCell>
                  <TableCell className="text-right">
                    ${Number(product.price).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    {product.quantity}
                  </TableCell>
                  <TableCell className="text-right">
                    ${(product.price * product.quantity).toFixed(2)}
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground mb-4">
              No customers found. Add your first customer!
            </p>
            <Button onClick={handleNewCustomer}>Add Customer</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
