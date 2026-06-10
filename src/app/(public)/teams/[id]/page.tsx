import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapPin, Calendar, Info, Users, Shield } from 'lucide-react'
import { getPositionColor, formatPosition } from '@/lib/utils'

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

  // Players are already sorted by position and number from the DB query

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
            <h1 className="text-4xl md:text-6xl font-black text-white mb-2 uppercase tracking-tight">{team.name}</h1>
            <p className="text-xl text-[#CCFF00] font-black mb-8 uppercase tracking-widest">[{team.shortName}]</p>
            
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
                  <h4 className="font-bold text-white uppercase tracking-wider group-hover:text-[#CCFF00] transition-colors truncate">{player.name}</h4>
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
