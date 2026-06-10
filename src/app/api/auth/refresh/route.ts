import { NextResponse } from "next/server";
import { verifyToken, signToken } from "@/lib/jwt";

export async function POST(req: Request) {
  // Read refreshToken from cookies
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(/refreshToken=([^;]+)/);
  const refreshToken = match ? match[1] : null;

  if (!refreshToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await verifyToken(refreshToken, "refresh");
  if (!payload) {
    return NextResponse.json({ error: "Invalid or expired refresh token" }, { status: 401 });
  }

  const newAccessToken = await signToken({ userId: payload.userId, role: payload.role }, "access");

  return NextResponse.json({ accessToken: newAccessToken });
}
