import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Interface for Cloudflare Env
interface CloudflareEnv {
  DB: D1Database;
}

function createPrismaClient() {
  // Check if we are running in a Cloudflare Worker environment with D1
  // This is a bit tricky in Next.js, often we might need to rely on process.env or context
  // But for now, let's keep it standard. If on Edge/Worker, we expect D1.

  // NOTE: Next.js + Prisma + D1 has specific setup requirements.
  // We'll stick to standard Prisma Client for now, but prepare for D1 if passed.

  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"],
  });
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/** Optional helper to assert env presence when you want */
export function ensurePrismaClient(): PrismaClient {
  // In D1 context, DATABASE_URL might just be a placeholder
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL is not set. This might be fine if using D1 binding directly, otherwise check .env");
  }
  return prisma;
}

export default prisma;
