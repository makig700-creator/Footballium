import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const tournamentId = searchParams.get("tournamentId");
    const teamId = searchParams.get("teamId");

    const where: any = {};

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      where.kickoff = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    if (tournamentId) {
      where.tournamentId = tournamentId;
    }

    if (teamId) {
      where.OR = [
        { homeTeamId: teamId },
        { awayTeamId: teamId }
      ];
    }

    const matches = await prisma.match.findMany({
      where,
      include: {
        homeTeam: true,
        awayTeam: true,
        tournament: true,
      },
      orderBy: { kickoff: "asc" }
    });

    return NextResponse.json(matches);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
