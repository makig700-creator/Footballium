"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function AdminRefereesPage() {
  const [referees, setReferees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings/admin/referees")
      .then(res => res.json())
      .then(data => {
        setReferees(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-black uppercase tracking-widest mb-6 border-b border-white/10 pb-4">
        Судді Платформи
      </h1>

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#CCFF00]" /></div>
      ) : (
        <div className="grid gap-4">
          {referees.map(referee => (
            <div key={referee.id} className="bg-zinc-900 border border-white/10 rounded-lg p-4 flex flex-col md:flex-row gap-4">
              <div className="flex items-center gap-4 min-w-[250px]">
                <img src={referee.photo || `https://ui-avatars.com/api/?name=${referee.name}`} alt="" className="w-12 h-12 rounded-full" />
                <div>
                  <h3 className="font-bold text-white">{referee.name}</h3>
                  <p className="text-zinc-400 text-xs">{referee.email}</p>
                  <p className="text-zinc-400 text-xs mt-1">Категорія: <span className="text-[#CCFF00] font-bold">{referee.refereeCategory || "Не вказана"}</span></p>
                </div>
              </div>

              <div className="flex-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Призначені матчі ({referee.matchesRefereed?.length || 0})</h4>
                <div className="space-y-2 max-h-[120px] overflow-y-auto pr-2">
                  {referee.matchesRefereed?.map((match: any) => (
                    <div key={match.id} className="flex items-center justify-between bg-zinc-950 p-2 rounded text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{match.homeTeam.name}</span>
                        <span className="text-zinc-500 text-xs">vs</span>
                        <span className="font-medium text-white">{match.awayTeam?.name || "TBD"}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-zinc-400 text-xs">{match.scheduledAt ? new Date(match.scheduledAt).toLocaleDateString() : "TBD"}</span>
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${match.status === 'FINISHED' ? 'bg-zinc-800 text-zinc-400' : 'bg-[#CCFF00]/10 text-[#CCFF00]'}`}>
                          {match.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {(!referee.matchesRefereed || referee.matchesRefereed.length === 0) && (
                    <div className="text-zinc-500 text-sm">Немає призначених матчів</div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {referees.length === 0 && (
            <div className="text-center text-zinc-500 py-8">Суддів не знайдено</div>
          )}
        </div>
      )}
    </div>
  );
}
