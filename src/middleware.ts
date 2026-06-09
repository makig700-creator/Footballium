import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

const publicRoutes = ["/", "/auth/login", "/auth/register", "/auth/forgot-password", "/auth/reset-password"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Пропускаємо API та статичні файли
  if (pathname.startsWith("/api") || pathname.startsWith("/_next") || pathname.startsWith("/public") || pathname.includes(".")) {
    return NextResponse.next();
  }

  const refreshToken = req.cookies.get("refreshToken")?.value;
  let payload = null;

  if (refreshToken) {
    payload = await verifyToken(refreshToken, "refresh");
  }

  const isAuthPage = pathname.startsWith("/auth");

  // 1. Редирект авторизованого юзера зі сторінки входу
  if (payload && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 2. Якщо роут публічний - пускаємо
  if (publicRoutes.includes(pathname) || isAuthPage) {
    return NextResponse.next();
  }

  // 3. Якщо немає токена і роут захищений - редирект на логін
  if (!payload) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // 4. Перевірка ролей для захищених шляхів
  if (pathname.startsWith("/admin") && payload.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  if (pathname.startsWith("/coach") && payload.role !== "COACH") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  if (pathname.startsWith("/referee") && payload.role !== "REFEREE") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
