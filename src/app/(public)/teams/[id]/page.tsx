import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapPin, Calendar, Info, Users, Shield, Activity, TrendingUp, Trophy } from 'lucide-react'
import { getPositionColor, formatPosition, cn } from '@/lib/utils'
import { FavoriteButton } from '@/components/FavoriteButton'

export const revalidate = 60

export default async function TeamProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const team = await prisma.team.findUnique({
    where: { id: resolvedParams.id },
    include: {
      players: {
        orderBy: [{ position: 'asc' }, { number: 'asc' }]
      },
      coaches: true,
    }
  })

  if (!team) notFound()

  const teamStandings = await prisma.tournamentStanding.findMany({
    where: { teamId: resolvedParams.id },
    include: { Tournament: true }
  });
  
  const globalStats = teamStandings.reduce((acc, st) => {
    acc.played += st.played;
    acc.won += st.won;
    acc.drawn += st.drawn;
    acc.lost += st.lost;
    acc.goalsFor += st.goalsFor;
    acc.goalsAgainst += st.goalsAgainst;
    return acc;
  }, { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0 });

  const lastMatches = await prisma.match.findMany({
    where: { 
      OR: [{ homeTeamId: resolvedParams.id }, { awayTeamId: resolvedParams.id }],
      status: "FINISHED"
    },
    orderBy: { finishedAt: 'desc' },
    take: 5
  });

  const form = lastMatches.map(match => {
    const isHome = match.homeTeamId === resolvedParams.id;
    const teamScore = isHome ? match.homeScore! : match.awayScore!;
    const oppScore = isHome ? match.awayScore! : match.homeScore!;
    if (teamScore > oppScore) return 'W';
    if (teamScore === oppScore) return 'D';
    return 'L';
  }).reverse();

  const playersWithStats = await prisma.player.findMany({
    where: { teamId: resolvedParams.id },
    include: { stats: true }
  });

  const topScorers = playersWithStats.map(p => ({
    ...p,
    totalGoals: p.stats.reduce((acc, s) => acc + s.goals, 0)
  })).filter(p => p.totalGoals > 0).sort((a, b) => b.totalGoals - a.totalGoals).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Team Header */}
      <div className="bg-[#1c1a1a] rounded-sm overflow-hidden relative border border-gray-800">
        <div className="absolute inset-0 bg-[#000000] opacity-80 z-10"></div>
        
        <div className="relative z-20 p-8 sm:p-12 flex flex-col md:flex-row items-center md:items-start gap-12">
          <div className="w-32 h-32 md:w-48 md:h-48 rounded-sm bg-[#0a0a0a] p-6 shadow-2xl border border-gray-800 shrink-0">
            {team.logo && <Image src={team.logo} alt={team.name} width={192} height={192} className="object-contain w-full h-full drop-shadow-2xl" />}
          </div>
          
          <div className="text-center md:text-left flex-1">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
              <div>
                <h1 className="text-4xl md:text-6xl font-black text-white mb-2 uppercase tracking-tight">{team.name}</h1>
                <p className="text-xl text-[#CCFF00] font-black uppercase tracking-widest">[{team.shortName}]</p>
              </div>
              <div className="shrink-0">
                <FavoriteButton teamId={team.id} />
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-bold uppercase tracking-widest text-gray-400">
              <span className="flex items-center gap-2 bg-[#0a0a0a] px-4 py-2 rounded-sm border border-gray-800">
                <MapPin className="w-4 h-4 text-[#CCFF00]" />
                {team.stadium}, {team.city}
              </span>
              <span className="flex items-center gap-2 bg-[#0a0a0a] px-4 py-2 rounded-sm border border-gray-800">
                <Calendar className="w-4 h-4 text-[#CCFF00]" />
                Засновано: {team.founded} р.
              </span>
              <span className="flex items-center gap-2 bg-[#0a0a0a] px-4 py-2 rounded-sm border border-gray-800">
                <Shield className="w-4 h-4 text-[#CCFF00]" />
                Тренер: {team.coaches[0]?.name || 'Не визначено'}
              </span>
            </div>
            
            {team.description && (
              <p className="mt-8 text-gray-400 max-w-3xl leading-relaxed text-sm border-l-4 border-[#CCFF00] pl-6">
                {team.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div>
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-[#CCFF00] rounded-sm">
            <Activity className="w-6 h-6 text-black" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-widest">Статистика</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="bg-[#1c1a1a] p-6 border border-gray-800 flex flex-col items-center justify-center text-center rounded-sm">
            <span className="text-3xl font-black text-white">{globalStats.played}</span>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2">Матчі</span>
          </div>
          <div className="bg-[#1c1a1a] p-6 border border-[#2a3f2a] flex flex-col items-center justify-center text-center rounded-sm">
            <span className="text-3xl font-black text-[#4ade80]">{globalStats.won}</span>
            <span className="text-[10px] font-black text-[#4ade80] uppercase tracking-widest mt-2">Перемоги</span>
          </div>
          <div className="bg-[#1c1a1a] p-6 border border-[#3f3f2a] flex flex-col items-center justify-center text-center rounded-sm">
            <span className="text-3xl font-black text-[#facc15]">{globalStats.drawn}</span>
            <span className="text-[10px] font-black text-[#facc15] uppercase tracking-widest mt-2">Нічиї</span>
          </div>
          <div className="bg-[#1c1a1a] p-6 border border-[#3f2a2a] flex flex-col items-center justify-center text-center rounded-sm">
            <span className="text-3xl font-black text-[#f87171]">{globalStats.lost}</span>
            <span className="text-[10px] font-black text-[#f87171] uppercase tracking-widest mt-2">Поразки</span>
          </div>
          <div className="bg-[#1c1a1a] p-6 border border-gray-800 flex flex-col items-center justify-center text-center rounded-sm">
            <span className="text-3xl font-black text-[#CCFF00]">{globalStats.goalsFor}</span>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2">Забиті</span>
          </div>
          <div className="bg-[#1c1a1a] p-6 border border-gray-800 flex flex-col items-center justify-center text-center rounded-sm">
            <span className="text-3xl font-black text-white">{globalStats.goalsAgainst}</span>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2">Пропущені</span>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-4 bg-[#1c1a1a] p-6 border border-gray-800 rounded-sm">
          <TrendingUp className="w-5 h-5 text-gray-400 shrink-0" />
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Форма:</span>
          <div className="flex gap-2">
            {form.length > 0 ? form.map((res, i) => (
              <div key={i} className={cn(
                "w-8 h-8 rounded-sm flex items-center justify-center text-xs font-black text-white",
                res === 'W' && "bg-[#4ade80]",
                res === 'D' && "bg-[#facc15] text-black",
                res === 'L' && "bg-[#f87171]"
              )}>
                {res}
              </div>
            )) : <span className="text-xs font-bold text-gray-500 uppercase">Немає матчів</span>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Top Scorers Section */}
        <div>
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-[#CCFF00] rounded-sm">
              <Trophy className="w-6 h-6 text-black" />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-widest">Топ Бомбардири</h2>
          </div>
          {topScorers.length > 0 ? (
            <div className="space-y-4">
              {topScorers.map((p, i) => (
                <div key={p.id} className="bg-[#1c1a1a] p-4 border border-gray-800 rounded-sm flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 flex items-center justify-center font-black text-gray-500">{i + 1}</div>
                    <div>
                      <h4 className="font-bold text-white uppercase tracking-wider">{p.firstName} {p.lastName}</h4>
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{formatPosition(p.position)}</span>
                    </div>
                  </div>
                  <div className="text-2xl font-black text-[#CCFF00]">{p.totalGoals} <span className="text-sm">⚽</span></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#1c1a1a] p-8 border border-gray-800 rounded-sm text-center text-gray-500 font-bold uppercase tracking-widest text-xs">
              Ще немає голів
            </div>
          )}
        </div>

        {/* Tournaments Participation */}
        <div>
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-[#CCFF00] rounded-sm">
              <Shield className="w-6 h-6 text-black" />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-widest">Турніри</h2>
          </div>
          {teamStandings.length > 0 ? (
            <div className="space-y-4">
              {teamStandings.map((st) => (
                <div key={st.id} className="bg-[#1c1a1a] p-4 border border-gray-800 rounded-sm flex items-center justify-between group">
                  <div>
                    <h4 className="font-bold text-white uppercase tracking-wider group-hover:text-[#CCFF00] transition-colors">
                      <Link href={`/tournaments/${st.tournamentId}`}>{st.Tournament.name}</Link>
                    </h4>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Місце: {st.position}</span>
                  </div>
                  <div className="text-xl font-black text-white">{st.points} <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">ОЧК</span></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#1c1a1a] p-8 border border-gray-800 rounded-sm text-center text-gray-500 font-bold uppercase tracking-widest text-xs">
              Не бере участь у турнірах
            </div>
          )}
        </div>
      </div>

      {/* Roster Section */}
      <div>
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-[#CCFF00] rounded-sm">
            <Users className="w-6 h-6 text-black" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-widest">Гравці</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {team.players.map((player) => (
            <Link key={player.id} href={`/players/${player.id}`} className="group">
              <div className="bg-[#1c1a1a] p-4 border border-[#2a2828] hover:border-[#CCFF00] rounded-sm flex items-center gap-4 h-full transition-colors">
                <div className="w-12 h-12 rounded-sm bg-[#0a0a0a] border border-gray-800 flex items-center justify-center font-black text-gray-500 text-lg group-hover:bg-[#CCFF00] group-hover:text-black transition-colors shrink-0">
                  {player.number}
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-bold text-white uppercase tracking-wider group-hover:text-[#CCFF00] transition-colors truncate">{player.firstName} {player.lastName}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm border border-gray-700 text-gray-400 uppercase tracking-widest">
                      {formatPosition(player.position)}
                    </span>
                    <span className="text-[10px] text-gray-600 uppercase font-bold tracking-widest truncate">{player.nationality}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
