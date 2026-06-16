import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query || query.length < 2) {
    return NextResponse.json({ teams: [], players: [], news: [] })
  }

  const [teams, players, news] = await Promise.all([
    prisma.team.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { shortName: { contains: query } },
        ],
      },
      take: 5,
    }),
    prisma.player.findMany({
      where: {
        OR: [
          { firstName: { contains: query } },
          { lastName: { contains: query } },
          { nationality: { contains: query } },
        ],
      },
      include: { team: { select: { shortName: true } } },
      take: 5,
    }),
    prisma.news.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { excerpt: { contains: query } },
        ],
        status: "PUBLISHED",
      },
      take: 5,
    }),
  ])

  return NextResponse.json({ teams, players, news })
}
