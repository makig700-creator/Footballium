import { notFound } from "next/navigation"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import { Calendar, Users, Trophy, Shield } from "lucide-react"
import { LeagueTable } from "@/components/standings/LeagueTable"

export const revalidate = 60 // Revalidate every minute

export default async function TournamentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const tournament = await prisma.tournament.findUnique({
    where: { id },
    include: {
      teams: {
        where: { status: 'APPROVED' },
        include: {
          team: true
        }
      }
    }
  })

  if (!tournament) {
    notFound()
  }

  // Fetch standings
  const standings = await prisma.standings.findMany({
    where: { leagueId: tournament.id },
    include: { team: true }
  })

  return (
    <div className="min-h-screen bg-[#000000] text-gray-200">
      {/* Hero Section */}
      <div className="relative w-full py-20 border-b border-gray-900 bg-[#0a0a0a] overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-[#ccff00]/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#000000] to-transparent pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-32 h-32 md:w-48 md:h-48 rounded-md bg-[#111111] border border-gray-800 flex items-center justify-center shrink-0 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            {tournament.logo ? (
              <Image src={tournament.logo} alt={tournament.name} fill className="object-contain p-4" />
            ) : (
              <Trophy className="w-16 h-16 md:w-24 md:h-24 text-gray-800 drop-shadow-md" />
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-5">
            <div className="inline-flex items-center justify-center px-3 py-1 bg-[#1a1a1a] border border-gray-800 text-[10px] font-black uppercase tracking-widest text-[#ccff00] rounded-sm">
              {tournament.status}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-[0.9]">
              {tournament.name}
            </h1>
            <p className="text-gray-400 font-medium max-w-2xl text-sm md:text-base leading-relaxed border-l-2 border-gray-800 pl-4">
              {tournament.description || 'Детальна інформація про турнір відсутня.'}
            </p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-8 pt-6 text-[11px] font-black tracking-widest text-gray-500 uppercase">
              <div className="flex items-center gap-2 bg-[#111111] border border-gray-800 px-4 py-2 rounded-sm">
                <Calendar className="w-4 h-4 text-[#ccff00]" />
                {new Date(tournament.startDate).toLocaleDateString('uk-UA')} - {new Date(tournament.endDate).toLocaleDateString('uk-UA')}
              </div>
              <div className="flex items-center gap-2 bg-[#111111] border border-gray-800 px-4 py-2 rounded-sm">
                <Users className="w-4 h-4 text-[#ccff00]" />
                {tournament.teams.length} / {tournament.maxTeams} Команд
              </div>
              <div className="flex items-center gap-2 bg-[#111111] border border-gray-800 px-4 py-2 rounded-sm">
                <Shield className="w-4 h-4 text-[#ccff00]" />
                {tournament.bracketType.replace('_', ' ')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
        
        {/* Standings */}
        {standings.length > 0 && (
          <section className="space-y-8">
            <div className="flex items-center gap-6">
              <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">Турнірна таблиця</h2>
              <div className="h-[2px] flex-1 bg-gradient-to-r from-[#ccff00] to-transparent opacity-20"></div>
            </div>
            <LeagueTable standings={standings} />
          </section>
        )}

      </div>
    </div>
  )
}
