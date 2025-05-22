export default function DashboardSkeleton() {
  return (
    <main className="max-w-5xl mx-auto py-12 px-4 space-y-6 animate-pulse">
      <div className="h-6 bg-zinc-300 dark:bg-zinc-700 w-1/3 rounded" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Business Info Skeleton */}
        <div className="p-4 border rounded shadow-sm space-y-3">
          <div className="h-4 bg-zinc-300 dark:bg-zinc-700 w-1/2 rounded" />
          <div className="h-3 bg-zinc-200 dark:bg-zinc-800 w-3/4 rounded" />
          <div className="h-3 bg-zinc-200 dark:bg-zinc-800 w-2/3 rounded" />
          <div className="h-3 bg-zinc-200 dark:bg-zinc-800 w-1/2 rounded" />
        </div>

        {/* Quick Actions Skeleton */}
        <div className="p-4 border rounded shadow-sm space-y-2">
          <div className="h-4 bg-zinc-300 dark:bg-zinc-700 w-1/3 rounded" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded"
              />
            ))}
          </div>
        </div>

        {/* Recent Invoices Skeleton */}
        <div className="sm:col-span-2 lg:col-span-1 p-4 border rounded shadow-sm">
          <div className="h-4 bg-zinc-300 dark:bg-zinc-700 w-1/2 rounded mb-2" />
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 w-full rounded" />
        </div>

        {/* Customers, Products, Services Tables */}
        {["Customers", "Products", "Services"].map((title, i) => (
          <div
            key={title}
            className="sm:col-span-3 p-4 border rounded shadow-sm space-y-2"
          >
            <div className="flex justify-between items-center">
              <div className="h-4 bg-zinc-300 dark:bg-zinc-700 w-1/4 rounded" />
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 w-20 rounded" />
            </div>
            {[...Array(3)].map((_, row) => (
              <div key={row} className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, col) => (
                  <div
                    key={col}
                    className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded"
                  />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}
