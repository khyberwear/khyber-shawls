/// <reference types="@cloudflare/workers-types" />
import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getRequestContext } from "@cloudflare/next-on-pages";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * A bridge to allow external hosts (like Vercel) to talk to Cloudflare D1 via HTTP API.
 * Implements the minimal D1Database interface required by Prisma.
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
      const msg = data.errors?.[0]?.message || "D1 Query Failed";
      console.error(`[D1 Bridge Error] ${msg}`, data.errors);
      throw new Error(msg);
    }

    // Cloudflare D1 /query API returns result as result[0]
    const result = data.result?.[0] || { results: [], success: true, meta: {} };

    return {
      results: result.results || [],
      success: !!result.success,
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
        raw: async () => {
          const res = await fetcher(sql, params);
          return res.results.map((r: any) => Object.values(r));
        }
      }),
    };
  }

  async batch(statements: any[]) {
    // Note: D1 HTTP API supports batches, but for Prisma bridge 
    // we execute sequentially to maintain simplicity and reliability.
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
    if (ctx?.env?.DB) {
      const adapter = new PrismaD1(ctx.env.DB);
      return new PrismaClient({ adapter });
    }
  } catch (e) {
    // Not in Cloudflare environment
  }

  // 2. Try HTTP Bridge (Vercel/External)
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.CLOUDFLARE_DATABASE_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (accountId && databaseId && apiToken) {
    const bridge = new D1HttpBridge(accountId, databaseId, apiToken);
    const adapter = new PrismaD1(bridge as any);
    return new PrismaClient({ adapter });
  }

  // 3. Fallback to default (Local dev or missing config)
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"],
  });
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export function ensurePrismaClient(): PrismaClient {
  return prisma;
}

export default prisma;
