import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { EventType } from "@prisma/client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const events = await prisma.matchEvent.findMany({
      where: { matchId: (await params).id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

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

    if (match.status !== "LIVE") {
      return NextResponse.json({ error: "Match is not live" }, { status: 400 });
    }

    const body = await request.json();
    const { type, minute, teamId, playerId, playerOutId, comment } = body;

    const event = await prisma.matchEvent.create({
      data: {
        matchId,
        type,
        minute: minute || match.minute || 0,
        teamId,
        playerId,
        playerOutId,
        comment,
      },
    });

    // Update match score if necessary
    let homeScore = match.homeScore || 0;
    let awayScore = match.awayScore || 0;
    let scoreChanged = false;

    if (type === EventType.GOAL || type === EventType.PENALTY_GOAL) {
      if (teamId === match.homeTeamId) {
        homeScore += 1;
        scoreChanged = true;
      } else if (teamId === match.awayTeamId) {
        awayScore += 1;
        scoreChanged = true;
      }
    } else if (type === EventType.OWN_GOAL) {
      if (teamId === match.homeTeamId) {
        awayScore += 1; // Own goal by home team gives point to away
        scoreChanged = true;
      } else if (teamId === match.awayTeamId) {
        homeScore += 1; // Own goal by away team gives point to home
        scoreChanged = true;
      }
    }

    let updatedMatch = match;
    if (scoreChanged) {
      updatedMatch = await prisma.match.update({
        where: { id: matchId },
        data: { homeScore, awayScore },
      });
    }

    // Fetch all events for Pusher update
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

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error creating match event:", error);
    return NextResponse.json({ error: "Failed to create match event" }, { status: 500 });
  }
}
