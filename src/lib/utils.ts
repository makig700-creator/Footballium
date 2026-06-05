import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow } from "date-fns"
import { uk } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const calcGoalDiff = (gf: number, ga: number) => {
  const diff = gf - ga
  return diff > 0 ? `+${diff}` : `${diff}`
}

export const getFormBadgeColor = (result: string) => {
  if (result === 'W') return 'bg-emerald-500'
  if (result === 'D') return 'bg-slate-500'
  if (result === 'L') return 'bg-red-500'
  return 'bg-slate-800'
}

export const formatPosition = (pos: string) => {
  const map: Record<string, string> = {
    GK: 'ВРТ',
    DEF: 'ЗХВ',
    MID: 'ПЗХ',
    FWD: 'НАП'
  }
  return map[pos] || pos
}

export const getPositionColor = (pos: string) => {
  const map: Record<string, string> = {
    GK: 'text-yellow-500 bg-yellow-500/10',
    DEF: 'text-blue-500 bg-blue-500/10',
    MID: 'text-emerald-500 bg-emerald-500/10',
    FWD: 'text-red-500 bg-red-500/10'
  }
  return map[pos] || 'text-slate-500 bg-slate-500/10'
}

export const formatRelative = (date: Date | string) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: uk })
}

export const formatKickoff = (date: Date | string) => {
  return format(new Date(date), 'dd MMM yyyy, HH:mm', { locale: uk })
}

export const formatDate = (date: Date | string) => {
  return format(new Date(date), 'dd MMMM yyyy', { locale: uk })
}
