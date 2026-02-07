import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient() {
  // If we are in Cloudflare Pages and have the D1 database binding
  const d1 = (process.env as any).khybershawls;

  if (d1) {
    const adapter = new PrismaD1(d1);
    return new PrismaClient({ adapter });
  }

  // Fallback for local development: use LibSQL adapter with file-based SQLite
  // PrismaClient without a driver adapter cannot run on edge runtime
  const client = createClient({ url: process.env.DATABASE_URL || "file:./dev.db" });
  const adapter = new PrismaLibSQL(client);
  return new PrismaClient({ adapter });
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/** Optional helper to assert env presence when you want */
export function ensurePrismaClient(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not set. Add it to .env.local (and .env for CLI) and restart the dev server."
    );
  }
  return prisma;
}

export default prisma;
