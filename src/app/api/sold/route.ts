import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "dummy_url",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy_key"
);

export async function GET() {
  const { data, error } = await supabase
    .from("purchases")
    .select("number, buyer_name, buyer_email, buyer_phone");

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, sold: data });
}
