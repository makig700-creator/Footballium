import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { EventType } from "@prisma/client";

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

    // Rollback score if it was a goal
    let homeScore = match.homeScore || 0;
    let awayScore = match.awayScore || 0;
    let scoreChanged = false;

    if (event.type === EventType.GOAL || event.type === EventType.PENALTY_GOAL) {
      if (event.teamId === match.homeTeamId) {
        homeScore = Math.max(0, homeScore - 1);
        scoreChanged = true;
      } else if (event.teamId === match.awayTeamId) {
        awayScore = Math.max(0, awayScore - 1);
        scoreChanged = true;
      }
    } else if (event.type === EventType.OWN_GOAL) {
      if (event.teamId === match.homeTeamId) {
        awayScore = Math.max(0, awayScore - 1);
        scoreChanged = true;
      } else if (event.teamId === match.awayTeamId) {
        homeScore = Math.max(0, homeScore - 1);
        scoreChanged = true;
      }
    }

    await prisma.matchEvent.delete({
      where: { id: (await params).eventId },
    });

    let updatedMatch = match;
    if (scoreChanged) {
      updatedMatch = await prisma.match.update({
        where: { id: matchId },
        data: { homeScore, awayScore },
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
