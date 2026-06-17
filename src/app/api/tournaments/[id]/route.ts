import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateTournamentSchema } from "@/lib/validations/tournament";

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const tournament = await prisma.tournament.findUnique({
      where: { id: params.id },
      include: {
        teams: {
          include: { team: true },
        },
        _count: {
          select: { teams: { where: { status: "APPROVED" } } },
        },
      },
    });

    if (!tournament) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(tournament);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const params = await props.params;
    const body = await req.json();
    const parsed = updateTournamentSchema.safeParse(body);

    if (!parsed.success) {
      return new NextResponse(JSON.stringify(parsed.error.format()), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const tournament = await prisma.tournament.update({
      where: { id: params.id },
      data: parsed.data,
    });

    return NextResponse.json(tournament);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const params = await props.params;
    const tournament = await prisma.tournament.findUnique({
      where: { id: params.id },
    });

    if (!tournament) {
      return new NextResponse("Not Found", { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.tournament.delete({
        where: { id: params.id },
      });
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE_TOURNAMENT_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
