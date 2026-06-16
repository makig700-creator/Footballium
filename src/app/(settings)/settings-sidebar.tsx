"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { User, Users, Shield, Settings, Activity, Heart, ShieldHalf, Key, ArrowLeft } from "lucide-react";

interface SettingsSidebarProps {
  role: string;
}

export function SettingsSidebar({ role }: SettingsSidebarProps) {
  const pathname = usePathname();

  const getBackLink = () => {
    if (role === "ADMIN") return { href: "/admin/dashboard", label: "Назад до адмінки" };
    if (role === "COACH") return { href: "/dashboard", label: "Назад до кабінету" };
    if (role === "REFEREE") return { href: "/referee/dashboard", label: "Назад до кабінету" };
    return { href: "/", label: "На головну" };
  };

  const getLinks = () => {
    if (role === "ADMIN") {
      return [
        { href: "/settings", label: "Профіль", icon: User },
        { href: "/settings/users", label: "Користувачі", icon: Users },
        { href: "/settings/referees", label: "Судді", icon: ShieldHalf },
        { href: "/settings/logs", label: "Логи", icon: Activity },
      ];
    }
    if (role === "COACH") {
      return [
        { href: "/coach/settings", label: "Профіль", icon: User },
        { href: "/coach/settings/password", label: "Пароль", icon: Key },
      ];
    }
    if (role === "REFEREE") {
      return [
        { href: "/referee/settings", label: "Профіль", icon: User },
        { href: "/referee/settings/matches", label: "Мої матчі", icon: Activity },
        { href: "/referee/settings/password", label: "Пароль", icon: Key },
      ];
    }
    // Default USER
    return [
      { href: "/user/settings", label: "Профіль", icon: User },
      { href: "/user/settings/favorites", label: "Улюблені команди", icon: Heart },
      { href: "/user/settings/password", label: "Пароль", icon: Key },
    ];
  };

  const links = getLinks();
  const backLink = getBackLink();

  return (
    <nav className="flex flex-col gap-2">
      <Link
        href={backLink.href}
        className="flex items-center gap-3 px-4 py-3 mb-4 rounded-lg text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-[#CCFF00] hover:bg-zinc-900 border border-transparent hover:border-[#CCFF00]/20 transition-all duration-200"
      >
        <ArrowLeft className="w-4 h-4" />
        {backLink.label}
      </Link>

      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/20"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            )}
          >
            <Icon className={cn("w-5 h-5", isActive ? "text-[#CCFF00]" : "text-zinc-500")} />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
