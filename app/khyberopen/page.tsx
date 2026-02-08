// // export const runtime = 'edge';
import LoginForm from './login-form';
import { Metadata } from 'next';

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
    <div className="mx-auto max-w-md space-y-8 rounded-3xl border bg-card p-10 shadow-sm">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Log in to your account to continue
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
