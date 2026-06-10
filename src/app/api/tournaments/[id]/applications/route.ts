import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const params = await props.params;
    const applications = await prisma.tournamentTeam.findMany({
      where: { tournamentId: params.id },
      include: {
        team: true,
      },
      orderBy: { appliedAt: "desc" },
    });

    return NextResponse.json(applications);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;
    const teamId = (session?.user as any)?.teamId;

    if (!session || role !== "COACH" || !teamId) {
      return new NextResponse("Unauthorized. Must be a coach of a team.", { status: 403 });
    }

    const params = await props.params;

    const tournament = await prisma.tournament.findUnique({
      where: { id: params.id },
    });

    if (!tournament) {
      return new NextResponse("Tournament not found", { status: 404 });
    }

    if (tournament.status !== "REGISTRATION") {
      return new NextResponse("Tournament is not open for registration", { status: 400 });
    }

    const existingApplication = await prisma.tournamentTeam.findUnique({
      where: {
        tournamentId_teamId: {
          tournamentId: params.id,
          teamId,
        },
      },
    });

    if (existingApplication) {
      return new NextResponse("Team has already applied to this tournament", { status: 400 });
    }

    const application = await prisma.tournamentTeam.create({
      data: {
        tournamentId: params.id,
        teamId,
        status: "PENDING",
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
