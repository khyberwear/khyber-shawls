'use client';

import { useActionState, startTransition, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { loginAction, type LoginState } from '@/app/(auth)/actions';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';

const initialState: LoginState = { error: undefined };

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const search = useSearchParams();
  const callbackUrl = search.get('callbackUrl') ?? '/dashboard';

  // Wrap the server action so we always pass callbackUrl
  const actionWithCallback = async (prev: LoginState, formData: FormData) => {
    formData.set('callbackUrl', callbackUrl);
    return loginAction(prev, formData);
  };

  // React 19: useActionState replaces useFormState
  const [state, formAction] = useActionState<LoginState, FormData>(
    actionWithCallback,
    initialState
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    startTransition(() => {
      formAction(formData);
      // Reset loading after a short delay (action will redirect on success)
      setTimeout(() => setIsLoading(false), 3000);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* also include a hidden field so the value shows up if you submit w/o JS */}
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      {/* Email Field */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground/90" htmlFor="login-email">
          Email address
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Mail className="h-4 w-4 text-muted-foreground group-focus-within:text-[#B3702B] transition-colors" />
          </div>
          <input
            id="login-email"
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
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground/90" htmlFor="login-password">
            Password
          </label>
          <a href="#" className="text-xs text-muted-foreground hover:text-[#B3702B] transition-colors">
            Forgot password?
          </a>
        </div>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Lock className="h-4 w-4 text-muted-foreground group-focus-within:text-[#B3702B] transition-colors" />
          </div>
          <input
            id="login-password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            placeholder="••••••••"
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
      </div>

      {/* Error Message */}
      {state?.error && (
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
        disabled={isLoading}
        className="relative w-full group overflow-hidden rounded-xl bg-gradient-to-r from-[#B3702B] to-[#8B5A2B] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#B3702B]/25 
                 hover:shadow-[#B3702B]/40 hover:scale-[1.02] 
                 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100
                 transition-all duration-300"
      >
        {/* Shine effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <span className="relative flex items-center justify-center gap-2">
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign in to your account
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </span>
      </button>
    </form>
  );
}
