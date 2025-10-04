import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendPurchaseConfirmation } from "../../../lib/email";

const supabaseService = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { token, numbers } = await req.json();

  console.log("[CLAIM] Token recibido:", token);
  console.log("[CLAIM] Números a reclamar:", numbers);

  if (!token || !Array.isArray(numbers) || numbers.length === 0) {
    return NextResponse.json(
      { ok: false, error: "invalid_input" },
      { status: 400 }
    );
  }

  // 1. Verificar que el link existe, está activo y no ha expirado
  const { data: link, error: linkError } = await supabaseService
    .from("links")
    .select("token, remaining, active, expires_at, buyer_name, buyer_email, buyer_phone")
    .eq("token", token)
    .single();

  console.log("[CLAIM] Link encontrado:", link);
  console.log("[CLAIM] Error al buscar link:", linkError);

  if (linkError || !link) {
    console.error("[CLAIM] Link no encontrado o error:", linkError);
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

  // 4. Ya tenemos los datos del comprador en 'link', no necesitamos otra query
  
  // 5. Insertar las compras con TODOS los datos del comprador
  const purchaseRecords = numbers.map((num) => ({
    number: num,
    buyer_name: link.buyer_name,
    buyer_email: link.buyer_email,
    buyer_phone: link.buyer_phone,
    token: link.token, // Usar token en lugar de link_id
  }));

  console.log("[CLAIM] Insertando compras:", purchaseRecords);

  const { error: insertError } = await supabaseService
    .from("purchases")
    .insert(purchaseRecords);

  if (insertError) {
    console.error("[CLAIM] Error al insertar:", insertError);
    return NextResponse.json(
      { ok: false, error: insertError.message },
      { status: 500 }
    );
  }

  console.log("[CLAIM] Compras insertadas exitosamente");

  // 6. Actualizar remaining en la tabla links
  const newRemaining = link.remaining - numbers.length;
  const shouldDeactivate = newRemaining === 0;

  const { error: updateError } = await supabaseService
    .from("links")
    .update({
      remaining: newRemaining,
      active: shouldDeactivate ? false : link.active,
    })
    .eq("token", link.token);

  if (updateError) {
    return NextResponse.json(
      { ok: false, error: updateError.message },
      { status: 500 }
    );
  }

  // 7. Enviar email de confirmación (no bloqueante - si falla, no afecta la compra)
  sendPurchaseConfirmation({
    buyerName: link.buyer_name,
    buyerEmail: link.buyer_email,
    numbers: numbers,
  })
    .then((result) => {
      if (result.success) {
        console.log("[CLAIM] Email enviado exitosamente a:", link.buyer_email);
      } else {
        console.error("[CLAIM] Error al enviar email:", result.error);
      }
    })
    .catch((err) => {
      console.error("[CLAIM] Error inesperado al enviar email:", err);
    });

  return NextResponse.json({
    ok: true,
    remaining: newRemaining,
    deactivated: shouldDeactivate,
  });
}
