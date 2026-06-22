import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: 'College ID is required',
        },
        { status: 400 }
      );
    }

    const college = await prisma.college.findUnique({
      where: { id },
      include: {
        courses: true,
        placements: true,
        reviews: {
          orderBy: {
            id: 'desc', // order reviews newest first
          },
        },
      },
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

    return NextResponse.json({
      success: true,
      data: college,
    });
  } catch (error) {
    console.error('Fetch college details API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error occurred while retrieving college details',
      },
      { status: 500 }
    );
  }
}
