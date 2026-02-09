
import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import bcrypt from 'bcryptjs';

// --- D1 Bridge Logic (Copied from lib/prisma.ts) ---
class D1HttpBridge {
    constructor(
        private accountId: string,
        private databaseId: string,
        private apiToken: string
    ) { }

    private async fetchD1(sql: string, params: any[] = []) {
        // console.log('[DEBUG] SQL:', sql, params); // Uncomment to debug queries
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
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const databaseId = process.env.CLOUDFLARE_DATABASE_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;

    // Prefer D1 if configured
    if (accountId && databaseId && apiToken) {
        console.log('🔌 Connecting to Cloudflare D1 via HTTP Bridge...');
        const bridge = new D1HttpBridge(accountId, databaseId, apiToken);
        const adapter = new PrismaD1(bridge as any);
        return new PrismaClient({ adapter });
    }

    console.log('🔌 Connecting to Local SQLite...');
    return new PrismaClient();
}

async function main() {
    const prisma = createPrismaClient();
    const targetEmail = 'atifjan2019@gmail.com';
    const newPassword = 'Test1234!';

    console.log(`\n🔑 Resetting password via updateMany...`);

    try {
        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Use updateMany to bypass unique lookup issues
        const result = await prisma.user.updateMany({
            where: {
                email: targetEmail
            },
            data: {
                password: hashedPassword,
                // Ensure role is set to ADMIN while we are at it
                role: 'ADMIN'
            }
        });

        console.log(`Update Result: JSON.stringify(result)`);

        if (result.count > 0) {
            console.log(`✅ Success! Updated ${result.count} user(s).`);
            console.log(`\nTry logging in with:\nEmail: ${targetEmail}\nPassword: ${newPassword}`);
        } else {
            console.log(`⚠️ User ${targetEmail} NOT found (count: 0). Attempting raw insert...`);

            // If update fails, try raw insert to bypass Prisma READ issues if any
            // Note: We need a valid CUID for ID.
            const { v4: uuidv4 } = require('uuid'); // Might not be available
            // Fallback to simple random string if needed or let DB handle it if autoincrement (but it's CUID)

            try {
                await prisma.user.create({
                    data: {
                        email: targetEmail,
                        name: "Admin User",
                        password: hashedPassword,
                        role: "ADMIN"
                    }
                });
                console.log('✨ User created successfully!');
                console.log(`\nTry logging in with:\nEmail: ${targetEmail}\nPassword: ${newPassword}`);
            } catch (e) {
                console.error("Create failed (again):", e);
            }
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
