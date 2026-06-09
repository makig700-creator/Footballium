import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { resetPasswordSchema } from "@/lib/validations/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, password } = body;

    if (!token) {
      return NextResponse.json({ error: "Токен відсутній" }, { status: 400 });
    }

    const { password: validPassword } = resetPasswordSchema.parse({ password });

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpiry: { gte: new Date() }, // Still valid
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Недійсний або прострочений токен" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(validPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpiry: null,
      },
    });

    return NextResponse.json({ message: "Пароль успішно змінено" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Помилка сервера" }, { status: 500 });
  }
}
