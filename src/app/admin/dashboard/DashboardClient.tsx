"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Download, Plus, Activity, Users, Trophy, Bell } from "lucide-react";
import { pusherClient } from "@/lib/pusher-client";
import MainMatchCard from "@/components/admin/MainMatchCard";
import LiveMatchesWidget from "@/components/admin/LiveMatchesWidget";
import PendingApplicationsWidget from "@/components/admin/PendingApplicationsWidget";
import UserGrowthChart from "@/components/admin/UserGrowthChart";

export default function DashboardClient({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const channel = pusherClient.subscribe("admin-dashboard");
    
    channel.bind("dashboard-update", () => {
      fetch("/api/admin/dashboard")
        .then(res => res.json())
        .then(fetched => setData(fetched))
        .catch(console.error);
    });

    return () => {
      pusherClient.unsubscribe("admin-dashboard");
    };
  }, []);

  return (
    <div className="space-y-8 pb-10">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-2">Управління футбольною платформою</p>
          <h1 className="text-4xl font-black text-white uppercase tracking-tight">Панель Адміністратора</h1>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/tournaments/new" className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-transparent border border-[#ccff00] text-[#ccff00] hover:bg-[#ccff00] hover:text-black transition-colors text-sm font-black uppercase tracking-widest">
            <Plus className="w-4 h-4" /> Створити Турнір
          </Link>
        </div>
      </div>

      {/* 2. TOP GRID (Hero + Stats) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left: Featured Highlight */}
        <MainMatchCard initialMatch={data.mainMatch} />

        {/* Right: 2x2 Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          
          {/* Stat 1 */}
          <Link href="/admin/tournaments" className="block bg-[#111111] border border-gray-800 rounded-2xl p-5 flex flex-col justify-between hover:border-gray-600 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Турніри</span>
              <div className="p-2 bg-[#1a1a1a] rounded-full">
                <Trophy className="w-4 h-4 text-gray-300" />
              </div>
            </div>
            <div>
              <div className="text-4xl font-black text-white">{data.stats.tournaments.total}</div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] bg-[#ccff00]/10 text-[#ccff00] px-2 py-0.5 rounded-full font-bold">+{data.stats.tournaments.newThisMonth}</span>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">за місяць</span>
              </div>
            </div>
          </Link>

          {/* Stat 2 */}
          <Link href="/teams" className="block bg-[#111111] border border-gray-800 rounded-2xl p-5 flex flex-col justify-between hover:border-gray-600 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Команди</span>
              <div className="p-2 bg-[#1a1a1a] rounded-full">
                <Users className="w-4 h-4 text-gray-300" />
              </div>
            </div>
            <div>
              <div className="text-4xl font-black text-white">{data.stats.teams.total}</div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] bg-[#ccff00]/10 text-[#ccff00] px-2 py-0.5 rounded-full font-bold">+{data.stats.teams.newThisMonth}</span>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">за місяць</span>
              </div>
            </div>
          </Link>

          {/* Stat 3 */}
          <Link href="/settings/users" className="block bg-[#111111] border border-gray-800 rounded-2xl p-5 flex flex-col justify-between hover:border-gray-600 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Юзери</span>
              <div className="p-2 bg-[#1a1a1a] rounded-full">
                <Activity className="w-4 h-4 text-gray-300" />
              </div>
            </div>
            <div>
              <div className="text-4xl font-black text-white">{data.stats.users.total}</div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] bg-[#ccff00]/10 text-[#ccff00] px-2 py-0.5 rounded-full font-bold">+{data.stats.users.growthPercent}%</span>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">за місяць</span>
              </div>
            </div>
          </Link>

          {/* Stat 4 */}
          <Link href="/matches?status=LIVE" className="block bg-[#111111] border border-gray-800 rounded-2xl p-5 flex flex-col justify-between hover:border-gray-600 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Наживо</span>
              <div className="p-2 bg-[#1a1a1a] rounded-full">
                <Bell className="w-4 h-4 text-gray-300" />
              </div>
            </div>
            <div>
              <div className="text-4xl font-black text-white">{data.stats.liveMatches.count}</div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] bg-[#ccff00]/10 text-[#ccff00] px-2 py-0.5 rounded-full font-bold animate-pulse">Зараз</span>
              </div>
            </div>
          </Link>

        </div>
      </div>

      {/* 3. BOTTOM GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* Left: Live Matches Section */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-black text-white uppercase tracking-widest">Матчі Наживо</h3>
            <Link href="/matches" className="text-xs font-bold text-gray-400 hover:text-[#ccff00] uppercase tracking-widest transition-colors underline underline-offset-4">
              Всі матчі
            </Link>
          </div>
          
          <LiveMatchesWidget initialMatches={data.liveMatches} />
        </div>

        {/* Right: Column for Pending Apps & Chart */}
        <div className="space-y-6">
          {/* Platform Activity Chart */}
          <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6 relative">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Активність (Останні 12 міс.)</h3>
            </div>
            <UserGrowthChart data={data.userGrowthChart} />
          </div>

          {/* Pending Applications */}
          <PendingApplicationsWidget applications={data.pendingApplications} />
        </div>

      </div>
    </div>
  );
}
