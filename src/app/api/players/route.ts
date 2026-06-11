import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''
  const position = searchParams.get('position') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 24
  const skip = (page - 1) * limit

  const where: any = {}
  if (search || position) {
    where.AND = []
    if (search) {
      where.AND.push({
        OR: [
          { firstName: { contains: search } },
          { lastName: { contains: search } }
        ]
      })
    }
    if (position) {
      where.AND.push({ position })
    }
  }

  const [players, total] = await Promise.all([
    prisma.player.findMany({
      where,
      include: { team: { select: { id: true, name: true, shortName: true, logo: true } } },
      skip,
      take: limit,
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }]
    }),
    prisma.player.count({ where })
  ])

  return NextResponse.json({ players, total, page, totalPages: Math.ceil(total / limit) })
}
