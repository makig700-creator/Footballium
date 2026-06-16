import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const stats = await prisma.playerStats.findMany({
      where: { goals: { gt: 0 } },
      include: { player: { include: { team: true } }, Tournament: true }
    });

    const playerMap = new Map<string, any>();
    for (const stat of stats) {
      if (!playerMap.has(stat.playerId)) {
        playerMap.set(stat.playerId, {
          player: stat.player,
          goals: 0,
          matchesPlayed: 0
        });
      }
      const p = playerMap.get(stat.playerId);
      p.goals += stat.goals;
      p.matchesPlayed += stat.matchesPlayed;
    }

    const topScorers = Array.from(playerMap.values())
      .sort((a, b) => b.goals - a.goals || a.matchesPlayed - b.matchesPlayed)
      .slice(0, 10);

    return NextResponse.json(topScorers);
  } catch (error) {
    console.error("Error fetching global top scorers:", error);
    return NextResponse.json({ error: "Failed to fetch global top scorers" }, { status: 500 });
  }
}
