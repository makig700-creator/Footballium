import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { 
        id: true, 
        name: true, 
        email: true, 
        role: true,
        phone: true,
        photo: true,
        refereeCategory: true
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { name, phone, photo, refereeCategory } = body;

    const dataToUpdate: any = {};
    if (name !== undefined) dataToUpdate.name = name;
    if (phone !== undefined) dataToUpdate.phone = phone;
    if (photo !== undefined) dataToUpdate.photo = photo;
    if (refereeCategory !== undefined) dataToUpdate.refereeCategory = refereeCategory;

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: dataToUpdate,
      select: { 
        id: true, 
        name: true, 
        email: true, 
        role: true,
        phone: true,
        photo: true,
        refereeCategory: true
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
