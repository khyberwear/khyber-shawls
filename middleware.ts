import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting storage (in production, use Redis or similar)
const requestCounts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const requests = requestCounts.get(ip);

  if (requests && requests.resetAt > now) {
    if (requests.count >= 100) { // 100 requests per minute
      return false;
    }
    requests.count++;
  } else {
    requestCounts.set(ip, { count: 1, resetAt: now + 60 * 1000 });
  }
  return true;
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Get client IP from headers
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

  // Check rate limit for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    if (!checkRateLimit(ip)) {
      return new NextResponse('Too Many Requests', { status: 429 });
    }
  }

  // Add security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Content Security Policy
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://web-sdk.smartlook.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https:;
    font-src 'self' data:;
    connect-src 'self' https://vercel.live https://vitals.vercel-insights.com https://web-sdk.smartlook.com https://*.smartlook.com https://*.smartlook.cloud wss://*.smartlook.com wss://*.smartlook.cloud;
    frame-ancestors 'self';
  `.replace(/\s{2,}/g, ' ').trim();

  response.headers.set('Content-Security-Policy', cspHeader);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
