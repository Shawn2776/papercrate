import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const user = await currentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: {
      memberships: {
        include: {
          tenant: {
            include: {
              InvoiceSettings: true, // ✅ add this
            },
          },
        },
      },
    },
  });

  if (!dbUser || !dbUser.memberships.length) {
    return new Response("No tenants found", { status: 404 });
  }

  const tenants = dbUser.memberships.map((m) => ({
    id: m.tenant.id,
    name: m.tenant.name,
    plan: m.tenant.plan,
    addressLine1: m.tenant.addressLine1,
    addressLine2: m.tenant.addressLine2,
    city: m.tenant.city,
    state: m.tenant.state,
    zip: m.tenant.zip,
    email: m.tenant.email,
    website: m.tenant.website,
    invoicePrefix: m.tenant.invoicePrefix,
    invoiceCounter: m.tenant.invoiceCounter,
    InvoiceSettings: m.tenant.InvoiceSettings ?? [],
  }));

  return Response.json(tenants);
}
