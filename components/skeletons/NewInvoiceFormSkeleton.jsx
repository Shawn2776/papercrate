import { Skeleton } from "@/components/ui/skeleton";

export default function NewInvoiceFormSkeleton() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Business + Invoice Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-8 w-32" />
      </div>

      {/* Bill To + Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      {/* Line Items */}
      <div>
        <Skeleton className="h-10 w-full mb-2" />
        {[...Array(2)].map((_, i) => (
          <div key={i} className="grid grid-cols-5 gap-2 mb-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full col-span-2" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
        <Skeleton className="h-10 w-32 mt-2" />
      </div>

      {/* Totals */}
      <div className="text-right space-y-2">
        <Skeleton className="h-5 w-40 ml-auto" />
        <Skeleton className="h-5 w-48 ml-auto" />
        <Skeleton className="h-6 w-52 ml-auto" />
      </div>

      {/* Terms & Submit */}
      <div>
        <Skeleton className="h-24 w-full mb-4" />
        <Skeleton className="h-10 w-36 ml-auto" />
      </div>
    </div>
  );
}
