import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { PlayerForm } from '../PlayerForm'

export default async function NewPlayerPage() {
  const session = await auth()
  if (!session || !session.user || (session.user as any).role !== 'COACH') redirect('/')

  const team = await prisma.team.findUnique({
    where: { coachId: session.user.id }
  })

  if (!team) {
    redirect('/coach/team/edit')
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-8">
        Додати гравця
      </h1>
      <PlayerForm teamId={team.id} />
    </div>
  )
}
