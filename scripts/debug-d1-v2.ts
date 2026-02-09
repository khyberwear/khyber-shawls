
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

        if (!data.success) {
            const msg = data.errors?.[0]?.message || "D1 Query Failed";
            console.error(`[D1 Bridge Error] ${msg}`, data.errors);
            throw new Error(msg);
        }

        const result = data.result?.[0] || { results: [], success: true, meta: {} };

        // Debug raw result BEFORE returning
        // console.log('[DEBUG] Raw result.results:', JSON.stringify(result.results, null, 2));

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

    console.log('🔌 Connecting to Cloudflare D1 via PrismaClient for DEBUGGING...');
    const bridge = new D1HttpBridge(accountId, databaseId, apiToken);
    const adapter = new PrismaD1(bridge as any);

    // Create PrismaClient with adapter
    const prisma = new PrismaClient({ adapter });

    try {
        console.log('\n--- Prisma Client FindFirst Test ---');
        const email = "atifjan2019@gmail.com";

        // Test findFirst which matches logic used in Login (it uses findUnique usually but findFirst is safer for generic check)
        const user = await prisma.user.findFirst({
            where: { email }
        });

        console.log('[DEBUG] Prisma Result:', user);

        if (user) {
            console.log('✅ Found User:', user.email);
        } else {
            console.error('❌ User NOT found via PrismaClient (but found via raw bridge earlier)');
        }

    } catch (e) {
        console.error("Prisma Client Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
