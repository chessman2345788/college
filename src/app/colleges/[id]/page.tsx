import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import CollegeDetailClient from '@/components/college-detail-client';

interface CollegePageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';


// Generate dynamic metadata titles
export async function generateMetadata({ params }: CollegePageProps): Promise<Metadata> {
  const { id } = await params;
  const college = await prisma.college.findUnique({
    where: { id },
    select: { name: true, location: true },
  });

  if (!college) {
    return {
      title: 'College Not Found | CollegeCompass',
    };
  }

  return {
    title: `${college.name} - Placement, Fees, Reviews | CollegeCompass`,
    description: `Get details on fees structure, courses available, placements average package, and student reviews for ${college.name} at ${college.location}.`,
  };
}

export default async function CollegeDetailPage({ params }: CollegePageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  // Fetch college with relations
  const college = await prisma.college.findUnique({
    where: { id },
    include: {
      courses: true,
      placements: true,
      reviews: {
        orderBy: {
          id: 'desc',
        },
      },
    },
  });

  if (!college) {
    notFound();
  }

  // Check if college is saved by the current user
  const session = await getServerSession(authOptions);
  let isSaved = false;

  if (session?.user?.id) {
    const savedRecord = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: {
          userId: session.user.id,
          collegeId: id,
        },
      },
    });
    isSaved = !!savedRecord;
  }

  return <CollegeDetailClient college={college} isInitiallySaved={isSaved} />;
}
