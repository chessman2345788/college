import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { savedCollegeSchema } from '@/lib/validation';

// GET: Retrieve all saved colleges for the authenticated user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized access',
        },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Fetch saved colleges with details needed for display
    const saved = await prisma.savedCollege.findMany({
      where: { userId },
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

    return NextResponse.json({
      success: true,
      data: saved.map((s) => s.college),
    });
  } catch (error) {
    console.error('Fetch saved colleges error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error occurred while fetching saved colleges',
      },
      { status: 500 }
    );
  }
}

// POST: Save a college
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized access',
        },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return NextResponse.json(
        {
          success: false,
          message: 'User session is invalid (e.g. database re-seeded). Please log out and sign in again.',
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate request
    const validated = savedCollegeSchema.safeParse(body);
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

    const { collegeId } = validated.data;

    // Verify college exists
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

    // Check if already saved (idempotent)
    const existing = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: {
          userId,
          collegeId,
        },
      },
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'College is already saved',
      });
    }

    // Save college
    await prisma.savedCollege.create({
      data: {
        userId,
        collegeId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'College saved successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Save college error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error occurred while saving the college',
      },
      { status: 500 }
    );
  }
}
