import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getLineupSchema } from '@/lib/validations/lineup'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session || !session.user || (session.user as any).role !== 'COACH') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const teamId = (session.user as any).teamId
    if (!teamId) {
      return NextResponse.json({ error: 'No team assigned' }, { status: 403 })
    }

    const resolvedParams = await params
    const matchId = resolvedParams.id
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: { homeTeam: true, awayTeam: true, tournament: true }
    })

    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 })
    }

    if (match.homeTeamId !== teamId && match.awayTeamId !== teamId) {
      return NextResponse.json({ error: 'Your team is not participating in this match' }, { status: 403 })
    }

    const body = await request.json()
    const format = (match.tournament as any)?.format || '11x11'
    const schema = getLineupSchema(format)
    const parsedData = schema.safeParse({ ...body, matchId })

    if (!parsedData.success) {
      return NextResponse.json({ error: 'Invalid lineup data', details: parsedData.error.flatten() }, { status: 400 })
    }

    const data = parsedData.data

    const existingLineup = await prisma.lineup.findUnique({ where: { matchId } });
    if (existingLineup) {
      await prisma.lineupSlot.deleteMany({
        where: { lineupId: existingLineup.id, player: { teamId } }
      });
    }

    const lineup = await prisma.lineup.upsert({
      where: { matchId },
      update: {
        formation: data.formation,
        submittedAt: new Date(),
        slots: {
          create: [
            ...data.starters.map(s => ({
              playerId: s.playerId,
              slotLabel: s.slotLabel,
              order: s.order,
              isStarter: true
            })),
            ...data.substitutes.map(s => ({
              playerId: s.playerId,
              slotLabel: s.slotLabel,
              order: s.order,
              isStarter: false
            }))
          ]
        }
      },
      create: {
        matchId,
        formation: data.formation,
        slots: {
          create: [
            ...data.starters.map(s => ({
              playerId: s.playerId,
              slotLabel: s.slotLabel,
              order: s.order,
              isStarter: true
            })),
            ...data.substitutes.map(s => ({
              playerId: s.playerId,
              slotLabel: s.slotLabel,
              order: s.order,
              isStarter: false
            }))
          ]
        }
      }
    })

    return NextResponse.json(lineup, { status: 201 })
  } catch (error) {
    console.error('Lineup submission error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
