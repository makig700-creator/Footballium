import Link from 'next/link'
import { Trophy, Globe, MessageSquare, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-gray-900 bg-[#000000] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-sm bg-[#CCFF00] flex items-center justify-center">
                <Trophy className="w-4 h-4 text-black" />
              </div>
              <span className="text-xl font-black text-white tracking-widest uppercase">FOOTBALLIUM</span>
            </Link>
            <p className="text-gray-400 text-sm max-w-sm leading-relaxed font-medium">
              Найкраща веб-платформа для управління футбольними турнірами. 
              Кінець епохи хаосу з таблицями Excel та месенджерами.
            </p>
            <div className="flex items-center gap-3 mt-8">
              {[Globe, MessageSquare, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-sm bg-gray-900 hover:bg-[#CCFF00]/20 border border-gray-800 hover:border-[#CCFF00]/50 flex items-center justify-center text-gray-400 hover:text-[#CCFF00] transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 text-xs uppercase tracking-widest">Платформа</h3>
            <ul className="space-y-4">
              {[['Новини', '/news'], ['Матчі', '/matches'], ['Турнірна таблиця', '/standings'], ['Пошук', '/search']].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-gray-400 hover:text-[#CCFF00] text-xs font-bold uppercase tracking-wider transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 text-xs uppercase tracking-widest">База даних</h3>
            <ul className="space-y-4">
              {[['Команди', '/teams'], ['Гравці', '/players'], ['Панель тренера', '/dashboard']].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-gray-400 hover:text-[#CCFF00] text-xs font-bold uppercase tracking-wider transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-900 mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs font-bold uppercase tracking-widest">© 2026 FOOTBALLIUM. Усі права захищені.</p>
          <div className="flex items-center gap-2 text-gray-600 text-xs font-bold uppercase tracking-widest">
            <span>Powered by</span>
            <span className="text-[#CCFF00]">Next.js</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
