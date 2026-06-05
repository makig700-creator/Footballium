import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Users } from 'lucide-react'

export type TeamCardData = {
  id: string
  name: string
  shortName: string
  logo: string | null
  city: string
  stadium: string
  _count: { players: number }
}

export function TeamCard({ team }: { team: TeamCardData }) {
  return (
    <Link href={`/teams/${team.id}`} className="block group">
      <div className="bg-[#1c1a1a] border border-[#2a2828] rounded-md p-6 flex flex-col relative hover:border-gray-600 transition-colors h-full">
        <div className="h-40 flex items-center justify-center mb-6 mt-4 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c1a1a] to-transparent z-0"></div>
          <div className="w-24 h-24 rounded-2xl bg-[#0a0a0a] p-4 shadow-xl z-10 border border-gray-800 group-hover:scale-105 transition-transform duration-300">
            {team.logo && <Image src={team.logo} alt={team.name} width={96} height={96} className="object-contain w-full h-full" />}
          </div>
        </div>
        
        <div className="flex flex-col flex-1">
          <h3 className="text-lg font-bold text-white mb-2 uppercase leading-snug group-hover:text-[#CCFF00] transition-colors">
            {team.name}
          </h3>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-6">
            {team.shortName}
          </p>
          
          <div className="mt-auto space-y-3 mb-6 text-xs text-gray-400 font-medium tracking-wide">
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-gray-500 group-hover:text-[#CCFF00] transition-colors" />
              <span>{team.stadium}, {team.city}</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 text-gray-500 group-hover:text-[#CCFF00] transition-colors" />
              <span>{team._count.players} гравців</span>
            </div>
          </div>

          <div className="mt-auto">
             <div className="flex gap-2">
                <div className="flex-1 py-3 text-center border border-gray-700 text-white group-hover:border-[#CCFF00] group-hover:text-[#CCFF00] font-extrabold uppercase text-[11px] tracking-widest transition-colors rounded-sm">
                  Переглянути
                </div>
             </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
