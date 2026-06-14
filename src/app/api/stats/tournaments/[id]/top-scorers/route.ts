import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const scorers = await prisma.playerStats.findMany({
      where: { tournamentId: (await params).id, goals: { gt: 0 } },
      orderBy: [
        { goals: 'desc' },
        { matchesPlayed: 'asc' }
      ],
      take: 10,
      include: { 
        player: { include: { team: true } }
      }
    });
    return NextResponse.json(scorers);
  } catch (error) {
    console.error("Error fetching top scorers:", error);
    return NextResponse.json({ error: "Failed to fetch top scorers" }, { status: 500 });
  }
}
