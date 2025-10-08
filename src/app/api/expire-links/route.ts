import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseService = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "dummy_url",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "dummy_key"
);

/**
 * API endpoint para marcar como inactivos todos los links expirados
 * Puede ser llamado por un cron job externo (Vercel Cron, GitHub Actions, etc.)
 */
export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 }
    );
  }

  const { data, error } = await supabaseService
    .from("links")
    .update({ active: false })
    .eq("active", true)
    .lt("expires_at", new Date().toISOString())
    .select("token");

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    expired_count: data?.length || 0,
    expired_tokens: data?.map((d) => d.token) || [],
  });
}
