import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  _req: Request,
  context: { params: Promise<{ token: string }> }
) {
  const { token } = await context.params;

  const { data, error } = await supabase
    .from("links")
    .select(
      "token, opportunities, remaining, active, buyer_name, buyer_email, buyer_phone, expires_at"
    )
    .eq("token", token)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { ok: false, error: "link_not_found" },
      { status: 404 }
    );
  }

  if (!data.active) {
    return NextResponse.json(
      { ok: false, error: "link_inactive" },
      { status: 403 }
    );
  }

  if (data.expires_at && new Date(data.expires_at).getTime() < Date.now()) {
    return NextResponse.json(
      { ok: false, error: "link_expired" },
      { status: 403 }
    );
  }

  return NextResponse.json({ ok: true, link: data });
}
