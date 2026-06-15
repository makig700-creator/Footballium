import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { Calendar, Users, Trophy, Shield, MapPin, Activity } from "lucide-react"
import { LeagueTable } from "@/components/standings/LeagueTable"
import { TournamentApplicationBlock } from "@/components/tournaments/tournament-application-block"
import { getApplicationStatus } from "@/lib/tournament-utils"

export const revalidate = 60 // Revalidate every minute

export default async function TournamentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  const user = session?.user as any
  const isCoach = user?.role === 'COACH'
  const userId = user?.id

  const tournament = await prisma.tournament.findUnique({
    where: { id },
    include: {
      teams: {
        where: { status: 'APPROVED' },
        include: {
          team: {
            include: {
              _count: { select: { players: true } },
              coach: true
            }
          }
        }
      },
      matches: {
        orderBy: { kickoff: 'asc' },
        include: {
          homeTeam: true,
          awayTeam: true
        }
      }
    }
  })

  if (!tournament) {
    notFound()
  }

  // Fetch application status for coach
  const appStatusObj = isCoach && userId ? await getApplicationStatus(tournament.id, userId) : { status: null, hasTeam: false, appId: null, teamId: null }

  // We can fetch coach team name if they have one to display in the block
  let coachTeamName = undefined
  if (appStatusObj.teamId) {
    const t = await prisma.team.findUnique({ where: { id: appStatusObj.teamId } })
    if (t) coachTeamName = t.name
  }

  // Fetch standings
  const rawStandings = await (prisma as any).tournamentStanding.findMany({
    where: { tournamentId: tournament.id },
    include: { Team: true }
  })

  const standings = rawStandings.map((s: any) => ({
    id: s.id,
    team: s.Team,
    played: s.played,
    won: s.won,
    drawn: s.drawn,
    lost: s.lost,
    gf: s.goalsFor,
    ga: s.goalsAgainst,
    points: s.points,
    form: ''
  }))

  const approvedTeamsCount = tournament.teams.length
  const fillPercentage = Math.min(100, Math.round((approvedTeamsCount / tournament.maxTeams) * 100))

  return (
    <div className="min-h-screen bg-[#000000] text-gray-200">
      {/* Hero Section */}
      <div className="relative w-full py-20 border-b border-gray-900 bg-[#0a0a0a] overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-[#ccff00]/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#000000] to-transparent pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-32 h-32 md:w-48 md:h-48 rounded-md bg-[#111111] border border-gray-800 flex items-center justify-center shrink-0 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            {tournament.logo ? (
              <Image src={tournament.logo} alt={tournament.name} fill className="object-contain p-4" />
            ) : (
              <Trophy className="w-16 h-16 md:w-24 md:h-24 text-gray-800 drop-shadow-md" />
            )}
          </div>

          <div className="flex-1 text-center md:text-left space-y-5">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="inline-flex items-center justify-center px-3 py-1 bg-[#1a1a1a] border border-gray-800 text-[10px] font-black uppercase tracking-widest text-[#ccff00] rounded-sm">
                {tournament.status}
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-[0.9]">
              {tournament.name}
            </h1>
            <p className="text-gray-400 font-medium max-w-2xl text-sm md:text-base leading-relaxed border-l-2 border-gray-800 pl-4">
              {tournament.description || 'Детальна інформація про турнір відсутня.'}
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-8 pt-6 text-[11px] font-black tracking-widest text-gray-500 uppercase">
              <div className="flex items-center gap-2 bg-[#111111] border border-gray-800 px-4 py-2 rounded-sm">
                <Calendar className="w-4 h-4 text-[#ccff00]" />
                {new Date(tournament.startDate).toLocaleDateString('uk-UA')} - {new Date(tournament.endDate).toLocaleDateString('uk-UA')}
              </div>
              <div className="flex items-center gap-2 bg-[#111111] border border-gray-800 px-4 py-2 rounded-sm">
                <Shield className="w-4 h-4 text-[#ccff00]" />
                {tournament.bracketType === 'ROUND_ROBIN' ? 'Круговий турнір' : 'На вибування'}
              </div>
              <div className="flex items-center gap-2 bg-[#111111] border border-gray-800 px-4 py-2 rounded-sm">
                <MapPin className="w-4 h-4 text-[#ccff00]" />
                Житомир
              </div>
            </div>

            {/* Progress Bar for Registration */}
            {(tournament.status === 'REGISTRATION' || tournament.status === 'DRAFT') && (
              <div className="mt-8 max-w-md bg-[#111111] border border-gray-800 p-4 rounded-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Заповненість:</span>
                  <span className="text-xs text-[#ccff00] font-black">{approvedTeamsCount} / {tournament.maxTeams} КОМАНД</span>
                </div>
                <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                  <div className="h-full bg-[#ccff00] transition-all duration-1000" style={{ width: `${fillPercentage}%` }}></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <div className="flex flex-col lg:flex-row gap-12">

          {/* Main Content Column */}
          <div className="flex-1 space-y-16">

            {/* Participating Teams */}
            <section className="space-y-6">
              <div className="flex items-center gap-4 border-b border-gray-900 pb-4">
                <Users className="w-6 h-6 text-[#ccff00]" />
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Команди-учасники</h2>
                <span className="bg-[#111111] text-gray-400 px-2 py-1 rounded-sm text-xs font-black">{approvedTeamsCount}</span>
              </div>

              {approvedTeamsCount === 0 ? (
                <div className="bg-[#111111] border border-gray-800 border-dashed rounded-sm p-12 text-center">
                  <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Жодної команди ще не затверджено</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {tournament.teams.map(({ team }) => (
                    <Link href={`/teams/${team.id}`} key={team.id} className="bg-[#111111] border border-gray-800 rounded-sm p-4 flex items-center gap-4 group hover:border-[#ccff00] transition-colors">
                      <div className="w-12 h-12 bg-[#0a0a0a] rounded-sm flex items-center justify-center p-1 border border-gray-800 group-hover:border-[#ccff00]/50">
                        {team.logo ? (
                          <Image src={team.logo} alt={team.name} width={40} height={40} className="object-contain" />
                        ) : (
                          <Shield className="w-6 h-6 text-gray-700" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white uppercase tracking-wider truncate">{team.name}</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest truncate">Тренер: {team.coach?.name || 'Н/Д'}</p>
                      </div>
                      <div className="bg-[#0a0a0a] px-3 py-1 rounded-sm border border-gray-800">
                        <span className="text-xs font-black text-[#ccff00]">{team._count.players}</span>
                        <span className="text-[10px] text-gray-500 ml-1">ГР</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {/* Standings */}
            {standings.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center gap-4 border-b border-gray-900 pb-4">
                  <Trophy className="w-6 h-6 text-[#ccff00]" />
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Турнірна таблиця</h2>
                </div>
                <LeagueTable standings={standings} />
              </section>
            )}

            {/* Match Schedule */}
            {['ONGOING', 'FINISHED'].includes(tournament.status) && tournament.matches.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center gap-4 border-b border-gray-900 pb-4">
                  <Activity className="w-6 h-6 text-[#ccff00]" />
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                    {tournament.status === 'FINISHED' ? 'Результати' : 'Розклад та Результати'}
                  </h2>
                </div>

                <div className="space-y-8">
                  {Object.entries(
                    tournament.matches.reduce((acc, match) => {
                      const r = match.round || 0;
                      if (!acc[r]) acc[r] = [];
                      acc[r].push(match);
                      return acc;
                    }, {} as Record<number, typeof tournament.matches>)
                  )
                  .sort(([a], [b]) => Number(b) - Number(a))
                  .map(([round, matches]) => (
                    <div key={`round-${round}`} className="space-y-4">
                      <h3 className="text-[#CCFF00] font-bold text-sm uppercase tracking-widest pb-2 border-b border-gray-800">
                        {round === '0' ? 'Матчі' : `Тур ${round}`}
                      </h3>
                      <div className="bg-[#111111] border border-gray-800 rounded-sm divide-y divide-gray-900">
                        {matches.map(match => (
                          <Link href={`/matches/${match.id}`} key={match.id} className="block p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-900/50 transition-colors">
                            <div className="flex items-center gap-4 w-full sm:w-1/3">
                              <div className="text-right w-full">
                                <p className="font-bold text-white text-sm uppercase tracking-wider truncate">{match.homeTeam.name}</p>
                              </div>
                              <div className="w-8 h-8 shrink-0 bg-[#0a0a0a] rounded-sm flex items-center justify-center p-1 border border-gray-800">
                                {match.homeTeam.logo ? <Image src={match.homeTeam.logo} alt={match.homeTeam.name} width={24} height={24} className="object-contain" /> : <Shield className="w-4 h-4 text-gray-700" />}
                              </div>
                            </div>

                            <div className="flex flex-col items-center justify-center shrink-0 w-24">
                              {match.status === 'FINISHED' || match.status === 'LIVE' ? (
                                <div className="bg-[#ccff00] text-black px-4 py-1.5 rounded-sm font-black text-lg">
                                  {match.homeScore} : {match.awayScore}
                                </div>
                              ) : (
                                <div className="bg-gray-800 text-gray-400 px-3 py-1.5 rounded-sm font-bold text-xs uppercase tracking-widest">
                                  {new Date(match.kickoff).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              )}
                              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2">{new Date(match.kickoff).toLocaleDateString('uk-UA')}</span>
                            </div>

                            <div className="flex items-center gap-4 w-full sm:w-1/3">
                              <div className="w-8 h-8 shrink-0 bg-[#0a0a0a] rounded-sm flex items-center justify-center p-1 border border-gray-800">
                                {match.awayTeam?.logo ? <Image src={match.awayTeam.logo} alt={match.awayTeam?.name} width={24} height={24} className="object-contain" /> : <Shield className="w-4 h-4 text-gray-700" />}
                              </div>
                              <div className="text-left w-full">
                                <p className="font-bold text-white text-sm uppercase tracking-wider truncate">{match.awayTeam?.name || 'TBD'}</p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-80 shrink-0 space-y-6">
            {(isCoach || tournament.status === 'REGISTRATION') && (
              <TournamentApplicationBlock
                tournamentId={tournament.id}
                tournamentStatus={tournament.status}
                applicationStatus={appStatusObj.status}
                appId={appStatusObj.appId}
                hasTeam={appStatusObj.hasTeam}
                isCoach={isCoach}
                teamName={coachTeamName}
              />
            )}

            <div className="bg-[#111111] border border-gray-800 rounded-sm p-6">
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Деталі</h3>
              <div className="space-y-4 text-sm font-medium text-gray-300">
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-500">Реєстрація до:</span>
                  <span>{new Date(tournament.registrationDeadline).toLocaleDateString('uk-UA')}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-500">Формат:</span>
                  <span>{tournament.format}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-500">Організатор:</span>
                  <span>Footballium</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
