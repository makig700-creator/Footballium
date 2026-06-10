import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validations/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = forgotPasswordSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Don't leak whether the email exists
      return NextResponse.json({ message: "Якщо email існує, ми відправили на нього посилання для скидання паролю" }, { status: 200 });
    }

    // Generate token
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 1); // 1 hour validity

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: token,
        resetPasswordExpiry: expiry,
      },
    });

    // In a real app, send email here
    console.log(`[Email Mock] Reset link for ${email}: http://localhost:3000/reset-password?token=${token}`);

    return NextResponse.json({ message: "Якщо email існує, ми відправили на нього посилання для скидання паролю" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Помилка валідації" }, { status: 400 });
  }
}
