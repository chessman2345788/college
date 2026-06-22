import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import CollegeCard from '@/components/college-card';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { GraduationCap, Search, Trophy, Briefcase, Award } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {

  // 1. Fetch top 3 colleges based on rating
  const featuredColleges = await prisma.college.findMany({
    orderBy: { rating: 'desc' },
    take: 3,
    include: {
      courses: true,
      placements: true,
    },
  });

  // 2. Fetch saved colleges for bookmark states
  const session = await getServerSession(authOptions);
  let savedCollegeIds: string[] = [];

  if (session?.user?.id) {
    const savedColleges = await prisma.savedCollege.findMany({
      where: { userId: session.user.id },
      select: { collegeId: true },
    });
    savedCollegeIds = savedColleges.map((s) => s.collegeId);
  }

  return (
    <div className="space-y-16 py-8">
      
      {/* 1. Hero Section */}
      <section className="relative flex flex-col items-center text-center max-w-4xl mx-auto px-4 gap-6 mt-6">
        
        {/* Animated Accent */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-700 dark:text-indigo-300 text-xs font-bold tracking-wide uppercase select-none animate-float">
          <Award className="w-4 h-4" />
          The Ultimate Discovery Tool
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none text-zinc-900 dark:text-white">
          Find Your Perfect College Match with{' '}
          <span className="text-blue-600 dark:text-blue-400">CollegeCompass</span>
        </h1>

        {/* Subtitle */}
        <p className="text-zinc-600 dark:text-zinc-300 text-base sm:text-lg max-w-2xl leading-relaxed">
          Compare 100+ top IITs, NITs, IIITs, and Private Universities. Analyze fee structures, course packages, student reviews, and placement stats side-by-side.
        </p>

        {/* Search Redirect Bar */}
        <form
          action="/colleges"
          method="GET"
          className="w-full max-w-xl flex items-center gap-2 p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-lg shadow-indigo-500/5 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all"
        >
          <div className="flex-grow flex items-center pl-3">
            <Search className="w-5 h-5 text-zinc-400 mr-2" />
            <input
              name="search"
              type="text"
              placeholder="Search by college name, city, or courses (e.g. CSE)..."
              className="w-full bg-transparent border-none text-sm outline-none focus:ring-0 text-zinc-900 dark:text-white"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/25 transition-all"
          >
            Explore
          </button>
        </form>

      </section>

      {/* 2. Key Statistics Counters */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-4 p-6 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl shadow-sm">
          <div className="p-3 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-2xl font-black text-zinc-900 dark:text-white">100+</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wider">Top Institutions</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 p-6 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl shadow-sm">
          <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-2xl font-black text-zinc-900 dark:text-white">4.9 / 5.0</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wider">Student Rating Avg</span>
          </div>
        </div>

        <div className="flex items-center gap-4 p-6 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl shadow-sm">
          <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-2xl font-black text-zinc-900 dark:text-white">1.5 Crore</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wider">Highest Placement Package</span>
          </div>
        </div>
      </section>

      {/* 3. Explore Categories Section */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white">Explore Categories</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Jump directly into specialized institutional listings</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <Link
            href="/colleges?search=IIT"
            className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/30 text-center font-bold hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:-translate-y-1 shadow-sm hover:shadow-md transition-all duration-300"
          >
            Indian Institutes of Tech (IITs)
          </Link>
          <Link
            href="/colleges?search=NIT"
            className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/30 text-center font-bold hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:-translate-y-1 shadow-sm hover:shadow-md transition-all duration-300"
          >
            National Institutes of Tech (NITs)
          </Link>
          <Link
            href="/colleges?search=IIIT"
            className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/30 text-center font-bold hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:-translate-y-1 shadow-sm hover:shadow-md transition-all duration-300"
          >
            Indian Institutes of Info Tech (IIITs)
          </Link>
          <Link
            href="/colleges?sort=fees_asc"
            className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/30 text-center font-bold hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:-translate-y-1 shadow-sm hover:shadow-md transition-all duration-300"
          >
            Budget-Friendly Universities
          </Link>
        </div>
      </section>

      {/* 4. Dynamic Featured Colleges Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-zinc-900 dark:text-white">Top Rated Colleges</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Discover elite academic performance institutions</p>
          </div>
          <Link
            href="/colleges"
            className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold hover:underline flex items-center gap-1"
          >
            Browse all colleges
            <span>&rarr;</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredColleges.map((college) => (
            <CollegeCard
              key={college.id}
              college={college}
              isInitiallySaved={savedCollegeIds.includes(college.id)}
            />
          ))}
        </div>
      </section>

      {/* 5. Tool Walkthrough Banner */}
      <section className="relative overflow-hidden p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-zinc-950 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-xl">
          <div className="inline-flex px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-indigo-200">
            Compare Feature
          </div>
          <h3 className="text-2xl sm:text-3xl font-black leading-tight">
            Can&apos;t decide between multiple colleges?
          </h3>
          <p className="text-sm text-indigo-200/80 leading-relaxed">
            Add up to 3 colleges using the compare button on the cards, then load the comparison dashboard to map them side-by-side across fees, placements, ratings, and course lists.
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/compare"
            className="px-6 py-3 bg-white text-indigo-950 font-bold rounded-xl text-sm hover:scale-105 transition-all shadow-md"
          >
            Launch Comparator
          </Link>
          <Link
            href="/colleges"
            className="px-6 py-3 border border-white/20 text-white font-bold rounded-xl text-sm hover:bg-white/10 hover:border-white transition-all"
          >
            Explore Colleges
          </Link>
        </div>
      </section>

    </div>
  );
}
