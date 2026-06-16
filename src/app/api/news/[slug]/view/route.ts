import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const news = await prisma.news.findFirst({
      where: { slug, status: "PUBLISHED" },
      select: { id: true },
    });

    if (!news) {
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }

    const cookieStore = await cookies();
    const viewCookieName = `viewed_news_${news.id}`;
    
    if (!cookieStore.has(viewCookieName)) {
      await prisma.news.update({
        where: { id: news.id },
        data: { viewsCount: { increment: 1 } },
      });

      cookieStore.set(viewCookieName, 'true', {
        maxAge: 60 * 60 * 24, // 24 hours
        httpOnly: true,
        path: '/',
      });
      
      return NextResponse.json({ viewed: true, action: "incremented" });
    }

    return NextResponse.json({ viewed: true, action: "already_viewed" });
  } catch (error) {
    console.error("Failed to track view:", error);
    return NextResponse.json(
      { error: "Failed to track view" },
      { status: 500 }
    );
  }
}
