import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { createPlayerSchema } from '@/lib/validations/player'

export async function GET(request: Request, { params }: { params: Promise<{ id: string, playerId: string }> }) {
  const resolvedParams = await params;
  const player = await prisma.player.findUnique({
    where: { id: resolvedParams.playerId },
    include: { team: true, stats: true }
  })
  if (!player) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(player)
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string, playerId: string }> }) {
  const session = await auth()
  const resolvedParams = await params;

  const team = await prisma.team.findUnique({ where: { id: resolvedParams.id } })
  if (!team || !session || !session.user || team.coachId !== session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const json = await request.json()
    const body = createPlayerSchema.partial().parse(json)

    if (body.number) {
      const existing = await prisma.player.findUnique({
        where: { teamId_number: { teamId: resolvedParams.id, number: body.number } }
      })
      if (existing && existing.id !== resolvedParams.playerId) {
        return NextResponse.json({ error: 'Number already taken' }, { status: 400 })
      }
    }

    const updatedPlayer = await prisma.player.update({
      where: { id: resolvedParams.playerId },
      data: body,
    })

    return NextResponse.json(updatedPlayer)
  } catch (error) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string, playerId: string }> }) {
  const session = await auth()
  const resolvedParams = await params;

  const team = await prisma.team.findUnique({ where: { id: resolvedParams.id } })
  if (!team || !session || !session.user || team.coachId !== session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const player = await prisma.player.findUnique({
    where: { id: resolvedParams.playerId },
    include: { lineupSlots: { include: { lineup: { include: { match: true } } } } }
  })

  if (!player) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const inActiveMatch = player.lineupSlots.some(s => s.lineup.match.status !== 'FINISHED')
  if (inActiveMatch) {
    return NextResponse.json({ error: 'Player is in an active match lineup' }, { status: 400 })
  }

  await prisma.player.delete({
    where: { id: resolvedParams.playerId }
  })

  return new NextResponse(null, { status: 204 })
}
