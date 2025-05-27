import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export function useNextInvoiceNumber() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/invoices/next-number",
    fetcher,
    {
      refreshInterval: 30000, // Auto-refresh every 30 seconds
      revalidateOnFocus: true,
    }
  );

  return {
    invoiceNumber: data?.invoiceNumber ?? "(loading...)",
    isLoading,
    isError: !!error,
    refresh: mutate, // optional: force refresh
  };
}
