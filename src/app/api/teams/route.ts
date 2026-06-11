import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { createTeamSchema } from '@/lib/validations/team'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''
  const city = searchParams.get('city') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 12
  const skip = (page - 1) * limit

  const where: any = {}
  if (search || city) {
    where.AND = []
    if (search) where.AND.push({ name: { contains: search } })
    if (city) where.AND.push({ city: { contains: city } })
  }

  const [teams, total] = await Promise.all([
    prisma.team.findMany({
      where,
      include: { _count: { select: { players: true } } },
      skip,
      take: limit,
      orderBy: { name: 'asc' }
    }),
    prisma.team.count({ where })
  ])

  return NextResponse.json({ teams, total, page, totalPages: Math.ceil(total / limit) })
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session || !session.user || (session.user as any).role !== 'COACH') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const existingTeam = await prisma.team.findUnique({
    where: { coachId: session.user.id! }
  })

  if (existingTeam) {
    return NextResponse.json({ error: 'Coach already has a team' }, { status: 400 })
  }

  try {
    const json = await request.json()
    const body = createTeamSchema.parse(json)

    const team = await prisma.team.create({
      data: {
        ...body,
        stadium: body.stadium ?? 'Невідомо',
        shortName: body.shortName ?? 'ТМ',
        founded: body.founded ?? new Date().getFullYear(),
        coachId: session.user.id!,
      }
    })

    return NextResponse.json(team, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }
}
