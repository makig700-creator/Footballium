import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { refereeId } = await request.json();

    const match = await prisma.match.update({
      where: { id: (await params).id },
      data: { refereeId },
      include: {
        referee: true,
      },
    });

    return NextResponse.json(match);
  } catch (error) {
    console.error("Error assigning referee:", error);
    return NextResponse.json(
      { error: "Failed to assign referee" },
      { status: 500 }
    );
  }
}
