-- Migration: Initial Schema for Cloudflare D1
-- Generated from Prisma schema

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user' NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create contact_entries table
CREATE TABLE IF NOT EXISTS contact_entries (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    userId TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS contact_entries_userId_idx ON contact_entries(userId);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    summary TEXT,
    featuredImageUrl TEXT,
    featuredImageAlt TEXT,
    seoTitle TEXT,
    seoDescription TEXT,
    intro TEXT,
    sections TEXT,
    uiConfig TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create Tag table
CREATE TABLE IF NOT EXISTS Tag (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    details TEXT,
    careInstructions TEXT,
    price REAL NOT NULL,
    image TEXT NOT NULL,
    categoryId TEXT NOT NULL,
    inStock INTEGER DEFAULT 1 NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    published INTEGER DEFAULT 0 NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS products_categoryId_idx ON products(categoryId);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    address TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create Order table
CREATE TABLE IF NOT EXISTS "Order" (
    id TEXT PRIMARY KEY,
    userId TEXT,
    customerName TEXT NOT NULL,
    customerEmail TEXT NOT NULL,
    customerPhone TEXT,
    shippingAddress TEXT NOT NULL,
    notes TEXT,
    total REAL NOT NULL,
    status TEXT DEFAULT 'PENDING' NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY,
    orderId TEXT NOT NULL,
    productId TEXT NOT NULL,
    quantity INTEGER DEFAULT 1 NOT NULL,
    price REAL NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (orderId) REFERENCES "Order"(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
);

-- Create blog_post table
CREATE TABLE IF NOT EXISTS blog_post (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    published INTEGER DEFAULT 0 NOT NULL,
    authorId TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    image TEXT,
    FOREIGN KEY (authorId) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS blog_post_authorId_idx ON blog_post(authorId);

-- Create media table
CREATE TABLE IF NOT EXISTS media (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    alt TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create hero_media table
CREATE TABLE IF NOT EXISTS hero_media (
    id TEXT PRIMARY KEY,
    key TEXT NOT NULL UNIQUE,
    title TEXT,
    subtitle TEXT,
    description TEXT,
    ctaLabel TEXT,
    ctaHref TEXT,
    backgroundImageId TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (backgroundImageId) REFERENCES media(id)
);

CREATE INDEX IF NOT EXISTS hero_media_backgroundImageId_idx ON hero_media(backgroundImageId);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
    id TEXT PRIMARY KEY,
    websiteName TEXT,
    websiteLogoUrl TEXT,
    websiteFaviconUrl TEXT,
    contactPhone TEXT,
    contactEmail TEXT,
    contactAddress TEXT,
    smtpHost TEXT,
    smtpPort INTEGER,
    smtpUser TEXT,
    smtpPass TEXT,
    stripePublicKey TEXT,
    stripeSecretKey TEXT,
    socialLinks TEXT
);

-- Create product_images table
CREATE TABLE IF NOT EXISTS product_images (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    alt TEXT,
    productId TEXT NOT NULL,
    position INTEGER DEFAULT 0 NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updatedAt DATETIME NOT NULL,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS product_images_productId_idx ON product_images(productId);

-- Create product_variants table
CREATE TABLE IF NOT EXISTS product_variants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    sku TEXT NOT NULL UNIQUE,
    price REAL,
    inventory INTEGER DEFAULT 0 NOT NULL,
    productId TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updatedAt DATETIME NOT NULL,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS product_variants_productId_idx ON product_variants(productId);

-- Create junction tables for many-to-many relationships
CREATE TABLE IF NOT EXISTS "_ProductTags" (
    A TEXT NOT NULL,
    B TEXT NOT NULL,
    FOREIGN KEY (A) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (B) REFERENCES Tag(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "_ProductTags_AB_unique" ON "_ProductTags"(A, B);
CREATE INDEX IF NOT EXISTS "_ProductTags_B_index" ON "_ProductTags"(B);

CREATE TABLE IF NOT EXISTS "_RelatedProducts" (
    A TEXT NOT NULL,
    B TEXT NOT NULL,
    FOREIGN KEY (A) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (B) REFERENCES products(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "_RelatedProducts_AB_unique" ON "_RelatedProducts"(A, B);
CREATE INDEX IF NOT EXISTS "_RelatedProducts_B_index" ON "_RelatedProducts"(B);
