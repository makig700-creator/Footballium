import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { logActivity } from "@/lib/activity-logger";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const news = await prisma.news.update({
      where: { id },
      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });

    await logActivity({
      userId: session.user.id as string,
      action: "PUBLISH_NEWS",
      entity: "News",
      entityId: news.id,
      metadata: { title: news.title },
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error("Failed to publish news:", error);
    return NextResponse.json(
      { error: "Failed to publish news" },
      { status: 500 }
    );
  }
}
