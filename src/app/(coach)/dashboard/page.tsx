import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { formatKickoff } from '@/lib/utils'
import { CalendarDays, Users, AlertCircle, Edit } from 'lucide-react'

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session || !session.user) {
    redirect('/auth/login')
  }

  const user = session.user as any
  
  if (user.role !== 'COACH' || !user.teamId) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Доступ заборонено</h1>
        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">У вас немає прав тренера або ви не закріплені за жодною командою.</p>
      </div>
    )
  }

  const team = await prisma.team.findUnique({
    where: { id: user.teamId },
    include: {
      _count: { select: { players: true } }
    }
  })

  if (!team) return null

  const upcomingMatches = await prisma.match.findMany({
    where: {
      OR: [
        { homeTeamId: team.id },
        { awayTeamId: team.id }
      ],
      status: 'SCHEDULED'
    },
    include: {
      homeTeam: true,
      awayTeam: true
    },
    orderBy: { kickoff: 'asc' },
    take: 5
  })

  return (
    <div className="space-y-12 max-w-5xl">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-gray-900 pb-8">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">Панель тренера</h1>
          <p className="text-[#CCFF00] font-bold text-xs uppercase tracking-widest mt-1">З поверненням, {user.name}</p>
        </div>
        <div className="flex items-center gap-4 bg-[#0a0a0a] px-4 py-3 rounded-sm border border-gray-800">
          <div className="w-12 h-12 rounded-sm bg-[#1c1a1a] border border-gray-800 flex items-center justify-center">
             {team.logo && <Image src={team.logo} alt={team.name} width={36} height={36} className="object-contain" />}
          </div>
          <div>
            <p className="font-black text-white uppercase tracking-wider">{team.name}</p>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{team._count.players} гравців у складі</p>
          </div>
        </div>
      </header>

      <section>
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-[#CCFF00] rounded-sm">
            <CalendarDays className="w-5 h-5 text-black" />
          </div>
          <h2 className="text-xl font-black text-white uppercase tracking-widest">Найближчі матчі</h2>
        </div>

        {upcomingMatches.length === 0 ? (
          <div className="bg-[#1c1a1a] p-12 text-center border border-gray-800 border-dashed rounded-sm">
            <CalendarDays className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-black text-gray-400 uppercase tracking-widest mb-2">Немає запланованих матчів</h3>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">У вашому розкладі поки що немає матчів.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {upcomingMatches.map((match) => {
              const isHome = match.homeTeamId === team.id
              const opponent = isHome ? match.awayTeam : match.homeTeam
              
              return (
                <div key={match.id} className="bg-[#1c1a1a] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-gray-800 border-l-4 border-l-[#CCFF00] rounded-sm">
                  <div className="flex items-center gap-8">
                    <div className="text-center shrink-0">
                      <div className="text-[10px] font-black text-black bg-[#CCFF00] px-3 py-1 rounded-sm inline-block mb-2 uppercase tracking-widest">
                        {isHome ? 'Вдома' : 'В гостях'}
                      </div>
                      <div className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">{formatKickoff(match.kickoff)}</div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-sm bg-[#0a0a0a] border border-gray-800 flex items-center justify-center p-2">
                        {opponent?.logo && <Image src={opponent.logo} alt={opponent.name} width={48} height={48} className="object-contain" />}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">VS</p>
                        <p className="font-black text-xl text-white uppercase tracking-wider">{opponent?.name || 'TBD'}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{match.venue}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 shrink-0">
                    <Link 
                      href={`/dashboard/matches/${match.id}/lineup`}
                      className="flex items-center justify-center gap-2 bg-[#CCFF00] hover:bg-[#b3ff00] text-black px-6 py-4 rounded-sm font-black uppercase tracking-widest text-xs transition-colors w-full md:w-auto"
                    >
                      <Edit className="w-4 h-4" /> Налаштувати склад
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
