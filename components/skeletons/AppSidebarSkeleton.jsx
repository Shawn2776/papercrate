export default function AppSidebarSkeleton() {
  return (
    <div className="w-64 h-screen border-r bg-white dark:bg-zinc-900 p-4 space-y-4 animate-pulse">
      <div className="h-6 bg-zinc-300 dark:bg-zinc-700 rounded w-1/2" />
      <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
      <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3" />

      <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6 mt-8" />
      <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
      <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3" />

      <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4 mt-8" />
      <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3" />
    </div>
  );
}
