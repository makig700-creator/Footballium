import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ViewerMatchClient } from "./ViewerMatchClient"

export default async function PublicMatchPage(props: { params: Promise<{ id: string }> }) {
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
      tournament: true,
      referee: {
        select: { id: true, name: true }
      }
    }
  })

  if (!match) return notFound()

  return <ViewerMatchClient initialMatch={match} />
}
