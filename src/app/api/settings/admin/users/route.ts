import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const where: any = {};
    if (role) where.role = role;

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        photo: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
