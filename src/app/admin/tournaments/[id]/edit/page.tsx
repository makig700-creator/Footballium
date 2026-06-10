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
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4 text-gray-400 text-sm">
        <Link href={`/admin/tournaments/${tournament.id}`} className="hover:text-white flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Назад до турніру
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-black text-white uppercase tracking-wider">Редагувати турнір</h1>
        <p className="text-gray-400 mt-1">{tournament.name}</p>
      </div>

      <div className="bg-[#0a0a0a] border border-gray-900 rounded-lg p-6">
        <EditTournamentForm tournament={tournament} />
      </div>
    </div>
  )
}
