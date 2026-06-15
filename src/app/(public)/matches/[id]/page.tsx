import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { format } from 'date-fns'
import { uk } from 'date-fns/locale'
import { Calendar, MapPin, Clock, Shield } from 'lucide-react'

export const revalidate = 60

type Props = {
  params: Promise<{ id: string }>
}

function getEventIcon(type: string) {
  switch (type) {
    case 'GOAL':
    case 'PENALTY_GOAL':
      return <div className="w-4 h-4 rounded-full bg-emerald-400" title="Гол" />
    case 'OWN_GOAL':
      return <div className="w-4 h-4 rounded-full bg-rose-500" title="Автогол" />
    case 'YELLOW_CARD':
      return <div className="w-4 h-5 rounded-sm bg-yellow-400 rotate-12" title="Жовта картка" />
    case 'RED_CARD':
      return <div className="w-4 h-5 rounded-sm bg-rose-600 rotate-12" title="Червона картка" />
    case 'SUBSTITUTION':
      return <div className="text-xs text-blue-400 font-bold" title="Заміна">⇅</div>
    default:
      return null
  }
}

export default async function MatchDetailsPage({ params }: Props) {
  const { id } = await params

  const match = await prisma.match.findUnique({
    where: { id },
    include: {
      homeTeam: {
        include: { players: true }
      },
      awayTeam: {
        include: { players: true }
      },
      tournament: true,
      events: {
        orderBy: { minute: 'asc' }
      },
      lineup: {
        include: {
          slots: {
            include: { player: true },
            orderBy: { order: 'asc' }
          }
        }
      }
    }
  })


  if (!match) {
    notFound()
  }

  // Combine players into a lookup map for easy access
  const allPlayers = [...match.homeTeam.players, ...(match.awayTeam?.players || [])]
  const playerMap = new Map(allPlayers.map(p => [p.id, p]))

  const isLive = match.status === 'LIVE'
  const isFinished = match.status === 'FINISHED'

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* MATCH HEADER / SCOREBOARD */}
      <div className="relative rounded-2xl bg-zinc-900/50 backdrop-blur-md border border-white/10 p-8 sm:p-12 overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
        {/* Abstract Background Element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-3xl opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#CCFF00]/10 to-transparent blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="flex items-center gap-3 text-zinc-400 text-sm sm:text-base font-medium mb-8 uppercase tracking-widest">
            {match.tournament && (
              <span className="flex items-center gap-1.5 text-white">
                <Shield className="w-4 h-4 text-[#CCFF00]" />
                {match.tournament.name}
              </span>
            )}
            {match.scheduledAt && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(match.scheduledAt), "d MMMM, HH:mm", { locale: uk })}
                </span>
              </>
            )}
            {match.venue && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {match.venue}
                </span>
              </>
            )}
          </div>

          <div className="flex w-full items-center justify-between sm:justify-center sm:gap-16">
            {/* HOME TEAM */}
            <div className="flex flex-col items-center gap-4 flex-1 sm:flex-none">
              <div className="relative w-20 h-20 sm:w-32 sm:h-32">
                <Image
                  src={match.homeTeam.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(match.homeTeam.shortName)}&background=random`}
                  alt={match.homeTeam.name}
                  fill
                  className="object-contain drop-shadow-2xl"
                />
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-white text-center tracking-tight">
                {match.homeTeam.shortName}
              </h2>
            </div>

            {/* SCORE */}
            <div className="flex flex-col items-center justify-center min-w-[120px] sm:min-w-[160px]">
              {isLive && (
                <div className="flex items-center gap-2 mb-2 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider">{match.minute}" Наживо</span>
                </div>
              )}
              {isFinished && (
                <div className="mb-2 bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-white/5">
                  Завершено
                </div>
              )}
              {(!isLive && !isFinished) && (
                <div className="mb-2 bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-white/5">
                  {format(new Date(match.scheduledAt || match.kickoff), "HH:mm", { locale: uk })}
                </div>
              )}

              <div className="flex items-center gap-4 sm:gap-6 text-5xl sm:text-7xl font-mono font-black text-white tracking-tighter">
                <span>{match.homeScore ?? '-'}</span>
                <span className="text-zinc-600 text-3xl sm:text-5xl pb-2">:</span>
                <span>{match.awayScore ?? '-'}</span>
              </div>
            </div>

            {/* AWAY TEAM */}
            <div className="flex flex-col items-center gap-4 flex-1 sm:flex-none">
              <div className="relative w-20 h-20 sm:w-32 sm:h-32">
                {match.awayTeam ? (
                  <Image
                    src={match.awayTeam.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(match.awayTeam.shortName)}&background=random`}
                    alt={match.awayTeam.name}
                    fill
                    className="object-contain drop-shadow-2xl"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-800 rounded-full flex items-center justify-center border-2 border-dashed border-zinc-700">
                    <span className="text-zinc-500 font-bold text-2xl">?</span>
                  </div>
                )}
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-white text-center tracking-tight">
                {match.awayTeam?.shortName || 'TBD'}
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* MAIN CONTENT COLUMN (Events) */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
            <h3 className="text-xl font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#CCFF00]" />
              Хід матчу
            </h3>

            {match.events.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 font-medium">
                Немає подій для відображення
              </div>
            ) : (
              <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-[45px] sm:before:left-[55px] before:w-[2px] before:bg-white/5">
                {match.events.map((event) => {
                  const player = event.playerId ? playerMap.get(event.playerId) : null
                  const playerOut = event.playerOutId ? playerMap.get(event.playerOutId) : null
                  const isHome = event.teamId === match.homeTeamId

                  return (
                    <div key={event.id} className="relative flex items-center gap-4 z-10 group">
                      <div className="w-[40px] sm:w-[50px] flex-shrink-0 text-right">
                        <span className="text-white font-mono font-bold text-lg group-hover:text-[#CCFF00] transition-colors">{event.minute}"</span>
                      </div>

                      <div className="w-4 h-4 rounded-full bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center z-10 shadow-sm" />

                      <div className="flex-1 bg-white/5 backdrop-blur-sm border border-white/5 rounded-xl p-4 flex items-center gap-4 hover:bg-white/10 transition-colors">
                        <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-zinc-900/80 rounded-lg">
                          {getEventIcon(event.type)}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {player && (
                              <span className="font-bold text-white text-sm sm:text-base">{player.firstName} {player.lastName}</span>
                            )}
                            {event.type === 'SUBSTITUTION' && playerOut && (
                              <span className="text-zinc-500 text-sm">замість <span className="text-zinc-400">{playerOut.firstName} {playerOut.lastName}</span></span>
                            )}
                          </div>
                          {event.comment && (
                            <p className="text-zinc-400 text-xs sm:text-sm mt-1">{event.comment}</p>
                          )}
                        </div>

                        <div className="flex-shrink-0 hidden sm:block">
                          <Image
                            src={(isHome ? match.homeTeam.logo : match.awayTeam?.logo) || `https://ui-avatars.com/api/?name=${isHome ? match.homeTeam.shortName : match.awayTeam?.shortName}&background=random`}
                            alt="Team logo"
                            width={24}
                            height={24}
                            className="opacity-50"
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        </div>

        {/* SIDEBAR (Lineups/Stats placeholder) */}
        <div className="space-y-8">
          <section className="bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
            <h3 className="text-xl font-black text-white uppercase tracking-widest mb-6">Склади команд</h3>

            {!match.lineup ? (
              <div className="text-center py-8 text-zinc-500 font-medium text-sm border border-dashed border-zinc-700/50 rounded-xl">
                Склади ще не оголошені
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-center mb-2">
                  <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-xs font-mono border border-white/5 uppercase tracking-wider">
                    {match.lineup.formation}
                  </span>
                </div>

                <div className="space-y-8">
                  {/* HOME TEAM LINEUP */}
                  <div>
                    <h4 className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-widest mb-4 border-b border-white/10 pb-2">
                      <Image src={match.homeTeam.logo || `https://ui-avatars.com/api/?name=${match.homeTeam.shortName}&background=random`} width={20} height={20} alt="" className="rounded-full" />
                      {match.homeTeam.shortName}
                    </h4>

                    <div className="space-y-1">
                      {match.lineup.slots.filter(s => s.player.teamId === match.homeTeamId && s.isStarter).map((slot) => (
                        <div key={slot.id} className="flex items-center gap-3 px-2 py-1.5 rounded-md bg-white/5 hover:bg-white/10 transition-colors">
                          <span className="w-5 text-zinc-500 font-mono text-xs text-right">
                            {match.lineup!.formation === '5x5' ? (slot.slotLabel || slot.player.number) : slot.player.number}
                          </span>
                          <span className="text-white font-medium text-sm">{slot.player.firstName} {slot.player.lastName}</span>
                        </div>
                      ))}
                    </div>
                    {/* Home Subs */}
                    {match.lineup.slots.some(s => s.player.teamId === match.homeTeamId && !s.isStarter) && (
                      <div className="space-y-1 mt-3">
                        <h5 className="text-zinc-500 text-[10px] uppercase tracking-widest pl-2 mb-2">Запасні</h5>
                        {match.lineup.slots.filter(s => s.player.teamId === match.homeTeamId && !s.isStarter).map((slot) => (
                          <div key={slot.id} className="flex items-center gap-3 px-2 py-1 rounded-md hover:bg-white/5 transition-colors opacity-70">
                            <span className="w-5 text-zinc-600 font-mono text-xs text-right">{slot.player.number}</span>
                            <span className="text-zinc-300 font-medium text-sm">{slot.player.firstName} {slot.player.lastName}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* AWAY TEAM LINEUP */}
                  {match.awayTeam && (
                    <div>
                      <h4 className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-widest mb-4 border-b border-white/10 pb-2">
                        <Image src={match.awayTeam.logo || `https://ui-avatars.com/api/?name=${match.awayTeam.shortName}&background=random`} width={20} height={20} alt="" className="rounded-full" />
                        {match.awayTeam.shortName}
                      </h4>

                      <div className="space-y-1">
                        {match.lineup.slots.filter(s => s.player.teamId === match.awayTeamId && s.isStarter).map((slot) => (
                          <div key={slot.id} className="flex items-center gap-3 px-2 py-1.5 rounded-md bg-white/5 hover:bg-white/10 transition-colors">
                            <span className="w-5 text-zinc-500 font-mono text-xs text-right">
                              {match.lineup!.formation === '5x5' ? (slot.slotLabel || slot.player.number) : slot.player.number}
                            </span>
                            <span className="text-white font-medium text-sm">{slot.player.firstName} {slot.player.lastName}</span>
                          </div>
                        ))}
                      </div>
                      {/* Away Subs */}
                      {match.lineup.slots.some(s => s.player.teamId === match.awayTeamId && !s.isStarter) && (
                        <div className="space-y-1 mt-3">
                          <h5 className="text-zinc-500 text-[10px] uppercase tracking-widest pl-2 mb-2">Запасні</h5>
                          {match.lineup.slots.filter(s => s.player.teamId === match.awayTeamId && !s.isStarter).map((slot) => (
                            <div key={slot.id} className="flex items-center gap-3 px-2 py-1 rounded-md hover:bg-white/5 transition-colors opacity-70">
                              <span className="w-5 text-zinc-600 font-mono text-xs text-right">{slot.player.number}</span>
                              <span className="text-zinc-300 font-medium text-sm">{slot.player.firstName} {slot.player.lastName}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
