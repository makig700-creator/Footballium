import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Calendar, Eye, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { NewsLikeButton } from "@/components/news/NewsLikeButton"
import { ViewTracker } from "@/components/news/ViewTracker"

export const revalidate = 60

export default async function NewsDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await auth()

  const news = await prisma.news.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: {
      author: { select: { name: true } },
      _count: { select: { likes: true } },
    }
  })

  if (!news) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <ViewTracker slug={news.slug} />
      
      <Link 
        href="/news"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 text-sm font-bold uppercase tracking-widest"
      >
        <ArrowLeft className="w-4 h-4" />
        Всі новини
      </Link>

      <article className="bg-[#0a0a0a] border border-gray-900 rounded-sm overflow-hidden mb-8">
        {news.coverImage && (
          <div className="w-full aspect-[21/9] relative bg-[#111]">
            <img 
              src={news.coverImage} 
              alt={news.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-8 md:p-12">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-bold uppercase tracking-widest text-gray-500 mb-6 border-b border-gray-900 pb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#ccff00]" />
                {news.publishedAt ? new Date(news.publishedAt).toLocaleDateString("uk-UA", { day: 'numeric', month: 'long', year: 'numeric' }) : ""}
              </div>
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                {news.viewsCount}
              </div>
            </div>
            <div className="text-[#ccff00]">
              {news.author.name}
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-8">
            {news.title}
          </h1>

          <div 
            className="prose prose-invert prose-lg max-w-none prose-p:text-gray-300 prose-headings:text-white prose-a:text-[#ccff00] prose-img:rounded-sm"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
        </div>
      </article>

      <div className="flex justify-between items-center bg-[#0a0a0a] border border-gray-900 rounded-sm p-6">
        <h3 className="text-xl font-black text-white uppercase tracking-tighter">Оцініть новину</h3>
        <NewsLikeButton slug={news.slug} initialLikes={news._count.likes} />
      </div>
    </div>
  )
}
