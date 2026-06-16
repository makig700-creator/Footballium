"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Trophy, Users, Settings, LogOut, Newspaper } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/admin/dashboard', label: 'Огляд', icon: LayoutDashboard },
    { href: '/admin/tournaments', label: 'Турніри', icon: Trophy },
    { href: '/admin/users', label: 'Користувачі', icon: Users },
    { href: '/admin/news', label: 'Новини', icon: Newspaper },
    { href: '/settings', label: 'Налаштування', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0a0a0a] border-r border-gray-900 hidden md:flex flex-col">
      <nav className="flex-1 py-8 px-4 space-y-3">
        {links.map((link) => {
          const isActive = pathname.startsWith(link.href) && (link.href !== '/admin/dashboard' || pathname === '/admin/dashboard');
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-sm font-bold uppercase tracking-widest text-xs transition-colors border",
                isActive
                  ? "bg-[#CCFF00] text-black border-[#CCFF00]"
                  : "text-gray-400 hover:text-[#CCFF00] hover:bg-gray-900 border-transparent hover:border-gray-800"
              )}
            >
              <Icon className="w-4 h-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-900">
        <Link href="/api/auth/signout" className="flex items-center gap-3 px-4 py-3 w-full rounded-sm text-gray-400 hover:text-red-500 hover:bg-gray-900 border border-transparent hover:border-gray-800 transition-colors font-bold uppercase tracking-widest text-xs">
          <LogOut className="w-4 h-4" />
          Вийти
        </Link>
      </div>
    </aside>
  );
}
