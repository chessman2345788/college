import { GraduationCap } from 'lucide-react';

export default function CollegesLoading() {
  return (
    <div className="space-y-6">
      
      {/* Header Banner Skeleton */}
      <div className="flex flex-col gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
          <GraduationCap className="w-8 h-8 text-indigo-500/50 animate-pulse" />
          Discover Colleges
        </h1>
        <div className="w-64 h-4 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded" />
      </div>

      {/* Main Grid Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filter Skeleton */}
        <div className="lg:col-span-1">
          <div className="bg-white/70 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <div className="w-24 h-6 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded" />
              <div className="w-12 h-4 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded" />
            </div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="w-16 h-4 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded" />
                <div className="w-full h-10 bg-zinc-100 dark:bg-zinc-850 animate-pulse rounded-xl" />
              </div>
            ))}
          </div>
        </div>

        {/* Listings Display Skeleton */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex flex-col h-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm"
              >
                {/* Image Skeleton */}
                <div className="h-48 w-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                
                {/* Details Skeletons */}
                <div className="p-5 space-y-4 flex-grow">
                  <div className="space-y-2">
                    <div className="w-20 h-3 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded" />
                    <div className="w-3/4 h-5 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="w-full h-3 bg-zinc-100 dark:bg-zinc-850 animate-pulse rounded" />
                    <div className="w-5/6 h-3 bg-zinc-100 dark:bg-zinc-850 animate-pulse rounded" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 p-3 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/40 rounded-xl">
                    <div className="space-y-1">
                      <div className="w-12 h-3 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded" />
                      <div className="w-16 h-4 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded" />
                    </div>
                    <div className="space-y-1">
                      <div className="w-12 h-3 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded" />
                      <div className="w-16 h-4 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded" />
                    </div>
                  </div>
                </div>

                {/* Footer Skeleton */}
                <div className="p-5 border-t border-zinc-100 dark:border-zinc-800/40 bg-zinc-50/50 dark:bg-zinc-900/20">
                  <div className="w-full h-9 bg-zinc-250 dark:bg-zinc-800 animate-pulse rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
