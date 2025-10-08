import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseService = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { count: soldCount, error } = await supabaseService
      .from("purchases")
      .select("*", { count: "exact", head: true });

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    const totalNumbers = 1000;
    const numbersSold = soldCount || 0;
    const percentage = Math.round((numbersSold / totalNumbers) * 100);

    const raffleDate = new Date("2025-11-01T00:00:00-05:00");
    const today = new Date();
    const diffTime = raffleDate.getTime() - today.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const minimumReached = percentage >= 75;

    return NextResponse.json({
      ok: true,
      stats: {
        totalNumbers,
        numbersSold,
        percentage,
        daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
        raffleDate: "2025-11-01",
        minimumReached,
        minimumRequired: 75,
      },
    });
  } catch (error: any) {
    console.error("[STATS] Error inesperado:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
