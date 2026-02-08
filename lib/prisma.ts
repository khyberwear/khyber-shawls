/// <reference types="@cloudflare/workers-types" />
import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getRequestContext } from "@cloudflare/next-on-pages";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * A bridge to allow Vercel to talk to Cloudflare D1 via HTTP API.
 * This implements the D1Database interface expected by Prisma.
 */
class D1HttpBridge {
  constructor(
    private accountId: string,
    private databaseId: string,
    private apiToken: string
  ) { }

  private async fetchD1(sql: string, params: any[] = []) {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/d1/database/${this.databaseId}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sql, params }),
      }
    );

    const data = (await res.json()) as any;
    if (!data.success) {
      throw new Error(`D1 HTTP Error: ${JSON.stringify(data.errors)}`);
    }
    // D1 API returns an array of results for batch/single queries
    const result = data.result[0];

    // Prisma expectations for D1 results
    return {
      results: result.results || [],
      success: result.success,
      meta: result.meta || {},
    };
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
      }),
    };
  }

  async batch(statements: any[]) {
    // Sequential execution to mimic batch for HTTP
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
      console.log("Using Native Cloudflare D1 binding");
      const adapter = new PrismaD1(ctx.env.DB);
      return new PrismaClient({ adapter });
    }
  } catch (e) {
    // getRequestContext fails if not in CF runtime
  }

  // 2. Try HTTP Bridge (Vercel/Local)
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.CLOUDFLARE_DATABASE_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (accountId && databaseId && apiToken) {
    console.log("Using Cloudflare D1 HTTP Bridge for External hosting");
    const bridge = new D1HttpBridge(accountId, databaseId, apiToken);
    const adapter = new PrismaD1(bridge as any);
    return new PrismaClient({ adapter });
  }

  // 3. Fallback to standard client (Prisma will look for DATABASE_URL)
  // This is used for local development in Next.js or migrations
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
