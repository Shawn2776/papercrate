import { RowData } from "@tanstack/react-table";

// This extends TanStack's ColumnMeta once and cleanly
declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData = unknown, TValue = unknown> {
    className?: string;
  }
}
