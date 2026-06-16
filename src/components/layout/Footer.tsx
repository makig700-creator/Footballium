import Link from 'next/link'
import { Trophy, Camera, Globe, PlayCircle, Send } from 'lucide-react'

export function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/10 bg-zinc-950/90 backdrop-blur-xl z-10">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#CCFF00]/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8">
          
          {/* Brand Column */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6 group w-fit">
              <div className="w-8 h-8 rounded-sm bg-[#CCFF00] flex items-center justify-center group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(204,255,0,0.3)]">
                <Trophy className="w-4 h-4 text-black" />
              </div>
              <span className="text-xl font-black text-white tracking-widest uppercase group-hover:text-zinc-200 transition-colors">FOOTBALLIUM</span>
            </Link>
            <p className="text-zinc-400 text-sm max-w-sm leading-relaxed font-medium mb-8">
              Найкраща веб-платформа для управління футбольними турнірами. 
              Кінець епохи хаосу з таблицями Excel та месенджерами.
            </p>
            <div className="flex items-center gap-3">
              {[
                { Icon: Camera, href: 'https://instagram.com/footballium', label: 'Instagram' },
                { Icon: Globe, href: 'https://footballium.com', label: 'Website' },
                { Icon: PlayCircle, href: 'https://youtube.com/@footballium', label: 'Youtube' },
                { Icon: Send, href: 'https://t.me/footballium', label: 'Telegram' }
              ].map(({ Icon, href, label }, i) => (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-[#CCFF00] hover:bg-[#CCFF00]/10 hover:border-[#CCFF00]/50 hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-sm">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav Column 1 */}
          <div className="md:col-span-1">
            <h3 className="text-white font-bold mb-6 text-xs uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#CCFF00]/80 animate-pulse shadow-[0_0_8px_rgba(204,255,0,0.6)]" />
              Для гравців
            </h3>
            <ul className="space-y-4">
              {[['Матчі', '/matches'], ['Турнірна таблиця', '/standings'], ['Статистика', '/statistics'], ['Команди', '/teams'], ['Гравці', '/players']].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-zinc-400 hover:text-[#CCFF00] text-sm font-medium transition-all duration-300 hover:translate-x-1 inline-block">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Nav Column 2 */}
          <div className="md:col-span-1">
            <h3 className="text-white font-bold mb-6 text-xs uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500/80 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
              Інформація
            </h3>
            <ul className="space-y-4">
              {[['Новини', '/news'], ['Правила турніру', '/rules'], ['FAQ', '/faq']].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-zinc-400 hover:text-white text-sm font-medium transition-all duration-300 hover:translate-x-1 inline-block">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
          <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">© 2026 FOOTBALLIUM. Усі права захищені.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            <Link href="/privacy" className="text-zinc-600 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">Конфіденційність</Link>
            <Link href="/terms" className="text-zinc-600 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">Умови</Link>

          </div>
        </div>
      </div>
    </footer>
  )
}
