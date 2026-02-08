/// <reference types="@cloudflare/workers-types" />
import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getRequestContext } from "@cloudflare/next-on-pages";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * A bridge to allow Vercel to talk to Cloudflare D1 via HTTP API.
 */
class D1HttpBridge {
  constructor(
    private accountId: string,
    private databaseId: string,
    private apiToken: string
  ) { }

  private async fetchD1(sql: string, params: any[] = []) {
    try {
      const res = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/d1/database/${this.databaseId}/query`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.apiToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sql, params }),
          // Vercel/Node environment might need a shorter timeout
          signal: AbortSignal.timeout(10000),
        }
      );

      const data = (await res.json()) as any;
      if (!data.success) {
        console.error("D1 Bridge Query Failed:", data.errors);
        throw new Error(`D1 API Error: ${data.errors?.[0]?.message || "Unknown error"}`);
      }

      const result = data.result[0];
      return {
        results: result.results || [],
        success: result.success,
        meta: result.meta || {},
      };
    } catch (err: any) {
      console.error("D1 Bridge Fetch Error:", err.message);
      throw err;
    }
  }

  prepare(sql: string) {
    const fetcher = this.fetchD1.bind(this);
    return {
      bind: (...params: any[]) => ({
        all: () => fetcher(sql, params),
        run: () => fetcher(sql, params),
        first: async () => {
          const res = await fetcher(sql, params);
          return res.results[0];
        },
        raw: async () => {
          const res = await fetcher(sql, params);
          return res.results.map((r: any) => Object.values(r));
        }
      }),
    };
  }

  async batch(statements: any[]) {
    // For batching, Cloudflare D1 API expects an array or we can loop
    // But keeping it simple for Prisma compatibility
    const results = [];
    for (const stmt of statements) {
      results.push(await this.fetchD1(stmt.sql, stmt.params));
    }
    return results;
  }

  async exec(sql: string) {
    return this.fetchD1(sql);
  }
}

function createPrismaClient() {
  try {
    // 1. Try Native D1 (Cloudflare Pages/Workers)
    const ctx = getRequestContext() as any;
    if (ctx && ctx.env && ctx.env.DB) {
      const adapter = new PrismaD1(ctx.env.DB);
      return new PrismaClient({ adapter });
    }
  } catch (e) {
    // Expected to fail in Vercel/Node
  }

  // 2. Try HTTP Bridge (Vercel)
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.CLOUDFLARE_DATABASE_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  // Mask sensitive token in logs
  if (accountId && databaseId && apiToken) {
    const maskedToken = apiToken.substring(0, 4) + "****" + apiToken.substring(apiToken.length - 4);
    console.log(`Connecting to D1 via Bridge (Account: ${accountId}, DB: ${databaseId}, Token: ${maskedToken})`);
    const bridge = new D1HttpBridge(accountId, databaseId, apiToken);
    const adapter = new PrismaD1(bridge as any);
    return new PrismaClient({ adapter });
  }

  // 3. Fallback to local SQLite (requires DATABASE_URL)
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"],
  });
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/** Optional helper to assert env presence */
export function ensurePrismaClient(): PrismaClient {
  return prisma;
}

export default prisma;
