import { prisma } from '@/lib/prisma'
import { FixtureCard } from '@/components/matches/FixtureCard'
import { CalendarDays } from 'lucide-react'

export const revalidate = 60

export default async function MatchesPage() {
  const [liveMatches, upcomingMatches, pastMatches] = await Promise.all([
    prisma.match.findMany({
      where: { status: 'LIVE' },
      include: { homeTeam: true, awayTeam: true },
      orderBy: { kickoff: 'asc' },
    }),
    prisma.match.findMany({
      where: { status: 'SCHEDULED' },
      include: { homeTeam: true, awayTeam: true },
      orderBy: { kickoff: 'asc' },
    }),
    prisma.match.findMany({
      where: { status: 'FULLTIME' },
      include: { homeTeam: true, awayTeam: true },
      orderBy: { kickoff: 'desc' },
      take: 10,
    }),
  ])

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="flex items-center gap-4 border-b border-gray-900 pb-6">
        <div className="w-12 h-12 rounded-sm bg-[#CCFF00] flex items-center justify-center shadow-lg border border-[#CCFF00]">
          <CalendarDays className="w-6 h-6 text-black" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">Центр матчів</h1>
          <p className="text-[#CCFF00] font-bold text-xs uppercase tracking-widest mt-1">Результати матчів онлайн та розклад</p>
        </div>
      </div>

      {liveMatches.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-8">
            <span className="w-3 h-3 rounded-full bg-[#CCFF00] animate-pulse"></span>
            <h2 className="text-xl font-black text-white uppercase tracking-widest">Наживо</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {liveMatches.map((match) => (
              <FixtureCard key={match.id} match={match} />
            ))}
          </div>
        </section>
      )}

      {upcomingMatches.length > 0 && (
        <section>
          <h2 className="text-xl font-black text-white uppercase tracking-widest mb-8">Заплановані матчі</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingMatches.map((match) => (
              <FixtureCard key={match.id} match={match} />
            ))}
          </div>
        </section>
      )}

      {pastMatches.length > 0 && (
        <section>
          <h2 className="text-xl font-black text-gray-500 uppercase tracking-widest mb-8">Останні результати</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-80 hover:opacity-100 transition-opacity">
            {pastMatches.map((match) => (
              <FixtureCard key={match.id} match={match} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
