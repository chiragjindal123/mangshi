import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Recipe, SupplyLot } from "./matching";

export type SurplusRow = {
  id: string;
  month: number;
  veg_key: string;
  name_zh: string;
  name_en: string;
  typical_surplus_kg: number;
  severity: string;
  note_zh: string | null;
  note_en: string | null;
};

export type SupplyRow = SupplyLot & {
  id: string;
  farmer_name: string;
  available_from: string;
  available_to: string;
  created_at: string;
};

export function useRecipes() {
  return useQuery({
    queryKey: ["recipes"],
    queryFn: async (): Promise<Recipe[]> => {
      const { data, error } = await supabase
        .from("recipes")
        .select(
          "id, code, name_zh, name_en, prep_min, cook_min, cost_ntd, kcal, vegetarian, allergens, max_batch, note_zh, note_en, recipe_ingredients(veg_key, name_zh, name_en, kg_per_100, is_core)",
        )
        .order("code");
      if (error) throw error;
      return (data ?? []).map((r) => {
        const { recipe_ingredients, ...rest } = r as typeof r & {
          recipe_ingredients: Recipe["ingredients"];
        };
        return {
          ...rest,
          cost_ntd: Number(rest.cost_ntd),
          ingredients: (recipe_ingredients ?? []).map((i) => ({
            ...i,
            kg_per_100: Number(i.kg_per_100),
          })),
        } as Recipe;
      });
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useSurplusCalendar() {
  return useQuery({
    queryKey: ["seasonal_surplus"],
    queryFn: async (): Promise<SurplusRow[]> => {
      const { data, error } = await supabase
        .from("seasonal_surplus")
        .select("*")
        .order("month")
        .order("typical_surplus_kg", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((r) => ({
        ...r,
        typical_surplus_kg: Number(r.typical_surplus_kg),
      })) as SurplusRow[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useSupply() {
  return useQuery({
    queryKey: ["farm_supply"],
    queryFn: async (): Promise<SupplyRow[]> => {
      const { data, error } = await supabase
        .from("farm_supply")
        .select("*")
        .eq("status", "available")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((r) => ({ ...r, kg: Number(r.kg) })) as SupplyRow[];
    },
  });
}

export function usePreorders() {
  return useQuery({
    queryKey: ["preorders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("preorders")
        .select("id, campus, portions, order_date")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export async function addSupply(input: {
  farmer_name: string;
  veg_key: string;
  name_zh: string;
  name_en: string;
  kg: number;
}) {
  const { error } = await supabase.from("farm_supply").insert(input);
  if (error) throw error;
}

/** The vegetables a farmer can log — kept in sync with the recipe library. */
export const VEG_OPTIONS = [
  { veg_key: "cabbage", name_zh: "高麗菜", name_en: "Cabbage" },
  { veg_key: "broccoli", name_zh: "青花菜", name_en: "Broccoli" },
  { veg_key: "cauliflower", name_zh: "白花椰菜", name_en: "Cauliflower" },
  { veg_key: "carrot", name_zh: "紅蘿蔔", name_en: "Carrot" },
  { veg_key: "daikon", name_zh: "白蘿蔔", name_en: "Daikon" },
  { veg_key: "tomato", name_zh: "番茄", name_en: "Tomato" },
  { veg_key: "eggplant", name_zh: "茄子", name_en: "Eggplant" },
  { veg_key: "onion", name_zh: "洋蔥", name_en: "Onion" },
  { veg_key: "pumpkin", name_zh: "南瓜", name_en: "Pumpkin" },
  { veg_key: "bitter_melon", name_zh: "苦瓜", name_en: "Bitter Melon" },
  { veg_key: "mustard_greens", name_zh: "芥菜", name_en: "Mustard Greens" },
  { veg_key: "sweet_potato_leaf", name_zh: "地瓜葉", name_en: "Sweet Potato Leaves" },
  { veg_key: "bamboo", name_zh: "竹筍", name_en: "Bamboo Shoots" },
  { veg_key: "corn", name_zh: "玉米", name_en: "Corn" },
  { veg_key: "cucumber", name_zh: "小黃瓜", name_en: "Cucumber" },
] as const;

export const MONTHS = [
  { n: 1, zh: "一月", en: "January" },
  { n: 2, zh: "二月", en: "February" },
  { n: 3, zh: "三月", en: "March" },
  { n: 4, zh: "四月", en: "April" },
  { n: 5, zh: "五月", en: "May" },
  { n: 6, zh: "六月", en: "June" },
  { n: 7, zh: "七月", en: "July" },
  { n: 8, zh: "八月", en: "August" },
  { n: 9, zh: "九月", en: "September" },
  { n: 10, zh: "十月", en: "October" },
  { n: 11, zh: "十一月", en: "November" },
  { n: 12, zh: "十二月", en: "December" },
] as const;
