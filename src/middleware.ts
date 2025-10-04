import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Proteger rutas de admin
  if (path.startsWith("/admin")) {
    const session = request.cookies.get("session")?.value;
    const sessionData = await decrypt(session);

    if (!sessionData?.email) {
      // No hay sesión válida, redirigir a login (mismo admin page mostrará el form)
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
