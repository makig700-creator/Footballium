import { NewsForm } from "@/components/admin/news/NewsForm"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewNewsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/news"
          className="p-2 bg-[#0a0a0a] text-gray-400 hover:text-white rounded-sm border border-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Створити новину</h1>
      </div>

      <NewsForm />
    </div>
  )
}
