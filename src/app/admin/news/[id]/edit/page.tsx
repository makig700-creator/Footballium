import { prisma } from "@/lib/prisma"
import { NewsForm } from "@/components/admin/news/NewsForm"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export const revalidate = 0

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const news = await prisma.news.findUnique({
    where: { id }
  })

  if (!news) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/news"
          className="p-2 bg-[#0a0a0a] text-gray-400 hover:text-white rounded-sm border border-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Редагувати новину</h1>
      </div>

      <NewsForm initialData={news} />
    </div>
  )
}
