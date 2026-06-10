import * as z from "zod";

const baseTournamentSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().optional(),
  bracketType: z.enum(["ROUND_ROBIN", "SINGLE_ELIMINATION"]),
  maxTeams: z.coerce.number().min(2).max(64),
  minTeams: z.coerce.number().min(2),
  registrationDeadline: z.coerce.date(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

export const createTournamentSchema = baseTournamentSchema.refine(d => d.startDate > d.registrationDeadline, {
  message: "Дата старту має бути після дедлайну реєстрації",
  path: ["startDate"]
});

export const updateTournamentSchema = baseTournamentSchema.partial().extend({
  status: z.enum(["DRAFT", "REGISTRATION", "ONGOING", "FINISHED"]).optional()
});

export type CreateTournamentInput = z.infer<typeof createTournamentSchema>;
export type UpdateTournamentInput = z.infer<typeof updateTournamentSchema>;

