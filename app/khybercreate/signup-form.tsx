'use client'

import Link from "next/link"
import { useEffect, useRef, useActionState, useState } from "react"
import { registerAction } from "@/app/(auth)/actions"
import { User, Mail, Lock, Eye, EyeOff, Loader2, Check } from "lucide-react"

const initialState = { error: undefined as string | undefined }

export function SignupForm({ redirectTo }: { redirectTo?: string }) {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction, isPending] = useActionState(registerAction, initialState)
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (!state.error) {
      formRef.current?.reset()
      setPassword('')
    }
  }, [state.error])

  // Password strength indicators
  const hasMinLength = password.length >= 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const isStrongPassword = hasMinLength && hasUppercase && hasLowercase && hasNumber

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      <input type="hidden" name="redirectTo" value={redirectTo ?? ""} />

      {/* Full Name Field */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground/90" htmlFor="signup-name">
          Full name
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <User className="h-4 w-4 text-muted-foreground group-focus-within:text-[#B3702B] transition-colors" />
          </div>
          <input
            id="signup-name"
            name="name"
            required
            placeholder="Amina Khan"
            className="w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 py-3 text-sm outline-none 
                     placeholder:text-muted-foreground/50
                     focus:border-[#B3702B]/50 focus:bg-white/10 focus:ring-2 focus:ring-[#B3702B]/20
                     transition-all duration-300"
          />
        </div>
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground/90" htmlFor="signup-email">
          Email address
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Mail className="h-4 w-4 text-muted-foreground group-focus-within:text-[#B3702B] transition-colors" />
          </div>
          <input
            id="signup-email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 py-3 text-sm outline-none 
                     placeholder:text-muted-foreground/50
                     focus:border-[#B3702B]/50 focus:bg-white/10 focus:ring-2 focus:ring-[#B3702B]/20
                     transition-all duration-300"
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground/90" htmlFor="signup-password">
          Password
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Lock className="h-4 w-4 text-muted-foreground group-focus-within:text-[#B3702B] transition-colors" />
          </div>
          <input
            id="signup-password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-12 py-3 text-sm outline-none 
                     placeholder:text-muted-foreground/50
                     focus:border-[#B3702B]/50 focus:bg-white/10 focus:ring-2 focus:ring-[#B3702B]/20
                     transition-all duration-300"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Password strength indicators */}
        {password && (
          <div className="grid grid-cols-2 gap-2 pt-2">
            <PasswordCheck passed={hasMinLength} label="8+ characters" />
            <PasswordCheck passed={hasUppercase} label="Uppercase" />
            <PasswordCheck passed={hasLowercase} label="Lowercase" />
            <PasswordCheck passed={hasNumber} label="Number" />
          </div>
        )}
      </div>

      {/* Error Message */}
      {state.error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
          <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-red-500">{state.error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending || !isStrongPassword}
        className="relative w-full group overflow-hidden rounded-xl bg-gradient-to-r from-[#B3702B] to-[#8B5A2B] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#B3702B]/25 
                 hover:shadow-[#B3702B]/40 hover:scale-[1.02] 
                 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100
                 transition-all duration-300"
      >
        {/* Shine effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <span className="relative flex items-center justify-center gap-2">
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              Create account
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </span>
      </button>

      {/* Footer */}
      <div className="pt-4 border-t border-white/10">
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/khyberopen"
            className="font-medium text-[#B3702B] hover:text-[#8B5A2B] transition-colors underline-offset-4 hover:underline"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </form>
  )
}

function PasswordCheck({ passed, label }: { passed: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-1.5 text-xs transition-colors ${passed ? 'text-green-500' : 'text-muted-foreground/50'}`}>
      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors ${passed ? 'bg-green-500/20' : 'bg-white/5'}`}>
        {passed && <Check className="w-2.5 h-2.5" />}
      </div>
      {label}
    </div>
  )
}
