import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const [news, total] = await Promise.all([
      prisma.news.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          author: { select: { name: true } },
          _count: { select: { likes: true } }
        },
      }),
      prisma.news.count(),
    ]);

    return NextResponse.json({
      data: news,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Failed to fetch admin news:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin news" },
      { status: 500 }
    );
  }
}
