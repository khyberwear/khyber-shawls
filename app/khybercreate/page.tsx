// // // // export const runtime = 'edge';
import { redirect } from "next/navigation"
import { Metadata } from 'next';
import Link from 'next/link';

import { SignupForm } from "@/app/khybercreate/signup-form"
import { getCurrentUser } from "@/lib/auth"

export const metadata: Metadata = {
  title: 'Create Account',
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

type PageProps = {
  searchParams: Promise<{ callbackUrl?: string }>
}

export default async function SignupPage({ searchParams }: PageProps) {
  const user = await getCurrentUser()
  if (user) {
    redirect("/admin")
  }

  const params = await searchParams
  const redirectTo = params?.callbackUrl

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-gradient-to-bl from-[#B3702B]/20 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-gradient-to-tr from-[#8B5A2B]/15 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-radial from-[#B3702B]/5 to-transparent rounded-full" />
      </div>

      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#D4A574]/20 via-[#B3702B]/30 to-[#D4A574]/20 rounded-[28px] blur-xl opacity-50" />

          {/* Card */}
          <div className="relative backdrop-blur-xl bg-card/80 border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
            {/* Header */}
            <div className="space-y-3 text-center mb-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#B3702B]/10 border border-[#B3702B]/20 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-[#B3702B]">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
                Admin Access
              </span>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text">
                Create an account
              </h1>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Set up your admin account to manage your store and products
              </p>
            </div>

            {/* Form */}
            <SignupForm redirectTo={redirectTo} />
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-8 flex items-center justify-center gap-6 text-muted-foreground/60">
          <div className="flex items-center gap-2 text-xs">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Encrypted Data</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2 text-xs">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Secure Setup</span>
          </div>
        </div>
      </div>
    </div>
  )
}
