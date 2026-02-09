
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log('\n');
    console.log('╔════════════════════════════════════════════════════╗');
    console.log('║           MONGODB CONNECTION TEST SUITE            ║');
    console.log('╚════════════════════════════════════════════════════╝');
    console.log('\n🔍 Testing Prisma Connection to MongoDB...');
    console.log('━'.repeat(50));

    try {
        // Test basic connectivity
        await prisma.$connect();
        console.log('✅ Prisma: Connection Successful!');

        // MongoDB doesn't support raw SQL like "SELECT 1", so we check collections
        // Check stats
        const userCount = await prisma.user.count();
        const productCount = await prisma.product.count();
        const categoryCount = await prisma.category.count();
        const orderCount = await prisma.order.count();

        console.log('\n📊 Database Stats:');
        console.log(`   Users: ${userCount}`);
        console.log(`   Products: ${productCount}`);
        console.log(`   Categories: ${categoryCount}`);
        console.log(`   Orders: ${orderCount}`);

        console.log('\n🏁 RESULT: ✅ PASS');

    } catch (error) {
        console.error('❌ Connection Failed:', error);
        console.log('\n🏁 RESULT: ❌ FAIL');
    } finally {
        await prisma.$disconnect();
    }
}

main();
