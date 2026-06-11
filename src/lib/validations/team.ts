import { z } from 'zod';

export const createTeamSchema = z.object({
  name: z.string().min(2).max(100),
  city: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  logo: z.string().optional(),
  stadium: z.string().optional(),
  shortName: z.string().min(2).max(10).optional(),
  founded: z.number().int().optional(),
});
