// app/error-test/page.jsx
import { prisma } from "@/lib/db"; // adjust path as needed

export const dynamic = "force-dynamic"; // Prevent static generation

export default async function ErrorTestPage() {
  // Simulate a DB error
  await prisma.invoice.findUnique({
    where: { id: "nonexistent-id" },
    rejectOnNotFound: true, // This will throw if not found
  });

  return <div>This should never render.</div>;
}
