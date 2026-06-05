import { prisma } from '@/lib/prisma'
import { LeagueTable } from '@/components/standings/LeagueTable'
import { Trophy } from 'lucide-react'

export const revalidate = 60

export default async function StandingsPage() {
  const standings = await prisma.standings.findMany({
    where: { season: '2024/25', leagueId: 'premier-league' },
    include: {
      team: {
        select: { id: true, name: true, shortName: true, logo: true }
      }
    }
  })

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex items-center gap-4 border-b border-gray-900 pb-6">
        <div className="w-12 h-12 rounded-sm bg-[#CCFF00] flex items-center justify-center shadow-lg border border-[#CCFF00]">
          <Trophy className="w-6 h-6 text-black" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">Турнірна таблиця Прем'єр-ліги</h1>
          <p className="text-[#CCFF00] font-bold text-xs uppercase tracking-widest mt-1">Сезон 2024/25</p>
        </div>
      </div>

      <LeagueTable standings={standings} />
      
      <div className="text-center text-xs font-bold uppercase tracking-widest text-gray-600 mt-8">
        Останнє оновлення: {new Date().toLocaleTimeString()}
      </div>
    </div>
  )
}
