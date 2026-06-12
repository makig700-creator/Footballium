import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MatchStatus } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const statusParams = searchParams.get("status");
    const tournamentId = searchParams.get("tournamentId");
    const date = searchParams.get("date");

    const where: any = {};

    if (statusParams) {
      const statuses = statusParams.split('|') as MatchStatus[];
      where.status = { in: statuses };
    }

    if (tournamentId) {
      where.tournamentId = tournamentId;
    }

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      
      where.kickoff = {
        gte: startDate,
        lt: endDate,
      };
    }

    const matches = await prisma.match.findMany({
      where,
      include: {
        homeTeam: true,
        awayTeam: true,
        tournament: true,
      },
      orderBy: { kickoff: 'asc' },
    });

    return NextResponse.json(matches);
  } catch (error) {
    console.error("Error fetching matches:", error);
    return NextResponse.json({ error: "Failed to fetch matches" }, { status: 500 });
  }
}
