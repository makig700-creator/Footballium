import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { User, Activity, Shield, Hash, MapPin } from 'lucide-react'
import { getPositionColor, cn, formatPosition } from '@/lib/utils'

export const revalidate = 60

export default async function PlayerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const player = await prisma.player.findUnique({
    where: { id: resolvedParams.id },
    include: {
      team: true,
      stats: true,
    }
  })

  if (!player) notFound()

  const stats = [
    { label: 'Матчі', value: player.stats?.appearances || 0 },
    { label: 'Голи', value: player.stats?.goals || 0 },
    { label: 'Асисти', value: player.stats?.assists || 0 },
    { label: 'Хвилини', value: player.stats?.minutesPlayed || 0 },
    { label: 'Сухі матчі', value: player.stats?.cleanSheets || 0 },
    { label: 'Рейтинг', value: player.stats?.rating?.toFixed(1) || 'N/A' },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Profile Header */}
      <div className="bg-[#1c1a1a] border border-gray-800 rounded-sm overflow-hidden relative">
        <div className="absolute inset-0 bg-[#000000] opacity-80 z-10"></div>
        
        <div className="relative z-20 p-8 sm:p-12 flex flex-col md:flex-row items-center md:items-start gap-12">
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-sm bg-[#0a0a0a] border border-gray-800 flex items-center justify-center overflow-hidden shrink-0 shadow-2xl relative">
              {player.photo ? (
                <Image src={player.photo} alt={`${player.firstName} ${player.lastName}`} fill className="object-cover" />
              ) : (
                <User className="w-16 h-16 text-gray-700" />
              )}
            </div>
            <div className="absolute -bottom-4 -right-4 w-14 h-14 rounded-sm bg-[#CCFF00] border border-[#000000] p-1 flex items-center justify-center shadow-lg">
              {player.team.logo && <Image src={player.team.logo} alt={player.team.name} width={36} height={36} className="object-contain" />}
            </div>
          </div>
          
          <div className="text-center md:text-left flex-1 mt-4 md:mt-0">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase">{player.firstName} {player.lastName}</h1>
              <span className="text-[10px] font-black px-2 py-1 rounded-sm border border-[#CCFF00] text-[#CCFF00] uppercase tracking-widest md:ml-2">
                {formatPosition(player.position)}
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
              <div className="bg-[#0a0a0a] rounded-sm p-4 border border-gray-800">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <Hash className="w-4 h-4 text-[#CCFF00]" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Номер</span>
                </div>
                <div className="text-3xl font-black text-white">{player.number}</div>
              </div>
              
              <div className="bg-[#0a0a0a] rounded-sm p-4 border border-gray-800">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <Shield className="w-4 h-4 text-[#CCFF00]" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Команда</span>
                </div>
                <Link href={`/teams/${player.teamId}`} className="text-lg font-bold text-white hover:text-[#CCFF00] uppercase tracking-wider transition-colors line-clamp-1">
                  {player.team.shortName}
                </Link>
              </div>

              <div className="bg-[#0a0a0a] rounded-sm p-4 border border-gray-800">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <MapPin className="w-4 h-4 text-[#CCFF00]" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Країна</span>
                </div>
                <div className="text-lg font-bold text-white uppercase tracking-wider truncate">{player.nationality}</div>
              </div>
              
              <div className="bg-[#0a0a0a] rounded-sm p-4 border border-gray-800">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <User className="w-4 h-4 text-[#CCFF00]" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Вік</span>
                </div>
                <div className="text-xl font-black text-white">{player.age} р.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Season Stats */}
      <div>
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-[#CCFF00] rounded-sm">
            <Activity className="w-6 h-6 text-black" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-widest">Статистика</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-[#1c1a1a] border border-gray-800 p-8 flex flex-col items-center justify-center text-center rounded-sm">
              <span className="text-4xl md:text-5xl font-black text-[#CCFF00] mb-4">{stat.value}</span>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</span>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-2 gap-6 mt-6">
           <div className="bg-[#1c1a1a] border border-gray-800 p-6 flex items-center justify-between border-l-4 border-l-yellow-400 rounded-sm">
             <span className="font-black text-gray-400 uppercase tracking-widest text-[10px]">Жовті картки</span>
             <span className="text-2xl font-black text-white">{player.stats?.yellowCards || 0}</span>
           </div>
           <div className="bg-[#1c1a1a] border border-gray-800 p-6 flex items-center justify-between border-l-4 border-l-red-500 rounded-sm">
             <span className="font-black text-gray-400 uppercase tracking-widest text-[10px]">Червоні картки</span>
             <span className="text-2xl font-black text-white">{player.stats?.redCards || 0}</span>
           </div>
        </div>
      </div>
    </div>
  )
}
