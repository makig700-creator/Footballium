'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Search as SearchIcon, Loader2, Shield, User, Newspaper, ChevronRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from '@/hooks/useDebounce'
import { formatPosition } from '@/lib/utils'
import { Input } from '@/components/ui/input'

function SearchContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  
  const [query, setQuery] = useState(initialQuery)
  const debouncedQuery = useDebounce(query, 500)

  // Update URL when search changes
  useEffect(() => {
    const params = new URLSearchParams()
    if (debouncedQuery) {
      params.set('q', debouncedQuery)
    } else {
      params.delete('q')
    }
    router.replace(`/search?${params.toString()}`, { scroll: false })
  }, [debouncedQuery, router])

  const { data, isLoading, isError } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) return null
      const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
      if (!res.ok) throw new Error('Search failed')
      return res.json()
    },
    enabled: debouncedQuery.length >= 2,
  })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight uppercase">Пошук</h1>
        <p className="text-[#CCFF00] font-bold text-xs uppercase tracking-widest">Шукайте команди, гравців та новини</p>
      </div>

      <div className="relative max-w-2xl mx-auto mb-16">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          {isLoading ? (
            <Loader2 className="w-6 h-6 text-[#CCFF00] animate-spin" />
          ) : (
            <SearchIcon className="w-6 h-6 text-gray-500" />
          )}
        </div>
        <Input
          type="text"
          className="h-16 w-full rounded-sm bg-[#0a0a0a] pl-14 pr-4 text-white font-bold uppercase tracking-wider shadow-xl border border-gray-800 focus-visible:ring-[#CCFF00] focus-visible:border-[#CCFF00] text-sm transition-all placeholder:text-gray-600 placeholder:font-bold placeholder:uppercase"
          placeholder="Назва команди, гравець..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      {debouncedQuery.length < 2 && !data && (
        <div className="text-center text-gray-600 mt-20">
          <SearchIcon className="w-16 h-16 mx-auto text-gray-800 mb-6" />
          <p className="font-bold uppercase tracking-widest text-xs">Введіть щонайменше 2 символи, щоб почати пошук</p>
        </div>
      )}

      {isError && (
        <div className="text-center text-red-500 font-bold uppercase tracking-widest text-xs mt-10">Під час пошуку сталася помилка. Будь ласка, спробуйте ще раз.</div>
      )}

      {data && (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {data.teams?.length === 0 && data.players?.length === 0 && data.news?.length === 0 && (
            <div className="text-center text-gray-500 mt-10 font-bold uppercase tracking-widest">
              <p className="text-sm">Нічого не знайдено за запитом "{debouncedQuery}"</p>
            </div>
          )}

          {data.teams?.length > 0 && (
            <section>
              <h2 className="text-sm font-black text-white mb-6 flex items-center gap-3 border-b border-gray-900 pb-4 uppercase tracking-widest">
                <Shield className="w-5 h-5 text-gray-500" /> Команди
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.teams.map((team: any) => (
                  <Link key={team.id} href={`/teams/${team.id}`} className="bg-[#1c1a1a] border border-[#2a2828] rounded-sm p-4 flex items-center justify-between hover:border-[#CCFF00] transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-sm bg-[#0a0a0a] border border-gray-800 p-2 group-hover:border-gray-600 transition-colors">
                        {team.logo && <Image src={team.logo} alt={team.name} width={48} height={48} className="object-contain" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-white uppercase tracking-wider group-hover:text-[#CCFF00] transition-colors">{team.name}</h3>
                        <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">{team.stadium}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-[#CCFF00] transition-colors" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {data.players?.length > 0 && (
            <section>
              <h2 className="text-sm font-black text-white mb-6 flex items-center gap-3 border-b border-gray-900 pb-4 uppercase tracking-widest">
                <User className="w-5 h-5 text-gray-500" /> Гравці
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.players.map((player: any) => (
                  <Link key={player.id} href={`/players/${player.id}`} className="bg-[#1c1a1a] border border-[#2a2828] rounded-sm p-4 flex items-center justify-between hover:border-[#CCFF00] transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-sm bg-[#0a0a0a] border border-gray-800 flex items-center justify-center group-hover:border-gray-600 transition-colors">
                        <User className="w-6 h-6 text-gray-500 group-hover:text-[#CCFF00]" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white uppercase tracking-wider group-hover:text-[#CCFF00] transition-colors">{player.name}</h3>
                        <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">{player.team.shortName} · {formatPosition(player.position)}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-[#CCFF00] transition-colors" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {data.news?.length > 0 && (
            <section>
              <h2 className="text-sm font-black text-white mb-6 flex items-center gap-3 border-b border-gray-900 pb-4 uppercase tracking-widest">
                <Newspaper className="w-5 h-5 text-gray-500" /> Новини
              </h2>
              <div className="space-y-4">
                {data.news.map((article: any) => (
                  <Link key={article.id} href={`/news/${article.slug}`} className="bg-[#1c1a1a] border border-[#2a2828] rounded-sm p-4 flex items-center justify-between hover:border-[#CCFF00] transition-colors group">
                    <div>
                      <span className="text-[10px] uppercase font-black text-[#CCFF00] tracking-widest mb-2 block">{article.category}</span>
                      <h3 className="font-bold text-white uppercase group-hover:text-[#CCFF00] transition-colors line-clamp-1">{article.title}</h3>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-[#CCFF00] transition-colors shrink-0 ml-4" />
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-600 font-bold uppercase tracking-widest text-xs">Завантаження...</div>}>
      <SearchContent />
    </Suspense>
  )
}
