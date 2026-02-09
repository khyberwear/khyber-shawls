
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

        if (!data.success) {
            // Log errors but return structure
            console.error(`[D1 Bridge Error]`, data.errors);
            // throw new Error(data.errors?.[0]?.message || "D1 Query Failed");
        }

        // Log result for debugging
        // console.log("[DEBUG] Result:", JSON.stringify(data.result?.[0], null, 2));

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

    console.log('🔌 Connecting to Cloudflare D1 via HTTP Bridge (Test 3)...');
    const bridge = new D1HttpBridge(accountId, databaseId, apiToken);

    // Test 3: Parameterized Select with LIMIT/OFFSET (Mimic Prisma)
    try {
        console.log('\n--- Test 3: Parameterized Select with LIMIT/OFFSET ---');
        const targetEmail = "atifjan2019@gmail.com";
        // Exact SQL Prisma generated
        const sql = "SELECT `id`, `email`, `name`, `password`, `role`, `createdAt`, `updatedAt` FROM `users` WHERE `users`.`email` = ? LIMIT ? OFFSET ?";
        const params = [targetEmail, 1, 0];

        await bridge.prepare(sql).bind(...params).all();
    } catch (e) {
        console.error("Test 3 failed", e);
    }
}

main();
