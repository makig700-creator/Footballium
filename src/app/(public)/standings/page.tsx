import { prisma } from '@/lib/prisma'
import { LeagueTable } from '@/components/standings/LeagueTable'
import { Trophy } from 'lucide-react'
import { TournamentSelector } from '@/components/standings/TournamentSelector'

export const revalidate = 60

export default async function StandingsPage(props: { searchParams: Promise<{ tournamentId?: string }> }) {
  const searchParams = await props.searchParams
  
  // Fetch available tournaments that have standings
  const tournaments = await prisma.tournament.findMany({
    where: { 
      status: { in: ['ONGOING', 'FINISHED'] }
    },
    select: { id: true, name: true },
    orderBy: { createdAt: 'desc' }
  })

  // Determine the selected tournament
  const selectedTournamentId = searchParams.tournamentId || 
                               (tournaments.length > 0 ? tournaments[0].id : undefined)

  let standings: any[] = []
  
  if (selectedTournamentId) {
    const tournamentStandings = await prisma.tournamentStanding.findMany({
      where: { tournamentId: selectedTournamentId },
      include: {
        Team: {
          select: { id: true, name: true, shortName: true, logo: true }
        }
      },
      orderBy: [
        { points: 'desc' },
        { goalDiff: 'desc' },
        { goalsFor: 'desc' }
      ]
    })

    standings = tournamentStandings.map(ts => ({
      id: ts.id,
      team: ts.Team,
      played: ts.played,
      won: ts.won,
      drawn: ts.drawn,
      lost: ts.lost,
      gf: ts.goalsFor,
      ga: ts.goalsAgainst,
      points: ts.points,
      form: '' // Form removed
    }))
  }

  const selectedTournamentName = tournaments.find(t => t.id === selectedTournamentId)?.name || "Турнірна таблиця"

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 min-h-[60vh]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-900 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-sm bg-[#111111] flex items-center justify-center shadow-lg border border-gray-800 shrink-0">
            <Trophy className="w-6 h-6 text-gray-400" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">Турнірна таблиця</h1>
            <p className="text-gray-400 font-medium text-xs uppercase tracking-widest mt-1">{selectedTournamentName}</p>
          </div>
        </div>
        
        {tournaments.length > 0 && (
          <TournamentSelector 
            tournaments={tournaments} 
            defaultTournamentId={selectedTournamentId as string} 
          />
        )}
      </div>

      {standings.length > 0 ? (
        <LeagueTable standings={standings} />
      ) : (
        <div className="text-center py-12 text-gray-500 font-bold uppercase tracking-widest border border-dashed border-gray-800 rounded-sm">
          Дані про турнірну таблицю відсутні
        </div>
      )}
      
      <div className="text-center text-xs font-bold uppercase tracking-widest text-gray-600 mt-8">
        Останнє оновлення: {new Date().toLocaleTimeString('uk-UA')}
      </div>
    </div>
  )
}
