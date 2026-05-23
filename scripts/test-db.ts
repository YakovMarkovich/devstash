import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  console.log("Testing database connection...");

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
}

main()
  .catch((err) => {
    console.error("✗ Database connection failed:", err.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
