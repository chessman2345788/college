'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ShieldAlert, RotateCcw, ArrowLeft } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error details
    console.error('Next.js App Router Error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="p-4 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-full mb-6 animate-pulse">
        <ShieldAlert className="w-12 h-12" />
      </div>
      <h1 className="text-3xl font-black text-zinc-900 dark:text-white mb-2">Something Went Wrong</h1>
      <p className="text-zinc-550 dark:text-zinc-400 text-sm sm:text-base max-w-md mb-8 leading-relaxed">
        An unexpected error occurred while displaying this page. We have logged the issue and are looking into it.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Button onClick={reset} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl gap-1.5 shadow-md">
          <RotateCcw className="w-4 h-4" />
          Try Again
        </Button>
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: 'outline' }),
            "rounded-xl flex items-center gap-1.5"
          )}
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
