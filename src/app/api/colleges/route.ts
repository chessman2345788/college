import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { searchParamsSchema } from '@/lib/validation';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse queries
    const queryParams: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });

    const validated = searchParamsSchema.safeParse(queryParams);
    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid search parameters',
          errors: validated.error.issues,
        },
        { status: 400 }
      );
    }

    const { page, limit, search, location, rating, sort } = validated.data;

    // Build query filters
    const where: Prisma.CollegeWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { courses: { some: { name: { contains: search, mode: 'insensitive' } } } },
      ];
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    if (rating > 0) {
      where.rating = { gte: rating };
    }

    // Sorting options
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

    // Pagination calculations
    const skip = (page - 1) * limit;

    // Query database
    const [colleges, total] = await prisma.$transaction([
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
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        colleges,
        pagination: {
          total,
          page,
          limit,
          totalPages,
        },
      },
    });
  } catch (error) {
    console.error('Fetch colleges API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error occurred while retrieving colleges',
      },
      { status: 500 }
    );
  }
}
