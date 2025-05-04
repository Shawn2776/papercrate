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
import { useDispatch, useSelector } from "react-redux";
import { fetchServices } from "@/lib/redux/slices/servicesSlice";

export default function ServicesPage() {
  const { user } = useUser();
  const router = useRouter();
  const dispatch = useDispatch();

  const handleNewService = () => {
    router.push("/dashboard/services/new");
  };

  const services = useSelector((state) => state.services.items);
  const loading = useSelector((state) => state.services.loading);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  if (loading) return <p className="p-4">Loading Services...</p>;

  return (
    <Card className="rounded-none shadow-sm hover:shadow-md transition max-w-[98%] mx-auto mt-5">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Services</CardTitle>
          <Button className="rounded-none" onClick={handleNewService}>
            Add Service
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {services.length > 0 ? (
          <Table>
            <TableCaption>A list of your services.</TableCaption>
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
                  className="cursor-pointer hover:bg-muted/50 transition"
                  onClick={() =>
                    router.push(`/dashboard/services/${service.id}`)
                  }
                >
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>{service.description}</TableCell>
                  <TableCell>{service.unit}</TableCell>
                  <TableCell className="text-right">
                    ${Number(service.rate).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground mb-4">
              No services found. Add your first service!
            </p>
            <Button onClick={handleNewService}>Add Service</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
