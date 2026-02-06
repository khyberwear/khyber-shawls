/**
 * Migration Script: Supabase PostgreSQL → Cloudflare D1 (SQLite)
 * 
 * This script fetches all data from your Supabase PostgreSQL database
 * and imports it into your new D1/SQLite database.
 * 
 * Prerequisites:
 * 1. Set SUPABASE_DATABASE_URL in your .env file with your old Supabase connection
 * 2. Set DATABASE_URL to your local SQLite database (e.g., file:./dev.db)
 * 3. Run: npm install pg
 * 
 * Usage:
 * node scripts/migrate-supabase-to-d1.js
 */

const { PrismaClient } = require('@prisma/client');
const { Client } = require('pg');

// Initialize Prisma client for the new SQLite/D1 database
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'file:./dev.db'
    }
  }
});

// PostgreSQL client for Supabase
const supabaseClient = new Client({
  connectionString: process.env.SUPABASE_DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function migrateData() {
  console.log('🚀 Starting migration from Supabase to D1...\n');

  try {
    // Connect to Supabase PostgreSQL
    console.log('📡 Connecting to Supabase PostgreSQL...');
    await supabaseClient.connect();
    console.log('✅ Connected to Supabase\n');

    // Test D1/SQLite connection
    console.log('📡 Testing D1/SQLite connection...');
    await prisma.$connect();
    console.log('✅ Connected to D1/SQLite\n');

    // Migrate in order of dependencies
    await migrateUsers();
    await migrateCategories();
    await migrateTags();
    await migrateProducts();
    await migrateProductTags();
    await migrateProductRelations();
    await migrateProductImages();
    await migrateProductVariants();
    await migrateCustomers();
    await migrateOrders();
    await migrateOrderItems();
    await migrateContactEntries();
    await migrateBlogPosts();
    await migrateMedia();
    await migrateHeroMedia();
    await migrateSettings();

    console.log('\n✨ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await supabaseClient.end();
    await prisma.$disconnect();
  }
}

// Helper function to fetch all records from a table
async function fetchFromSupabase(tableName) {
  const result = await supabaseClient.query(`SELECT * FROM ${tableName}`);
  return result.rows;
}

async function migrateUsers() {
  console.log('👥 Migrating Users...');
  try {
    const users = await fetchFromSupabase('users');
    console.log(`   Found ${users.length} users`);

    for (const user of users) {
      await prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          password: user.password,
          role: user.role,
          createdAt: new Date(user.createdAt || user.createdat),
          updatedAt: new Date(user.updatedAt || user.updatedat),
        }
      });
    }
    console.log(`✅ Migrated ${users.length} users\n`);
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('⚠️  Users already exist, skipping...\n');
    } else {
      console.error('❌ Error migrating users:', error.message);
    }
  }
}

async function migrateCategories() {
  console.log('📁 Migrating Categories...');
  try {
    const categories = await fetchFromSupabase('categories');
    console.log(`   Found ${categories.length} categories`);

    for (const category of categories) {
      await prisma.category.create({
        data: {
          id: category.id,
          name: category.name,
          slug: category.slug,
          summary: category.summary,
          featuredImageUrl: category.featuredimageurl || category.featuredImageUrl,
          featuredImageAlt: category.featuredimagealt || category.featuredImageAlt,
          seoTitle: category.seotitle || category.seoTitle,
          seoDescription: category.seodescription || category.seoDescription,
          intro: category.intro,
          sections: category.sections,
          uiConfig: category.uiconfig || category.uiConfig,
          createdAt: new Date(category.createdAt || category.createdat),
          updatedAt: new Date(category.updatedAt || category.updatedat),
        }
      });
    }
    console.log(`✅ Migrated ${categories.length} categories\n`);
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('⚠️  Categories already exist, skipping...\n');
    } else {
      console.error('❌ Error migrating categories:', error.message);
    }
  }
}

async function migrateTags() {
  console.log('🏷️  Migrating Tags...');
  try {
    const tags = await fetchFromSupabase('Tag');
    console.log(`   Found ${tags.length} tags`);

    for (const tag of tags) {
      await prisma.tag.create({
        data: {
          id: tag.id,
          name: tag.name,
        }
      });
    }
    console.log(`✅ Migrated ${tags.length} tags\n`);
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('⚠️  Tags already exist, skipping...\n');
    } else {
      console.error('❌ Error migrating tags:', error.message);
    }
  }
}

async function migrateProducts() {
  console.log('🛍️  Migrating Products...');
  try {
    const products = await fetchFromSupabase('products');
    console.log(`   Found ${products.length} products`);

    for (const product of products) {
      await prisma.product.create({
        data: {
          id: product.id,
          name: product.name,
          description: product.description,
          details: product.details,
          careInstructions: product.careinstructions || product.careInstructions,
          price: parseFloat(product.price),
          image: product.image,
          categoryId: product.categoryid || product.categoryId,
          inStock: product.instock ?? product.inStock ?? true,
          published: product.published ?? false,
          slug: product.slug,
          createdAt: new Date(product.createdAt || product.createdat),
          updatedAt: new Date(product.updatedAt || product.updatedat),
        }
      });
    }
    console.log(`✅ Migrated ${products.length} products\n`);
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('⚠️  Products already exist, skipping...\n');
    } else {
      console.error('❌ Error migrating products:', error.message);
      console.error('Full error:', error);
    }
  }
}

async function migrateProductTags() {
  console.log('🔗 Migrating Product-Tag Relations...');
  try {
    const result = await supabaseClient.query('SELECT * FROM "_ProductTags"');
    const relations = result.rows;
    console.log(`   Found ${relations.length} product-tag relations`);

    for (const relation of relations) {
      await prisma.product.update({
        where: { id: relation.A },
        data: {
          tags: {
            connect: { id: relation.B }
          }
        }
      });
    }
    console.log(`✅ Migrated ${relations.length} product-tag relations\n`);
  } catch (error) {
    console.error('❌ Error migrating product-tag relations:', error.message);
  }
}

async function migrateProductRelations() {
  console.log('🔗 Migrating Related Products...');
  try {
    const result = await supabaseClient.query('SELECT * FROM "_RelatedProducts"');
    const relations = result.rows;
    console.log(`   Found ${relations.length} product relations`);

    for (const relation of relations) {
      await prisma.product.update({
        where: { id: relation.A },
        data: {
          products_B: {
            connect: { id: relation.B }
          }
        }
      });
    }
    console.log(`✅ Migrated ${relations.length} product relations\n`);
  } catch (error) {
    console.error('❌ Error migrating product relations:', error.message);
  }
}

async function migrateProductImages() {
  console.log('🖼️  Migrating Product Images...');
  try {
    const images = await fetchFromSupabase('product_images');
    console.log(`   Found ${images.length} product images`);

    for (const image of images) {
      await prisma.product_images.create({
        data: {
          id: image.id,
          url: image.url,
          alt: image.alt,
          productId: image.productid || image.productId,
          position: image.position || 0,
          createdAt: new Date(image.createdAt || image.createdat),
          updatedAt: new Date(image.updatedAt || image.updatedat),
        }
      });
    }
    console.log(`✅ Migrated ${images.length} product images\n`);
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('⚠️  Product images already exist, skipping...\n');
    } else {
      console.error('❌ Error migrating product images:', error.message);
    }
  }
}

async function migrateProductVariants() {
  console.log('📦 Migrating Product Variants...');
  try {
    const variants = await fetchFromSupabase('product_variants');
    console.log(`   Found ${variants.length} product variants`);

    for (const variant of variants) {
      await prisma.product_variants.create({
        data: {
          id: variant.id,
          name: variant.name,
          sku: variant.sku,
          price: variant.price ? parseFloat(variant.price) : null,
          inventory: variant.inventory || 0,
          productId: variant.productid || variant.productId,
          createdAt: new Date(variant.createdAt || variant.createdat),
          updatedAt: new Date(variant.updatedAt || variant.updatedat),
        }
      });
    }
    console.log(`✅ Migrated ${variants.length} product variants\n`);
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('⚠️  Product variants already exist, skipping...\n');
    } else {
      console.error('❌ Error migrating product variants:', error.message);
    }
  }
}

async function migrateCustomers() {
  console.log('👤 Migrating Customers...');
  try {
    const customers = await fetchFromSupabase('customers');
    console.log(`   Found ${customers.length} customers`);

    for (const customer of customers) {
      await prisma.customer.create({
        data: {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          createdAt: new Date(customer.createdAt || customer.createdat),
          updatedAt: new Date(customer.updatedAt || customer.updatedat),
        }
      });
    }
    console.log(`✅ Migrated ${customers.length} customers\n`);
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('⚠️  Customers already exist, skipping...\n');
    } else {
      console.error('❌ Error migrating customers:', error.message);
    }
  }
}

async function migrateOrders() {
  console.log('📦 Migrating Orders...');
  try {
    const orders = await fetchFromSupabase('Order');
    console.log(`   Found ${orders.length} orders`);

    for (const order of orders) {
      await prisma.order.create({
        data: {
          id: order.id,
          userId: order.userid || order.userId,
          customerName: order.customername || order.customerName,
          customerEmail: order.customeremail || order.customerEmail,
          customerPhone: order.customerphone || order.customerPhone,
          shippingAddress: order.shippingaddress || order.shippingAddress,
          notes: order.notes,
          total: parseFloat(order.total),
          status: order.status,
          createdAt: new Date(order.createdAt || order.createdat),
          updatedAt: new Date(order.updatedAt || order.updatedat),
        }
      });
    }
    console.log(`✅ Migrated ${orders.length} orders\n`);
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('⚠️  Orders already exist, skipping...\n');
    } else {
      console.error('❌ Error migrating orders:', error.message);
    }
  }
}

async function migrateOrderItems() {
  console.log('📋 Migrating Order Items...');
  try {
    const orderItems = await fetchFromSupabase('order_items');
    console.log(`   Found ${orderItems.length} order items`);

    for (const item of orderItems) {
      await prisma.orderItem.create({
        data: {
          id: item.id,
          orderId: item.orderid || item.orderId,
          productId: item.productid || item.productId,
          quantity: item.quantity || 1,
          price: parseFloat(item.price),
          createdAt: new Date(item.createdAt || item.createdat),
          updatedAt: new Date(item.updatedAt || item.updatedat),
        }
      });
    }
    console.log(`✅ Migrated ${orderItems.length} order items\n`);
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('⚠️  Order items already exist, skipping...\n');
    } else {
      console.error('❌ Error migrating order items:', error.message);
    }
  }
}

async function migrateContactEntries() {
  console.log('📧 Migrating Contact Entries...');
  try {
    const entries = await fetchFromSupabase('contact_entries');
    console.log(`   Found ${entries.length} contact entries`);

    for (const entry of entries) {
      await prisma.contactEntry.create({
        data: {
          id: entry.id,
          name: entry.name,
          email: entry.email,
          message: entry.message,
          userId: entry.userid || entry.userId,
          createdAt: new Date(entry.createdAt || entry.createdat),
        }
      });
    }
    console.log(`✅ Migrated ${entries.length} contact entries\n`);
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('⚠️  Contact entries already exist, skipping...\n');
    } else {
      console.error('❌ Error migrating contact entries:', error.message);
    }
  }
}

async function migrateBlogPosts() {
  console.log('📝 Migrating Blog Posts...');
  try {
    const posts = await fetchFromSupabase('blog_post');
    console.log(`   Found ${posts.length} blog posts`);

    for (const post of posts) {
      await prisma.blogPost.create({
        data: {
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          published: post.published ?? false,
          authorId: post.authorid || post.authorId,
          image: post.image,
          createdAt: new Date(post.createdAt || post.createdat),
          updatedAt: new Date(post.updatedAt || post.updatedat),
        }
      });
    }
    console.log(`✅ Migrated ${posts.length} blog posts\n`);
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('⚠️  Blog posts already exist, skipping...\n');
    } else {
      console.error('❌ Error migrating blog posts:', error.message);
    }
  }
}

async function migrateMedia() {
  console.log('🎨 Migrating Media...');
  try {
    const media = await fetchFromSupabase('media');
    console.log(`   Found ${media.length} media items`);

    for (const item of media) {
      await prisma.media.create({
        data: {
          id: item.id,
          url: item.url,
          alt: item.alt,
          createdAt: new Date(item.createdAt || item.createdat),
          updatedAt: new Date(item.updatedAt || item.updatedat),
        }
      });
    }
    console.log(`✅ Migrated ${media.length} media items\n`);
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('⚠️  Media already exists, skipping...\n');
    } else {
      console.error('❌ Error migrating media:', error.message);
    }
  }
}

async function migrateHeroMedia() {
  console.log('🎯 Migrating Hero Media...');
  try {
    const heroMedia = await fetchFromSupabase('hero_media');
    console.log(`   Found ${heroMedia.length} hero media items`);

    for (const item of heroMedia) {
      await prisma.heroMedia.create({
        data: {
          id: item.id,
          key: item.key,
          title: item.title,
          subtitle: item.subtitle,
          description: item.description,
          ctaLabel: item.ctalabel || item.ctaLabel,
          ctaHref: item.ctahref || item.ctaHref,
          backgroundImageId: item.backgroundimageid || item.backgroundImageId,
          createdAt: new Date(item.createdAt || item.createdat),
          updatedAt: new Date(item.updatedAt || item.updatedat),
        }
      });
    }
    console.log(`✅ Migrated ${heroMedia.length} hero media items\n`);
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('⚠️  Hero media already exists, skipping...\n');
    } else {
      console.error('❌ Error migrating hero media:', error.message);
    }
  }
}

async function migrateSettings() {
  console.log('⚙️  Migrating Settings...');
  try {
    const settings = await fetchFromSupabase('settings');
    console.log(`   Found ${settings.length} settings records`);

    for (const setting of settings) {
      await prisma.settings.create({
        data: {
          id: setting.id,
          websiteName: setting.websitename || setting.websiteName,
          websiteLogoUrl: setting.websitelogourl || setting.websiteLogoUrl,
          websiteFaviconUrl: setting.websitefaviconurl || setting.websiteFaviconUrl,
          contactPhone: setting.contactphone || setting.contactPhone,
          contactEmail: setting.contactemail || setting.contactEmail,
          contactAddress: setting.contactaddress || setting.contactAddress,
          smtpHost: setting.smtphost || setting.smtpHost,
          smtpPort: setting.smtpport || setting.smtpPort,
          smtpUser: setting.smtpuser || setting.smtpUser,
          smtpPass: setting.smtppass || setting.smtpPass,
          stripePublicKey: setting.stripepublickey || setting.stripePublicKey,
          stripeSecretKey: setting.stripesecretkey || setting.stripeSecretKey,
          socialLinks: setting.sociallinks || setting.socialLinks,
        }
      });
    }
    console.log(`✅ Migrated ${settings.length} settings records\n`);
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('⚠️  Settings already exist, skipping...\n');
    } else {
      console.error('❌ Error migrating settings:', error.message);
    }
  }
}

// Run the migration
migrateData()
  .then(() => {
    console.log('\n✨ All done! Your data has been migrated to D1.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  });
