# Cloudflare Pages + Next.js Setup Guide

## Prerequisites
```bash
npm install -g wrangler
wrangler login
```

## Step 1: Create Cloudflare R2 Bucket

```bash
# Create bucket
wrangler r2 bucket create khyber-shawls-uploads

# Create API tokens
# Go to: Cloudflare Dashboard → R2 → Manage R2 API Tokens → Create API Token
# Select: Admin Read & Write
# Copy the Access Key ID and Secret Access Key
```

Add to your environment:
```env
R2_ENDPOINT="https://<your-account-id>.r2.cloudflarestorage.com"
R2_ACCESS_KEY_ID="your-access-key-id"
R2_SECRET_ACCESS_KEY="your-secret-access-key"
R2_BUCKET_NAME="khyber-shawls-uploads"
R2_PUBLIC_URL="https://uploads.khybershawls.store"  # or use R2.dev subdomain
```

## Step 2: Create Cloudflare D1 Database

```bash
# Create database
wrangler d1 create khyber-shawls-db

# Copy the database_id from output and update wrangler.toml
```

Generate and apply schema:
```bash
# Generate schema SQL
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > migrations/001_init.sql

# Apply to D1
wrangler d1 execute khyber-shawls-db --file=migrations/001_init.sql
```

## Step 3: Deploy to Cloudflare Pages

### Option A: Via Dashboard (Recommended for first deployment)

1. Go to Cloudflare Dashboard → Pages
2. Click "Create a project" → "Connect to Git"
3. Select your GitHub repo: `khyberwear/khyber-shawls`
4. Configure build settings:
   - **Framework preset:** Next.js
   - **Build command:** `npm run build`
   - **Build output directory:** `.next`
   - **Node version:** 20

5. Add environment variables:
   ```
   DATABASE_URL=<will-use-D1-binding>
   JWT_SECRET=your-secret-key
   ADMIN_EMAILS=atifjan2019@gmail.com
   NEXT_PUBLIC_BASE_URL=https://khybershawls.store
   R2_ACCESS_KEY_ID=your-r2-key
   R2_SECRET_ACCESS_KEY=your-r2-secret
   R2_BUCKET_NAME=khyber-shawls-uploads
   R2_PUBLIC_URL=https://uploads.khybershawls.store
   R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
   ```

6. Click "Save and Deploy"

### Option B: Via Wrangler CLI

```bash
# Build your app
npm run build

# Deploy to Pages
wrangler pages deploy .next --project-name=khyber-shawls
```

## Step 4: Connect D1 to Pages

After deployment, bind D1 to your Pages project:

```bash
wrangler pages project create khyber-shawls --production-branch=main

# Add D1 binding
wrangler pages project bind khyber-shawls --d1=DB:khyber-shawls-db
```

Or via Dashboard:
1. Go to your Pages project → Settings → Functions
2. Add D1 binding:
   - Variable name: `DB`
   - D1 database: `khyber-shawls-db`

## Step 5: Set Up Custom Domain

1. In Pages project → Custom domains
2. Add your domain: `khybershawls.store`
3. Follow DNS instructions to point to Pages

For R2 public access:
1. In R2 bucket settings → Settings → Public access
2. Connect custom domain: `uploads.khybershawls.store`
3. Update `R2_PUBLIC_URL` environment variable

## Testing Locally with Wrangler

```bash
# Run dev with D1 binding
wrangler pages dev .next --d1=DB:khyber-shawls-db --port=3000
```

## Important Notes

- **D1 Limits:** 10GB storage free, 5M reads/day, 100K writes/day
- **R2 Limits:** 10GB storage free, 1M Class A operations/month, 10M Class B operations/month
- **Pages Limits:** Unlimited requests on free plan

## Troubleshooting

### Build fails on Cloudflare
- Check Node version is set to 20 in Pages settings
- Ensure all environment variables are set
- Check build command includes `npx prisma generate`

### Database connection issues
- D1 uses bindings, not connection URLs in production
- Update your Prisma client to use D1 binding in production

### R2 uploads fail
- Verify API tokens have correct permissions
- Check bucket name matches environment variable
- Ensure CORS is configured if uploading from browser
