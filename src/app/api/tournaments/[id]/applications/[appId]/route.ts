import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ id: string; appId: string }> }
) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const params = await props.params;
    const body = await req.json();
    const { action } = body; // "approve" or "reject"

    if (action !== "approve" && action !== "reject") {
      return new NextResponse("Invalid action. Must be 'approve' or 'reject'.", { status: 400 });
    }

    const status = action === "approve" ? "APPROVED" : "REJECTED";

    const application = await prisma.tournamentTeam.update({
      where: { id: params.appId },
      data: {
        status,
        reviewedAt: new Date(),
        reviewedById: session.user.id,
      },
    });

    return NextResponse.json(application);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
