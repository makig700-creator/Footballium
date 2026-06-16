"use client";

import { MoreVertical } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher-client";

export default function LiveMatchesWidget({ initialMatches }: { initialMatches: any[] }) {
  const [matches, setMatches] = useState(initialMatches);

  useEffect(() => {
    // We bind to each individual live match to get minute and score updates
    matches.forEach(match => {
      const channel = pusherClient.subscribe(`match-${match.id}`);
      channel.bind("score-update", (data: any) => {
        setMatches(prev => prev.map(m => {
          if (m.id === match.id) {
            return {
              ...m,
              homeScore: data.homeScore ?? m.homeScore,
              awayScore: data.awayScore ?? m.awayScore,
              minute: data.minute ?? m.minute,
            };
          }
          return m;
        }));
      });
    });

    return () => {
      matches.forEach(match => {
        pusherClient.unsubscribe(`match-${match.id}`);
      });
    };
  }, [matches.length]); // Re-bind if matches array changes

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {matches.length > 0 ? matches.map((match) => (
        <div key={match.id} className="bg-[#111111] border border-gray-800 rounded-2xl p-5 relative group hover:border-[#ccff00]/50 transition-colors">
          <div className="absolute top-4 right-4">
            <MoreVertical className="w-4 h-4 text-gray-500 hover:text-white cursor-pointer" />
          </div>
          
          <div className="flex justify-center items-center mb-6">
            <div className="text-[10px] font-black text-[#ccff00] bg-[#ccff00]/10 px-2 py-1 rounded-sm uppercase tracking-widest animate-pulse">
              {match.minute}' Хв
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-8 px-2">
            <div className="text-center w-1/3">
              <div className="w-12 h-12 mx-auto bg-[#1a1a1a] rounded-full border border-gray-800 mb-2 flex items-center justify-center font-black text-xs text-gray-400">
                {match.homeTeam?.shortName?.slice(0,3) || 'TBD'}
              </div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">{match.homeTeam?.shortName || 'TBD'}</div>
            </div>
            
            <div className="w-1/3 text-center">
              <div className="text-3xl font-black text-white tracking-wider">{match.homeScore}:{match.awayScore}</div>
            </div>
            
            <div className="text-center w-1/3">
              <div className="w-12 h-12 mx-auto bg-[#1a1a1a] rounded-full border border-gray-800 mb-2 flex items-center justify-center font-black text-xs text-gray-400">
                {match.awayTeam?.shortName?.slice(0,3) || 'TBD'}
              </div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">{match.awayTeam?.shortName || 'TBD'}</div>
            </div>
          </div>

          <Link href={`/matches/${match.id}`} className="block w-full py-2.5 text-center bg-transparent border border-gray-700 hover:border-[#ccff00] hover:text-black hover:bg-[#ccff00] rounded-full text-xs font-black uppercase tracking-widest text-white transition-all">
            Слідкувати
          </Link>
        </div>
      )) : (
        <div className="col-span-3 bg-[#111111] border border-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[250px]">
          <div className="text-gray-500 mb-4 font-bold uppercase tracking-widest">Немає матчів наживо</div>
          <Link href="/admin/tournaments" className="px-5 py-2.5 rounded-full bg-transparent border border-[#ccff00] text-[#ccff00] hover:bg-[#ccff00] hover:text-black transition-colors text-sm font-black uppercase tracking-widest">
            Переглянути розклад
          </Link>
        </div>
      )}
    </div>
  );
}
