'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { Compass, Mail, Lock, Loader2, LogIn } from 'lucide-react';
import { useToast } from '@/components/providers';
import { loginSchema } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Redirect to dashboard if already logged in
  if (status === 'authenticated') {
    router.replace('/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const formData = { email, password };
    const validated = loginSchema.safeParse(formData);

    if (!validated.success) {
      const fieldErrors: { [key: string]: string } = {};
      validated.error.issues.forEach((err) => {
        const fieldName = err.path[0] as string;
        fieldErrors[fieldName] = err.message;
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn('credentials', {
        email: validated.data.email,
        password: validated.data.password,
        redirect: false,
      });

      if (result?.error) {
        toast(result.error || 'Invalid credentials', 'error');
        setErrors({ auth: result.error || 'Invalid credentials' });
      } else {
        toast('Logged in successfully!', 'success');
        
        // Check for redirect callback
        const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard';
        router.replace(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      toast('An unexpected network error occurred.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[75vh] px-4">
      <Card className="w-full max-w-md bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200/85 dark:border-zinc-800/85 rounded-3xl shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto p-3 bg-indigo-500 text-white rounded-2xl w-fit shadow-md shadow-indigo-500/20 mb-4 animate-float">
            <Compass className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-black text-zinc-900 dark:text-white">Welcome Back</CardTitle>
          <CardDescription className="text-xs text-zinc-500">
            Sign in to access your dashboard and manage saved colleges.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {errors.auth && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-455 text-xs font-semibold rounded-xl text-center">
                {errors.auth}
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-1">
              <label htmlFor="email" className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  id="email"
                  type="email"
                  placeholder="e.g. john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-9 pr-4 py-2 border bg-white dark:bg-zinc-950 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/25 ${
                    errors.email ? 'border-rose-500' : 'border-zinc-200 dark:border-zinc-800'
                  }`}
                />
              </div>
              {errors.email && <p className="text-xs font-semibold text-rose-500">{errors.email}</p>}
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label htmlFor="password" className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-9 pr-4 py-2 border bg-white dark:bg-zinc-950 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/25 ${
                    errors.password ? 'border-rose-500' : 'border-zinc-200 dark:border-zinc-800'
                  }`}
                />
              </div>
              {errors.password && <p className="text-xs font-semibold text-rose-500">{errors.password}</p>}
            </div>

            {/* Login button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-2.5 mt-2 flex items-center justify-center gap-1.5"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <LogIn className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-zinc-100 dark:border-zinc-800/40 p-4 bg-zinc-50/50 dark:bg-zinc-900/10 rounded-b-3xl">
          <p className="text-xs text-zinc-500">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-bold text-indigo-600 hover:underline dark:text-indigo-400">
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
