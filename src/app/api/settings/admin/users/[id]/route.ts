import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-logger";

export async function PATCH(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const params = await props.params;
    const body = await req.json();
    const { role, name } = body;

    const targetUser = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!targetUser) return new NextResponse("Користувача не знайдено", { status: 404 });

    // Prevent demoting the last admin
    if (role && role !== "ADMIN" && targetUser.role === "ADMIN") {
      const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
      if (adminCount <= 1) {
        return new NextResponse("Неможливо змінити роль єдиного адміністратора", { status: 400 });
      }
    }

    const dataToUpdate: any = {};
    if (role !== undefined) dataToUpdate.role = role;
    if (name !== undefined) dataToUpdate.name = name;

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: dataToUpdate,
    });

    if (role !== undefined && role !== targetUser.role) {
      await logActivity({
        userId: session.user?.id as string,
        action: "USER_ROLE_CHANGED",
        entity: "User",
        entityId: targetUser.id,
        metadata: { oldRole: targetUser.role, newRole: role, targetName: targetUser.name }
      });
    }

    if (name !== undefined && name !== targetUser.name) {
      await logActivity({
        userId: session.user?.id as string,
        action: "USER_NAME_CHANGED",
        entity: "User",
        entityId: targetUser.id,
        metadata: { oldName: targetUser.name, newName: name, targetName: name }
      });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
