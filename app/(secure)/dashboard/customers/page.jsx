"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomers } from "@/lib/redux/slices/customersSlice";

export default function CustomersPage() {
  const { user } = useUser();
  const router = useRouter();
  const dispatch = useDispatch();

  const customers = useSelector((state) => state.customers.items);
  const loading = useSelector((state) => state.customers.loading);

  const handleNewCustomer = () => {
    router.push("/dashboard/customers/new");
  };

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  if (loading) return <p className="p-4">Loading Customers...</p>;

  return (
    <Card className="shadow-sm hover:shadow-md transition max-w-[98%] mx-auto mt-5 rounded-none">
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
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
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
                  onClick={() => router.push(`/dashboard/customers/${customer.id}`)}
                >
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>
                    <Link
                      href={`mailto:${customer.email}`}
                      onClick={(e) => e.stopPropagation()}
                      className="hover:text-blue-500 "
                    >
                      {customer.email}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`tel:${customer.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="hover:text-blue-500 "
                    >
                      {customer.phone.replace(/\D/g, "").replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {customer.addressLine1 && <p>{customer.addressLine1}</p>}
                    {customer.addressLine2 && <p>{customer.addressLine2}</p>}
                    {(customer.city || customer.state || customer.postalCode) && (
                      <p>{[customer.city, customer.state, customer.postalCode].filter(Boolean).join(", ")}</p>
                    )}
                    {customer.country && <p>{customer.country}</p>}
                  </TableCell>

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
            <p className="text-muted-foreground mb-4">No customers found. Add your first customer!</p>
            <Button onClick={handleNewCustomer}>Add Customer</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
