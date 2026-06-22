import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Providers } from '@/components/providers';
import Navbar from '@/components/navbar';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'CollegeCompass | Discovery & Comparison Platform',
  description:
    'Discover, review, and compare top colleges (IITs, NITs, IIITs, Private Universities) based on fees, ratings, placement records, and available courses.',
  keywords: 'college finder, compare colleges, BTech placements, college reviews, IIT, NIT, IIIT, engineering admission',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn('scroll-smooth', geist.variable)} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'light';
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })()
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 gradient-bg">
        <Providers>
          <Navbar />
          <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 py-6 bg-white dark:bg-zinc-950/60 transition-colors">
            <div className="container mx-auto px-4 text-center text-xs text-zinc-500">
              &copy; {new Date().getFullYear()} CollegeCompass. All rights reserved. Built for College Discovery & Decision Making.
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
