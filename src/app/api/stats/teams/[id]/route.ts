import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const teamId = (await params).id;
    const teamStandings = await prisma.tournamentStanding.findMany({
      where: { teamId },
      include: { Tournament: true }
    });
    
    // Aggregate global stats
    const globalStats = teamStandings.reduce((acc, standing) => {
      acc.played += standing.played;
      acc.won += standing.won;
      acc.drawn += standing.drawn;
      acc.lost += standing.lost;
      acc.goalsFor += standing.goalsFor;
      acc.goalsAgainst += standing.goalsAgainst;
      return acc;
    }, {
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0
    });

    // Get last 5 matches for form
    const lastMatches = await prisma.match.findMany({
      where: { 
        OR: [{ homeTeamId: teamId }, { awayTeamId: teamId }],
        status: "FINISHED"
      },
      orderBy: { finishedAt: 'desc' },
      take: 5
    });

    const form = lastMatches.map(match => {
      const isHome = match.homeTeamId === teamId;
      const teamScore = isHome ? match.homeScore! : match.awayScore!;
      const oppScore = isHome ? match.awayScore! : match.homeScore!;
      if (teamScore > oppScore) return 'W';
      if (teamScore === oppScore) return 'D';
      return 'L';
    });

    return NextResponse.json({
      global: globalStats,
      tournaments: teamStandings,
      form: form.reverse()
    });
  } catch (error) {
    console.error("Error fetching team stats:", error);
    return NextResponse.json({ error: "Failed to fetch team stats" }, { status: 500 });
  }
}
