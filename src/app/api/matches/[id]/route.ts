import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const matchId = (await params).id;
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        homeTeam: {
          include: {
            players: true,
          }
        },
        awayTeam: {
          include: {
            players: true,
          }
        },
        events: {
          orderBy: { createdAt: 'desc' }
        },
        tournament: true,
        referee: {
          select: { id: true, name: true }
        }
      }
    });

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    return NextResponse.json(match);
  } catch (error) {
    console.error("Error fetching match details:", error);
    return NextResponse.json({ error: "Failed to fetch match details" }, { status: 500 });
  }
}
