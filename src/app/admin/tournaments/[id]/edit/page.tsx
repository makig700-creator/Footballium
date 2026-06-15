import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { EditTournamentForm } from "./edit-tournament-form"

export default async function EditTournamentPage(props: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || (session.user as any).role !== "ADMIN") return null

  const params = await props.params;

  const tournament = await prisma.tournament.findUnique({
    where: { id: params.id },
  })

  if (!tournament) return notFound()

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 text-zinc-400 text-sm">
        <Link href={`/admin/tournaments/${tournament.id}`} className="hover:text-white flex items-center gap-2 transition-colors duration-200">
          <ArrowLeft className="w-4 h-4" /> Назад до турніру
        </Link>
      </div>

      <div className="bg-[#0a0a0a] border border-gray-900 rounded-2xl p-8">
        <div className="mb-8 border-b border-gray-900 pb-6">
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Редагувати турнір</h1>
          <p className="text-zinc-500 mt-2 font-mono text-sm">{tournament.name}</p>
        </div>
        
        <EditTournamentForm tournament={tournament} />
      </div>
    </div>
  )
}
