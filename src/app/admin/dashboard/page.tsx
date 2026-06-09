import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Download, Plus, Activity, Users, Trophy, Bell, MoreVertical } from "lucide-react"

export default async function AdminDashboardPage() {
  const session = await auth()
  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/")
  }

  // Fetch stats
  const [tournamentsCount, teamsCount, usersCount, liveMatchesCount, liveMatchesData] = await Promise.all([
    prisma.tournament.count(),
    prisma.team.count(),
    prisma.user.count(),
    prisma.match.count({ where: { status: "LIVE" } }),
    prisma.match.findMany({
      where: { status: "LIVE" },
      include: { homeTeam: true, awayTeam: true },
      take: 3
    })
  ])

  // Mock data for the chart
  const months = ['Jan', 'Feb', 'Mar', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const chartPoints = [20, 25, 22, 30, 35, 60, 40, 30, 35, 40, 50]

  return (
    <div className="space-y-8 pb-10">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-2">Управління футбольною платформою</p>
          <h1 className="text-4xl font-black text-white uppercase tracking-tight">Панель Адміністратора</h1>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-700 bg-[#0a0a0a] hover:bg-gray-900 transition-colors text-sm font-bold text-gray-300 uppercase tracking-widest">
            <Download className="w-4 h-4" /> Звіт
          </button>
          <Link href="/admin/tournaments/new" className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-transparent border border-[#ccff00] text-[#ccff00] hover:bg-[#ccff00] hover:text-black transition-colors text-sm font-black uppercase tracking-widest">
            <Plus className="w-4 h-4" /> Створити Турнір
          </Link>
        </div>
      </div>

      {/* 2. TOP GRID (Hero + Stats) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left: Featured Highlight */}
        <div className="xl:col-span-2 relative rounded-3xl overflow-hidden border border-gray-800 aspect-video md:aspect-[21/9] xl:aspect-auto">
          <Image 
            src="/hero-bg.png" 
            alt="Live Match Highlight" 
            fill 
            className="object-cover object-center opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
          
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md border border-[#ccff00]/30 px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#ccff00]">LIVE</span>
          </div>
          
          <div className="absolute bottom-6 left-6 right-6">
            <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-2 drop-shadow-md">
              Головний Матч Дня
            </h2>
            <p className="text-sm font-bold text-gray-300 drop-shadow-md">
              Фінал Кубка • 85' хвилина
            </p>
          </div>
        </div>

        {/* Right: 2x2 Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          
          {/* Stat 1 */}
          <div className="bg-[#111111] border border-gray-800 rounded-2xl p-5 flex flex-col justify-between hover:border-gray-600 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Турніри</span>
              <div className="p-2 bg-[#1a1a1a] rounded-full">
                <Trophy className="w-4 h-4 text-gray-300" />
              </div>
            </div>
            <div>
              <div className="text-4xl font-black text-white">{tournamentsCount}</div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] bg-[#ccff00]/10 text-[#ccff00] px-2 py-0.5 rounded-full font-bold">+2</span>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">за місяць</span>
              </div>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="bg-[#111111] border border-gray-800 rounded-2xl p-5 flex flex-col justify-between hover:border-gray-600 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Команди</span>
              <div className="p-2 bg-[#1a1a1a] rounded-full">
                <Users className="w-4 h-4 text-gray-300" />
              </div>
            </div>
            <div>
              <div className="text-4xl font-black text-white">{teamsCount}</div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] bg-[#ccff00]/10 text-[#ccff00] px-2 py-0.5 rounded-full font-bold">+5</span>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">за місяць</span>
              </div>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="bg-[#111111] border border-gray-800 rounded-2xl p-5 flex flex-col justify-between hover:border-gray-600 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Юзери</span>
              <div className="p-2 bg-[#1a1a1a] rounded-full">
                <Activity className="w-4 h-4 text-gray-300" />
              </div>
            </div>
            <div>
              <div className="text-4xl font-black text-white">{usersCount}</div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] bg-[#ccff00]/10 text-[#ccff00] px-2 py-0.5 rounded-full font-bold">+12%</span>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">за місяць</span>
              </div>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="bg-[#111111] border border-gray-800 rounded-2xl p-5 flex flex-col justify-between hover:border-gray-600 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Наживо</span>
              <div className="p-2 bg-[#1a1a1a] rounded-full">
                <Bell className="w-4 h-4 text-gray-300" />
              </div>
            </div>
            <div>
              <div className="text-4xl font-black text-white">{liveMatchesCount}</div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] bg-[#ccff00]/10 text-[#ccff00] px-2 py-0.5 rounded-full font-bold animate-pulse">Зараз</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. BOTTOM GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left: Live Matches Section */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-black text-white uppercase tracking-widest">Матчі Наживо</h3>
            <Link href="/tournaments" className="text-xs font-bold text-gray-400 hover:text-[#ccff00] uppercase tracking-widest transition-colors underline underline-offset-4">
              Всі матчі
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {liveMatchesData.length > 0 ? liveMatchesData.map((match) => (
              <div key={match.id} className="bg-[#111111] border border-gray-800 rounded-2xl p-5 relative group hover:border-[#ccff00]/50 transition-colors">
                <div className="absolute top-4 right-4">
                   <MoreVertical className="w-4 h-4 text-gray-500 hover:text-white cursor-pointer" />
                </div>
                
                <div className="flex justify-center items-center mb-6">
                  <div className="text-[10px] font-black text-[#ccff00] bg-[#ccff00]/10 px-2 py-1 rounded-sm uppercase tracking-widest">
                    {match.minute}' Хв
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-8 px-2">
                  <div className="text-center w-1/3">
                    <div className="w-12 h-12 mx-auto bg-[#1a1a1a] rounded-full border border-gray-800 mb-2 flex items-center justify-center font-black text-xs text-gray-400">
                      {match.homeTeam.shortName.slice(0,3)}
                    </div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">{match.homeTeam.shortName}</div>
                  </div>
                  
                  <div className="w-1/3 text-center">
                    <div className="text-3xl font-black text-white tracking-wider">{match.homeScore}:{match.awayScore}</div>
                  </div>
                  
                  <div className="text-center w-1/3">
                    <div className="w-12 h-12 mx-auto bg-[#1a1a1a] rounded-full border border-gray-800 mb-2 flex items-center justify-center font-black text-xs text-gray-400">
                      {match.awayTeam.shortName.slice(0,3)}
                    </div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">{match.awayTeam.shortName}</div>
                  </div>
                </div>

                <Link href={`/tournaments/${match.tournamentId}`} className="block w-full py-2.5 text-center bg-transparent border border-gray-700 hover:border-[#ccff00] hover:text-black hover:bg-[#ccff00] rounded-full text-xs font-black uppercase tracking-widest text-white transition-all">
                  Слідкувати
                </Link>
              </div>
            )) : (
              // Mock items if no live matches
              [1, 2, 3].map((i) => (
                <div key={i} className="bg-[#111111] border border-gray-800 rounded-2xl p-5 relative opacity-50 grayscale">
                  <div className="flex justify-center items-center mb-6">
                    <div className="text-[10px] font-black text-gray-500 bg-gray-900 px-2 py-1 rounded-sm uppercase tracking-widest">
                      Очікується
                    </div>
                  </div>
                  <div className="flex justify-between items-center mb-8 px-2">
                    <div className="w-12 h-12 bg-[#1a1a1a] rounded-full border border-gray-800"></div>
                    <div className="text-2xl font-black text-gray-600">0:0</div>
                    <div className="w-12 h-12 bg-[#1a1a1a] rounded-full border border-gray-800"></div>
                  </div>
                  <button disabled className="w-full py-2.5 text-center bg-[#1a1a1a] rounded-full text-xs font-black uppercase tracking-widest text-gray-600">
                    Немає матчу
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Platform Activity Chart (CSS Mock) */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-black text-white uppercase tracking-widest">Активність</h3>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest cursor-pointer hover:text-white underline underline-offset-4">
              Деталі
            </span>
          </div>

          <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6 h-[300px] flex flex-col justify-end relative">
            {/* Y Axis labels */}
            <div className="absolute left-4 top-6 bottom-8 flex flex-col justify-between text-[10px] font-bold text-gray-600">
              <span>60%</span>
              <span>40%</span>
              <span>20%</span>
              <span>0%</span>
            </div>

            {/* Grid lines */}
            <div className="absolute left-12 right-4 top-8 bottom-8 flex flex-col justify-between pointer-events-none">
              <div className="w-full border-t border-gray-800/50"></div>
              <div className="w-full border-t border-gray-800/50"></div>
              <div className="w-full border-t border-gray-800/50"></div>
              <div className="w-full border-t border-gray-800/50"></div>
            </div>

            {/* Chart Area */}
            <div className="flex justify-between items-end h-48 w-full pl-8 z-10 relative">
              {months.map((month, idx) => {
                const isHighlight = month === 'Jul';
                const height = `${chartPoints[idx]}%`;
                return (
                  <div key={month} className="flex flex-col items-center group w-full relative">
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-[#ccff00] text-black text-[10px] font-black px-2 py-1 rounded-sm pointer-events-none transition-opacity z-20">
                      {chartPoints[idx]}k
                    </div>
                    
                    {/* Line / Bar replacement for pure CSS visual */}
                    <div className="w-full flex justify-center items-end h-full relative">
                       {/* Connection Line Mock */}
                       {idx < months.length - 1 && (
                         <svg className="absolute left-1/2 bottom-0 w-full overflow-visible pointer-events-none" style={{ height: '100%', zIndex: 0 }}>
                            <line 
                              x1="0" 
                              y1={`${100 - chartPoints[idx]}%`} 
                              x2="100%" 
                              y2={`${100 - chartPoints[idx+1]}%`} 
                              stroke="#ccff00" 
                              strokeWidth="2"
                              strokeOpacity={isHighlight || months[idx+1] === 'Jul' ? "1" : "0.3"}
                            />
                         </svg>
                       )}
                       
                       {/* Highlight Background Pillar */}
                       {isHighlight && (
                         <div className="absolute bottom-0 w-8 h-full bg-gradient-to-t from-[#ccff00]/30 to-transparent rounded-t-sm -z-10"></div>
                       )}
                       
                       {/* Data Point Dot */}
                       <div 
                         className={`absolute w-2.5 h-2.5 rounded-full z-10 transition-all ${isHighlight ? 'bg-[#ccff00] ring-4 ring-[#ccff00]/20' : 'bg-[#1c1a1a] border-2 border-gray-600 group-hover:border-[#ccff00] group-hover:bg-[#ccff00]'}`}
                         style={{ bottom: `calc(${height} - 5px)` }}
                       ></div>
                    </div>

                    <span className={`mt-4 text-[10px] font-bold uppercase tracking-wider ${isHighlight ? 'text-[#ccff00]' : 'text-gray-500 group-hover:text-gray-300'}`}>
                      {month}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
