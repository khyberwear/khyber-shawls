/**
 * Database Connection Test Script
 * Tests both local SQLite and Cloudflare D1 HTTP Bridge connections
 */

// Test D1 HTTP Bridge Connection
async function testD1HttpBridge() {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const databaseId = process.env.CLOUDFLARE_DATABASE_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;

    console.log('\n🔍 Testing Cloudflare D1 HTTP Bridge Connection...');
    console.log('━'.repeat(50));

    if (!accountId || !databaseId || !apiToken) {
        console.log('⚠️  Missing Cloudflare credentials:');
        console.log(`   CLOUDFLARE_ACCOUNT_ID: ${accountId ? '✓ Set' : '✗ Missing'}`);
        console.log(`   CLOUDFLARE_DATABASE_ID: ${databaseId ? '✓ Set' : '✗ Missing'}`);
        console.log(`   CLOUDFLARE_API_TOKEN: ${apiToken ? '✓ Set' : '✗ Missing'}`);
        return { success: false, error: 'Missing credentials' };
    }

    try {
        const res = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${apiToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sql: 'SELECT 1 as test', params: [] }),
            }
        );

        const data = await res.json() as { success: boolean; result?: Array<{ results?: unknown[] }>; errors?: Array<{ message: string }> };

        if (data.success) {
            console.log('✅ D1 HTTP Bridge: Connection Successful!');
            console.log(`   Response: ${JSON.stringify(data.result?.[0]?.results || data.result)}`);
            return { success: true, data: data.result };
        } else {
            console.log('❌ D1 HTTP Bridge: Connection Failed!');
            console.log(`   Error: ${data.errors?.[0]?.message || 'Unknown error'}`);
            return { success: false, error: data.errors };
        }
    } catch (error) {
        console.log('❌ D1 HTTP Bridge: Connection Error!');
        console.log(`   Error: ${error instanceof Error ? error.message : error}`);
        return { success: false, error };
    }
}

// Test Prisma/SQLite Connection
async function testPrismaConnection() {
    console.log('\n🔍 Testing Prisma/SQLite Connection...');
    console.log('━'.repeat(50));

    try {
        const { PrismaClient } = await import('@prisma/client');
        const prisma = new PrismaClient();

        // Test basic query
        const result = await prisma.$queryRaw`SELECT 1 as test`;
        console.log('✅ Prisma/SQLite: Connection Successful!');
        console.log(`   Response: ${JSON.stringify(result)}`);

        // Test actual data
        const userCount = await prisma.user.count();
        const productCount = await prisma.product.count();
        const categoryCount = await prisma.category.count();
        const orderCount = await prisma.order.count();

        console.log('\n📊 Database Stats:');
        console.log(`   Users: ${userCount}`);
        console.log(`   Products: ${productCount}`);
        console.log(`   Categories: ${categoryCount}`);
        console.log(`   Orders: ${orderCount}`);

        await prisma.$disconnect();
        return { success: true, stats: { userCount, productCount, categoryCount, orderCount } };
    } catch (error) {
        console.log('❌ Prisma/SQLite: Connection Error!');
        console.log(`   Error: ${error instanceof Error ? error.message : error}`);
        return { success: false, error };
    }
}

// Main test runner
async function main() {
    console.log('\n');
    console.log('╔════════════════════════════════════════════════════╗');
    console.log('║          DATABASE CONNECTION TEST SUITE            ║');
    console.log('╚════════════════════════════════════════════════════╝');

    const d1Result = await testD1HttpBridge();
    const prismaResult = await testPrismaConnection();

    console.log('\n');
    console.log('═'.repeat(52));
    console.log('🏁 SUMMARY:');
    console.log(`   D1 HTTP Bridge: ${d1Result.success ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Prisma/SQLite:  ${prismaResult.success ? '✅ PASS' : '❌ FAIL'}`);
    console.log('═'.repeat(52));
    console.log('\n');
}

main().catch(console.error);
