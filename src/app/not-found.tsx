import Link from 'next/link';
import { Compass, ArrowLeft } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="p-4 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full mb-6 animate-pulse">
        <Compass className="w-12 h-12" />
      </div>
      <h1 className="text-4xl font-black text-zinc-900 dark:text-white mb-2">404 - Page Not Found</h1>
      <p className="text-zinc-550 dark:text-zinc-400 text-sm sm:text-base max-w-md mb-8 leading-relaxed">
        The college, page, or resource you are looking for does not exist, or has been moved to a different location.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
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
        <Link
          href="/colleges"
          className={cn(
            buttonVariants({ variant: 'default' }),
            "bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
          )}
        >
          Explore Colleges
        </Link>
      </div>
    </div>
  );
}
