import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { formatKickoff } from '@/lib/utils'
import { CalendarDays, AlertCircle, Edit, CheckCircle2, Trophy } from 'lucide-react'

export default async function MatchesPage() {
  const session = await auth()
  
  if (!session || !session.user) {
    redirect('/auth/login')
  }

  const user = session.user as any
  
  if (user.role !== 'COACH') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Доступ заборонено</h1>
        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">У вас немає прав тренера.</p>
      </div>
    )
  }

  const team = await prisma.team.findUnique({
    where: { coachId: user.id }
  })

  if (!team) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Команду не знайдено</h1>
        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Ви не закріплені за жодною командою. Зверніться до адміністратора.</p>
      </div>
    )
  }

  const allMatches = await prisma.match.findMany({
    where: {
      OR: [
        { homeTeamId: team.id },
        { awayTeamId: team.id }
      ]
    },
    include: {
      homeTeam: true,
      awayTeam: true,
      tournament: true
    },
    orderBy: { kickoff: 'asc' }
  })

  const upcomingMatches = allMatches.filter(m => m.status === 'SCHEDULED')
  const pastMatches = allMatches.filter(m => m.status === 'FINISHED' || m.status === 'LIVE').reverse()

  const MatchCard = ({ match, isUpcoming }: { match: any, isUpcoming: boolean }) => {
    const isHome = match.homeTeamId === team.id
    const opponent = isHome ? match.awayTeam : match.homeTeam
    
    return (
      <div className={`bg-[#1c1a1a] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-gray-800 ${isUpcoming ? 'border-l-4 border-l-[#CCFF00]' : 'border-l-4 border-l-gray-600'} rounded-sm`}>
        <div className="flex items-center gap-8">
          <div className="text-center shrink-0 w-24">
            <div className={`text-[10px] font-black ${isUpcoming ? 'text-black bg-[#CCFF00]' : 'text-gray-400 bg-gray-900'} px-3 py-1 rounded-sm inline-block mb-2 uppercase tracking-widest`}>
              {isHome ? 'Вдома' : 'В гостях'}
            </div>
            <div className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">{formatKickoff(match.kickoff)}</div>
            {!isUpcoming && (
              <div className="text-xl font-black text-white mt-2">
                {match.homeScore} : {match.awayScore}
              </div>
            )}
          </div>
          
          <div className="flex flex-col justify-center">
             <p className="text-[10px] font-bold text-[#CCFF00] uppercase tracking-widest mb-2">{match.tournament?.name || 'Товариський матч'}</p>
             <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-sm bg-[#0a0a0a] border border-gray-800 flex items-center justify-center p-2">
                  {opponent?.logo && <Image src={opponent.logo} alt={opponent.name} width={48} height={48} className="object-contain" />}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Опонент</p>
                  <p className="font-black text-xl text-white uppercase tracking-wider">{opponent?.name || 'TBD'}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{match.venue}</p>
                </div>
             </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-3 shrink-0">
          {isUpcoming ? (
            <Link 
              href={`/dashboard/matches/${match.id}/lineup`}
              className="flex items-center justify-center gap-2 bg-[#CCFF00] hover:bg-[#b3ff00] text-black px-6 py-4 rounded-sm font-black uppercase tracking-widest text-xs transition-colors w-full md:w-auto"
            >
              <Edit className="w-4 h-4" /> Налаштувати склад
            </Link>
          ) : (
            <Link 
              href={`/matches/${match.id}`}
              className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-4 rounded-sm font-black uppercase tracking-widest text-xs transition-colors w-full md:w-auto border border-gray-800"
            >
              <Trophy className="w-4 h-4 text-gray-400" /> Деталі матчу
            </Link>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-12 max-w-5xl">
      <header className="border-b border-gray-900 pb-8">
        <h1 className="text-3xl font-black text-white tracking-tight uppercase">Усі матчі</h1>
        <p className="text-[#CCFF00] font-bold text-xs uppercase tracking-widest mt-1">Календар та результати команди {team.name}</p>
      </header>

      <section>
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-[#CCFF00] rounded-sm">
            <CalendarDays className="w-5 h-5 text-black" />
          </div>
          <h2 className="text-xl font-black text-white uppercase tracking-widest">Майбутні матчі</h2>
        </div>

        {upcomingMatches.length === 0 ? (
          <div className="bg-[#1c1a1a] p-12 text-center border border-gray-800 border-dashed rounded-sm">
            <CalendarDays className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-black text-gray-400 uppercase tracking-widest mb-2">Немає запланованих матчів</h3>
          </div>
        ) : (
          <div className="grid gap-6">
            {upcomingMatches.map((match) => (
              <MatchCard key={match.id} match={match} isUpcoming={true} />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-gray-900 border border-gray-800 rounded-sm">
            <CheckCircle2 className="w-5 h-5 text-gray-400" />
          </div>
          <h2 className="text-xl font-black text-white uppercase tracking-widest">Минулі матчі</h2>
        </div>

        {pastMatches.length === 0 ? (
          <div className="bg-[#1c1a1a] p-12 text-center border border-gray-800 border-dashed rounded-sm">
            <h3 className="text-lg font-black text-gray-400 uppercase tracking-widest mb-2">Немає зіграних матчів</h3>
          </div>
        ) : (
          <div className="grid gap-6">
            {pastMatches.map((match) => (
              <MatchCard key={match.id} match={match} isUpcoming={false} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
