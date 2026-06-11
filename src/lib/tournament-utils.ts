import { prisma } from './prisma'

export type ApplicationStatusResult = {
  status: string | null
  appId: string | null
  hasTeam: boolean
  teamId: string | null
}

export async function getApplicationStatus(tournamentId: string, coachId: string): Promise<ApplicationStatusResult> {
  const team = await prisma.team.findUnique({
    where: { coachId }
  })

  if (!team) {
    return {
      status: null,
      appId: null,
      hasTeam: false,
      teamId: null
    }
  }

  const application = await prisma.tournamentTeam.findUnique({
    where: {
      tournamentId_teamId: {
        tournamentId,
        teamId: team.id
      }
    }
  })

  return {
    status: application?.status || null,
    appId: application?.id || null,
    hasTeam: true,
    teamId: team.id
  }
}
