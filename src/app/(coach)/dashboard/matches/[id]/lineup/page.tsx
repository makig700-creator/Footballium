import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import { LineupBuilder } from '@/components/dashboard/LineupBuilder'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function LineupPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || !session.user || (session.user as any).role !== 'COACH') redirect('/auth/login')

  const teamId = (session.user as any).teamId
  const resolvedParams = await params
  const matchId = resolvedParams.id

  const [match, players, existingLineup] = await Promise.all([
    prisma.match.findUnique({
      where: { id: matchId },
      include: { homeTeam: true, awayTeam: true, tournament: true }
    }),
    prisma.player.findMany({
      where: { teamId },
      orderBy: [{ position: 'asc' }, { number: 'asc' }]
    }),
    prisma.lineup.findUnique({
      where: { matchId },
      include: { slots: true }
    })
  ])

  if (!match) notFound()

  const format = (match.tournament as any)?.format || '11x11'

  // Prepare initial data if lineup exists
  let initialLineup = undefined
  if (existingLineup) {
    initialLineup = {
      matchId,
      formation: existingLineup.formation as any,
      starters: existingLineup.slots.filter(s => s.isStarter).map(s => ({
        playerId: s.playerId,
        slotLabel: s.slotLabel,
        order: s.order
      })).sort((a, b) => a.order - b.order),
      substitutes: existingLineup.slots.filter(s => !s.isStarter).map(s => ({
        playerId: s.playerId,
        slotLabel: s.slotLabel,
        order: s.order
      })).sort((a, b) => a.order - b.order),
    }
  }

  const isHome = match.homeTeamId === teamId
  const opponent = isHome ? match.awayTeam : match.homeTeam

  const playersWithNames = players.map(p => ({
    ...p,
    name: `${p.firstName} ${p.lastName}`.trim()
  }))

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs text-[#CCFF00] font-black uppercase tracking-widest hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Назад до панелі
      </Link>
      
      <div className="border-b border-gray-900 pb-8">
        <h1 className="text-3xl font-black text-white tracking-tight uppercase">Налаштувати склад</h1>
        <p className="text-[#CCFF00] font-bold text-xs uppercase tracking-widest mt-2">проти {opponent?.name || 'TBD'} • {match.venue}</p>
      </div>

      <LineupBuilder matchId={matchId} players={playersWithNames as any} initialLineup={initialLineup} format={format} />
    </div>
  )
}
