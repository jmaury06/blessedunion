import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseService = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { token, numbers } = await req.json();

  if (!token || !Array.isArray(numbers) || numbers.length === 0) {
    return NextResponse.json(
      { ok: false, error: "invalid_input" },
      { status: 400 }
    );
  }

  // 1. Verificar que el link existe, está activo y no ha expirado
  const { data: link, error: linkError } = await supabaseService
    .from("links")
    .select("id, remaining, active, expires_at")
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

  // 2. Verificar que no está intentando reclamar más números de los que tiene disponibles
  if (numbers.length > link.remaining) {
    return NextResponse.json(
      { ok: false, error: "not_enough_remaining" },
      { status: 400 }
    );
  }

  // 3. Verificar que los números no están ya comprados
  const { data: existingPurchases, error: checkError } = await supabaseService
    .from("purchases")
    .select("number")
    .in("number", numbers);

  if (checkError) {
    return NextResponse.json(
      { ok: false, error: checkError.message },
      { status: 500 }
    );
  }

  if (existingPurchases && existingPurchases.length > 0) {
    const alreadySold = existingPurchases.map((p) => p.number);
    return NextResponse.json(
      { ok: false, error: "numbers_already_sold", numbers: alreadySold },
      { status: 409 }
    );
  }

  // 4. Insertar las compras en la tabla purchases
  const purchaseRecords = numbers.map((num) => ({
    link_id: link.id,
    number: num,
  }));

  const { error: insertError } = await supabaseService
    .from("purchases")
    .insert(purchaseRecords);

  if (insertError) {
    return NextResponse.json(
      { ok: false, error: insertError.message },
      { status: 500 }
    );
  }

  // 5. Actualizar remaining en la tabla links
  const newRemaining = link.remaining - numbers.length;
  const shouldDeactivate = newRemaining === 0;

  const { error: updateError } = await supabaseService
    .from("links")
    .update({
      remaining: newRemaining,
      active: shouldDeactivate ? false : link.active,
    })
    .eq("id", link.id);

  if (updateError) {
    return NextResponse.json(
      { ok: false, error: updateError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    remaining: newRemaining,
    deactivated: shouldDeactivate,
  });
}
