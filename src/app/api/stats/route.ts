import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifySession } from "../../../lib/auth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "dummy_url",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy_key"
);

export async function GET() {
  try {
    const session = await verifySession();
    if (!session) {
      return NextResponse.json(
        { ok: false, error: "No autorizado" },
        { status: 401 }
      );
    }
    const { count: totalLinks } = await supabase
      .from("links")
      .select("*", { count: "exact", head: true });

    const { count: activeLinks } = await supabase
      .from("links")
      .select("*", { count: "exact", head: true })
      .eq("active", true);

    const { count: expiredLinks } = await supabase
      .from("links")
      .select("*", { count: "exact", head: true })
      .eq("active", false);

    const { data: purchases } = await supabase
      .from("purchases")
      .select("number");

    const numbersSold = purchases?.length || 0;
    const numbersAvailable = 1000 - numbersSold;

    const { data: links } = await supabase
      .from("links")
      .select("opportunities");

    const totalOpportunities = links?.reduce(
      (sum, link) => sum + link.opportunities,
      0
    ) || 0;

    const opportunitiesUsed = numbersSold;
    const opportunitiesRemaining = totalOpportunities - opportunitiesUsed;

    return NextResponse.json({
      ok: true,
      stats: {
        links: {
          total: totalLinks || 0,
          active: activeLinks || 0,
          expired: expiredLinks || 0,
        },
        numbers: {
          sold: numbersSold,
          available: numbersAvailable,
          total: 1000,
          percentage: ((numbersSold / 1000) * 100).toFixed(2),
        },
        opportunities: {
          total: totalOpportunities,
          used: opportunitiesUsed,
          remaining: opportunitiesRemaining,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
