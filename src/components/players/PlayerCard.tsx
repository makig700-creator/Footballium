import Link from 'next/link'
import { getPositionColor, cn } from '@/lib/utils'
import { User, Flag } from 'lucide-react'

export type PlayerCardData = {
  id: string
  name: string
  position: string
  number: number
  nationality: string
  team: { id: string, shortName: string }
}

export function PlayerCard({ player }: { player: PlayerCardData }) {
  // Translate previous position colors to new ones or just use a uniform style
  const isGoalkeeper = player.position === 'Воротар'
  const isDefender = player.position === 'Захисник'
  const isMidfielder = player.position === 'Півзахисник'
  const isForward = player.position === 'Нападник'

  let posColor = 'text-gray-400 border-gray-600'
  if (isForward) posColor = 'text-[#CCFF00] border-[#CCFF00]/50'
  else if (isMidfielder) posColor = 'text-blue-400 border-blue-500/50'
  else if (isDefender) posColor = 'text-amber-400 border-amber-500/50'
  else if (isGoalkeeper) posColor = 'text-red-400 border-red-500/50'

  return (
    <Link href={`/players/${player.id}`} className="block group">
      <div className="bg-[#1c1a1a] border border-[#2a2828] hover:border-gray-600 transition-colors rounded-md p-4 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-[#0a0a0a] flex items-center justify-center border border-gray-800 shrink-0 group-hover:border-[#CCFF00] transition-colors">
          <User className="w-6 h-6 text-gray-500 group-hover:text-[#CCFF00]" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-white uppercase truncate group-hover:text-[#CCFF00] transition-colors">
            {player.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-sm border uppercase tracking-wider", posColor)}>
              {player.position}
            </span>
            <span className="text-xs text-gray-400 font-black">#{player.number}</span>
            <span className="text-[10px] text-gray-500 flex items-center gap-1 truncate uppercase font-bold tracking-widest">
              <Flag className="w-3 h-3" /> {player.nationality}
            </span>
          </div>
        </div>
        
        <div className="text-right shrink-0">
          <span className="text-[10px] font-black uppercase tracking-widest text-white border border-gray-700 px-2 py-1 rounded-sm">
            {player.team.shortName}
          </span>
        </div>
      </div>
    </Link>
  )
}
