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
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/lib/redux/slices/productsSlice";

export default function ProductsPage() {
  const { user } = useUser();
  const router = useRouter();
  const dispatch = useDispatch();

  const products = useSelector((state) => state.products.items);
  const loading = useSelector((state) => state.products.loading);

  const handleNewProduct = () => {
    router.push("/dashboard/products/new");
  };

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) return <p className="p-4">Loading Products...</p>;

  return (
    <Card className="rounded-none shadow-sm hover:shadow-md transition max-w-[98%] mx-auto mt-5">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Products</CardTitle>
          <Button className="rounded-none" onClick={handleNewProduct}>
            Add Product
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {products.length > 0 ? (
          <Table>
            <TableCaption>A list of your products.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Inventory Value</TableHead>
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
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{product.unit}</TableCell>
                  <TableCell className="text-right">
                    ${Number(product.price).toFixed(2)}
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
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground mb-4">
              No products found. Add your first product!
            </p>
            <Button onClick={handleNewProduct}>Add Product</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
