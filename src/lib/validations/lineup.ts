import { z } from 'zod'

export const lineupSchema = z.object({
  matchId: z.string().cuid(),
  formation: z.enum(['4-3-3', '4-4-2', '4-2-3-1', '3-5-2', '5-3-2', '4-5-1']),
  starters: z
    .array(
      z.object({
        playerId: z.string().cuid(),
        slotLabel: z.string().min(1),
        order: z.number().int().min(0).max(10),
      })
    )
    .length(11, 'Необхідно рівно 11 гравців стартового складу'),
  substitutes: z
    .array(
      z.object({
        playerId: z.string().cuid(),
        slotLabel: z.string().min(1),
        order: z.number().int().min(11).max(17),
      })
    )
    .max(7, 'Максимум 7 запасних гравців'),
}).refine(
  (data) => {
    const goalkeeperSlots = data.starters.filter((s) =>
      s.slotLabel.toUpperCase().includes('GK')
    )
    return goalkeeperSlots.length === 1
  },
  { message: 'У стартовому складі має бути рівно 1 воротар' }
)

export type LineupFormData = z.infer<typeof lineupSchema>
