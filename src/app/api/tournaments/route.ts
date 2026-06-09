import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createTournamentSchema } from "@/lib/validations/tournament";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where = status ? { status } : {};

    const [tournaments, total] = await Promise.all([
      prisma.tournament.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: { teams: { where: { status: "APPROVED" } } },
          },
        },
      }),
      prisma.tournament.count({ where }),
    ]);

    return NextResponse.json({
      tournaments,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const body = await req.json();
    const parsed = createTournamentSchema.safeParse(body);

    if (!parsed.success) {
      return new NextResponse(JSON.stringify(parsed.error.format()), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = parsed.data;

    const tournament = await prisma.tournament.create({
      data: {
        ...data,
        createdById: session.user.id!,
      },
    });

    return NextResponse.json(tournament, { status: 201 });
  } catch (error) {
    console.error("CREATE_TOURNAMENT_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
