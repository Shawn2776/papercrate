// lib/hooks/useBusiness.ts
import useSWR from "swr";

const fetcher = (url) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch business");
    return res.json();
  });

export function useBusiness() {
  const { data, error, isLoading, mutate } = useSWR("/api/business", fetcher);

  return {
    business: data,
    isLoading,
    isError: !!error,
    error,
    mutate, // useful to revalidate after a PATCH
  };
}
