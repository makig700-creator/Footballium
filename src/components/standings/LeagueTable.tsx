import Image from 'next/image'
import Link from 'next/link'
import { getFormBadgeColor, cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type StandingsRow = {
  id: string
  team: { id: string, name: string, shortName: string, logo: string | null }
  played: number
  won: number
  drawn: number
  lost: number
  gf: number
  ga: number
  points: number
  form: string
}

export function LeagueTable({ standings }: { standings: StandingsRow[] }) {
  // Sort standings by points (desc), then goal difference (desc), then goals scored (desc)
  const sortedStandings = [...standings].sort((a, b) => {
    if (a.points !== b.points) return b.points - a.points
    const gdA = a.gf - a.ga
    const gdB = b.gf - b.ga
    if (gdA !== gdB) return gdB - gdA
    return b.gf - a.gf
  })

  return (
    <div className="w-full overflow-x-auto rounded-sm bg-[#000000] border border-gray-800 shadow-xl">
      <Table className="w-full text-sm whitespace-nowrap">
        <TableHeader className="bg-[#0a0a0a] sticky top-0 z-10">
          <TableRow className="hover:bg-transparent border-gray-800">
            <TableHead className="w-12 text-center text-[10px] font-bold uppercase tracking-widest text-gray-400">Поз</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Клуб</TableHead>
            <TableHead className="text-center w-12 text-[10px] font-bold uppercase tracking-widest text-gray-400" title="Ігри">І</TableHead>
            <TableHead className="text-center w-12 text-[10px] font-bold uppercase tracking-widest text-gray-400" title="Перемоги">В</TableHead>
            <TableHead className="text-center w-12 text-[10px] font-bold uppercase tracking-widest text-gray-400" title="Нічиї">Н</TableHead>
            <TableHead className="text-center w-12 text-[10px] font-bold uppercase tracking-widest text-gray-400" title="Поразки">П</TableHead>
            <TableHead className="text-center w-12 hidden sm:table-cell text-[10px] font-bold uppercase tracking-widest text-gray-400" title="Забиті голи">ЗГ</TableHead>
            <TableHead className="text-center w-12 hidden sm:table-cell text-[10px] font-bold uppercase tracking-widest text-gray-400" title="Пропущені голи">ПГ</TableHead>
            <TableHead className="text-center w-12 text-[10px] font-bold uppercase tracking-widest text-gray-400" title="Різниця голів">РГ</TableHead>
            <TableHead className="text-center w-16 text-[10px] font-black uppercase tracking-widest text-[#CCFF00]" title="Очки">О</TableHead>
            <TableHead className="hidden md:table-cell text-center text-[10px] font-bold uppercase tracking-widest text-gray-400" title="Форма (останні 5 матчів)">Форма</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-800/40">
          {sortedStandings.map((row, index) => {
            const pos = index + 1
            let posClass = ""
            if (pos <= 4) posClass = "bg-[#1c1a1a] text-white font-bold border-l-4 border-l-blue-500" // Champions League
            else if (pos === 5) posClass = "bg-[#1c1a1a] text-white font-bold border-l-4 border-l-orange-500" // Europa League
            else if (pos >= sortedStandings.length - 2) posClass = "bg-[#1c1a1a] text-white font-bold border-l-4 border-l-red-500" // Relegation
            else posClass = "text-gray-300 font-medium border-l-4 border-l-transparent"

            return (
              <TableRow key={row.id} className="hover:bg-gray-900 transition-colors group border-gray-800/40">
                <TableCell className={cn("text-center", posClass)}>
                  {pos}
                </TableCell>
                <TableCell className="font-semibold text-white">
                  <Link href={`/teams/${row.team.id}`} className="flex items-center gap-3 uppercase group-hover:text-[#CCFF00] transition-colors">
                    <div className="w-8 h-8 rounded-sm bg-[#0a0a0a] border border-gray-800 flex items-center justify-center p-1.5 shrink-0">
                      {row.team.logo && <Image src={row.team.logo} alt={row.team.shortName} width={24} height={24} className="object-contain" />}
                    </div>
                    <span className="hidden sm:inline">{row.team.name}</span>
                    <span className="sm:hidden">{row.team.shortName}</span>
                  </Link>
                </TableCell>
                <TableCell className="text-center text-gray-400">{row.played}</TableCell>
                <TableCell className="text-center text-gray-400">{row.won}</TableCell>
                <TableCell className="text-center text-gray-400">{row.drawn}</TableCell>
                <TableCell className="text-center text-gray-400">{row.lost}</TableCell>
                <TableCell className="text-center text-gray-500 hidden sm:table-cell">{row.gf}</TableCell>
                <TableCell className="text-center text-gray-500 hidden sm:table-cell">{row.ga}</TableCell>
                <TableCell className="text-center text-gray-400">{row.gf - row.ga}</TableCell>
                <TableCell className="text-center font-black text-[#CCFF00] text-base">{row.points}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center justify-center gap-1.5">
                    {row.form.split(',').slice(0, 5).map((result, i) => {
                      const formMap: Record<string, string> = { W: 'В', D: 'Н', L: 'П' };
                      return (
                        <span
                          key={i}
                          className={cn(
                            "flex items-center justify-center w-5 h-5 rounded-sm text-[10px] font-bold text-white shadow-sm border border-gray-800",
                            getFormBadgeColor(result)
                          )}
                        >
                          {formMap[result] || result}
                        </span>
                      )
                    })}
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      
      {/* Legend */}
      <div className="bg-[#0a0a0a] p-4 border-t border-gray-800 flex flex-wrap gap-4 text-xs text-gray-400 font-bold uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-sm"></div> Ліга чемпіонів
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded-sm"></div> Ліга Європи
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-sm"></div> Виліт
        </div>
      </div>
    </div>
  )
}
