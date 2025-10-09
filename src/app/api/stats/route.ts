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
      .select("number, paid, token");

    const numbersSold = purchases?.length || 0;
    const numbersAvailable = 1000 - numbersSold;
    const numbersPaid = purchases?.filter(p => p.paid === true).length || 0;

    const { data: links } = await supabase
      .from("links")
      .select("opportunities, token");

    const totalOpportunities = links?.reduce(
      (sum, link) => sum + link.opportunities,
      0
    ) || 0;

    const opportunitiesUsed = numbersSold;
    const opportunitiesRemaining = totalOpportunities - opportunitiesUsed;

    // Calcular ingresos totales basado en números pagados y sus oportunidades
    let totalRevenue = 0;
    if (purchases && links) {
      // Agrupar compras por token para saber cuántas oportunidades compró cada persona
      const purchasesByToken = purchases.reduce((acc, purchase) => {
        if (purchase.paid) { // Solo contar los pagados
          if (!acc[purchase.token]) {
            acc[purchase.token] = 0;
          }
          acc[purchase.token]++;
        }
        return acc;
      }, {} as Record<string, number>);

      // Calcular ingresos por cada token pagado
      Object.entries(purchasesByToken).forEach(([token, count]) => {
        const link = links.find(l => l.token === token);
        if (link) {
          const opportunities = link.opportunities;
          // Precios según oportunidades: 2=20k, 4=40k, 6=50k, 8=70k, 10=80k
          const priceMap: Record<number, number> = {
            2: 20000,
            4: 40000, 
            6: 50000,
            8: 70000,
            10: 80000
          };
          totalRevenue += priceMap[opportunities] || 0;
        }
      });
    }

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
          paid: numbersPaid,
        },
        opportunities: {
          total: totalOpportunities,
          used: opportunitiesUsed,
          remaining: opportunitiesRemaining,
        },
        revenue: {
          total: totalRevenue,
          formatted: new Intl.NumberFormat('es-CO', { 
            style: 'currency', 
            currency: 'COP',
            minimumFractionDigits: 0
          }).format(totalRevenue),
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
