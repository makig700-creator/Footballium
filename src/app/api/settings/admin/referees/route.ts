import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const referees = await prisma.user.findMany({
      where: { role: "REFEREE" },
      select: {
        id: true,
        name: true,
        email: true,
        photo: true,
        refereeCategory: true,
        matchesRefereed: {
          select: {
            id: true,
            scheduledAt: true,
            status: true,
            homeTeam: { select: { name: true } },
            awayTeam: { select: { name: true } },
          }
        }
      },
      orderBy: { name: "asc" }
    });

    return NextResponse.json(referees);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
