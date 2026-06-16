import { prisma } from "@/lib/prisma"
import { Newspaper, Plus, FileEdit } from "lucide-react"
import Link from "next/link"

export const revalidate = 0

export default async function AdminNewsPage() {
  const news = await prisma.news.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { name: true } },
      _count: { select: { likes: true } }
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Новини</h1>
        <Link 
          href="/admin/news/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#ccff00] text-black font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-[#b3e600] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Додати новину
        </Link>
      </div>

      <div className="bg-[#0a0a0a] border border-gray-900 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400 whitespace-nowrap">
            <thead className="bg-[#111] text-xs uppercase font-bold tracking-widest text-gray-500 border-b border-gray-900">
              <tr>
                <th className="px-6 py-4">Заголовок</th>
                <th className="px-6 py-4">Статус</th>
                <th className="px-6 py-4">Перегляди / Лайки</th>
                <th className="px-6 py-4">Дата</th>
                <th className="px-6 py-4 text-right">Дії</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900/50">
              {news.map((item) => (
                <tr key={item.id} className="hover:bg-[#1a1a1a] transition-colors">
                  <td className="px-6 py-4 font-bold text-white max-w-xs truncate">
                    {item.title}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest border ${
                      item.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                      'bg-gray-800 text-gray-400 border-gray-700'
                    }`}>
                      {item.status === 'PUBLISHED' ? 'Опубліковано' : 'Чернетка'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold tracking-widest">
                    👁 {item.viewsCount} &nbsp;|&nbsp; ❤️ {item._count.likes}
                  </td>
                  <td className="px-6 py-4 text-xs">
                    {item.publishedAt 
                      ? new Date(item.publishedAt).toLocaleDateString('uk-UA') 
                      : new Date(item.createdAt).toLocaleDateString('uk-UA')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={`/admin/news/${item.id}/edit`}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-sm bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                    >
                      <FileEdit className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {news.length === 0 && (
          <div className="text-center py-12">
            <Newspaper className="w-12 h-12 text-gray-800 mx-auto mb-3" />
            <p className="text-gray-500 font-bold uppercase tracking-widest">Новин не знайдено</p>
          </div>
        )}
      </div>
    </div>
  )
}
