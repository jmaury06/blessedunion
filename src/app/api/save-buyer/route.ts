import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseService = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "dummy_url",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "dummy_key"
);

export async function POST(req: Request) {
  try {
    const { token, name, email, phone } = await req.json();

    if (!token || !name?.trim() || !email?.trim() || !phone?.trim()) {
      return NextResponse.json(
        { ok: false, error: "missing_fields" },
        { status: 400 }
      );
    }

    const { data: link, error: linkError } = await supabaseService
      .from("links")
      .select("token, active, expires_at")
      .eq("token", token)
      .single();

    if (linkError || !link) {
      return NextResponse.json(
        { ok: false, error: "link_not_found" },
        { status: 404 }
      );
    }

    if (!link.active) {
      return NextResponse.json(
        { ok: false, error: "link_inactive" },
        { status: 403 }
      );
    }

    if (link.expires_at && new Date(link.expires_at).getTime() < Date.now()) {
      return NextResponse.json(
        { ok: false, error: "link_expired" },
        { status: 403 }
      );
    }

    const { error } = await supabaseService
      .from("links")
      .update({ 
        buyer_name: name.trim(), 
        buyer_email: email.trim(), 
        buyer_phone: phone.trim() 
      })
      .eq("token", token);

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "internal_server_error" },
      { status: 500 }
    );
  }
}
