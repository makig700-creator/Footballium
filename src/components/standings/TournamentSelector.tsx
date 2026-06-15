"use client"

import { useRouter, useSearchParams } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function TournamentSelector({ tournaments, defaultTournamentId }: { 
  tournaments: { id: string, name: string }[],
  defaultTournamentId: string 
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentId = searchParams.get('tournamentId') || defaultTournamentId

  return (
    <div className="w-full md:w-[320px]">
      <Select 
        value={currentId} 
        onValueChange={(val) => router.push(`/standings?tournamentId=${val}`)}
      >
        <SelectTrigger className="w-full bg-[#111111]/80 border-gray-800/80 text-gray-300 hover:text-white focus:ring-1 focus:ring-gray-700 h-11 transition-colors">
          <span className="truncate">
            {tournaments.find(t => t.id === currentId)?.name || 'Оберіть турнір'}
          </span>
        </SelectTrigger>
        <SelectContent className="bg-[#111111] border-gray-800 text-gray-300">
          {tournaments.map((t) => (
            <SelectItem key={t.id} value={t.id} className="focus:bg-gray-800 focus:text-white cursor-pointer">
              {t.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
