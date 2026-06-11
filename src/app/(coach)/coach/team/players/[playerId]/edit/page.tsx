import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { PlayerForm } from '../../PlayerForm'

export default async function EditPlayerPage({ params }: { params: Promise<{ playerId: string }> }) {
  const resolvedParams = await params;
  const session = await auth()
  if (!session || !session.user || (session.user as any).role !== 'COACH') redirect('/')

  const team = await prisma.team.findUnique({
    where: { coachId: session.user.id }
  })

  if (!team) {
    redirect('/coach/team')
  }

  const player = await prisma.player.findUnique({
    where: { id: resolvedParams.playerId }
  })

  if (!player || player.teamId !== team.id) {
    redirect('/coach/team')
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-8">
        Редагувати гравця
      </h1>
      <PlayerForm teamId={team.id} initialData={player} />
    </div>
  )
}
