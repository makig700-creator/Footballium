import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { formatKickoff } from '@/lib/utils'
import { CalendarDays, AlertCircle, ShieldAlert } from 'lucide-react'

export default async function RefereeDashboardPage() {
  const session = await auth()
  
  if (!session || !session.user) {
    redirect('/auth/login')
  }

  const user = session.user as any
  
  if (user.role !== 'REFEREE') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Доступ заборонено</h1>
        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Ви не є суддею турніру.</p>
      </div>
    )
  }

  const matches = await prisma.match.findMany({
    where: {
      refereeId: user.id
    },
    include: {
      homeTeam: true,
      awayTeam: true,
      tournament: true
    },
    orderBy: { kickoff: 'asc' }
  })

  // Separate matches by status
  const scheduledMatches = matches.filter(m => m.status === 'SCHEDULED')
  const liveMatches = matches.filter(m => m.status === 'LIVE')
  const finishedMatches = matches.filter(m => m.status === 'FINISHED')

  return (
    <div className="space-y-12 max-w-5xl mx-auto pb-10">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-gray-900 pb-8">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">Панель Судді</h1>
          <p className="text-[#CCFF00] font-bold text-xs uppercase tracking-widest mt-1">Вітаємо, {user.name}</p>
        </div>
        <Link 
          href="/referee/settings" 
          className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2 rounded-sm font-bold uppercase tracking-widest text-xs transition-colors border border-gray-800"
        >
          Налаштування профілю
        </Link>
      </header>

      <section>
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-[#CCFF00] rounded-sm">
            <CalendarDays className="w-5 h-5 text-black" />
          </div>
          <h2 className="text-xl font-black text-white uppercase tracking-widest">Ваші призначення</h2>
        </div>

        {matches.length === 0 ? (
          <div className="bg-[#1c1a1a] p-12 text-center border border-gray-800 border-dashed rounded-sm">
            <CalendarDays className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-black text-gray-400 uppercase tracking-widest mb-2">Немає призначень</h3>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Вас ще не призначено на жоден матч.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Live Matches */}
            {liveMatches.length > 0 && (
              <div>
                <h3 className="text-lg font-black text-red-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  Зараз тривають
                </h3>
                <div className="grid gap-4">
                  {liveMatches.map(match => <MatchCard key={match.id} match={match} />)}
                </div>
              </div>
            )}

            {/* Scheduled Matches */}
            {scheduledMatches.length > 0 && (
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-widest mb-4">Заплановані</h3>
                <div className="grid gap-4">
                  {scheduledMatches.map(match => <MatchCard key={match.id} match={match} />)}
                </div>
              </div>
            )}

            {/* Finished Matches */}
            {finishedMatches.length > 0 && (
              <div>
                <h3 className="text-lg font-black text-gray-500 uppercase tracking-widest mb-4">Завершені</h3>
                <div className="grid gap-4">
                  {finishedMatches.map(match => <MatchCard key={match.id} match={match} />)}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  )
}

function MatchCard({ match }: { match: any }) {
  const isFinished = match.status === 'FINISHED';
  
  return (
    <div className={`bg-[#1c1a1a] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-gray-800 border-l-4 rounded-sm transition-all duration-300 hover:border-gray-700 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#CCFF00]/5 ${
      isFinished ? 'border-l-gray-600 opacity-75 hover:opacity-100' : 
      match.status === 'LIVE' ? 'border-l-red-500 shadow-lg shadow-red-500/10' : 
      'border-l-[#CCFF00]'
    }`}>
      <div className="flex items-center gap-8">
        <div className="text-center shrink-0 w-24">
          <div className={`text-[10px] font-black px-3 py-1 rounded-sm inline-block mb-2 uppercase tracking-widest ${
            match.status === 'LIVE' ? 'bg-red-500 text-white animate-pulse shadow-md shadow-red-500/20' :
            isFinished ? 'bg-gray-700 text-white' :
            'bg-[#CCFF00] text-black shadow-md shadow-[#CCFF00]/10'
          }`}>
            {match.status === 'LIVE' ? 'НАЖИВО' : match.status === 'FINISHED' ? 'ЗАВЕРШЕНО' : 'ЗАПЛАНОВАНО'}
          </div>
          <div className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">{formatKickoff(match.kickoff)}</div>
        </div>
        
        <div className="flex items-center gap-6">
          {/* Home Team */}
          <div className="flex flex-col items-center gap-2 w-24">
            <div className="w-12 h-12 rounded-sm bg-[#0a0a0a] border border-gray-800 flex items-center justify-center p-1">
              {match.homeTeam?.logo ? <Image src={match.homeTeam.logo} alt={match.homeTeam.name} width={36} height={36} className="object-contain" /> : <div className="w-8 h-8 bg-gray-800 rounded-full" />}
            </div>
            <p className="font-bold text-xs text-center text-white truncate w-full">{match.homeTeam?.shortName || match.homeTeam?.name}</p>
          </div>

          {/* Score or VS */}
          <div className="text-center px-4">
            {match.status === 'SCHEDULED' ? (
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">VS</p>
            ) : (
              <p className="font-black text-2xl text-[#CCFF00]">{match.homeScore} : {match.awayScore}</p>
            )}
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center gap-2 w-24">
            <div className="w-12 h-12 rounded-sm bg-[#0a0a0a] border border-gray-800 flex items-center justify-center p-1">
              {match.awayTeam?.logo ? <Image src={match.awayTeam.logo} alt={match.awayTeam.name} width={36} height={36} className="object-contain" /> : <div className="w-8 h-8 bg-gray-800 rounded-full" />}
            </div>
            <p className="font-bold text-xs text-center text-white truncate w-full">{match.awayTeam?.shortName || match.awayTeam?.name}</p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-2 shrink-0">
        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest text-right">
          {match.tournament?.name || 'Турнір'} • Тур {match.round || 1}
        </div>
        <Link 
          href={`/referee/match/${match.id}`}
          className="flex items-center justify-center gap-2 bg-[#CCFF00] hover:bg-[#b3ff00] text-black px-6 py-3 rounded-sm font-black uppercase tracking-widest text-xs transition-colors"
        >
          {match.status === 'FINISHED' ? 'Переглянути' : 'Панель матчу'}
        </Link>
      </div>
    </div>
  )
}
