import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Cloudflare R2 configuration
const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL; // e.g., https://pub-xxxxx.r2.dev

/**
 * Upload a file to Cloudflare R2 storage
 * @param file - The file to upload
 * @param pathPrefix - The path prefix in the bucket (e.g., 'uploads', 'categories')
 * @returns The public URL of the uploaded file via /images proxy path
 */
export async function uploadFileToR2(
  file: File,
  pathPrefix = 'uploads'
): Promise<string> {
  if (!R2_BUCKET_NAME || !R2_PUBLIC_URL) {
    throw new Error(
      'Cloudflare R2 environment variables (R2_BUCKET_NAME, R2_PUBLIC_URL) are missing'
    );
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const safeName = file.name.replace(/\s+/g, '-');
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}-${safeName}`;
    const filePath = `${pathPrefix}/${filename}`;

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: filePath,
      Body: buffer,
      ContentType: file.type,
    });

    await r2Client.send(command);

    // Return URL via /images proxy rewrite
    // This allows images to be accessed at khybershawls.store/images/...
    // instead of exposing the raw R2 bucket URL
    const proxyUrl = `/images/${filePath}`;
    return proxyUrl;
  } catch (error) {
    console.error('R2 upload error:', error);
    throw new Error(
      `Failed to upload to Cloudflare R2: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
