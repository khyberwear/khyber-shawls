# Migration from Supabase to Cloudflare D1 & R2

This document outlines the steps completed and remaining actions needed to complete the migration from Supabase to Cloudflare.

## Changes Completed ✅

### 1. Database Migration (PostgreSQL → D1/SQLite)
- Updated `prisma/schema.prisma` to use SQLite instead of PostgreSQL
- Changed datasource provider from `postgresql` to `sqlite`

### 2. File Storage Migration (Supabase Storage → R2)
- Created new `lib/cloudflare-r2.ts` with R2 upload functionality using AWS S3 SDK
- Replaced all `uploadFileToSupabase()` calls with `uploadFileToR2()` in:
  - `lib/media.ts`
  - `app/admin/actions.ts`
  - `app/admin/categories/actions.ts`

### 3. Dependency Updates
- Removed `@supabase/supabase-js` from package.json
- Added `@aws-sdk/client-s3` for R2 compatibility
- Removed `isomorphic-dompurify` (ESM issue)
- Added `sanitize-html` as replacement

### 4. Configuration Files
- Updated `env.example` with Cloudflare D1 and R2 environment variables
- Created `wrangler.toml` for Cloudflare Workers configuration

## Required Actions 🔧

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Cloudflare D1 Database
1. Install Wrangler CLI (if not already installed):
   ```bash
   npm install -g wrangler
   ```

2. Login to Cloudflare:
   ```bash
   wrangler login
   ```

3. Create a new D1 database:
   ```bash
   wrangler d1 create khyber-shawls-db
   ```

4. Copy the database ID from the output and update `wrangler.toml`:
   ```toml
   database_id = "your-database-id-from-step-3"
   ```

5. Update your environment variables (`.env` or `.env.local`):
   ```env
   # For local development
   DATABASE_URL="file:./dev.db"
   
   # For production, Cloudflare will inject the D1 binding
   ```

### Step 3: Set Up Cloudflare R2 Storage
1. Create an R2 bucket:
   ```bash
   wrangler r2 bucket create khyber-shawls-uploads
   ```

2. Create R2 API tokens:
   - Go to Cloudflare Dashboard → R2 → Manage R2 API Tokens
   - Click "Create API Token"
   - Select "Admin Read & Write" permissions
   - Copy the Access Key ID and Secret Access Key

3. Update `wrangler.toml` with your bucket name:
   ```toml
   bucket_name = "khyber-shawls-uploads"
   ```

4. Update your environment variables:
   ```env
   R2_ENDPOINT="https://<your-account-id>.r2.cloudflarestorage.com"
   R2_ACCESS_KEY_ID="your-access-key-id"
   R2_SECRET_ACCESS_KEY="your-secret-access-key"
   R2_BUCKET_NAME="khyber-shawls-uploads"
   R2_PUBLIC_URL="https://your-bucket.your-domain.com"  # or R2.dev URL
   ```

5. (Optional) Set up a custom domain for R2:
   - In Cloudflare Dashboard, go to R2 → your bucket → Settings
   - Add a custom domain
   - Update `R2_PUBLIC_URL` with your custom domain

### Step 4: Migrate Database Schema
1. For local development, create a new SQLite database:
   ```bash
   npx prisma migrate dev --name init
   ```

2. For production D1, you'll need to run migrations:
   ```bash
   # Generate migration SQL
   npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > migrations/001_init.sql
   
   # Apply to D1
   wrangler d1 execute khyber-shawls-db --file=migrations/001_init.sql
   ```

### Step 5: Migrate Your Data
You'll need to export data from Supabase and import it into D1:

1. Export data from Supabase PostgreSQL
2. Convert PostgreSQL data to SQLite format (handling any incompatibilities)
3. Import into your D1 database using Wrangler

### Step 6: Migrate Existing Files
Transfer existing files from Supabase Storage to R2:
- Download files from Supabase Storage buckets
- Upload to R2 using Wrangler or AWS CLI with S3 compatibility
- Update file URLs in your database to point to R2

### Step 7: Update Deployment Configuration
Since you're using Netlify, you'll need to decide:
- Continue using Netlify with Cloudflare D1/R2 (requires API routes to access D1)
- OR migrate to Cloudflare Pages for better integration

For Netlify deployment:
- D1 database needs to be accessed via Cloudflare Workers API
- Consider using Cloudflare Pages instead for native D1 support

### Step 8: Test Locally
```bash
npm run dev
```

Test:
- Database operations (read/write)
- File uploads to R2
- Image display from R2

### Step 9: Clean Up Old Files
Once everything is working, you can remove:
- `lib/supabase.ts`
- `lib/supabase-client.ts`

## Important Notes ⚠️

### SQLite Differences from PostgreSQL
- SQLite doesn't support some PostgreSQL features
- `cuid()` functions work fine
- Relationships work the same way
- Check for any custom PostgreSQL-specific queries in your codebase

### R2 vs Supabase Storage
- R2 is S3-compatible, so most operations are similar
- You need to set up CORS if accessing from browser
- Consider CDN caching for better performance

### Cloudflare Pages Recommendation
For the best experience with D1 and R2, consider deploying to Cloudflare Pages instead of Netlify:
- Native D1 database access
- No cold starts for database queries
- Integrated R2 access
- Better global performance

## Deployment Options

### Option A: Cloudflare Pages (Recommended)
```bash
npm run build
wrangler pages deploy .next
```

### Option B: Continue with Netlify
- Keep using Netlify for hosting
- Create Cloudflare Workers for D1 access
- Use R2 with public URLs or custom domain

## Troubleshooting

### Build Errors
If you encounter build errors:
- Ensure all dependencies are installed: `npm install`
- Clear `.next` cache: `rm -rf .next`
- Regenerate Prisma client: `npx prisma generate`

### Database Connection Issues
- For local dev, ensure `DATABASE_URL="file:./dev.db"` in `.env`
- For production, check Wrangler bindings in `wrangler.toml`

### R2 Upload Issues
- Verify R2 credentials are correct
- Check bucket name matches in environment variables
- Ensure CORS is configured if uploading from browser

## Resources
- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)
- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [Prisma with SQLite](https://www.prisma.io/docs/concepts/database-connectors/sqlite)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
