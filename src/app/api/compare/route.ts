import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idsString = searchParams.get('ids');

    if (!idsString) {
      return NextResponse.json(
        {
          success: false,
          message: 'At least one college ID is required for comparison',
        },
        { status: 400 }
      );
    }

    const ids = idsString.split(',').map((id) => id.trim()).filter((id) => id.length > 0);

    if (ids.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'No valid college IDs provided',
        },
        { status: 400 }
      );
    }

    if (ids.length > 3) {
      return NextResponse.json(
        {
          success: false,
          message: 'You can compare a maximum of 3 colleges at once',
        },
        { status: 400 }
      );
    }

    // Fetch details for the requested colleges
    const colleges = await prisma.college.findMany({
      where: {
        id: { in: ids },
      },
      include: {
        courses: true,
        placements: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: colleges,
    });
  } catch (error) {
    console.error('Fetch compare API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error occurred while retrieving comparison data',
      },
      { status: 500 }
    );
  }
}
