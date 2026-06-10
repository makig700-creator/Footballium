import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateRoundRobin, generateSingleElimination } from "@/lib/brackets";

export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const params = await props.params;
    const tournament = await prisma.tournament.findUnique({
      where: { id: params.id },
      include: {
        teams: {
          where: { status: "APPROVED" },
        },
      },
    });

    if (!tournament) {
      return new NextResponse("Tournament not found", { status: 404 });
    }

    if (tournament.status !== "REGISTRATION") {
      return new NextResponse("Tournament must be in REGISTRATION status to generate bracket", { status: 400 });
    }

    if (tournament.teams.length < tournament.minTeams) {
      return new NextResponse(
        `Not enough approved teams. Need at least ${tournament.minTeams}, got ${tournament.teams.length}.`,
        { status: 400 }
      );
    }

    const teamIds = tournament.teams.map((t) => t.teamId);
    let matchesData;

    if (tournament.bracketType === "ROUND_ROBIN") {
      matchesData = generateRoundRobin(teamIds, tournament.id);
    } else if (tournament.bracketType === "SINGLE_ELIMINATION") {
      matchesData = generateSingleElimination(teamIds, tournament.id);
    } else {
      return new NextResponse(`Bracket type ${tournament.bracketType} is not implemented yet.`, { status: 400 });
    }

    // Wrap in a transaction: Create matches and update status
    await prisma.$transaction([
      prisma.match.createMany({
        data: matchesData,
      }),
      prisma.tournament.update({
        where: { id: tournament.id },
        data: { status: "ONGOING" },
      }),
    ]);

    return NextResponse.json({ success: true, message: "Bracket generated successfully." });
  } catch (error) {
    console.error("GENERATE_BRACKET_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
