import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabaseService = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "dummy_url",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "dummy_key"
);

export async function POST(req: Request) {
  const { opportunities } = await req.json();

  if (![2, 4, 6, 8, 10].includes(opportunities)) {
    return NextResponse.json(
      { ok: false, error: "invalid_opportunities" },
      { status: 400 }
    );
  }

  const token = crypto.randomBytes(6).toString("hex");
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

  const { error } = await supabaseService.from("links").insert([
    {
      token,
      opportunities,
      remaining: opportunities,
      active: true,
      expires_at: expiresAt,
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
    token: token,
  });
}
