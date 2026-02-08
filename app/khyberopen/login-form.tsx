'use client';

import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import { loginAction, type LoginState } from '@/app/(auth)/actions';

const initialState: LoginState = { error: undefined };

export default function LoginForm() {
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

  return (
    <form action={formAction} className="space-y-6">
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
        <input
          id="login-password"
          name="password"
          type="password"
          required
          placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
          className="rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40"
        />
      </div>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

      <button type="submit" className="w-full rounded-md bg-black px-4 py-2 text-white hover:bg-black/90 transition">
        Log in
      </button>
    </form>
  );
}
