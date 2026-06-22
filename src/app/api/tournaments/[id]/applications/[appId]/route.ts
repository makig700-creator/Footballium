import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ id: string; appId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const params = await props.params;
    const body = await req.json();
    const { action } = body; // "approve" or "reject"

    if (action !== "approve" && action !== "reject") {
      return new NextResponse("Invalid action. Must be 'approve' or 'reject'.", { status: 400 });
    }

    const status = action === "approve" ? "APPROVED" : "REJECTED";

    if (status === "APPROVED") {
      const tournament = await prisma.tournament.findUnique({
        where: { id: params.id },
        include: {
          _count: {
            select: {
              teams: { where: { status: "APPROVED" } }
            }
          }
        }
      });

      if (!tournament) {
        return new NextResponse("Tournament not found", { status: 404 });
      }

      if (tournament._count.teams >= tournament.maxTeams) {
        return new NextResponse("Ліміт команд у турнірі вичерпано. Ви не можете прийняти більше команд.", { status: 400 });
      }
    }

    const application = await prisma.tournamentTeam.update({
      where: { id: params.appId },
      data: {
        status,
        reviewedAt: new Date(),
        reviewedById: session.user!.id,
      },
    });

    return NextResponse.json(application);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ id: string; appId: string }> }
) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;
    const userId = session?.user?.id;

    if (!session || role !== "COACH" || !userId) {
      return new NextResponse("Unauthorized. Must be a coach.", { status: 403 });
    }

    const params = await props.params;

    const team = await prisma.team.findUnique({
      where: { coachId: userId },
    });

    if (!team) {
      return new NextResponse("Must create a team first.", { status: 400 });
    }

    const application = await prisma.tournamentTeam.findUnique({
      where: { id: params.appId },
    });

    if (!application) {
      return new NextResponse("Application not found", { status: 404 });
    }

    if (application.teamId !== team.id) {
      return new NextResponse("Unauthorized. You can only withdraw your own team's application.", { status: 403 });
    }

    if (application.status !== "PENDING") {
      return new NextResponse("Can only withdraw PENDING applications.", { status: 400 });
    }

    await prisma.tournamentTeam.delete({
      where: { id: params.appId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
