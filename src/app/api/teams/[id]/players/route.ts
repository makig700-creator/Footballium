import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { createPlayerSchema } from '@/lib/validations/player'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const players = await prisma.player.findMany({
    where: { teamId: resolvedParams.id },
    orderBy: { number: 'asc' }
  })
  return NextResponse.json(players)
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  const resolvedParams = await params;

  const team = await prisma.team.findUnique({ where: { id: resolvedParams.id } })
  if (!team || !session || !session.user || team.coachId !== session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const json = await request.json()
    const body = createPlayerSchema.parse(json)

    const existingPlayer = await prisma.player.findUnique({
      where: { teamId_number: { teamId: resolvedParams.id, number: body.number } }
    })

    if (existingPlayer) {
      return NextResponse.json({ error: 'Player with this number already exists' }, { status: 400 })
    }

    const player = await prisma.player.create({
      data: {
        ...body,
        teamId: resolvedParams.id,
        age: body.age ?? 0,
        photo: body.photo ?? null,
        nationality: 'Ukraine',
      }
    })

    return NextResponse.json(player, { status: 201 })
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }
}
