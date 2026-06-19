import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { RefereeMatchClient } from "./RefereeMatchClient"

export default async function RefereeMatchPage(props: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || (session.user as any).role !== "REFEREE") {
    redirect('/')
  }

  const params = await props.params;

  const match = await prisma.match.findUnique({
    where: { id: params.id },
    include: {
      homeTeam: {
        include: { players: true }
      },
      awayTeam: {
        include: { players: true }
      },
      events: {
        orderBy: { createdAt: "desc" }
      },
      lineup: {
        include: {
          slots: {
            include: { player: true }
          }
        }
      }
    }
  })

  if (!match) return notFound()

  if (match.refereeId && match.refereeId !== session.user?.id) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold text-red-500">Ви не призначені суддею на цей матч</h1>
      </div>
    )
  }

  return <RefereeMatchClient match={match} />
}
