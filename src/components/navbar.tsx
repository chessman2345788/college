'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Compass, GraduationCap, LogIn, LogOut, LayoutDashboard, GitCompare, User, Sun, Moon } from 'lucide-react';
import { useCompare } from '@/hooks/use-compare';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme-provider';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { compareIds } = useCompare();
  const { theme, toggleTheme, mounted } = useTheme();

  const isActive = (path: string) => {
    if (path === '/colleges' && pathname.startsWith('/colleges')) return true;
    return pathname === path;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/75 dark:bg-zinc-950/75 backdrop-blur-md transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-indigo-500 text-white rounded-xl shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
            CollegeCompass
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/colleges"
            className={`text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5 ${
              isActive('/colleges') || pathname === '/'
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Find Colleges
          </Link>
          <Link
            href="/compare"
            className={`text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5 relative ${
              isActive('/compare')
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            <GitCompare className="w-4 h-4" />
            Compare
            {compareIds.length > 0 && (
              <span className="absolute -top-2 -right-3 px-1.5 py-0.5 text-[10px] font-bold bg-indigo-600 text-white rounded-full scale-90 animate-pulse">
                {compareIds.length}
              </span>
            )}
          </Link>
          {status === 'authenticated' && (
            <Link
              href="/dashboard"
              className={`text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5 ${
                isActive('/dashboard')
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-zinc-600 dark:text-zinc-400'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
          )}
        </nav>

        {/* Right side: Auth Controls */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            title="Toggle Theme"
          >
            {mounted && theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-500 animate-pulse" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </Button>

          {status === 'loading' ? (
            <div className="w-20 h-8 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded-lg" />
          ) : status === 'authenticated' ? (
            <div className="flex items-center gap-3">
              {/* User badge */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                <User className="w-3.5 h-3.5 text-zinc-500" />
                <span>{session.user?.name}</span>
              </div>
              
              {/* Log out */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-zinc-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "hidden sm:flex items-center gap-1.5"
                )}
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                )}
              >
                Register
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
