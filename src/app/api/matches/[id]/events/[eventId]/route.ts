import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { EventType } from "@prisma/client";
import { recalculateMatchStats, recalculateStandings, recalculatePlayerStats } from "@/lib/stats-calculator";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string, eventId: string }> }
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

    const event = await prisma.matchEvent.findUnique({
      where: { id: (await params).eventId },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    await prisma.matchEvent.delete({
      where: { id: (await params).eventId },
    });

    // Update match score using stats calculator
    await recalculateMatchStats(matchId);
    
    const updatedMatch = await prisma.match.findUnique({
      where: { id: matchId },
    }) || match;

    if (updatedMatch.tournamentId) {
      await recalculateStandings(updatedMatch.tournamentId);
      if (event.playerId) {
        await recalculatePlayerStats(event.playerId, updatedMatch.tournamentId);
      }
      
      const updatedStandings = await prisma.tournamentStanding.findMany({
        where: { tournamentId: updatedMatch.tournamentId },
        orderBy: [
          { points: 'desc' },
          { goalDiff: 'desc' },
          { goalsFor: 'desc' }
        ],
        include: { team: true }
      });
      await pusherServer.trigger(`tournament-${updatedMatch.tournamentId}`, 'standings-updated', {
        standings: updatedStandings
      });
    }

    // Fetch all remaining events
    const allEvents = await prisma.matchEvent.findMany({
      where: { matchId },
      orderBy: { createdAt: "desc" },
    });

    await pusherServer.trigger(`match-${matchId}`, 'match-updated', {
      status: updatedMatch.status,
      homeScore: updatedMatch.homeScore,
      awayScore: updatedMatch.awayScore,
      minute: updatedMatch.minute,
      events: allEvents,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting match event:", error);
    return NextResponse.json({ error: "Failed to delete match event" }, { status: 500 });
  }
}
