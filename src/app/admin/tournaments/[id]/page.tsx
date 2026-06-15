import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Settings, Play, ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import { uk } from "date-fns/locale"

const statusMap: Record<string, string> = {
  DRAFT: "Чорнетка",
  REGISTRATION: "Реєстрація",
  ONGOING: "В процесі",
  FINISHED: "Завершено",
}

export default async function TournamentDetailsPage(props: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || (session.user as any).role !== "ADMIN") return null

  const params = await props.params;

  const tournament = await prisma.tournament.findUnique({
    where: { id: params.id },
    include: {
      _count: {
        select: { teams: { where: { status: "APPROVED" } }, matches: true },
      },
    },
  })

  if (!tournament) return notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 text-gray-400 text-sm">
        <Link href="/admin/tournaments" className="hover:text-white flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Назад до списку
        </Link>
      </div>

      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-white uppercase tracking-wider">{tournament.name}</h1>
            <Badge variant="outline" className="bg-gray-800 text-white border-gray-700">
              {statusMap[tournament.status] || tournament.status}
            </Badge>
          </div>
          {tournament.description && (
            <p className="text-gray-400 mt-2">{tournament.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/tournaments/${tournament.id}/edit`}>
            <Button variant="outline" className="bg-[#111111] text-white border-gray-800 hover:bg-gray-900 rounded-sm">
              <Settings className="w-4 h-4 mr-2" />
              Налаштування
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0a0a0a] border border-gray-900 rounded-lg p-6 flex flex-col items-center justify-center text-center">
          <Users className="w-8 h-8 text-[#CCFF00] mb-2" />
          <h3 className="text-gray-400 font-bold uppercase text-xs tracking-wider mb-1">Зареєстровано команд</h3>
          <p className="text-3xl font-black text-white">{tournament._count.teams} <span className="text-gray-600 text-xl">/ {tournament.maxTeams}</span></p>
          <Link href={`/admin/tournaments/${tournament.id}/applications`} className="mt-4 w-full">
            <Button variant="secondary" className="w-full bg-[#1a1a1a] text-white hover:bg-gray-800">
              Керувати заявками
            </Button>
          </Link>
        </div>

        <div className="bg-[#0a0a0a] border border-gray-900 rounded-lg p-6 flex flex-col items-center justify-center text-center">
          <Play className="w-8 h-8 text-[#CCFF00] mb-2" />
          <h3 className="text-gray-400 font-bold uppercase text-xs tracking-wider mb-1">Матчів</h3>
          <p className="text-3xl font-black text-white">{tournament._count.matches}</p>
          <Link href={`/admin/tournaments/${tournament.id}/bracket`} className="mt-4 w-full">
            <Button variant="secondary" className="w-full bg-[#1a1a1a] text-white hover:bg-gray-800">
              Переглянути сітку
            </Button>
          </Link>
        </div>

        <div className="bg-[#0a0a0a] border border-gray-900 rounded-lg p-6">
          <Calendar className="w-8 h-8 text-[#CCFF00] mb-4" />
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-gray-800 pb-2">
              <span className="text-gray-500">Кінець реєстрації:</span>
              <span className="text-white font-medium">{format(tournament.registrationDeadline, "PPP", { locale: uk })}</span>
            </div>
            <div className="flex justify-between border-b border-gray-800 pb-2">
              <span className="text-gray-500">Початок:</span>
              <span className="text-white font-medium">{format(tournament.startDate, "PPP", { locale: uk })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Завершення:</span>
              <span className="text-white font-medium">{format(tournament.endDate, "PPP", { locale: uk })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
