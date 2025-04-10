import { PrismaClient } from "@prisma/client";
import slugify from "slugify";

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();

  for (const product of products) {
    if (!product.slug) {
      const base = slugify(product.name, { lower: true, strict: true });
      const tenantSlug = `${base}-${product.id}`;
      await prisma.product.update({
        where: { id: product.id },
        data: { slug: tenantSlug },
      });
      console.log(`Slug set for product ${product.name}: ${tenantSlug}`);
    }
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
