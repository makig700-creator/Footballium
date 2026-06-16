import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const news = await prisma.news.update({
      where: { slug: params.slug, status: "PUBLISHED" },
      data: { viewsCount: { increment: 1 } },
      include: {
        author: { select: { name: true } },
      },
    });

    if (!news) {
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }

    return NextResponse.json(news);
  } catch (error) {
    console.error("Failed to fetch news details:", error);
    return NextResponse.json(
      { error: "Failed to fetch news details" },
      { status: 500 }
    );
  }
}
