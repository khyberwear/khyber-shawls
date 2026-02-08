// // export const runtime = 'edge';
import { redirect } from "next/navigation"
import { Metadata } from 'next';

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
    <div className="mx-auto max-w-md space-y-8 rounded-3xl border bg-card p-10 shadow-sm">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Create an admin account</h1>
        <p className="text-sm text-muted-foreground">
          Only admin accounts can be created. You will have full access to the store management dashboard.
        </p>
      </div>
      <SignupForm redirectTo={redirectTo} />
    </div>
  )
}
