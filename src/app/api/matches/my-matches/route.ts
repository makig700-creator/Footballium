import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Only REFEREE or ADMIN roles should have assigned matches,
    // but checking by refereeId is enough for security
    const matches = await prisma.match.findMany({
      where: {
        refereeId: session.user.id
      },
      include: {
        homeTeam: true,
        awayTeam: true,
        tournament: true
      },
      orderBy: {
        scheduledAt: 'asc'
      }
    });

    return NextResponse.json({ matches });
  } catch (error) {
    console.error("GET_MY_MATCHES_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
