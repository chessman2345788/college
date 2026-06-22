'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, GraduationCap } from 'lucide-react';
import CollegeCard from '@/components/college-card';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Course {
  id: string;
  name: string;
}

interface Placement {
  avgPackage: number;
  highestPackage: number;
}

interface College {
  id: string;
  name: string;
  location: string;
  description: string;
  fees: number;
  rating: number;
  imageUrl: string;
  courses: Course[];
  placements: Placement[];
}

interface DashboardClientProps {
  initialSavedColleges: College[];
}

export default function DashboardClient({ initialSavedColleges }: DashboardClientProps) {
  const [savedColleges, setSavedColleges] = useState<College[]>(initialSavedColleges);

  const handleSaveToggle = (collegeId: string, isSaved: boolean) => {
    if (!isSaved) {
      // Remove from list
      setSavedColleges((prev) => prev.filter((col) => col.id !== collegeId));
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Overview stats */}
      <div className="bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-lg text-zinc-900 dark:text-white">Bookmark Summary</h2>
          <p className="text-xs text-zinc-500">
            You have saved {savedColleges.length} out of 100 available institutions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/compare"
            className={cn(buttonVariants({ variant: 'outline' }), "rounded-xl")}
          >
            Launch Comparator
          </Link>
          <Link
            href="/colleges"
            className={cn(buttonVariants({ variant: 'default' }), "bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl")}
          >
            Explore More
          </Link>
        </div>
      </div>

      {savedColleges.length === 0 ? (
        
        /* Empty State */
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white/50 dark:bg-zinc-900/30 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl min-h-[350px]">
          <div className="p-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 rounded-full mb-4">
            <Heart className="w-10 h-10" />
          </div>
          <h3 className="font-bold text-xl text-zinc-900 dark:text-white">No Saved Colleges</h3>
          <p className="text-zinc-550 dark:text-zinc-400 text-sm max-w-sm mt-2 mb-6 leading-relaxed">
            You haven&apos;t saved any colleges yet. Browse the listing catalog to bookmark top institutions.
          </p>
          <Link
            href="/colleges"
            className={cn(buttonVariants({ variant: 'default' }), "bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center gap-1.5")}
          >
            <GraduationCap className="w-4 h-4" />
            Explore Listings
          </Link>
        </div>
      ) : (
        
        /* Saved Colleges Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedColleges.map((college) => (
            <CollegeCard
              key={college.id}
              college={college}
              isInitiallySaved={true}
              onSaveToggle={handleSaveToggle}
            />
          ))}
        </div>
      )}

    </div>
  );
}
