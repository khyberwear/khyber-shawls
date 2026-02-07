// lib/settings.ts
import { prisma } from "@/lib/prisma";

// Note: unstable_cache is not supported on Cloudflare Pages.
// D1 queries are fast enough without an application-level cache.
export async function getSettings() {
    try {
        return await prisma.settings.findFirst();
    } catch (error) {
        console.error("Could not fetch settings:", error);
        return null;
    }
}
