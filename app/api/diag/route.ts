import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const diagnostics: any = {
        env: {
            hasAccountId: !!process.env.CLOUDFLARE_ACCOUNT_ID,
            hasDatabaseId: !!process.env.CLOUDFLARE_DATABASE_ID,
            hasApiToken: !!process.env.CLOUDFLARE_API_TOKEN,
            nodeEnv: process.env.NODE_ENV,
        },
        database: "checking...",
    };

    try {
        // Try a very simple query
        const start = Date.now();
        const result = await (prisma as any).$queryRaw`SELECT 1 as test`;
        diagnostics.database = "Connected successfully!";
        diagnostics.latency = `${Date.now() - start}ms`;
        diagnostics.testResult = result;
    } catch (err: any) {
        diagnostics.database = "Failed";
        diagnostics.error = err.message;
        // Log details for server logs
        console.error("DIAGNOSTIC FAILURE:", err);
    }

    return NextResponse.json(diagnostics);
}
