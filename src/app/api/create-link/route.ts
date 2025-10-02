import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabaseService = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { opportunities } = await req.json();

  if (![2, 4, 6, 8, 10].includes(opportunities)) {
    return NextResponse.json(
      { ok: false, error: "invalid_opportunities" },
      { status: 400 }
    );
  }

  // generar token encriptado
  const token = crypto.randomBytes(6).toString("hex"); // ej: "a1b2c3d4e5f6"

  const { error } = await supabaseService.from("links").insert([
    {
      token,
      opportunities,
      remaining: opportunities,
      active: true,
    },
  ]);

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    link: `${process.env.NEXT_PUBLIC_BASE_URL}/${token}`,
  });
}
