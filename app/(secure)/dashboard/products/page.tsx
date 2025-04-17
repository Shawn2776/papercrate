"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  fetchProducts,
  selectProducts,
  selectProductsLoading,
  selectProductsError,
} from "@/lib/redux/slices/productsSlice";
import { ProductDataTable } from "@/components/tables/product-data-table/ProductDataTable";
import { selectUserPermissions } from "@/lib/redux/slices/authSlice";
import { columns } from "@/components/tables/product-data-table/columns";

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const loading = useAppSelector(selectProductsLoading);
  const error = useAppSelector(selectProductsError);
  const userPermissions = useAppSelector(selectUserPermissions);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Products</h1>

      {loading && <p className="text-muted">Loading...</p>}
      {error && <p className="text-destructive">Error: {error}</p>}

      <ProductDataTable
        columns={columns}
        data={products}
        userPermissions={userPermissions ?? []}
      />
    </div>
  );
}
