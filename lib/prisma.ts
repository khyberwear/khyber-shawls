import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getRequestContext } from "@cloudflare/next-on-pages";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Interface for Cloudflare Env
// Note: We use D1Database from @cloudflare/workers-types
interface CloudflareEnv {
  DB: D1Database;
}

function createPrismaClient() {
  try {
    // Only attempt to access request context if running on edge/worker runtime
    // or if the environment suggests we are in a CF context
    if (process.env.NODE_ENV === 'production' || process.env.NEXT_RUNTIME === 'edge') {
      const ctx = getRequestContext();
      if (ctx.env && ctx.env.DB) {
        // Use adapter for D1
        const adapter = new PrismaD1(ctx.env.DB);
        return new PrismaClient({ adapter });
      }
    }
  } catch (err) {
    // Ignore context errors during build/dev if context is missing
  }

  // Fallback to standard client (works for local dev with sqlite if set up, or with no adapter)
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"],
  });
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/** Optional helper to assert env presence when you want */
export function ensurePrismaClient(): PrismaClient {
  // Relaxed check: warns but doesn't throw, allowing D1 usage where DATABASE_URL is dummy
  if (!process.env.DATABASE_URL && process.env.NODE_ENV === 'development') {
    console.warn("DATABASE_URL is not set. If using D1 locally via wrangler dev, ensure proper config.");
  }
  return prisma;
}

export default prisma;
