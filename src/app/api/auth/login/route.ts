import { NextResponse } from "next/server";
import { createSession, verifyCredentials } from "../../../../lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: "Email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    // Verificar credenciales
    if (!verifyCredentials(email, password)) {
      return NextResponse.json(
        { ok: false, error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // Crear sesión
    await createSession(email);

    return NextResponse.json({
      ok: true,
      message: "Login exitoso",
    });
  } catch (error: any) {
    console.error("[AUTH] Error en login:", error);
    return NextResponse.json(
      { ok: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
