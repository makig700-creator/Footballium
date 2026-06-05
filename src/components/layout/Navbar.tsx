'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import {
  Trophy, Newspaper, Calendar, Users, Search,
  BarChart3, Shield, Menu, X, LogOut, User, ChevronDown
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const navLinks = [
  { href: '/news', label: 'НОВИНИ', icon: Newspaper },
  { href: '/matches', label: 'МАТЧІ', icon: Calendar },
  { href: '/standings', label: 'ТАБЛИЦЯ', icon: BarChart3 },
  { href: '/teams', label: 'КОМАНДИ', icon: Shield },
  { href: '/players', label: 'ГРАВЦІ', icon: Users },
  { href: '/search', label: 'ПОШУК', icon: Search },
]

export function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-[#000000]/90 backdrop-blur-md border-b border-gray-900">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-sm bg-[#CCFF00] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Trophy className="w-4 h-4 text-black" />
            </div>
            <span className="text-lg font-black text-white tracking-widest uppercase">FOOTBALLIUM</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-sm text-[11px] font-extrabold uppercase tracking-widest transition-all',
                  pathname.startsWith(href)
                    ? 'bg-[#CCFF00]/10 text-[#CCFF00]'
                    : 'text-gray-400 hover:text-white hover:bg-gray-900'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </Link>
            ))}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-3">
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-gray-900 hover:bg-gray-800 transition-all text-sm border border-gray-800"
                >
                  <div className="w-6 h-6 rounded-full bg-[#CCFF00] flex items-center justify-center">
                    <User className="w-3 h-3 text-black" />
                  </div>
                  <span className="hidden sm:block text-white font-bold uppercase text-[11px] tracking-wider">{session.user?.name?.split(' ')[0]}</span>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#0a0a0a] border border-gray-800 py-1 shadow-2xl z-50">
                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-[#CCFF00] hover:bg-gray-900 transition-colors"
                    >
                      <BarChart3 className="w-4 h-4" /> Панель тренера
                    </Link>
                    <hr className="border-gray-800 my-1" />
                    <button
                      onClick={() => { signOut(); setUserMenuOpen(false) }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-red-500 hover:bg-gray-900 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Вийти
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="inline-flex shrink-0 items-center justify-center text-[11px] tracking-widest uppercase font-extrabold transition-all outline-none select-none h-9 px-5 bg-[#CCFF00] hover:bg-[#b3ff00] text-black rounded-sm"
              >
                Вхід для тренера
              </Link>
            )}

            {/* Mobile toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-gray-400 hover:text-white hover:bg-gray-900 rounded-sm"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden py-3 border-t border-gray-900 space-y-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all',
                  pathname.startsWith(href)
                    ? 'bg-[#CCFF00]/10 text-[#CCFF00]'
                    : 'text-gray-400 hover:text-white hover:bg-gray-900'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  )
}
