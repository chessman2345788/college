import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export const savedCollegeSchema = z.object({
  collegeId: z.string().uuid({ message: 'Invalid college ID format' }),
});

export const searchParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(9),
  search: z.string().optional().default(''),
  location: z.string().optional().default(''),
  fees: z.string().optional().default(''), // e.g. "0-500000" or just max fees
  rating: z.coerce.number().min(0).max(5).optional().default(0),
  sort: z.enum(['rating_desc', 'rating_asc', 'fees_desc', 'fees_asc']).optional().default('rating_desc'),
});

export const reviewSchema = z.object({
  collegeId: z.string().uuid({ message: 'Invalid college ID format' }),
  rating: z.coerce.number().min(1, { message: 'Rating must be at least 1' }).max(5, { message: 'Rating cannot exceed 5' }),
  comment: z.string().min(5, { message: 'Comment must be at least 5 characters long' }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type SearchParamsInput = z.infer<typeof searchParamsSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
