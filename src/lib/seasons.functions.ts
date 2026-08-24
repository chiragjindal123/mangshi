import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { Recipe, SurplusRow } from "./seasons";

export const getSeasonalCalendar = createServerFn({ method: "GET" }).handler(async () => {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const supabase = createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });

  const [surplusRes, recipeRes, ingRes] = await Promise.all([
    supabase
      .from("seasonal_surplus")
      .select(
        "month, veg_key, name_zh, name_en, typical_surplus_kg, severity, note_zh, note_en",
      )
      .order("month")
      .order("typical_surplus_kg", { ascending: false }),
    supabase.from("recipes").select("*").order("code"),
    supabase
      .from("recipe_ingredients")
      .select("recipe_id, veg_key, name_zh, name_en, kg_per_100, is_core"),
  ]);

  if (surplusRes.error) throw surplusRes.error;
  if (recipeRes.error) throw recipeRes.error;
  if (ingRes.error) throw ingRes.error;

  const recipes: Recipe[] = (recipeRes.data ?? []).map((r) => ({
    id: r.id,
    code: r.code,
    name_zh: r.name_zh,
    name_en: r.name_en,
    prep_min: r.prep_min,
    cook_min: r.cook_min,
    cost_ntd: Number(r.cost_ntd),
    kcal: r.kcal,
    protein_g: Number(r.protein_g),
    carbs_g: Number(r.carbs_g),
    fat_g: Number(r.fat_g),
    fiber_g: Number(r.fiber_g),
    vegetarian: r.vegetarian,
    allergens: r.allergens ?? [],
    max_batch: r.max_batch,
    note_zh: r.note_zh,
    note_en: r.note_en,
    ingredients: (ingRes.data ?? [])
      .filter((i) => i.recipe_id === r.id)
      .map((i) => ({
        veg_key: i.veg_key,
        name_zh: i.name_zh,
        name_en: i.name_en,
        kg_per_100: Number(i.kg_per_100),
        is_core: i.is_core,
      })),
  }));

  const surplus: SurplusRow[] = (surplusRes.data ?? []).map((s) => ({
    ...s,
    typical_surplus_kg: Number(s.typical_surplus_kg),
  }));

  return { surplus, recipes };
});
