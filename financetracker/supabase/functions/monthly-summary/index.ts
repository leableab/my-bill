import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const now = new Date();
    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const monthStart = prevMonth.toISOString().split("T")[0];
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split("T")[0];

    // Get all transactions for previous month
    const { data: transactions, error: txError } = await supabase
      .from("transactions")
      .select("user_id, type, amount, category")
      .gte("date", monthStart)
      .lt("date", nextMonthStart);

    if (txError) throw txError;

    // Group by user
    const userMap = new Map<
      string,
      { income: number; expense: number; categories: Record<string, number> }
    >();

    for (const tx of transactions || []) {
      if (!userMap.has(tx.user_id)) {
        userMap.set(tx.user_id, { income: 0, expense: 0, categories: {} });
      }
      const user = userMap.get(tx.user_id)!;
      const amount = Number(tx.amount);

      if (tx.type === "income") {
        user.income += amount;
      } else {
        user.expense += amount;
        user.categories[tx.category] =
          (user.categories[tx.category] || 0) + amount;
      }
    }

    // Upsert summaries
    const summaries = Array.from(userMap.entries()).map(([userId, data]) => ({
      user_id: userId,
      month: monthStart,
      total_income: data.income,
      total_expense: data.expense,
      category_breakdown: data.categories,
    }));

    if (summaries.length > 0) {
      const { error: upsertError } = await supabase
        .from("monthly_summaries")
        .upsert(summaries, { onConflict: "user_id,month" });

      if (upsertError) throw upsertError;
    }

    return new Response(
      JSON.stringify({ success: true, processed: summaries.length }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
