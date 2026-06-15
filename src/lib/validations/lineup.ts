import { z } from 'zod'

const basePlayerSchema = z.object({
  playerId: z.string().min(1, 'Оберіть гравця'),
  slotLabel: z.string().min(1, 'Вкажіть номер/позицію'),
  order: z.coerce.number().int().min(0),
})

export const getLineupSchema = (format: string = '11x11') => {
  if (format === '5x5') {
    return z.object({
      matchId: z.string().min(1),
      formation: z.string().default('5x5'),
      starters: z.array(basePlayerSchema)
        .min(5, 'Мінімум 5 гравців у заявці')
        .max(14, 'Максимум 14 гравців у заявці'),
      substitutes: z.array(basePlayerSchema).max(0),
    }).superRefine((data, ctx) => {
      const playerIds = data.starters.map(s => s.playerId);
      if (new Set(playerIds).size !== playerIds.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Один і той самий гравець не може бути заявлений двічі",
          path: ["starters"],
        });
      }

      const numbers = data.starters.map(s => s.slotLabel);
      if (new Set(numbers).size !== numbers.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Номери гравців не можуть повторюватись",
          path: ["starters"],
        });
      }

      data.starters.forEach((s, index) => {
        const num = parseInt(s.slotLabel, 10);
        if (isNaN(num) || num < 1 || num > 100) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Номер гравця (рядок ${index + 1}) має бути від 1 до 100`,
            path: ["starters"],
          });
        }
      });
    });
  }

  return z.object({
    matchId: z.string().min(1),
    formation: z.enum(['4-3-3', '4-4-2', '4-2-3-1', '3-5-2', '5-3-2', '4-5-1']),
    starters: z.array(basePlayerSchema).length(11, 'Необхідно рівно 11 гравців стартового складу'),
    substitutes: z.array(basePlayerSchema).max(7, 'Максимум 7 запасних гравців'),
  }).superRefine((data, ctx) => {
    const allPlayers = [...data.starters.map(s => s.playerId), ...data.substitutes.map(s => s.playerId)];
    if (new Set(allPlayers).size !== allPlayers.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Гравець не може дублюватись у складі",
        path: ["root"],
      });
    }

    const goalkeeperSlots = data.starters.filter((s) => s.slotLabel.toUpperCase().includes('GK'))
    if (goalkeeperSlots.length !== 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'У стартовому складі має бути рівно 1 воротар',
        path: ["starters"]
      });
    }
  });
}

export const defaultLineupSchema = getLineupSchema('11x11')
export type LineupFormData = {
  matchId: string;
  formation: string;
  starters: { playerId: string; slotLabel: string; order: number; }[];
  substitutes: { playerId: string; slotLabel: string; order: number; }[];
}
