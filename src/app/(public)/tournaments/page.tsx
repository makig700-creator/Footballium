import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import { Calendar, Users, Trophy, Shield } from "lucide-react"

export const revalidate = 60 // Revalidate every minute

export default async function TournamentsListPage() {
  const tournaments = await prisma.tournament.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { teams: { where: { status: 'APPROVED' } } }
      }
    }
  })

  return (
    <div className="min-h-screen bg-[#000000] text-gray-200 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
            Всі турніри
          </h1>
          <p className="text-gray-400 font-medium max-w-2xl mx-auto">
            Оберіть турнір, щоб переглянути детальну статистику, календар матчів та склади команд.
          </p>
        </div>

        {/* List */}
        {tournaments.length === 0 ? (
          <div className="text-center py-20 border border-gray-900 bg-[#0a0a0a] rounded-md">
            <Trophy className="w-16 h-16 text-gray-800 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white uppercase tracking-widest">Турнірів ще немає</h2>
            <p className="text-gray-500 mt-2">Незабаром тут з'являться нові змагання.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament) => (
              <div key={tournament.id} className="bg-[#1c1a1a] border border-[#2a2828] rounded-md p-6 flex flex-col relative group hover:border-gray-500 transition-colors">
                <div className="absolute top-4 right-4 border border-gray-600 text-gray-400 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-sm bg-gray-900 z-10">
                  {tournament.status}
                </div>
                
                <div className="h-40 flex items-center justify-center mb-6 mt-4 relative">
                  {tournament.logo ? (
                    <Image src={tournament.logo} alt={tournament.name} fill className="object-contain p-4 drop-shadow-lg group-hover:scale-105 transition-transform" />
                  ) : (
                    <Trophy className="w-24 h-24 text-gray-600 drop-shadow-[0_0_15px_rgba(75,85,99,0.2)] group-hover:scale-110 transition-transform duration-500" />
                  )}
                </div>
                
                <h3 className="text-lg font-bold text-white mb-6 uppercase leading-snug truncate">
                  {tournament.name}
                </h3>
                
                <div className="space-y-3 mb-8 text-xs text-gray-400 font-medium tracking-wide">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-500" /> 
                    {new Date(tournament.startDate).toLocaleDateString('uk-UA')} - {new Date(tournament.endDate).toLocaleDateString('uk-UA')}
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-gray-500" /> 
                    {tournament._count.teams} / {tournament.maxTeams} Команд
                  </div>
                </div>
                
                <div className="mt-auto pt-6 border-t border-gray-800/50">
                   <div className="flex gap-2">
                      <Link href={`/tournaments/${tournament.id}`} className="flex-1 py-3 text-center border border-gray-700 hover:border-[#ccff00] hover:text-[#ccff00] text-white font-extrabold uppercase text-[11px] tracking-widest transition-colors rounded-sm bg-[#0a0a0a]">
                        Детальніше
                      </Link>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
