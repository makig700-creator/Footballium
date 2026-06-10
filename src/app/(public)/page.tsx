import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { Calendar, MapPin, Users, Flag, Trophy, Shield, Activity } from 'lucide-react'

export const revalidate = 60 // Revalidate every minute

export default async function HomePage() {
  const [liveMatches] = await Promise.all([
    prisma.match.findMany({
      where: { status: 'LIVE' },
      include: { homeTeam: true, awayTeam: true },
    }),
  ])

  return (
    <div className="flex flex-col min-h-screen bg-[#000000] text-gray-200 font-sans selection:bg-[#ccff00] selection:text-black">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[85vh] min-h-[700px] flex items-center border-b border-gray-900">
        {/* Background Image - Right Side bias */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-y-0 right-0 w-full md:w-3/4">
            <Image 
              src="/hero-bg.png" 
              alt="Football Player" 
              fill 
              priority
              className="object-cover object-center opacity-40 md:opacity-80 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#000000] via-[#000000]/80 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-transparent to-[#000000]/50"></div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Hero Content */}
          <div className="space-y-6 pt-20">

            
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black text-white uppercase leading-[0.95] tracking-tight">
              Твій шлях до <br/>
              чемпіонства <br/>
              починається тут.
            </h1>
            
            <p className="text-sm sm:text-base text-gray-400 max-w-md font-medium leading-relaxed tracking-wide pt-2">
              Footballium — це веб-платформа для управління футбольними турнірами. 
              В Європі вчаться на бетоні; в Бразилії — на піску; ми приносимо поле до вас. 
              Об'єднуємо адміністраторів, тренерів та гравців.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Link href="/auth/register" className="inline-flex justify-center items-center px-8 py-3.5 bg-[#ccff00] hover:bg-white text-black font-extrabold uppercase text-sm tracking-widest transition-all">
                Долучитися
              </Link>
              <Link href="/tournaments" className="inline-flex justify-center items-center px-8 py-3.5 border border-gray-600 hover:border-[#ccff00] text-[#ccff00] font-extrabold uppercase text-sm tracking-widest transition-all bg-black/50 backdrop-blur-sm">
                Знайти турнір
              </Link>
            </div>

            <div className="pt-8 flex items-center gap-3 text-gray-500 text-xs uppercase tracking-widest font-bold">
               <Flag className="w-4 h-4 text-[#ccff00]" />
               Запуск платформи: Сезон 2026 • Україна
            </div>
          </div>

          {/* Right Side Empty or Minimal Widget to let photo shine */}
          <div className="hidden lg:flex justify-end items-end h-full pb-20">
             {/* Small live widget floating */}
             {liveMatches.length > 0 && (
                <div className="w-72 bg-[#111111]/80 backdrop-blur-md border border-gray-800 p-4">
                   <div className="flex justify-between items-center mb-4">
                      <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Наживо</span>
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                   </div>
                   <div className="flex justify-between items-center">
                      <div className="text-center">
                         <div className="font-bold text-white text-sm">{liveMatches[0].homeTeam?.shortName || 'TBD'}</div>
                      </div>
                      <div className="text-2xl font-black text-[#ccff00]">
                         {liveMatches[0].homeScore} - {liveMatches[0].awayScore}
                      </div>
                      <div className="text-center">
                         <div className="font-bold text-white text-sm">{liveMatches[0].awayTeam?.shortName || 'TBD'}</div>
                      </div>
                   </div>
                   <div className="mt-2 text-center text-[10px] text-gray-500 uppercase">{liveMatches[0].minute}' Хвилина</div>
                </div>
             )}
          </div>
        </div>
      </section>

      {/* 2. UPCOMING TOURNAMENTS */}
      <section className="py-24 relative z-10 bg-[#000000] border-b border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-2">
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">Найближчі турніри</h2>
            <p className="text-gray-400 font-medium">Де народжуються легенди</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tournament Card 1 */}
            <div className="bg-[#1c1a1a] border border-[#2a2828] rounded-md p-6 flex flex-col relative group hover:border-gray-600 transition-colors">
              <div className="absolute top-4 right-4 border border-green-500 text-green-500 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-sm">
                Відкрито
              </div>
              
              <div className="h-40 flex items-center justify-center mb-6 mt-4">
                 <Trophy className="w-24 h-24 text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.2)] group-hover:scale-110 transition-transform duration-500" />
              </div>
              
              <h3 className="text-lg font-bold text-white mb-6 uppercase leading-snug">Київська Прем'єр Ліга 2026.</h3>
              
              <div className="space-y-3 mb-8 text-xs text-gray-400 font-medium tracking-wide">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-500" /> Травень 15, 2026
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-500" /> X-Park, Київ
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-gray-500" /> 8 Дивізіонів (8x8)
                </div>
              </div>
              
              <div className="mt-auto">
                 <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#2a2828]">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">Внесок:</div>
                    <div className="text-xs text-white font-bold">15,000 ₴</div>
                 </div>
                 <div className="flex gap-2">
                    <Link href="/tournaments/kpl" className="flex-1 py-3 text-center bg-[#ccff00] hover:bg-[#b3ff00] text-black font-extrabold uppercase text-[11px] tracking-widest transition-colors rounded-sm">
                      Заявитися
                    </Link>
                    <button className="px-4 py-3 border border-gray-700 hover:border-gray-500 text-white font-extrabold uppercase text-[11px] tracking-widest transition-colors rounded-sm">
                      Деталі
                    </button>
                 </div>
              </div>
            </div>

            {/* Tournament Card 2 */}
            <div className="bg-[#1c1a1a] border border-[#2a2828] rounded-md p-6 flex flex-col relative group hover:border-gray-600 transition-colors">
              <div className="absolute top-4 right-4 border border-green-500 text-green-500 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-sm">
                Відкрито
              </div>
              
              <div className="h-40 flex items-center justify-center mb-6 mt-4">
                 <Trophy className="w-24 h-24 text-[#ccff00] drop-shadow-[0_0_15px_rgba(204,255,0,0.2)] group-hover:scale-110 transition-transform duration-500" />
              </div>
              
              <h3 className="text-lg font-bold text-white mb-6 uppercase leading-snug">Літній Кубок Незалежності 2026.</h3>
              
              <div className="space-y-3 mb-8 text-xs text-gray-400 font-medium tracking-wide">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-500" /> Серпень 24, 2026
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-500" /> НТК Баннікова, Київ
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-gray-500" /> 4 Дивізіони (11x11)
                </div>
              </div>
              
              <div className="mt-auto">
                 <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#2a2828]">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">Внесок:</div>
                    <div className="text-xs text-white font-bold">25,000 ₴</div>
                 </div>
                 <div className="flex gap-2">
                    <Link href="/tournaments/independence-cup" className="flex-1 py-3 text-center bg-[#ccff00] hover:bg-[#b3ff00] text-black font-extrabold uppercase text-[11px] tracking-widest transition-colors rounded-sm">
                      Заявитися
                    </Link>
                    <button className="px-4 py-3 border border-gray-700 hover:border-gray-500 text-white font-extrabold uppercase text-[11px] tracking-widest transition-colors rounded-sm">
                      Деталі
                    </button>
                 </div>
              </div>
            </div>

            {/* Tournament Card 3 */}
            <div className="bg-[#1c1a1a] border border-[#2a2828] rounded-md p-6 flex flex-col relative group hover:border-gray-600 transition-colors opacity-80 grayscale hover:grayscale-0">
              <div className="absolute top-4 right-4 border border-gray-600 text-gray-500 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-sm">
                Незабаром
              </div>
              
              <div className="h-40 flex items-center justify-center mb-6 mt-4">
                 <Trophy className="w-24 h-24 text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.2)] group-hover:scale-110 transition-transform duration-500" />
              </div>
              
              <h3 className="text-lg font-bold text-white mb-6 uppercase leading-snug">Зимова першість столиці 2026.</h3>
              
              <div className="space-y-3 mb-8 text-xs text-gray-400 font-medium tracking-wide">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-500" /> Грудень 10, 2026
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-500" /> Очікується
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-gray-500" /> 8 Дивізіонів (5x5)
                </div>
              </div>
              
              <div className="mt-auto">
                 <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#2a2828]">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">Внесок:</div>
                    <div className="text-xs text-gray-500 font-bold">Очікується</div>
                 </div>
                 <div className="flex gap-2">
                    <button disabled className="flex-1 py-3 text-center bg-gray-800 text-gray-600 font-extrabold uppercase text-[11px] tracking-widest rounded-sm cursor-not-allowed">
                      Очікується
                    </button>
                 </div>
              </div>
            </div>
            
          </div>
          
          <div className="mt-12 flex justify-center">
             <Link href="/tournaments" className="px-8 py-3 border border-gray-600 text-white hover:border-white font-extrabold uppercase text-sm tracking-widest transition-colors bg-[#0a0a0a]">
                Переглянути всі турніри
             </Link>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (ROLES) */}
      <section className="py-24 bg-[#000000]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center mb-16 space-y-2">
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight text-center">Єдина екосистема</h2>
            <div className="w-16 h-1 bg-[#ccff00] mt-6"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-[#0a0a0a] border border-gray-800 hover:border-[#ccff00] transition-colors p-8 flex flex-col items-center text-center group">
               <div className="w-16 h-16 rounded-full border border-gray-800 flex items-center justify-center mb-6 group-hover:border-[#ccff00] transition-colors">
                  <Activity className="w-6 h-6 text-white group-hover:text-[#ccff00]" />
               </div>
               <h3 className="text-white font-bold uppercase tracking-wider mb-4">Організаторам</h3>
               <p className="text-gray-400 text-sm leading-relaxed">
                  Створюйте турніри, генеруйте сітки та календарі, керуйте фінансами в один клік. Кінець епохи Excel.
               </p>
            </div>

            <div className="bg-[#0a0a0a] border border-red-900/50 hover:border-red-500 transition-colors p-8 flex flex-col items-center text-center group">
               <div className="w-16 h-16 rounded-full border border-red-900/50 flex items-center justify-center mb-6 group-hover:border-red-500 transition-colors">
                  <Shield className="w-6 h-6 text-red-500" />
               </div>
               <h3 className="text-white font-bold uppercase tracking-wider mb-4">Тренерам</h3>
               <p className="text-gray-400 text-sm leading-relaxed">
                  Подавайте електронні заявки на матчі, формуйте стартові склади та аналізуйте статистику команди.
               </p>
            </div>

            <div className="bg-[#0a0a0a] border border-amber-900/50 hover:border-amber-500 transition-colors p-8 flex flex-col items-center text-center group">
               <div className="w-16 h-16 rounded-full border border-amber-900/50 flex items-center justify-center mb-6 group-hover:border-amber-500 transition-colors">
                  <Trophy className="w-6 h-6 text-amber-500" />
               </div>
               <h3 className="text-white font-bold uppercase tracking-wider mb-4">Суддям</h3>
               <p className="text-gray-400 text-sm leading-relaxed">
                  Заповнюйте протокол матчу онлайн з мобільного телефону. Голи та картки фіксуються в реальному часі.
               </p>
            </div>

            <div className="bg-[#0a0a0a] border border-blue-900/50 hover:border-blue-500 transition-colors p-8 flex flex-col items-center text-center group">
               <div className="w-16 h-16 rounded-full border border-blue-900/50 flex items-center justify-center mb-6 group-hover:border-blue-500 transition-colors">
                  <Users className="w-6 h-6 text-blue-500" />
               </div>
               <h3 className="text-white font-bold uppercase tracking-wider mb-4">Вболівальникам</h3>
               <p className="text-gray-400 text-sm leading-relaxed">
                  Слідкуйте за результатами онлайн, читайте новини та переглядайте розширену статистику гравців.
               </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}
