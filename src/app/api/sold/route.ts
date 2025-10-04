import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // ojo: usamos anon, es solo lectura
);

export async function GET() {
  // Ahora devolvemos número + datos del comprador
  const { data, error } = await supabase
    .from("purchases")
    .select("number, buyer_name, buyer_email, buyer_phone");

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  // Retornar en formato { number, buyer_name, buyer_email, buyer_phone }
  return NextResponse.json({ ok: true, sold: data });
}
