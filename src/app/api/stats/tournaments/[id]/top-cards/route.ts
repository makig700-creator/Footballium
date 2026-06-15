import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cards = await prisma.playerStats.findMany({
      where: { 
        tournamentId: (await params).id,
        OR: [
          { yellowCards: { gt: 0 } },
          { redCards: { gt: 0 } }
        ]
      },
      orderBy: [
        { redCards: 'desc' },
        { yellowCards: 'desc' }
      ],
      take: 10,
      include: { 
        player: { include: { team: true } }
      }
    });
    return NextResponse.json(cards);
  } catch (error) {
    console.error("Error fetching top cards:", error);
    return NextResponse.json({ error: "Failed to fetch top cards" }, { status: 500 });
  }
}
