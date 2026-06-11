import { prisma } from '@/lib/prisma'
import { PlayerCard } from '@/components/players/PlayerCard'
import { User, Search } from 'lucide-react'
import Link from 'next/link'

export const revalidate = 0

export default async function PlayersPage({ searchParams }: { searchParams: Promise<{ search?: string, position?: string, page?: string }> }) {
  const resolvedParams = await searchParams;
  const search = resolvedParams.search || ''
  const position = resolvedParams.position || ''
  const page = parseInt(resolvedParams.page || '1')
  const limit = 24
  const skip = (page - 1) * limit

  const where: any = {}
  if (search || position) {
    where.AND = []
    if (search) {
      where.AND.push({
        OR: [
          { firstName: { contains: search } },
          { lastName: { contains: search } }
        ]
      })
    }
    if (position) {
      where.AND.push({ position })
    }
  }

  const [players, total] = await Promise.all([
    prisma.player.findMany({
      where,
      include: {
        team: { select: { id: true, name: true, shortName: true } }
      },
      skip,
      take: limit,
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }]
    }),
    prisma.player.count({ where })
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-900 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-sm bg-[#CCFF00] flex items-center justify-center shadow-lg border border-[#CCFF00]">
            <User className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">Гравці</h1>
            <p className="text-[#CCFF00] font-bold text-xs uppercase tracking-widest mt-1">Всі гравці платформи</p>
          </div>
        </div>

        <form className="flex flex-col sm:flex-row gap-4" action="/players">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              name="search" 
              defaultValue={search} 
              placeholder="Пошук за ім'ям..." 
              className="pl-9 pr-4 py-2 bg-[#0a0a0a] border border-gray-800 rounded-sm text-sm text-white focus:ring-1 focus:ring-[#CCFF00] focus:border-[#CCFF00] outline-none w-full sm:w-64"
            />
          </div>
          <select 
            name="position" 
            defaultValue={position} 
            className="px-4 py-2 bg-[#0a0a0a] border border-gray-800 rounded-sm text-sm text-gray-300 focus:ring-1 focus:ring-[#CCFF00] focus:border-[#CCFF00] outline-none"
          >
            <option value="">Всі позиції</option>
            <option value="GOALKEEPER">Воротар</option>
            <option value="DEFENDER">Захисник</option>
            <option value="MIDFIELDER">Півзахисник</option>
            <option value="FORWARD">Нападник</option>
          </select>
          <button type="submit" className="bg-[#1c1a1a] text-white border border-gray-800 px-4 py-2 rounded-sm text-sm font-bold uppercase tracking-widest hover:border-[#CCFF00] hover:text-[#CCFF00] transition-colors">
            Знайти
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {players.map((player) => (
          <PlayerCard key={player.id} player={player as any} />
        ))}
      </div>

      {players.length === 0 && (
        <div className="text-center py-20 text-gray-500 font-bold uppercase tracking-widest">
          Гравців не знайдено
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-12">
          {page > 1 && (
            <Link href={`/players?page=${page - 1}${search ? `&search=${search}` : ''}${position ? `&position=${position}` : ''}`} className="px-4 py-2 bg-[#1c1a1a] border border-gray-800 rounded-sm text-white hover:border-[#CCFF00] transition-colors text-xs font-bold uppercase tracking-widest">
              Попередня
            </Link>
          )}
          <span className="px-4 py-2 text-gray-500 text-xs font-bold uppercase tracking-widest">
            Сторінка {page} з {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/players?page=${page + 1}${search ? `&search=${search}` : ''}${position ? `&position=${position}` : ''}`} className="px-4 py-2 bg-[#1c1a1a] border border-gray-800 rounded-sm text-white hover:border-[#CCFF00] transition-colors text-xs font-bold uppercase tracking-widest">
              Наступна
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
