import { z } from "zod";

export const createTournamentSchema = z
  .object({
    name: z.string().min(3).max(100),
    description: z.string().optional(),
    logo: z.string().url().optional().or(z.literal("")),
    bracketType: z.enum(["ROUND_ROBIN", "SINGLE_ELIMINATION", "DOUBLE_ELIMINATION"]),
    maxTeams: z.coerce.number().min(2).max(64),
    minTeams: z.coerce.number().min(2).max(64),
    registrationDeadline: z.coerce.date(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
  })
  .refine((data) => data.startDate > data.registrationDeadline, {
    message: "Start date must be after registration deadline",
    path: ["startDate"],
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date must be after or equal to start date",
    path: ["endDate"],
  })
  .refine((data) => data.maxTeams >= data.minTeams, {
    message: "Max teams must be greater than or equal to min teams",
    path: ["maxTeams"],
  });

export const updateTournamentSchema = createTournamentSchema.partial().extend({
  status: z.enum(["DRAFT", "REGISTRATION", "ONGOING", "FINISHED"]).optional(),
});
