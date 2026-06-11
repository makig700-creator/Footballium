import { z } from 'zod';

export const createPlayerSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  position: z.enum(["GOALKEEPER", "DEFENDER", "MIDFIELDER", "FORWARD"]),
  number: z.number().int().min(1).max(99),
  age: z.number().int().min(14).max(50).optional(),
  photo: z.string().optional(),
});
