"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { pusherClient } from "@/lib/pusher";
import { cn } from "@/lib/utils";

interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string | null;
}

interface Standing {
  id: string;
  teamId: string;
  position: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  team: Team;
}

interface StandingsTableProps {
  tournamentId: string;
  highlightTeamId?: string;
  showMedals?: boolean;
  compact?: boolean;
}

export function StandingsTable({ tournamentId, highlightTeamId, showMedals = true, compact = false }: StandingsTableProps) {
  const [standings, setStandings] = useState<Standing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    fetch(`/api/stats/tournaments/${tournamentId}/standings`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setStandings(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch standings:", err);
        setLoading(false);
      });

    // Pusher subscription
    const channelName = `tournament-${tournamentId}`;
    const channel = pusherClient.subscribe(channelName);
    
    channel.bind("standings-updated", (data: { standings: Standing[] }) => {
      setStandings(data.standings);
    });

    return () => {
      pusherClient.unsubscribe(channelName);
    };
  }, [tournamentId]);

  if (loading) {
    return <div className="animate-pulse flex flex-col space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-12 bg-[#1c1a1a] border border-gray-800 rounded-sm"></div>
      ))}
    </div>;
  }

  if (standings.length === 0) {
    return <div className="text-center py-8 text-gray-500">Таблиця порожня. Матчі ще не зіграні.</div>;
  }

  const displayStandings = compact ? standings.slice(0, 5) : standings;

  const getMedal = (index: number) => {
    if (!showMedals) return null;
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return null;
  };

  return (
    <div className="overflow-x-auto border border-gray-800 rounded-sm bg-[#0a0a0a]">
      <table className="w-full text-sm text-left">
        <thead className="text-[10px] uppercase bg-[#1c1a1a] text-gray-400 font-black tracking-wider">
          <tr>
            <th className="px-4 py-3 text-center w-12">#</th>
            <th className="px-4 py-3">Команда</th>
            <th className="px-4 py-3 text-center">І</th>
            <th className="px-4 py-3 text-center">В</th>
            <th className="px-4 py-3 text-center">Н</th>
            <th className="px-4 py-3 text-center">П</th>
            <th className="px-4 py-3 text-center">РГ</th>
            <th className="px-4 py-3 text-center font-bold text-[#CCFF00]">О</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {displayStandings.map((standing, index) => {
            const isHighlighted = highlightTeamId === standing.teamId;
            const medal = getMedal(index);
            
            return (
              <tr 
                key={standing.id} 
                className={cn(
                  "hover:bg-[#1a1a1a] transition-colors group",
                  isHighlighted ? "bg-[#1c2e1c]" : "bg-transparent"
                )}
              >
                <td className="px-4 py-3 text-center font-bold text-gray-500">
                  {medal ? <span className="text-lg">{medal}</span> : standing.position}
                </td>
                <td className="px-4 py-3 font-bold">
                  <div className="flex items-center gap-3">
                    {standing.team.logo ? (
                      <div className="w-6 h-6 relative shrink-0">
                        <Image src={standing.team.logo} alt={standing.team.name} fill className="object-contain" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 bg-gray-800 rounded-full shrink-0" />
                    )}
                    <Link href={`/teams/${standing.teamId}`} className={cn(
                      "uppercase tracking-wider transition-colors",
                      isHighlighted ? "text-[#CCFF00]" : "text-white group-hover:text-[#CCFF00]"
                    )}>
                      {standing.team.shortName}
                    </Link>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-gray-400">{standing.played}</td>
                <td className="px-4 py-3 text-center text-gray-400">{standing.won}</td>
                <td className="px-4 py-3 text-center text-gray-400">{standing.drawn}</td>
                <td className="px-4 py-3 text-center text-gray-400">{standing.lost}</td>
                <td className="px-4 py-3 text-center text-gray-400">
                  {standing.goalDiff > 0 ? `+${standing.goalDiff}` : standing.goalDiff}
                </td>
                <td className="px-4 py-3 text-center font-black text-white text-base">
                  {standing.points}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
