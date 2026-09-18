import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "./utils/supabase/middleware";
import { COOKIE_NAME, isValidSessionToken } from "@/lib/admin-session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas del panel de admin: sesión propia, no pasan por Supabase
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (pathname === "/admin/login" || pathname === "/api/admin/login") {
      return NextResponse.next();
    }

    const token = request.cookies.get(COOKIE_NAME)?.value;
    const valid = await isValidSessionToken(token);

    if (!valid) {
      if (pathname.startsWith("/api/admin")) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    return NextResponse.next();
  }

  // Resto del sitio: sesión de Supabase para clientes, como ya tenías
  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};