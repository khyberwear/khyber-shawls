
import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";

// --- D1 Bridge Logic (Identical to lib/prisma.ts) ---
class D1HttpBridge {
    constructor(
        private accountId: string,
        private databaseId: string,
        private apiToken: string
    ) { }

    private async fetchD1(sql: string, params: any[] = []) {
        console.log(`\n[DEBUG] Executing SQL: ${sql}`);
        console.log(`[DEBUG] Params: ${JSON.stringify(params)}`);

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

        // --- CRITICAL DEBUG LOGGING ---
        console.log('---------------------------------------------------');
        console.log('[DEBUG] RAW D1 RESPONSE:', JSON.stringify(data, null, 2));
        console.log('---------------------------------------------------');

        if (!data.success) {
            const msg = data.errors?.[0]?.message || "D1 Query Failed";
            console.error(`[D1 Bridge Error] ${msg}`, data.errors);
            throw new Error(msg);
        }

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
}

async function main() {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const databaseId = process.env.CLOUDFLARE_DATABASE_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;

    if (!accountId || !databaseId || !apiToken) {
        console.error("Missing Cloudflare credentials in environment");
        return;
    }

    console.log('🔌 Connecting to Cloudflare D1 via HTTP Bridge for DEBUGGING...');
    const bridge = new D1HttpBridge(accountId, databaseId, apiToken);

    // Test 1: Simple Select
    try {
        console.log('\n--- Test 1: Simple Select ---');
        const sql = "SELECT * FROM users LIMIT 1";
        await bridge.prepare(sql).bind().all();
    } catch (e) {
        console.error("Test 1 failed", e);
    }

    // Test 2: Parameterized Select
    try {
        console.log('\n--- Test 2: Parameterized Select ---');
        const targetEmail = "atifjan2019@gmail.com";
        const sql = "SELECT * FROM users WHERE email = ?";
        await bridge.prepare(sql).bind(targetEmail).all();
    } catch (e) {
        console.error("Test 2 failed", e);
    }
}

main();
