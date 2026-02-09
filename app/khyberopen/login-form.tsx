'use client';

import { useActionState, startTransition, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { loginAction, type LoginState } from '@/app/(auth)/actions';
import { Eye, EyeOff } from 'lucide-react';

const initialState: LoginState = { error: undefined };

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
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
    const formData = new FormData(event.currentTarget);
    startTransition(() => {
      formAction(formData);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* also include a hidden field so the value shows up if you submit w/o JS */}
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <div className="grid gap-3">
        <label className="text-sm font-medium" htmlFor="login-email">
          Email address
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40"
        />
      </div>

      <div className="grid gap-3">
        <label className="text-sm font-medium" htmlFor="login-password">
          Password
        </label>
        <div className="relative">
          <input
            id="login-password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            placeholder="••••••••"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
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

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

      <button type="submit" className="w-full rounded-md bg-black px-4 py-2 text-white hover:bg-black/90 transition">
        Log in
      </button>
    </form>
  );
}
