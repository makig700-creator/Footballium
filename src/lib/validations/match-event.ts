import { z } from 'zod'

export const matchEventSchema = z.object({
  type: z.enum(['GOAL', 'YELLOW_CARD', 'RED_CARD', 'SUBSTITUTION', 'OWN_GOAL', 'PENALTY']),
  minute: z.number().int().min(1).max(120),
  teamId: z.string().cuid(),
  playerId: z.string().cuid().optional(),
  playerName: z.string().min(1),
  detail: z.string().optional(),
})

export type MatchEventFormData = z.infer<typeof matchEventSchema>
