import { prisma } from '@/lib/prisma'
import { PlayerCard } from '@/components/players/PlayerCard'
import { Users } from 'lucide-react'

export const revalidate = 60

export default async function PlayersPage() {
  const players = await prisma.player.findMany({
    include: {
      team: { select: { id: true, shortName: true } }
    },
    orderBy: { name: 'asc' }
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="flex items-center gap-4 border-b border-gray-900 pb-6">
        <div className="w-12 h-12 rounded-sm bg-[#CCFF00] flex items-center justify-center shadow-lg border border-[#CCFF00]">
          <Users className="w-6 h-6 text-black" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">Каталог гравців</h1>
          <p className="text-[#CCFF00] font-bold text-xs uppercase tracking-widest mt-1">Шукайте професійних футболістів ліги</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {players.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </div>
  )
}
