"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  fetchInvoiceProducts,
  fetchProducts,
  selectProducts,
  selectProductsError,
  selectProductsLoading,
} from "@/lib/redux/slices/productsSlice";
import { selectCurrentTenant } from "@/lib/redux/slices/tenantSlice";
import { ProductDataTable } from "@/components/tables/product-data-table/ProductDataTable";
import { selectUserPermissions } from "@/lib/redux/slices/authSlice";

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const tenant = useAppSelector(selectCurrentTenant);
  const loading = useAppSelector(selectProductsLoading);
  const error = useAppSelector(selectProductsError);
  const userPermissions = useAppSelector(selectUserPermissions);

  useEffect(() => {
    if (tenant?.id) dispatch(fetchInvoiceProducts(tenant.id));
  }, [dispatch, tenant?.id]);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Products</h1>

      {loading && <p className="text-muted">Loading...</p>}
      {error && <p className="text-destructive">Error: {error}</p>}

      <ProductDataTable data={products} userPermissions={userPermissions} />
    </div>
  );
}
