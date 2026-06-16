import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "COACH") {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const body = await req.json();
    const { logo, primaryColor, secondaryColor } = body;

    const team = await prisma.team.findUnique({
      where: { coachId: session.user.id }
    });

    if (!team) {
      return new NextResponse("Team not found", { status: 404 });
    }

    const dataToUpdate: any = {};
    if (logo !== undefined) dataToUpdate.logo = logo;
    if (primaryColor !== undefined) dataToUpdate.primaryColor = primaryColor;
    if (secondaryColor !== undefined) dataToUpdate.secondaryColor = secondaryColor;

    const updatedTeam = await prisma.team.update({
      where: { id: team.id },
      data: dataToUpdate,
    });

    return NextResponse.json(updatedTeam);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
