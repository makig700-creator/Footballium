import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "9");
    const skip = (page - 1) * limit;

    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          coverImage: true,
          publishedAt: true,
          viewsCount: true,
          author: { select: { name: true } },
          _count: { select: { likes: true } }
        },
      }),
      prisma.news.count({ where: { status: "PUBLISHED" } }),
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
    console.error("Failed to fetch news:", error);
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}

import { auth } from "@/lib/auth";
import { createNewsSchema } from "@/lib/validations/news";
import { generateSlug } from "@/lib/slug";
import { logActivity } from "@/lib/activity-logger";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const result = createNewsSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid data", details: result.error.issues },
        { status: 400 }
      );
    }

    const slug = await generateSlug(result.data.title);

    const news = await prisma.news.create({
      data: {
        title: result.data.title,
        slug,
        excerpt: result.data.excerpt,
        content: result.data.content,
        coverImage: result.data.coverImage,
        authorId: session?.user?.id as string,
        status: "DRAFT",
      },
    });

    await logActivity({
      userId: session?.user?.id as string,
      action: "CREATE_NEWS",
      entity: "News",
      entityId: news.id,
      metadata: { title: news.title },
    });

    return NextResponse.json(news, { status: 201 });
  } catch (error) {
    console.error("Failed to create news:", error);
    return NextResponse.json(
      { error: "Failed to create news" },
      { status: 500 }
    );
  }
}
