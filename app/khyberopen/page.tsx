// // // // export const runtime = 'edge';
import LoginForm from './login-form';
import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Login',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-gradient-to-br from-[#B3702B]/20 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gradient-to-tl from-[#8B5A2B]/15 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-[#B3702B]/5 to-transparent rounded-full" />
      </div>

      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#B3702B]/30 via-[#D4A574]/20 to-[#B3702B]/30 rounded-[28px] blur-xl opacity-50" />

          {/* Card */}
          <div className="relative backdrop-blur-xl bg-card/80 border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
            {/* Header */}
            <div className="space-y-3 text-center mb-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#B3702B]/10 border border-[#B3702B]/20 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-[#B3702B]">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Secure Login
              </span>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text">
                Welcome back
              </h1>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Enter your credentials to access your account and continue shopping
              </p>
            </div>

            {/* Form wrapped in Suspense for useSearchParams */}
            <div className="min-h-[200px]">
              <Suspense fallback={
                <div className="flex flex-col items-center justify-center py-10 space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin text-[#B3702B]" />
                  <p className="text-sm text-muted-foreground">Preparing login...</p>
                </div>
              }>
                <LoginForm />
              </Suspense>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link
                  href="/khybercreate"
                  className="font-medium text-[#B3702B] hover:text-[#8B5A2B] transition-colors underline-offset-4 hover:underline"
                >
                  Create one here
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-8 flex items-center justify-center gap-6 text-muted-foreground/60">
          <div className="flex items-center gap-2 text-xs">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>SSL Secured</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2 text-xs">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Privacy Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
