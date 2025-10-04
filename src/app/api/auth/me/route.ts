import { NextResponse } from "next/server";
import { verifySession } from "../../../../lib/auth";

export async function GET() {
  const session = await verifySession();
  
  if (!session) {
    return NextResponse.json(
      { ok: false, authenticated: false },
      { status: 401 }
    );
  }

  return NextResponse.json({
    ok: true,
    authenticated: true,
    email: session.email,
  });
}
