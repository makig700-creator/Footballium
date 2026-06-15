import { prisma } from '@/lib/prisma'
import { LeagueTable } from '@/components/standings/LeagueTable'
import { Trophy } from 'lucide-react'

export const revalidate = 60

export default async function StandingsPage() {
  const tournamentStandings = await prisma.tournamentStanding.findMany({
    where: { tournamentId: 'tournament-zhytomyr' },
    include: {
      Team: {
        select: { id: true, name: true, shortName: true, logo: true }
      }
    },
    orderBy: { position: 'asc' }
  })

  const standings = tournamentStandings.map(ts => ({
    id: ts.id,
    team: ts.Team,
    played: ts.played,
    won: ts.won,
    drawn: ts.drawn,
    lost: ts.lost,
    gf: ts.goalsFor,
    ga: ts.goalsAgainst,
    points: ts.points,
    form: '' // Form is not available in TournamentStanding
  }))

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex items-center gap-4 border-b border-gray-900 pb-6">
        <div className="w-12 h-12 rounded-sm bg-[#CCFF00] flex items-center justify-center shadow-lg border border-[#CCFF00]">
          <Trophy className="w-6 h-6 text-black" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">Турнірна таблиця</h1>
          <p className="text-[#CCFF00] font-bold text-xs uppercase tracking-widest mt-1">Чемпіонат Житомирської області</p>
        </div>
      </div>

      <LeagueTable standings={standings} />
      
      <div className="text-center text-xs font-bold uppercase tracking-widest text-gray-600 mt-8">
        Останнє оновлення: {new Date().toLocaleTimeString()}
      </div>
    </div>
  )
}
