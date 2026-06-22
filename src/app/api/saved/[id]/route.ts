import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const userId = session.user.id;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: 'College ID is required',
        },
        { status: 400 }
      );
    }

    // Delete the saved record matching user and college ID
    const deleteResult = await prisma.savedCollege.deleteMany({
      where: {
        userId,
        collegeId: id,
      },
    });

    if (deleteResult.count === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Saved college record not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'College removed from saved list successfully',
    });
  } catch (error) {
    console.error('Delete saved college error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error occurred while removing the saved college',
      },
      { status: 500 }
    );
  }
}
