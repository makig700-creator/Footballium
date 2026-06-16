import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Trophy, Shield, Filter } from 'lucide-react';
import { formatPosition } from '@/lib/utils';

export const revalidate = 60;

export default async function GlobalStatsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ tournamentId?: string }> 
}) {
  const { tournamentId } = await searchParams;

  // Fetch all tournaments for filter
  const tournamentsList = await prisma.tournament.findMany({
    orderBy: { createdAt: 'desc' }
  });

  // Filters
  const statsWhere = tournamentId ? { tournamentId } : {};
  const standingsWhere = tournamentId ? { tournamentId } : {};

  // Top Scorers
  const stats = await prisma.playerStats.findMany({
    where: { goals: { gt: 0 }, ...statsWhere },
    include: { player: { include: { team: true } }, Tournament: true }
  });

  const playerMap = new Map<string, any>();
  for (const stat of stats) {
    if (!playerMap.has(stat.playerId)) {
      playerMap.set(stat.playerId, {
        player: stat.player,
        goals: 0,
        matchesPlayed: 0
      });
    }
    const p = playerMap.get(stat.playerId);
    p.goals += stat.goals;
    p.matchesPlayed += stat.matchesPlayed;
  }

  const topScorers = Array.from(playerMap.values())
    .sort((a, b) => b.goals - a.goals || a.matchesPlayed - b.matchesPlayed)
    .slice(0, 10);

  // Top Teams
  const standings = await prisma.tournamentStanding.findMany({
    where: standingsWhere,
    include: { Team: true }
  });

  const teamMap = new Map<string, any>();
  for (const st of standings) {
    if (!teamMap.has(st.teamId)) {
      teamMap.set(st.teamId, {
        team: st.Team,
        played: 0,
        won: 0,
        points: 0
      });
    }
    const t = teamMap.get(st.teamId);
    t.played += st.played;
    t.won += st.won;
    t.points += st.points;
  }

  const topTeams = Array.from(teamMap.values())
    .filter(t => t.played > 0)
    .map(t => ({
      ...t,
      winRate: (t.won / t.played) * 100
    }))
    .sort((a, b) => b.winRate - a.winRate || b.points - a.points)
    .slice(0, 10);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">Загальна Статистика</h1>
          <p className="text-gray-400 mt-2 font-bold uppercase tracking-widest text-sm">Найкращі гравці та команди платформи</p>
        </div>

        {/* Filter Dropdown */}
        <div className="relative inline-block text-left">
          <form>
            <div className="flex items-center gap-2 bg-[#1c1a1a] border border-gray-800 rounded-sm px-4 py-2">
              <Filter className="w-4 h-4 text-[#CCFF00]" />
              <select 
                name="tournamentId" 
                className="bg-transparent text-white font-bold uppercase tracking-widest text-xs focus:outline-none appearance-none cursor-pointer"
                defaultValue={tournamentId || ""}
                onChange={(e) => e.target.form?.submit()}
              >
                <option value="" className="bg-[#1c1a1a]">Всі турніри</option>
                {tournamentsList.map(t => (
                  <option key={t.id} value={t.id} className="bg-[#1c1a1a]">{t.name}</option>
                ))}
              </select>
            </div>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Top Scorers */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#CCFF00] rounded-sm">
              <Trophy className="w-6 h-6 text-black" />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-widest">Топ Бомбардири</h2>
          </div>
          
          <div className="bg-[#1c1a1a] border border-gray-800 rounded-sm overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] uppercase bg-[#0a0a0a] text-gray-400 font-black tracking-wider">
                <tr>
                  <th className="px-6 py-4 w-16 text-center">#</th>
                  <th className="px-6 py-4">Гравець</th>
                  <th className="px-6 py-4 text-center">Матчі</th>
                  <th className="px-6 py-4 text-center text-[#CCFF00] font-bold">Голи</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {topScorers.length > 0 ? topScorers.map((scorer, i) => (
                  <tr key={scorer.player.id} className="hover:bg-[#1a1a1a] transition-colors group">
                    <td className="px-6 py-4 text-center font-bold text-gray-500">{i + 1}</td>
                    <td className="px-6 py-4">
                      <Link href={`/players/${scorer.player.id}`} className="block">
                        <div className="font-bold text-white uppercase tracking-wider group-hover:text-[#CCFF00] transition-colors truncate">
                          {scorer.player.firstName} {scorer.player.lastName}
                        </div>
                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                          {scorer.player.team?.shortName || 'Без команди'}
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-400 font-bold">{scorer.matchesPlayed}</td>
                    <td className="px-6 py-4 text-center text-xl font-black text-white">{scorer.goals}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500 font-bold uppercase tracking-widest text-xs">
                      Немає даних
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Teams */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#CCFF00] rounded-sm">
              <Shield className="w-6 h-6 text-black" />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-widest">Найкращі Команди</h2>
          </div>
          
          <div className="bg-[#1c1a1a] border border-gray-800 rounded-sm overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] uppercase bg-[#0a0a0a] text-gray-400 font-black tracking-wider">
                <tr>
                  <th className="px-6 py-4 w-16 text-center">#</th>
                  <th className="px-6 py-4">Команда</th>
                  <th className="px-6 py-4 text-center">Матчі</th>
                  <th className="px-6 py-4 text-center text-[#CCFF00] font-bold">Win Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {topTeams.length > 0 ? topTeams.map((teamStats, i) => (
                  <tr key={teamStats.team.id} className="hover:bg-[#1a1a1a] transition-colors group">
                    <td className="px-6 py-4 text-center font-bold text-gray-500">{i + 1}</td>
                    <td className="px-6 py-4">
                      <Link href={`/teams/${teamStats.team.id}`} className="block">
                        <div className="font-bold text-white uppercase tracking-wider group-hover:text-[#CCFF00] transition-colors truncate">
                          {teamStats.team.name}
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-400 font-bold">{teamStats.played}</td>
                    <td className="px-6 py-4 text-center font-black">
                      <div className="inline-flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#CCFF00]" 
                            style={{ width: `${teamStats.winRate}%` }}
                          />
                        </div>
                        <span className="text-white min-w-[3ch]">{Math.round(teamStats.winRate)}%</span>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500 font-bold uppercase tracking-widest text-xs">
                      Немає даних
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
