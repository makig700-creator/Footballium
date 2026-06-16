import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const playerStats = await prisma.playerStats.findMany({
      where: { playerId: (await params).id },
      include: { Tournament: true }
    });
    
    // Aggregate global stats
    const globalStats = playerStats.reduce((acc, stat) => {
      acc.goals += stat.goals;
      acc.ownGoals += stat.ownGoals;
      acc.yellowCards += stat.yellowCards;
      acc.redCards += stat.redCards;
      acc.matchesPlayed += stat.matchesPlayed;
      acc.minutesPlayed += stat.minutesPlayed;
      return acc;
    }, {
      goals: 0,
      ownGoals: 0,
      yellowCards: 0,
      redCards: 0,
      matchesPlayed: 0,
      minutesPlayed: 0
    });

    return NextResponse.json({
      global: globalStats,
      tournaments: playerStats
    });
  } catch (error) {
    console.error("Error fetching player stats:", error);
    return NextResponse.json({ error: "Failed to fetch player stats" }, { status: 500 });
  }
}
