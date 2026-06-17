import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ApplicationsTable } from "./applications-table"
import { GenerateBracketButton } from "./generate-bracket-button"

export default async function TournamentApplicationsPage(props: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || (session.user as any).role !== "ADMIN") return null

  const params = await props.params;

  const tournament = await prisma.tournament.findUnique({
    where: { id: params.id },
  })

  if (!tournament) return notFound()

  const applications = await prisma.tournamentTeam.findMany({
    where: { tournamentId: params.id },
    include: { team: true },
    orderBy: { appliedAt: "desc" },
  })

  const approvedCount = applications.filter((a) => a.status === "APPROVED").length

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 text-gray-400 text-sm">
        <Link href={`/admin/tournaments/${tournament.id}`} className="hover:text-white flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Назад до турніру
        </Link>
      </div>

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-wider">Заявки</h1>
          <p className="text-gray-400 mt-1">{tournament.name}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 mb-2">
            Схвалено: <span className="text-white font-bold">{approvedCount} / {tournament.maxTeams}</span>
          </p>
          <GenerateBracketButton 
            tournamentId={tournament.id} 
            status={tournament.status as any} 
            approvedCount={approvedCount} 
            minTeams={tournament.minTeams} 
            bracketType={tournament.bracketType}
          />
        </div>
      </div>

      <ApplicationsTable applications={applications} tournamentId={tournament.id} />
    </div>
  )
}
