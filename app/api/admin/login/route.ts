import { NextResponse } from "next/server";
import { createSessionToken, COOKIE_NAME } from "@/lib/admin-session";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error("Falta ADMIN_PASSWORD en las variables de entorno");
      return NextResponse.json({ error: "Error de configuración del servidor" }, { status: 500 });
    }

    if (password !== adminPassword) {
      return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
    }

    const token = await createSessionToken();
    const response = NextResponse.json({ success: true });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 horas
    });

    return response;
  } catch (error) {
    console.error("Error en login de admin:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}