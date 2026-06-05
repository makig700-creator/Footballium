import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import Link from 'next/link'
import { LayoutDashboard, Users, CalendarDays, Settings, LogOut } from 'lucide-react'

export default function CoachLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col h-screen bg-[#000000] overflow-hidden">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-[#0a0a0a] border-r border-gray-900 hidden md:flex flex-col">
          <nav className="flex-1 py-8 px-4 space-y-3">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-sm bg-[#CCFF00] text-black font-black uppercase tracking-widest text-xs border border-[#CCFF00]">
              <LayoutDashboard className="w-4 h-4" />
              Огляд
            </Link>
            <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-sm text-gray-400 hover:text-[#CCFF00] hover:bg-gray-900 border border-transparent hover:border-gray-800 transition-colors font-bold uppercase tracking-widest text-xs">
              <CalendarDays className="w-4 h-4" />
              Матчі
            </Link>
            <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-sm text-gray-400 hover:text-[#CCFF00] hover:bg-gray-900 border border-transparent hover:border-gray-800 transition-colors font-bold uppercase tracking-widest text-xs">
              <Users className="w-4 h-4" />
              Склад
            </Link>
            <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-sm text-gray-400 hover:text-[#CCFF00] hover:bg-gray-900 border border-transparent hover:border-gray-800 transition-colors font-bold uppercase tracking-widest text-xs">
              <Settings className="w-4 h-4" />
              Налаштування
            </Link>
          </nav>
          
          <div className="p-4 border-t border-gray-900">
            <button className="flex items-center gap-3 px-4 py-3 w-full rounded-sm text-gray-400 hover:text-red-500 hover:bg-gray-900 border border-transparent hover:border-gray-800 transition-colors font-bold uppercase tracking-widest text-xs">
              <LogOut className="w-4 h-4" />
              Вийти
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-10 relative">
          {children}
        </main>
      </div>
    </div>
  )
}
