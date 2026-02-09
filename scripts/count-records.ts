import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
    const products = await prisma.product.count()
    const categories = await prisma.category.count()
    const blogPosts = await prisma.blogPost.count()
    console.log({ products, categories, blogPosts })
    await prisma.$disconnect()
}
main()
