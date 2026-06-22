import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { id } = await props.params;
    const body = await req.json();
    const { kickoff } = body;

    if (!kickoff) {
      return new NextResponse("Kickoff time is required", { status: 400 });
    }

    const match = await prisma.match.update({
      where: { id },
      data: { kickoff: new Date(kickoff) },
    });

    return NextResponse.json(match);
  } catch (error) {
    console.error("UPDATE_KICKOFF_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
