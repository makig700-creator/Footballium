import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Calendar, Eye, Heart } from "lucide-react"

export const revalidate = 60

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || "1")
  const limit = 9
  const skip = (page - 1) * limit

  const [news, total] = await Promise.all([
    prisma.news.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      skip,
      take: limit,
      include: {
        author: { select: { name: true } },
        _count: { select: { likes: true } }
      }
    }),
    prisma.news.count({ where: { status: "PUBLISHED" } })
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
          Останні <span className="text-[#ccff00]">Новини</span>
        </h1>
        <p className="text-gray-400 max-w-2xl text-lg">
          Дізнавайтесь про останні події, результати матчів та новини платформи.
        </p>
      </div>

      {news.length === 0 ? (
        <div className="text-center py-20 bg-[#0a0a0a] rounded-sm border border-gray-900">
          <p className="text-gray-500 font-bold uppercase tracking-widest">Новин поки немає</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item) => (
            <Link 
              key={item.id} 
              href={`/news/${item.slug}`}
              className="group flex flex-col bg-[#0a0a0a] border border-gray-900 rounded-sm overflow-hidden hover:border-gray-700 transition-colors"
            >
              <div className="aspect-[16/9] relative bg-[#111] overflow-hidden">
                {item.coverImage ? (
                  <img 
                    src={item.coverImage} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-800">
                    <span className="font-black uppercase tracking-widest text-2xl opacity-50">Футбол</span>
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#ccff00]" />
                    {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString("uk-UA") : ""}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    {item.viewsCount}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5" />
                    {item._count.likes}
                  </div>
                </div>
                
                <h3 className="text-xl font-black text-white leading-tight mb-3 group-hover:text-[#ccff00] transition-colors">
                  {item.title}
                </h3>
                
                {item.excerpt && (
                  <p className="text-gray-400 text-sm line-clamp-3 mb-4 flex-grow">
                    {item.excerpt}
                  </p>
                )}
                
                <div className="mt-auto pt-4 border-t border-gray-900 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-gray-500">
                  <span>{item.author.name}</span>
                  <span className="text-[#ccff00] group-hover:underline">Читати →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-12 flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <Link
              key={i}
              href={`/news?page=${i + 1}`}
              className={`w-10 h-10 flex items-center justify-center text-sm font-bold rounded-sm border transition-colors ${
                page === i + 1 
                  ? "bg-[#ccff00] text-black border-[#ccff00]" 
                  : "bg-[#0a0a0a] text-gray-400 border-gray-900 hover:border-gray-700 hover:text-white"
              }`}
            >
              {i + 1}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
