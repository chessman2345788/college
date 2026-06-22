import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { reviewSchema } from '@/lib/validation';

// POST: Add a new review to a college and update the college's overall average rating
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized access. Please sign in to submit a review.',
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate request body
    const validated = reviewSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors: validated.error.issues,
        },
        { status: 400 }
      );
    }

    const { collegeId, rating, comment } = validated.data;

    // Check if college exists
    const college = await prisma.college.findUnique({
      where: { id: collegeId },
    });

    if (!college) {
      return NextResponse.json(
        {
          success: false,
          message: 'College not found',
        },
        { status: 404 }
      );
    }

    // Create the review using transaction
    const [newReview] = await prisma.$transaction([
      prisma.review.create({
        data: {
          rating,
          comment,
          userName: session.user.name || 'Anonymous Student',
          collegeId,
        },
      }),
    ]);

    // Recalculate college overall rating
    const allReviews = await prisma.review.findMany({
      where: { collegeId },
      select: { rating: true },
    });

    const averageRating =
      allReviews.length > 0
        ? parseFloat((allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1))
        : rating;

    // Update the college with the new average rating
    await prisma.college.update({
      where: { id: collegeId },
      data: { rating: averageRating },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Review submitted successfully',
        data: newReview,
        newAverageRating: averageRating,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Submit review error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error occurred while submitting your review',
      },
      { status: 500 }
    );
  }
}
