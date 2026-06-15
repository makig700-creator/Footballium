import * as z from "zod";

const baseTournamentSchema = z.object({
  name: z.string().min(3, { message: "Назва має містити мінімум 3 символи" }).max(100),
  description: z.string().optional(),
  bracketType: z.enum(["ROUND_ROBIN", "SINGLE_ELIMINATION"]),
  format: z.enum(["5x5", "8x8", "11x11"], { required_error: "Оберіть формат турніру" }),
  maxTeams: z.coerce.number().min(2, { message: "Мінімум 2 команди" }).max(64),
  minTeams: z.coerce.number().min(2, { message: "Мінімум 2 команди" }),
  registrationDeadline: z.coerce.date({ required_error: "Оберіть дату" }),
  startDate: z.coerce.date({ required_error: "Оберіть дату" }),
  endDate: z.coerce.date({ required_error: "Оберіть дату" }),
});

export const createTournamentSchema = baseTournamentSchema
  .refine(d => d.startDate > d.registrationDeadline, {
    message: "Дата старту має бути після дедлайну реєстрації",
    path: ["startDate"]
  })
  .refine(d => d.minTeams <= d.maxTeams, {
    message: "Мінімальна кількість команд не може бути більшою за максимальну",
    path: ["minTeams"]
  });

export const updateTournamentSchema = baseTournamentSchema.partial().extend({
  status: z.enum(["DRAFT", "REGISTRATION", "ONGOING", "FINISHED"]).optional()
});

export type CreateTournamentInput = z.infer<typeof createTournamentSchema>;
export type UpdateTournamentInput = z.infer<typeof updateTournamentSchema>;

