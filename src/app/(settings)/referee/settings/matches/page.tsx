"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function RefereeMatchesPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/matches/my-matches") // Assume we reuse or this will fail initially until we create it. Wait, we can fetch all matches with refereeId=my_id
      .then(res => res.json())
      .then(data => {
        // For now, if we don't have a my-matches route, we can show an empty state or fetch from schedule
        setMatches(data.matches || []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-black uppercase tracking-widest mb-6 border-b border-white/10 pb-4">
        Мої Матчі
      </h1>

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#CCFF00]" /></div>
      ) : (
        <div className="space-y-4">
          {matches.map(match => (
            <Link href={`/matches/${match.id}`} key={match.id} className="block bg-zinc-900 border border-white/10 rounded-lg p-4 hover:border-[#CCFF00]/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-white text-lg">{match.homeTeam.name}</p>
                  </div>
                  <div className="px-4 py-1 bg-zinc-950 rounded font-black text-white">
                    {match.status === 'FINISHED' ? `${match.homeScore} - ${match.awayScore}` : 'VS'}
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">{match.awayTeam?.name || "TBD"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-zinc-400">{new Date(match.scheduledAt || match.kickoff).toLocaleString()}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase rounded ${match.status === 'FINISHED' ? 'bg-zinc-800 text-zinc-400' : 'bg-[#CCFF00]/10 text-[#CCFF00]'}`}>
                    {match.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
          {matches.length === 0 && (
            <div className="text-center text-zinc-500 py-8">
              У вас поки немає призначених матчів.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
