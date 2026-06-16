import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return new NextResponse("Заповніть всі поля", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) return new NextResponse("Користувача не знайдено", { status: 404 });

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return new NextResponse("Неправильний поточний пароль", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("PASSWORD CHANGE ERROR:", error);
    return new NextResponse(error.message || "Internal Error", { status: 500 });
  }
}
