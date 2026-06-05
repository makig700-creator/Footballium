import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { formatRelative, formatDate } from '@/lib/utils'
import { ArrowLeft, Clock, User } from 'lucide-react'

export const revalidate = 60

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const article = await prisma.news.findUnique({
    where: { slug: resolvedParams.slug },
  })

  if (!article || !article.published) notFound()

  const tags = article.tags ? article.tags.split(',').map(t => t.trim()) : []

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
      <Link href="/news" className="inline-flex items-center gap-2 text-xs text-[#CCFF00] font-black uppercase tracking-widest hover:text-white mb-12 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Назад до новин
      </Link>

      <header className="mb-12 text-center md:text-left">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
          <span className="px-3 py-1 bg-[#CCFF00] text-black text-[10px] font-black rounded-sm uppercase tracking-widest">
            {article.category}
          </span>
          <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {formatDate(article.publishedAt!)}
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase mb-8 leading-[1.1]">
          {article.title}
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 font-medium leading-relaxed max-w-3xl border-l-4 border-[#CCFF00] pl-6 text-left mx-auto md:mx-0">
          {article.excerpt}
        </p>

        <div className="flex items-center justify-center md:justify-start gap-4 mt-10">
          <div className="w-12 h-12 rounded-sm bg-[#0a0a0a] flex items-center justify-center border border-gray-800">
            <User className="w-5 h-5 text-gray-500" />
          </div>
          <div className="text-left">
            <p className="text-xs font-black uppercase tracking-widest text-white">{article.authorName}</p>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Редакція FOOTBALLIUM</p>
          </div>
        </div>
      </header>

      {article.coverImage && (
        <div className="relative w-full aspect-video rounded-sm overflow-hidden mb-16 shadow-2xl border border-gray-800">
          <Image src={article.coverImage} alt={article.title} fill className="object-cover" priority />
        </div>
      )}

      <div className="prose prose-invert max-w-none md:prose-lg prose-p:text-gray-300 prose-p:leading-relaxed prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-a:text-[#CCFF00]">
        {article.content.split('\n\n').map((paragraph, i) => (
          <p key={i} className="mb-6">
            {paragraph}
          </p>
        ))}
      </div>

      {tags.length > 0 && (
        <div className="mt-16 pt-8 border-t border-gray-900 flex items-center gap-3 flex-wrap">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mr-2">Теми:</span>
          {tags.map((tag) => (
            <span key={tag} className="px-3 py-1 bg-[#1c1a1a] text-gray-400 text-[10px] font-bold uppercase tracking-widest rounded-sm border border-gray-800 hover:border-[#CCFF00] hover:text-[#CCFF00] transition-colors cursor-pointer">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}
