import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import DashboardClient from '@/components/dashboard-client';
import { Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dashboard | CollegeCompass',
  description: 'Manage and compare your saved colleges on CollegeCompass.',
};

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {

  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    redirect('/login?callbackUrl=/dashboard');
  }

  // Fetch user's saved colleges
  const saved = await prisma.savedCollege.findMany({
    where: { userId: session.user.id },
    include: {
      college: {
        include: {
          courses: true,
          placements: true,
        },
      },
    },
    orderBy: {
      id: 'desc',
    },
  });

  const savedColleges = saved.map((s) => s.college);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
          <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
          My Saved Colleges
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          Keep track of institutions you are interested in. Unsave or add them to comparison.
        </p>
      </div>

      {/* Dashboard Client Area */}
      <DashboardClient initialSavedColleges={savedColleges} />

    </div>
  );
}
