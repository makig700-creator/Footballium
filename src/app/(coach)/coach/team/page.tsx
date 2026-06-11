import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Edit, Users, MapPin, Trash2 } from 'lucide-react'
import { formatPosition } from '@/lib/utils'
import { DeleteButton } from '@/components/teams/DeleteButton' // We'll create this or use a form

export const revalidate = 0

export default async function CoachTeamPage() {
  const session = await auth()
  if (!session || !session.user || (session.user as any).role !== 'COACH') redirect('/')

  const team = await prisma.team.findUnique({
    where: { coachId: session.user.id },
    include: { players: { orderBy: { number: 'asc' } } }
  })

  if (!team) {
    return (
      <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-[#1c1a1a] border border-gray-800 flex items-center justify-center">
          <Users className="w-10 h-10 text-gray-500" />
        </div>
        <h1 className="text-3xl font-black text-white uppercase tracking-tight">У вас ще немає команди</h1>
        <p className="text-gray-400">Створіть профіль вашої команди, щоб додавати гравців та брати участь у турнірах.</p>
        <Link href="/coach/team/edit" className="bg-[#CCFF00] text-black px-8 py-4 rounded-sm font-black uppercase tracking-widest hover:bg-[#b3e600] transition-colors">
          Створити команду
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Моя команда</h1>
          <p className="text-[#CCFF00] font-bold text-xs uppercase tracking-widest mt-1">Керування профілем та складом</p>
        </div>
        <div className="flex gap-4">
          <Link href="/coach/team/edit" className="flex items-center gap-2 bg-[#1c1a1a] text-white px-4 py-2 rounded-sm border border-gray-800 hover:border-[#CCFF00] transition-colors font-bold text-xs uppercase tracking-widest">
            <Edit className="w-4 h-4" />
            Редагувати профіль
          </Link>
        </div>
      </div>

      <div className="bg-[#1c1a1a] border border-gray-800 p-8 rounded-sm flex flex-col sm:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-[#CCFF00] opacity-5 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="w-32 h-32 rounded-sm bg-[#0a0a0a] border border-gray-700 flex items-center justify-center shrink-0 z-10 p-2 shadow-xl">
          {team.logo ? (
            <Image src={team.logo} alt={team.name} width={100} height={100} className="object-contain" />
          ) : (
            <Users className="w-10 h-10 text-gray-600" />
          )}
        </div>
        
        <div className="flex-1 text-center sm:text-left z-10">
          <h2 className="text-4xl font-black text-white uppercase tracking-tight mb-2">{team.name}</h2>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[#CCFF00]" /> {team.city || 'Не вказано'}</span>
            <span className="text-gray-600">|</span>
            <span>Абревіатура: {team.shortName}</span>
          </div>
          {team.description && <p className="text-sm text-gray-400">{team.description}</p>}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-white uppercase tracking-widest">Склад команди ({team.players.length})</h3>
          <Link href="/coach/team/players/new" className="flex items-center gap-2 bg-[#CCFF00] text-black px-4 py-2 rounded-sm font-black text-xs uppercase tracking-widest hover:bg-[#b3e600] transition-colors">
            <Plus className="w-4 h-4" />
            Додати гравця
          </Link>
        </div>

        {team.players.length === 0 ? (
          <div className="bg-[#1c1a1a] border border-gray-800 p-12 rounded-sm text-center">
            <p className="text-gray-500 font-bold uppercase tracking-widest text-sm mb-4">У вашій команді ще немає гравців</p>
            <Link href="/coach/team/players/new" className="text-[#CCFF00] font-bold text-xs uppercase tracking-widest hover:underline">
              Додати першого гравця
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {team.players.map(player => (
              <div key={player.id} className="bg-[#1c1a1a] border border-[#2a2828] rounded-sm p-4 flex items-center gap-4 group">
                <div className="w-12 h-12 bg-[#0a0a0a] border border-gray-800 flex items-center justify-center font-black text-gray-500 rounded-sm">
                  {player.number}
                </div>
                <div className="flex-1 overflow-hidden">
                  <h4 className="font-bold text-white uppercase truncate">{player.firstName} {player.lastName}</h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">
                    {formatPosition(player.position)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/coach/team/players/${player.id}/edit`} className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-sm transition-colors">
                    <Edit className="w-4 h-4" />
                  </Link>
                  <DeleteButton id={player.id} type="player" teamId={team.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
