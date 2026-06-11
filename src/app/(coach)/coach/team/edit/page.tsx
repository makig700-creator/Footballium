import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { TeamForm } from './TeamForm'

export default async function EditTeamPage() {
  const session = await auth()
  if (!session || !session.user || (session.user as any).role !== 'COACH') redirect('/')

  const team = await prisma.team.findUnique({
    where: { coachId: session.user.id }
  })

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-8">
        {team ? 'Редагувати команду' : 'Створити команду'}
      </h1>
      <TeamForm initialData={team} />
    </div>
  )
}
