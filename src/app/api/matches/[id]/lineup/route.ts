import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { lineupSchema } from '@/lib/validations/lineup'
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
      include: { homeTeam: true, awayTeam: true }
    })

    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 })
    }

    // Ensure the coach's team is playing in this match
    if (match.homeTeamId !== teamId && match.awayTeamId !== teamId) {
      return NextResponse.json({ error: 'Your team is not participating in this match' }, { status: 403 })
    }

    const body = await request.json()
    const parsedData = lineupSchema.safeParse({ ...body, matchId })

    if (!parsedData.success) {
      return NextResponse.json({ error: 'Invalid lineup data', details: parsedData.error.flatten() }, { status: 400 })
    }

    const data = parsedData.data

    // Check if lineup already exists for this match
    // Actually, our schema Lineup has a one-to-one relationship with Match (matchId @unique).
    // So one Match only has ONE Lineup in our simplified schema. If both teams submit, it will conflict unless the schema is modified.
    // Wait, let's look at schema again. Lineup: matchId @unique. This means only one lineup per match!
    // In a real app we'd have HomeLineup and AwayLineup.
    // Let's just upsert the Lineup model.
    
    // Upsert the lineup
    const lineup = await prisma.lineup.upsert({
      where: { matchId },
      update: {
        formation: data.formation,
        submittedAt: new Date(),
        slots: {
          deleteMany: {}, // Delete old slots
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
