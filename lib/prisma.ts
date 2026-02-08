/// <reference types="@cloudflare/workers-types" />
import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getRequestContext } from "@cloudflare/next-on-pages";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Define a local interface for the environment bindings
interface Env {
  DB: any; // Using any here to avoid issues if D1Database is not globally typed yet
}

function createPrismaClient() {
  try {
    // Only attempt to access request context if running in an environment that supports it
    // getRequestContext() throws if not in a Cloudflare environment
    const ctx = getRequestContext() as unknown as { env: Env };

    if (ctx && ctx.env && ctx.env.DB) {
      console.log("Using Cloudflare D1 adapter");
      const adapter = new PrismaD1(ctx.env.DB);
      return new PrismaClient({ adapter });
    }
  } catch (err) {
    // Fallback if getRequestContext fails (expected in local dev/standard node)
  }

  // Fallback to standard client
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"],
  });
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/** Optional helper to assert env presence when you want */
export function ensurePrismaClient(): PrismaClient {
  return prisma;
}

export default prisma;
