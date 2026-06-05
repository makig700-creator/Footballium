import Image from 'next/image'
import Link from 'next/link'
import { formatKickoff } from '@/lib/utils'
import { Calendar, MapPin, ChevronRight, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

export type FixtureData = {
  id: string
  homeTeam: { id: string, name: string, shortName: string, logo: string | null }
  awayTeam: { id: string, name: string, shortName: string, logo: string | null }
  homeScore: number | null
  awayScore: number | null
  status: string
  kickoff: Date
  venue: string
  leagueId: string
  minute: number | null
}

export function FixtureCard({ match }: { match: FixtureData }) {
  const isLive = match.status === 'LIVE'
  const isFinished = match.status === 'FULLTIME'

  return (
    <Link href={`/matches/${match.id}`} className="block group">
      <div className={cn(
        "bg-[#1c1a1a] rounded-sm border transition-colors flex flex-col h-full relative overflow-hidden",
        isLive ? "border-[#CCFF00] shadow-[0_0_15px_rgba(204,255,0,0.15)] ring-1 ring-[#CCFF00]/50" : "border-[#2a2828] hover:border-gray-600"
      )}>
        {/* Header */}
        <div className="bg-[#0a0a0a] px-4 py-3 flex items-center justify-between border-b border-gray-800 text-[10px] font-bold uppercase tracking-widest">
          <div className="flex items-center gap-3">
            <span className="text-gray-500">
              {match.leagueId === 'premier-league' ? 'Premier League' : match.leagueId}
            </span>
            {isLive ? (
              <span className="flex items-center gap-1.5 text-black bg-[#CCFF00] px-2 py-0.5 rounded-sm">
                <Activity className="w-3 h-3 animate-pulse" />
                НАЖИВО {match.minute ? `${match.minute}'` : ''}
              </span>
            ) : isFinished ? (
              <span className="text-gray-600 bg-gray-900 px-2 py-0.5 border border-gray-800 rounded-sm">Завершено</span>
            ) : (
              <span className="text-gray-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {formatKickoff(match.kickoff)}
              </span>
            )}
          </div>
          <span className="text-gray-500 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {match.venue}
          </span>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            {/* Home Team */}
            <div className="flex flex-col items-center gap-3 flex-1">
              <div className="w-16 h-16 rounded-sm bg-[#0a0a0a] border border-gray-800 flex items-center justify-center relative p-2 shadow-inner group-hover:border-gray-600 transition-colors">
                {match.homeTeam.logo && <Image src={match.homeTeam.logo} alt={match.homeTeam.name} fill className="object-contain p-2" />}
              </div>
              <span className="font-black text-white text-center text-sm uppercase tracking-wider group-hover:text-[#CCFF00] transition-colors">
                {match.homeTeam.shortName}
              </span>
            </div>

            {/* Score / VS */}
            <div className="px-6 flex flex-col items-center justify-center">
              {isLive || isFinished ? (
                <div className="flex items-center gap-4 font-black text-4xl">
                  <span className={cn(match.homeScore! > match.awayScore! ? "text-[#CCFF00]" : "text-white")}>
                    {match.homeScore}
                  </span>
                  <span className="text-gray-700 text-2xl">-</span>
                  <span className={cn(match.awayScore! > match.homeScore! ? "text-[#CCFF00]" : "text-white")}>
                    {match.awayScore}
                  </span>
                </div>
              ) : (
               <div className="w-12 h-12 rounded-full border border-gray-800 bg-[#0a0a0a] flex items-center justify-center text-xs font-bold uppercase tracking-widest text-gray-500 shadow-inner">
                  VS
                </div>
              )}
            </div>

            {/* Away Team */}
            <div className="flex flex-col items-center gap-3 flex-1">
              <div className="w-16 h-16 rounded-sm bg-[#0a0a0a] border border-gray-800 flex items-center justify-center relative p-2 shadow-inner group-hover:border-gray-600 transition-colors">
                {match.awayTeam.logo && <Image src={match.awayTeam.logo} alt={match.awayTeam.name} fill className="object-contain p-2" />}
              </div>
              <span className="font-black text-white text-center text-sm uppercase tracking-wider group-hover:text-[#CCFF00] transition-colors">
                {match.awayTeam.shortName}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto bg-[#0a0a0a] px-4 py-3 flex items-center justify-center border-t border-gray-800 group-hover:bg-[#CCFF00] transition-colors group/btn">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1 group-hover:text-black transition-colors">
            Центр матчу <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}
