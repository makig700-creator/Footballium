import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import { formatRelative } from '@/lib/utils'
import { Newspaper, Clock } from 'lucide-react'

export const revalidate = 60

export default async function NewsFeedPage() {
  const articles = await prisma.news.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="flex items-center gap-4 border-b border-gray-900 pb-6">
        <div className="w-12 h-12 rounded-sm bg-[#CCFF00] flex items-center justify-center shadow-lg border border-[#CCFF00]">
          <Newspaper className="w-6 h-6 text-black" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">Останні новини</h1>
          <p className="text-[#CCFF00] font-bold text-xs uppercase tracking-widest mt-1">Свіжі новини, звіти про матчі та аналітика</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <Link key={article.id} href={`/news/${article.slug}`} className="group bg-[#1c1a1a] rounded-sm overflow-hidden flex flex-col h-full border border-gray-800 hover:border-[#CCFF00] transition-colors">
            <div className="aspect-[16/10] bg-[#0a0a0a] relative overflow-hidden border-b border-gray-800">
              {article.coverImage ? (
                <Image src={article.coverImage} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700 mix-blend-luminosity opacity-80 group-hover:opacity-100 group-hover:mix-blend-normal" />
              ) : (
                <div className="absolute inset-0 bg-[#000000] flex items-center justify-center">
                  <Newspaper className="w-12 h-12 text-gray-800" />
                </div>
              )}
              <div className="absolute top-3 left-3 px-3 py-1 bg-[#CCFF00] text-black text-[10px] font-black rounded-sm uppercase tracking-widest shadow-lg">
                {article.category}
              </div>
            </div>
            
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#CCFF00] transition-colors leading-tight line-clamp-3 uppercase">
                {article.title}
              </h3>
              <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-1">
                {article.excerpt}
              </p>
              
              <div className="mt-auto pt-4 border-t border-gray-800 flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-gray-500">
                <span className="truncate pr-4">{article.authorName}</span>
                <span className="flex items-center gap-1.5 shrink-0 text-[#CCFF00]">
                  <Clock className="w-3.5 h-3.5" />
                  {formatRelative(article.publishedAt!)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
