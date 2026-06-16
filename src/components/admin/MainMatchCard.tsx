"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { pusherClient } from "@/lib/pusher-client";

export default function MainMatchCard({ initialMatch }: { initialMatch: any }) {
  const [match, setMatch] = useState(initialMatch);

  useEffect(() => {
    if (!match?.id) return;

    const channel = pusherClient.subscribe(`match-${match.id}`);
    channel.bind("score-update", (data: any) => {
      setMatch((prev: any) => ({
        ...prev,
        homeScore: data.homeScore ?? prev.homeScore,
        awayScore: data.awayScore ?? prev.awayScore,
        minute: data.minute ?? prev.minute,
        status: data.status ?? prev.status,
      }));
    });

    return () => {
      pusherClient.unsubscribe(`match-${match.id}`);
    };
  }, [match?.id]);

  if (!match) {
    return (
      <div className="xl:col-span-2 relative rounded-3xl overflow-hidden border border-gray-800 aspect-video md:aspect-[21/9] xl:aspect-auto bg-[#111111] flex flex-col items-center justify-center min-h-[300px]">
        <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-2">Немає активних матчів</h2>
        <Link href="/admin/tournaments" className="px-5 py-2.5 rounded-full bg-transparent border border-[#ccff00] text-[#ccff00] hover:bg-[#ccff00] hover:text-black transition-colors text-sm font-black uppercase tracking-widest mt-4">
          Перейти до розкладу
        </Link>
      </div>
    );
  }

  const isActuallyLive = match.minute !== undefined && match.minute !== null && !match.scheduledAt;

  return (
    <div className="xl:col-span-2 relative rounded-3xl overflow-hidden border border-gray-800 aspect-video md:aspect-[21/9] xl:aspect-auto group min-h-[300px]">
      <Image 
        src="/hero-bg.png" 
        alt="Live Match Highlight" 
        fill 
        className="object-cover object-center opacity-80 group-hover:scale-105 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20"></div>
      
      {isActuallyLive ? (
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md border border-[#ccff00]/30 px-3 py-1.5 rounded-full z-10">
          <div className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse"></div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#ccff00]">LIVE</span>
        </div>
      ) : (
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md border border-gray-500/30 px-3 py-1.5 rounded-full z-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">ЗАПЛАНОВАНО</span>
        </div>
      )}
      
      <div className="absolute inset-0 flex flex-col justify-center items-center z-10">
        <div className="text-xs font-bold text-[#ccff00] uppercase tracking-widest mb-4">
          {match.tournamentName}
        </div>
        
        <div className="flex items-center gap-8 md:gap-16 w-full px-4 md:px-0 justify-center">
          <div className="flex flex-col items-center w-1/3">
            <div className="w-16 h-16 md:w-24 md:h-24 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 flex items-center justify-center mb-3">
               <span className="text-xl md:text-2xl font-black text-white">{match.homeTeam?.shortName?.substring(0,3) || 'TBD'}</span>
            </div>
            <span className="text-sm md:text-lg font-black text-white uppercase tracking-wider text-center">{match.homeTeam?.shortName || 'TBD'}</span>
          </div>

          <div className="flex flex-col items-center justify-center w-1/3">
            {isActuallyLive ? (
              <>
                <div className="text-5xl md:text-7xl font-black text-white tracking-tighter drop-shadow-xl whitespace-nowrap">
                  {match.homeScore} : {match.awayScore}
                </div>
                <div className="mt-2 text-sm font-bold text-[#ccff00] bg-[#ccff00]/10 px-3 py-1 rounded-full border border-[#ccff00]/20">
                  {match.minute}' ХВ
                </div>
              </>
            ) : (
              <div className="text-2xl md:text-4xl font-black text-white drop-shadow-xl flex flex-col items-center whitespace-nowrap">
                 <span>{new Date(match.scheduledAt).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}</span>
                 <span className="text-sm text-gray-400 mt-2">{new Date(match.scheduledAt).toLocaleDateString('uk-UA')}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center w-1/3">
            <div className="w-16 h-16 md:w-24 md:h-24 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 flex items-center justify-center mb-3">
               <span className="text-xl md:text-2xl font-black text-white">{match.awayTeam?.shortName?.substring(0,3) || 'TBD'}</span>
            </div>
            <span className="text-sm md:text-lg font-black text-white uppercase tracking-wider text-center">{match.awayTeam?.shortName || 'TBD'}</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end z-10">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-1 drop-shadow-md">
            Головний Матч
          </h2>
          <p className="text-sm font-bold text-gray-300 drop-shadow-md max-w-md line-clamp-1">
            {match.homeTeam?.name} проти {match.awayTeam?.name}
          </p>
        </div>
        <Link href={`/matches/${match.id}`} className="px-6 py-2.5 bg-white text-black hover:bg-[#ccff00] transition-colors rounded-full text-xs font-black uppercase tracking-widest hidden md:block">
          Деталі
        </Link>
      </div>
    </div>
  );
}
