import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  console.log("Testing database connection...\n");

  // ── Counts ───────────────────────────────────────────────────────────────
  const [userCount, itemCount, itemTypeCount, collectionCount] =
    await Promise.all([
      prisma.user.count(),
      prisma.item.count(),
      prisma.itemType.count(),
      prisma.collection.count(),
    ]);

  console.log("✓ Connected to Neon PostgreSQL");
  console.log(`  Users:       ${userCount}`);
  console.log(`  Items:       ${itemCount}`);
  console.log(`  Item types:  ${itemTypeCount}`);
  console.log(`  Collections: ${collectionCount}`);

  // ── Demo user ────────────────────────────────────────────────────────────
  const demo = await prisma.user.findUnique({
    where: { email: "demo@devstash.io" },
    include: {
      collections: {
        include: {
          items: {
            include: { item: { include: { itemType: true } } },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!demo) {
    console.log("\n✗ Demo user not found — run npm run db:seed");
    return;
  }

  console.log(`\nDemo user: ${demo.name} <${demo.email}>`);
  console.log(`  isPro: ${demo.isPro}  |  emailVerified: ${demo.emailVerified?.toISOString().slice(0, 10)}`);

  // ── Item types ───────────────────────────────────────────────────────────
  const systemTypes = await prisma.itemType.findMany({
    where: { isSystem: true },
    orderBy: { name: "asc" },
  });

  console.log(`\nSystem item types (${systemTypes.length}):`);
  for (const t of systemTypes) {
    console.log(`  ${t.icon.padEnd(12)} ${t.name.padEnd(10)} ${t.color}`);
  }

  // ── Collections & items ──────────────────────────────────────────────────
  console.log(`\nCollections (${demo.collections.length}):`);
  for (const col of demo.collections) {
    console.log(`\n  📁 ${col.name}`);
    console.log(`     ${col.description}`);
    for (const ic of col.items) {
      const { title, itemType, url } = ic.item;
      const label = url ? ` → ${url}` : "";
      console.log(`     • [${itemType.name}] ${title}${label}`);
    }
  }
}

main()
  .catch((err) => {
    console.error("✗ Database connection failed:", err.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
