export const runtime = 'edge';
// Health check endpoint for Coolify
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { 
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'khyber-shawls'
    },
    { status: 200 }
  );
}
