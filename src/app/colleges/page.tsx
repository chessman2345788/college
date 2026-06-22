import { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { searchParamsSchema } from '@/lib/validation';
import CollegeCard from '@/components/college-card';
import CollegeFilters from '@/components/college-filters';
import Pagination from '@/components/pagination';
import { GraduationCap, Inbox } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Find Colleges | CollegeCompass',
  description: 'Search, filter, and discover the best engineering and management colleges in India.',
};


interface SearchParamsProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CollegesPage({ searchParams }: SearchParamsProps) {
  const resolvedSearchParams = await searchParams;

  // 1. Parse query variables using our validation schema
  const queryParams: Record<string, string> = {};
  Object.entries(resolvedSearchParams).forEach(([key, value]) => {
    if (typeof value === 'string') {
      queryParams[key] = value;
    }
  });

  const parsed = searchParamsSchema.safeParse(queryParams);
  const validated = parsed.success ? parsed.data : {
    page: 1,
    limit: 9,
    search: '',
    location: '',
    rating: 0,
    sort: 'rating_desc' as const,
  };

  const { page, limit, search, location, rating, sort } = validated;

  // 2. Build where filter for database querying
  const where: Prisma.CollegeWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { location: { contains: search, mode: 'insensitive' } },
      { courses: { some: { name: { contains: search, mode: 'insensitive' } } } },
    ];
  }

  if (location && location !== 'all') {
    where.location = { contains: location, mode: 'insensitive' };
  }

  if (rating > 0) {
    where.rating = { gte: rating };
  }

  // 3. Build order sorting for database querying
  let orderBy: Prisma.CollegeOrderByWithRelationInput = {};
  if (sort === 'rating_desc') {
    orderBy = { rating: 'desc' };
  } else if (sort === 'rating_asc') {
    orderBy = { rating: 'asc' };
  } else if (sort === 'fees_desc') {
    orderBy = { fees: 'desc' };
  } else if (sort === 'fees_asc') {
    orderBy = { fees: 'asc' };
  }

  // 4. Fetch data in parallel
  const skip = (page - 1) * limit;

  // Retrieve locations, colleges data, and count
  const [dbColleges, totalCount, dbLocations] = await prisma.$transaction([
    prisma.college.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        courses: true,
        placements: true,
      },
    }),
    prisma.college.count({ where }),
    prisma.college.findMany({
      select: { location: true },
      distinct: ['location'],
    }),
  ]);

  // Extract unique city/state locations for search filter
  const uniqueLocations = Array.from(
    new Set(dbLocations.map((col) => col.location.split(',')[0].trim()))
  ).sort();

  // 5. Check user authenticated session to fetch bookmark states
  const session = await getServerSession(authOptions);
  let savedCollegeIds: string[] = [];

  if (session?.user?.id) {
    const savedColleges = await prisma.savedCollege.findMany({
      where: { userId: session.user.id },
      select: { collegeId: true },
    });
    savedCollegeIds = savedColleges.map((s) => s.collegeId);
  }

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
          <GraduationCap className="w-8 h-8 text-indigo-500" />
          Discover Colleges
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          Showing {totalCount} colleges matching your search criteria. Sort by fees, packages, or rating.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <CollegeFilters locations={uniqueLocations} />
        </div>

        {/* Listings Display */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {dbColleges.length === 0 ? (
            
            /* Empty State */
            <div className="flex flex-col items-center justify-center p-12 text-center bg-white/50 dark:bg-zinc-900/30 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl min-h-[400px]">
              <div className="p-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 rounded-full mb-4">
                <Inbox className="w-10 h-10" />
              </div>
              <h3 className="font-bold text-xl text-zinc-900 dark:text-white">No Colleges Found</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-sm mt-2 leading-relaxed">
                We couldn&apos;t find any colleges matching your active filters. Try adjusting your search query, location, or rating settings.
              </p>
            </div>
          ) : (
            <>
              {/* College Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dbColleges.map((college) => (
                  <CollegeCard
                    key={college.id}
                    college={college}
                    isInitiallySaved={savedCollegeIds.includes(college.id)}
                  />
                ))}
              </div>

              {/* Server-Side Pagination */}
              <Pagination currentPage={page} totalPages={totalPages} />
            </>
          )}
        </div>

      </div>

    </div>
  );
}
