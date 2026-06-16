import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        team: true
      }
    });

    const favorites = user?.team ? [{ team: user.team, teamId: user.team.id, userId: user.id }] : [];

    return NextResponse.json(favorites);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const body = await req.json();
    const { teamId } = body;

    if (!teamId) return new NextResponse("Team ID required", { status: 400 });

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        teamId
      }
    });

    const team = await prisma.team.findUnique({ where: { id: teamId } });

    return NextResponse.json({ team, teamId, userId: session.user.id });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
