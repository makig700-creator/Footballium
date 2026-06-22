import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { MatchStatus } from "@prisma/client";
import { recalculateStandings, recalculatePlayerStats } from "@/lib/stats-calculator";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "REFEREE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const matchId = (await params).id;
    const match = await prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    if (match.refereeId && match.refereeId !== session.user?.id) {
      return NextResponse.json({ error: "Not assigned referee" }, { status: 403 });
    }

    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: {
        status: MatchStatus.FINISHED,
        finishedAt: new Date(),
      },
      include: {
        events: true,
      }
    });

    await pusherServer.trigger(`match-${matchId}`, 'match-updated', {
      status: updatedMatch.status,
      homeScore: updatedMatch.homeScore,
      awayScore: updatedMatch.awayScore,
      minute: updatedMatch.minute,
      events: updatedMatch.events,
    });
    
    await pusherServer.trigger('global', 'match-updated', { matchId });

    if (updatedMatch.tournamentId) {
      await recalculateStandings(updatedMatch.tournamentId);

      const lineup = await prisma.lineup.findUnique({
        where: { matchId },
        include: { slots: true }
      });
      if (lineup) {
        for (const slot of lineup.slots) {
          await recalculatePlayerStats(slot.playerId, updatedMatch.tournamentId);
        }
      }

      const updatedStandings = await prisma.tournamentStanding.findMany({
        where: { tournamentId: updatedMatch.tournamentId },
        orderBy: [
          { points: 'desc' },
          { goalDiff: 'desc' },
          { goalsFor: 'desc' }
        ],
        include: { Team: true }
      });
      await pusherServer.trigger(`tournament-${updatedMatch.tournamentId}`, 'standings-updated', {
        standings: updatedStandings
      });
    }

    return NextResponse.json(updatedMatch);
  } catch (error) {
    console.error("Error finishing match:", error);
    return NextResponse.json({ error: "Failed to finish match" }, { status: 500 });
  }
}
