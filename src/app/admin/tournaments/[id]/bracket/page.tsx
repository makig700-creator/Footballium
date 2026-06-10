import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function TournamentBracketPage(props: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || (session.user as any).role !== "ADMIN") return null

  const params = await props.params;

  const tournament = await prisma.tournament.findUnique({
    where: { id: params.id },
  })

  if (!tournament) return notFound()

  const matches = await prisma.match.findMany({
    where: { tournamentId: params.id },
    include: {
      homeTeam: true,
      awayTeam: true,
    },
    orderBy: [
      { round: 'asc' },
      { matchNumber: 'asc' }
    ]
  })

  // Group matches by round
  const roundsMap = matches.reduce((acc, match) => {
    const r = match.round || 1;
    if (!acc[r]) acc[r] = [];
    acc[r].push(match);
    return acc;
  }, {} as Record<number, typeof matches>);

  const rounds = Object.keys(roundsMap).map(Number).sort((a, b) => a - b);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 text-gray-400 text-sm">
        <Link href={`/admin/tournaments/${tournament.id}`} className="hover:text-white flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Назад до турніру
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-black text-white uppercase tracking-wider">Сітка матчів</h1>
        <p className="text-gray-400 mt-1">{tournament.name}</p>
      </div>

      {matches.length === 0 ? (
        <div className="bg-[#0a0a0a] border border-gray-900 rounded-lg p-10 text-center">
          <p className="text-gray-500">Матчі ще не згенеровані.</p>
        </div>
      ) : (
        <div className="flex gap-8 overflow-x-auto pb-8">
          {rounds.map(roundNumber => (
            <div key={roundNumber} className="flex flex-col gap-4 min-w-[250px]">
              <h3 className="text-[#CCFF00] font-bold text-sm tracking-widest uppercase mb-2">
                Раунд {roundNumber}
              </h3>
              {roundsMap[roundNumber].map(match => (
                <div key={match.id} className="bg-[#0a0a0a] border border-gray-900 rounded p-3 flex flex-col justify-center">
                  <div className="flex justify-between items-center border-b border-gray-900 pb-2 mb-2">
                    <span className="text-white text-sm font-medium truncate pr-2">
                      {match.homeTeamId ? match.homeTeam.name : "TBD"}
                    </span>
                    <span className="text-gray-500 text-sm font-bold">
                      {match.homeScore ?? "-"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white text-sm font-medium truncate pr-2">
                      {match.awayTeamId ? match.awayTeam?.name : "TBD"}
                    </span>
                    <span className="text-gray-500 text-sm font-bold">
                      {match.awayScore ?? "-"}
                    </span>
                  </div>
                  {match.status === "FINISHED" && (
                    <div className="mt-2 text-[10px] text-center text-gray-600 uppercase">
                      Завершено
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
