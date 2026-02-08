"use server";

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Lazy-initialized S3 client (env vars aren't available at module top-level on CF Workers)
let _r2Client: S3Client | null = null;

function getR2Client(): S3Client {
  if (!_r2Client) {
    _r2Client = new S3Client({
      region: 'auto',
      endpoint: process.env.R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
      },
    });
  }
  return _r2Client;
}

const getR2BucketName = () => process.env.R2_BUCKET_NAME;
const getR2PublicUrl = () => process.env.R2_PUBLIC_URL;

/**
 * Upload a file to Cloudflare R2 storage
 * Uses the R2 binding directly when available (Cloudflare Pages),
 * falls back to S3-compatible API for local development.
 * @param file - The file to upload
 * @param pathPrefix - The path prefix in the bucket (e.g., 'uploads', 'categories')
 * @returns The public URL of the uploaded file via /images proxy path
 */
export async function uploadFileToR2(
  file: File,
  pathPrefix = 'uploads'
): Promise<string> {
  const safeName = file.name.replace(/\s+/g, '-');
  const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}-${safeName}`;
  const filePath = `${pathPrefix}/${filename}`;

  try {
    const arrayBuffer = await file.arrayBuffer();

    // Use S3-compatible API (works on Vercel and local development)
    const bucketName = getR2BucketName();
    const publicUrl = getR2PublicUrl();
    if (!bucketName || !publicUrl) {
      throw new Error(
        'Storage environment variables (R2_BUCKET_NAME, R2_PUBLIC_URL) are missing.'
      );
    }

    const body = new Uint8Array(arrayBuffer);

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: filePath,
      Body: body,
      ContentType: file.type,
    });

    await getR2Client().send(command);

    const proxyUrl = `/images/${filePath}`;
    return proxyUrl;
  } catch (error) {
    console.error('R2 upload error:', error);
    throw new Error(
      `Failed to upload to Cloudflare R2: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
