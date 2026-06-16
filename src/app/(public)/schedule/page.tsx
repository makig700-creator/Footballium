"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { uk } from "date-fns/locale";

export default function SchedulePage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  
  const [filters, setFilters] = useState({
    datePreset: "all",
    tournamentId: "all",
    teamId: "all"
  });

  useEffect(() => {
    // Fetch filter options
    Promise.all([
      fetch("/api/tournaments?limit=100").then(res => res.json()),
      fetch("/api/teams?limit=100").then(res => res.json())
    ]).then(([tournamentsData, teamsData]) => {
      setTournaments(tournamentsData.tournaments || []);
      setTeams(teamsData.teams || []);
    });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    let url = "/api/schedule?";
    
    if (filters.tournamentId !== "all") url += `tournamentId=${filters.tournamentId}&`;
    if (filters.teamId !== "all") url += `teamId=${filters.teamId}&`;
    
    if (filters.datePreset === "today") {
      url += `date=${new Date().toISOString()}&`;
    } else if (filters.datePreset === "week") {
      // not full implemented in api yet, but we'll leave it simple
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setMatches(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [filters]);

  // Group matches by date
  const groupedMatches = matches.reduce((acc: any, match: any) => {
    if (!match.scheduledAt) return acc;
    const dateStr = format(new Date(match.scheduledAt), 'yyyy-MM-dd');
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(match);
    return acc;
  }, {});

  const dates = Object.keys(groupedMatches).sort();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-zinc-950 border border-white/10 rounded-xl p-6 shadow-2xl mb-8">
        <h1 className="text-3xl font-black uppercase tracking-widest text-white mb-6">Розклад матчів</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
          <Select value={filters.datePreset} onValueChange={(v) => setFilters({...filters, datePreset: v})}>
            <SelectTrigger className="bg-zinc-900 border-white/10 text-white focus:ring-[#CCFF00]">
              <SelectValue placeholder="Час" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-white/10 text-white">
              <SelectItem value="all">Всі дати</SelectItem>
              <SelectItem value="today">Сьогодні</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.tournamentId} onValueChange={(v) => setFilters({...filters, tournamentId: v})}>
            <SelectTrigger className="bg-zinc-900 border-white/10 text-white focus:ring-[#CCFF00]">
              <SelectValue placeholder="Турнір" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-white/10 text-white">
              <SelectItem value="all">Всі турніри</SelectItem>
              {tournaments.map(t => (
                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.teamId} onValueChange={(v) => setFilters({...filters, teamId: v})}>
            <SelectTrigger className="bg-zinc-900 border-white/10 text-white focus:ring-[#CCFF00]">
              <SelectValue placeholder="Команда" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-white/10 text-white">
              <SelectItem value="all">Всі команди</SelectItem>
              {teams.map(t => (
                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#CCFF00]" /></div>
      ) : (
        <div className="space-y-8">
          {dates.map((dateStr) => {
            const dateMatches = groupedMatches[dateStr];
            return (
              <div key={dateStr} className="space-y-4">
                <h2 className="text-sm font-black text-zinc-400 uppercase tracking-widest bg-zinc-900/50 inline-block px-4 py-1.5 rounded-full">
                  {format(new Date(dateStr), 'EEEE, d MMMM', { locale: uk })}
                </h2>
                <div className="space-y-2">
                  {dateMatches.map((match: any) => (
                    <Link href={`/matches/${match.id}`} key={match.id} className="block group">
                      <div className="bg-zinc-950 border border-white/5 group-hover:border-[#CCFF00]/50 rounded-lg p-4 transition-colors flex items-center justify-between">
                        <div className="flex items-center gap-6 w-full max-w-lg mx-auto justify-between">
                          <div className="text-right flex-1">
                            <p className="font-bold text-white md:text-lg">{match.homeTeam.name}</p>
                          </div>
                          <div className="flex flex-col items-center shrink-0 w-24">
                            <span className="text-zinc-500 text-xs mb-1 font-bold">
                              {format(new Date(match.scheduledAt), 'HH:mm')}
                            </span>
                            <div className="px-3 py-1 bg-zinc-900 rounded font-black text-white text-lg">
                              {match.status === 'FINISHED' ? `${match.homeScore} : ${match.awayScore}` : 'VS'}
                            </div>
                            <span className={`mt-1 px-2 py-0.5 text-[9px] font-black uppercase rounded ${match.status === 'FINISHED' ? 'bg-zinc-800 text-zinc-400' : match.status === 'LIVE' ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-[#CCFF00]/10 text-[#CCFF00]'}`}>
                              {match.status === 'FINISHED' ? '✅ Завершено' : match.status === 'LIVE' ? '🔴 LIVE' : '⏳ Заплановано'}
                            </span>
                          </div>
                          <div className="text-left flex-1">
                            <p className="font-bold text-white md:text-lg">{match.awayTeam?.name || "TBD"}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
          {dates.length === 0 && (
            <div className="text-center py-20 text-zinc-500 border border-white/5 border-dashed rounded-xl">
              Матчів не знайдено
            </div>
          )}
        </div>
      )}
    </div>
  );
}
