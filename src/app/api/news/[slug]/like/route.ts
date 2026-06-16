import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const session = await auth();

    const news = await prisma.news.findUnique({
      where: { slug },
      select: { 
        id: true,
        _count: { select: { likes: true } },
      },
    });

    if (!news) {
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }

    let isLiked = false;
    if (session?.user?.id) {
      const existingLike = await prisma.newsLike.findUnique({
        where: {
          newsId_userId: {
            newsId: news.id,
            userId: session?.user?.id as string,
          },
        },
      });
      isLiked = !!existingLike;
    }

    return NextResponse.json({
      likesCount: news._count.likes,
      isLiked,
    });
  } catch (error) {
    console.error("Failed to fetch likes:", error);
    return NextResponse.json(
      { error: "Failed to fetch likes" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const news = await prisma.news.findFirst({
      where: { slug, status: "PUBLISHED" },
      select: { id: true },
    });

    if (!news) {
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }

    const existingLike = await prisma.newsLike.findUnique({
      where: {
        newsId_userId: {
          newsId: news.id,
          userId: session?.user?.id as string,
        },
      },
    });

    if (existingLike) {
      // Unlike
      await prisma.newsLike.delete({
        where: { id: existingLike.id },
      });
      return NextResponse.json({ action: "unliked" }, { status: 200 });
    } else {
      // Like
      await prisma.newsLike.create({
        data: {
          newsId: news.id,
          userId: session?.user?.id as string,
        },
      });
      return NextResponse.json({ action: "liked" }, { status: 201 });
    }
  } catch (error) {
    console.error("Failed to toggle like:", error);
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    );
  }
}
