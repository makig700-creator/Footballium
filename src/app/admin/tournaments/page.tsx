import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default async function TournamentsPage() {
  const session = await auth()
  if (!session || (session.user as any).role !== "ADMIN") return null

  const tournaments = await prisma.tournament.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { teams: { where: { status: "APPROVED" } } },
      },
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-wider">Турніри</h1>
          <p className="text-gray-400 mt-1">Керування турнірами та заявками команд</p>
        </div>
        <Link href="/admin/tournaments/new">
          <Button className="bg-[#CCFF00] text-black hover:bg-[#b3e600] font-bold rounded-sm">
            <Plus className="w-4 h-4 mr-2" />
            Створити турнір
          </Button>
        </Link>
      </div>

      <div className="bg-[#0a0a0a] border border-gray-900 rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-[#111111] border-b border-gray-900">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-gray-500 font-bold uppercase text-xs tracking-wider">Назва</TableHead>
              <TableHead className="text-gray-500 font-bold uppercase text-xs tracking-wider">Тип Сітки</TableHead>
              <TableHead className="text-gray-500 font-bold uppercase text-xs tracking-wider">Статус</TableHead>
              <TableHead className="text-gray-500 font-bold uppercase text-xs tracking-wider">Команди</TableHead>
              <TableHead className="text-gray-500 font-bold uppercase text-xs tracking-wider">Дії</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tournaments.map((tournament) => (
              <TableRow key={tournament.id} className="border-b border-gray-900 hover:bg-[#111111]/50">
                <TableCell className="font-medium text-white">{tournament.name}</TableCell>
                <TableCell>
                  <span className="text-gray-400 text-sm">
                    {tournament.bracketType === 'ROUND_ROBIN' ? 'Круговий турнір' : 'На вибування'}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={tournament.status === "DRAFT" ? "outline" : "default"} className="bg-gray-800 text-white border-gray-700">
                    {tournament.status === 'DRAFT' ? 'Чернетка' : 
                     tournament.status === 'REGISTRATION' ? 'Реєстрація' : 
                     tournament.status === 'ONGOING' ? 'Триває' : 
                     tournament.status === 'FINISHED' ? 'Завершено' : 
                     tournament.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-400 text-sm">
                  {tournament._count.teams} / {tournament.maxTeams}
                </TableCell>
                <TableCell>
                  <Link href={`/admin/tournaments/${tournament.id}`}>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      Деталі
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {tournaments.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  Турнірів ще не створено
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
