import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { createTeamSchema } from '@/lib/validations/team'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const team = await prisma.team.findUnique({
    where: { id: resolvedParams.id },
    include: { players: true, coach: true, _count: { select: { players: true } } }
  })

  if (!team) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(team)
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  const resolvedParams = await params;
  
  const team = await prisma.team.findUnique({ where: { id: resolvedParams.id } })
  if (!team) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  
  if (!session || !session.user || team.coachId !== session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const json = await request.json()
    const body = createTeamSchema.partial().parse(json)

    const updatedTeam = await prisma.team.update({
      where: { id: resolvedParams.id },
      data: body,
    })

    return NextResponse.json(updatedTeam)
  } catch (error) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  const resolvedParams = await params;

  const team = await prisma.team.findUnique({ 
    where: { id: resolvedParams.id },
    include: { tournaments: true }
  })
  
  if (!team) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  
  if (!session || !session.user || team.coachId !== session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (team.tournaments.some(t => t.status === 'APPROVED' || t.status === 'PENDING')) {
    return NextResponse.json({ error: 'Team is in an active tournament' }, { status: 400 })
  }

  await prisma.team.delete({
    where: { id: resolvedParams.id }
  })

  return new NextResponse(null, { status: 204 })
}
