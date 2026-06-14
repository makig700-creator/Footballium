import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const standings = await prisma.tournamentStanding.findMany({
      include: { team: true }
    });

    const teamMap = new Map<string, any>();
    for (const st of standings) {
      if (!teamMap.has(st.teamId)) {
        teamMap.set(st.teamId, {
          team: st.team,
          played: 0,
          won: 0,
          points: 0
        });
      }
      const t = teamMap.get(st.teamId);
      t.played += st.played;
      t.won += st.won;
      t.points += st.points;
    }

    const topTeams = Array.from(teamMap.values())
      .filter(t => t.played > 0)
      .map(t => ({
        ...t,
        winRate: (t.won / t.played) * 100
      }))
      .sort((a, b) => b.winRate - a.winRate || b.points - a.points)
      .slice(0, 10);

    return NextResponse.json(topTeams);
  } catch (error) {
    console.error("Error fetching global top teams:", error);
    return NextResponse.json({ error: "Failed to fetch global top teams" }, { status: 500 });
  }
}
