// app/(auth)/actions.ts
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SignJWT, jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';
import { verifyPassword, hashPassword } from '@/lib/passwords';
import { sendEmail } from '@/lib/email';

export type LoginState = { error?: string };

const SESSION_COOKIE = 'session';
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-change-in-production'
);

// Note: In-memory rate limiting does not work on Cloudflare Workers (stateless isolates).
// Use Cloudflare WAF Rate Limiting rules in the dashboard for production rate limiting.
// This is kept as a basic no-op check for API compatibility.
function checkRateLimit(_email: string): boolean {
  return true;
}

function isAdminEmail(email: string): boolean {
  const list = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(email.toLowerCase());
}

async function createSession(userId: string, email: string, name: string | null, role: 'USER' | 'ADMIN') {
  const token = await new SignJWT({ userId, email, name, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  const callbackUrl = String(formData.get('callbackUrl') ?? '') || '/';

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  // Check rate limit
  if (!checkRateLimit(email)) {
    return { error: 'Too many login attempts. Please try again in 15 minutes.' };
  }

  if (!prisma) {
    return { error: 'Database not configured.' };
  }

  try {
    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        role: true,
      },
    });

    console.log('[DEBUG] Prisma user lookup:', user);

    if (!user) {
      return { error: 'Invalid email or password.' };
    }

    // Check if user has a password set
    if (!user.password || user.password.trim() === '') {
      return { error: 'Please register or reset your password to continue.' };
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    console.log('[DEBUG] Password check:', { input: password, hash: user.password, isValidPassword });
    if (!isValidPassword) {
      return { error: 'Invalid email or password.' };
    }

    // Normalize role to uppercase
    const normalizedRole = user.role.toUpperCase() as 'USER' | 'ADMIN';

    // Create secure session
    await createSession(user.id, user.email, user.name, normalizedRole);

    // Redirect based on role
    if (normalizedRole === 'ADMIN' && (callbackUrl === '/' || callbackUrl === '/dashboard')) {
      redirect('/admin/products');
    }

    redirect(callbackUrl);
  } catch (error) {
    console.error('[loginAction]', error);
    
    // Check if it's a redirect (which is expected)
    if (error && typeof error === 'object' && 'digest' in error) {
      throw error; // Re-throw redirect errors
    }
    
    return { error: 'An error occurred during login.' };
  }
}

export async function registerAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  const name = String(formData.get('name') ?? '').trim();
  const redirectTo = String(formData.get('redirectTo') ?? '') || '/';

  if (!email || !password || !name) {
    return { error: 'All fields are required.' };
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters.' };
  }

  // Check password strength
  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
    return { error: 'Password must contain uppercase, lowercase, and numbers.' };
  }

  if (!prisma) {
    return { error: 'Database not configured.' };
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: 'Email already registered.' };
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Determine role (normalize to uppercase)
    const role = (isAdminEmail(email) ? 'ADMIN' : 'USER') as 'USER' | 'ADMIN';

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: role,
      },
    });

    // Create session
    await createSession(user.id, user.email, user.name, role);

    // Send welcome email
    try {
      await sendEmail({
        to: user.email,
        subject: 'Welcome to Khybershawls!',
        html: `
          <h1>Welcome, ${user.name}!</h1>
          <p>Thank you for creating an account at Khybershawls.</p>
          <p>You can now log in and start shopping.</p>
        `,
      });
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      // Do not block the response for email errors
    }

    // Redirect based on role
    if (role === 'ADMIN') {
      redirect('/admin/products');
    }

    redirect(redirectTo);
  } catch (error) {
    console.error('[registerAction]', error);
    
    // Check if it's a redirect (which is expected)
    if (error && typeof error === 'object' && 'digest' in error) {
      throw error; // Re-throw redirect errors
    }
    
    return { error: 'An error occurred during registration.' };
  }
}

export async function logout(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  redirect('/khyberopen');
}
