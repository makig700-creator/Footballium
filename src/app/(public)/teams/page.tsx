import { prisma } from '@/lib/prisma'
import { TeamCard } from '@/components/teams/TeamCard'
import { Shield, Search } from 'lucide-react'
import Link from 'next/link'

export const revalidate = 0

export default async function TeamsPage({ searchParams }: { searchParams: Promise<{ search?: string, city?: string, page?: string }> }) {
  const resolvedParams = await searchParams;
  const search = resolvedParams.search || ''
  const city = resolvedParams.city || ''
  const page = parseInt(resolvedParams.page || '1')
  const limit = 12
  const skip = (page - 1) * limit

  const where: any = {}
  if (search || city) {
    where.AND = []
    if (search) where.AND.push({ name: { contains: search } })
    if (city) where.AND.push({ city: { contains: city } })
  }

  const [teams, total] = await Promise.all([
    prisma.team.findMany({
      where,
      include: {
        _count: { select: { players: true } }
      },
      skip,
      take: limit,
      orderBy: { name: 'asc' }
    }),
    prisma.team.count({ where })
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-900 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-sm bg-[#CCFF00] flex items-center justify-center shadow-lg border border-[#CCFF00]">
            <Shield className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">Каталог команд</h1>
            <p className="text-[#CCFF00] font-bold text-xs uppercase tracking-widest mt-1">Переглядайте всі зареєстровані футбольні клуби</p>
          </div>
        </div>

        <form className="flex flex-col sm:flex-row gap-4" action="/teams">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              name="search" 
              defaultValue={search} 
              placeholder="Пошук за назвою..." 
              className="pl-9 pr-4 py-2 bg-[#0a0a0a] border border-gray-800 rounded-sm text-sm text-white focus:ring-1 focus:ring-[#CCFF00] focus:border-[#CCFF00] outline-none w-full sm:w-64"
            />
          </div>
          <div className="relative">
            <input 
              type="text" 
              name="city" 
              defaultValue={city} 
              placeholder="Місто..." 
              className="px-4 py-2 bg-[#0a0a0a] border border-gray-800 rounded-sm text-sm text-white focus:ring-1 focus:ring-[#CCFF00] focus:border-[#CCFF00] outline-none w-full sm:w-48"
            />
          </div>
          <button type="submit" className="bg-[#1c1a1a] text-white border border-gray-800 px-4 py-2 rounded-sm text-sm font-bold uppercase tracking-widest hover:border-[#CCFF00] hover:text-[#CCFF00] transition-colors">
            Знайти
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {teams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>

      {teams.length === 0 && (
        <div className="text-center py-20 text-gray-500 font-bold uppercase tracking-widest">
          Команд не знайдено
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-12">
          {page > 1 && (
            <Link href={`/teams?page=${page - 1}${search ? `&search=${search}` : ''}${city ? `&city=${city}` : ''}`} className="px-4 py-2 bg-[#1c1a1a] border border-gray-800 rounded-sm text-white hover:border-[#CCFF00] transition-colors text-xs font-bold uppercase tracking-widest">
              Попередня
            </Link>
          )}
          <span className="px-4 py-2 text-gray-500 text-xs font-bold uppercase tracking-widest">
            Сторінка {page} з {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/teams?page=${page + 1}${search ? `&search=${search}` : ''}${city ? `&city=${city}` : ''}`} className="px-4 py-2 bg-[#1c1a1a] border border-gray-800 rounded-sm text-white hover:border-[#CCFF00] transition-colors text-xs font-bold uppercase tracking-widest">
              Наступна
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
