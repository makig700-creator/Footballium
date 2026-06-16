import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Calendar, ArrowRight } from "lucide-react"

export async function NewsWidget() {
  const news = await prisma.news.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: 3,
  })

  if (news.length === 0) return null;

  return (
    <section className="py-16 border-t border-gray-900 bg-[#050505]">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
            Останні <span className="text-[#ccff00]">Новини</span>
          </h2>
          <Link 
            href="/news"
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
          >
            Всі новини <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((item) => (
            <Link 
              key={item.id} 
              href={`/news/${item.slug}`}
              className="group flex gap-4 bg-[#0a0a0a] border border-gray-900 p-4 rounded-sm hover:border-gray-700 transition-colors"
            >
              <div className="w-24 h-24 shrink-0 rounded-sm overflow-hidden bg-[#111]">
                {item.coverImage ? (
                  <img 
                    src={item.coverImage} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-800">
                    <span className="font-black uppercase text-[10px]">News</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                  <Calendar className="w-3 h-3 text-[#ccff00]" />
                  {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString("uk-UA") : ""}
                </div>
                <h3 className="text-sm font-bold text-white leading-tight group-hover:text-[#ccff00] transition-colors line-clamp-2">
                  {item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
