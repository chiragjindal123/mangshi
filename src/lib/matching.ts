// Pure matching engine: given today's rescued supply + demand, decide what the
// kitchen should cook. No I/O here so it can be reasoned about (and tested) alone.

export type SupplyLot = {
  veg_key: string;
  name_zh: string;
  name_en: string;
  kg: number;
};

export type RecipeIngredient = {
  veg_key: string;
  name_zh: string;
  name_en: string;
  kg_per_100: number;
  is_core: boolean;
};

export type Recipe = {
  id: string;
  code: string;
  name_zh: string;
  name_en: string;
  prep_min: number;
  cook_min: number;
  cost_ntd: number;
  kcal: number;
  vegetarian: boolean;
  allergens: string[];
  max_batch: number;
  note_zh: string | null;
  note_en: string | null;
  ingredients: RecipeIngredient[];
};

export type PlanLine = {
  recipe: Recipe;
  portions: number;
  kgUsed: number;
  uses: { veg_key: string; name_zh: string; name_en: string; kg: number }[];
};

export type MatchResult = {
  lines: PlanLine[];
  totalMeals: number;
  kgAvailable: number;
  kgUsed: number;
  utilization: number; // 0..1
  leftovers: SupplyLot[];
  unmetPortions: number;
};

const MIN_BATCH = 20; // kitchen won't fire a pot for less than this

function kgPerPortion(r: Recipe) {
  return r.ingredients.reduce((s, i) => s + i.kg_per_100, 0) / 100;
}

/** Largest batch of `r` the remaining stock can support. */
function feasiblePortions(r: Recipe, stock: Map<string, number>, cap: number) {
  let portions = Math.min(r.max_batch, cap);
  for (const ing of r.ingredients) {
    const have = stock.get(ing.veg_key) ?? 0;
    const possible = Math.floor((have / ing.kg_per_100) * 100);
    if (ing.is_core && possible < MIN_BATCH) return 0;
    portions = Math.min(portions, ing.is_core ? possible : Math.max(possible, 0));
  }
  return portions >= MIN_BATCH ? Math.floor(portions / 5) * 5 : 0;
}

/**
 * Greedy diversion-maximising match: repeatedly cook the dish that moves the
 * most surplus kilos per round, until demand is met or nothing is cookable.
 */
export function matchMenu(
  supply: SupplyLot[],
  recipes: Recipe[],
  demandPortions: number,
): MatchResult {
  const stock = new Map<string, number>();
  const names = new Map<string, SupplyLot>();
  for (const lot of supply) {
    stock.set(lot.veg_key, (stock.get(lot.veg_key) ?? 0) + Number(lot.kg));
    names.set(lot.veg_key, lot);
  }
  const kgAvailable = [...stock.values()].reduce((a, b) => a + b, 0);

  const lines: PlanLine[] = [];
  let remaining = demandPortions;
  const used = new Set<string>();

  while (remaining >= MIN_BATCH) {
    let best: { r: Recipe; portions: number; kg: number } | null = null;
    for (const r of recipes) {
      if (used.has(r.id)) continue;
      const portions = feasiblePortions(r, stock, remaining);
      if (!portions) continue;
      const kg = portions * kgPerPortion(r);
      if (
        !best ||
        kg > best.kg + 0.001 ||
        (Math.abs(kg - best.kg) < 0.001 && r.cost_ntd < best.r.cost_ntd)
      ) {
        best = { r, portions, kg };
      }
    }
    if (!best) break;

    const uses: PlanLine["uses"] = [];
    for (const ing of best.r.ingredients) {
      const need = (ing.kg_per_100 / 100) * best.portions;
      const have = stock.get(ing.veg_key) ?? 0;
      const take = Math.min(need, have);
      if (take > 0) {
        stock.set(ing.veg_key, have - take);
        uses.push({
          veg_key: ing.veg_key,
          name_zh: ing.name_zh,
          name_en: ing.name_en,
          kg: Math.round(take * 10) / 10,
        });
      }
    }
    const kgUsed = uses.reduce((s, u) => s + u.kg, 0);
    lines.push({ recipe: best.r, portions: best.portions, kgUsed: Math.round(kgUsed * 10) / 10, uses });
    used.add(best.r.id);
    remaining -= best.portions;
  }

  const totalMeals = lines.reduce((s, l) => s + l.portions, 0);
  const kgUsed = lines.reduce((s, l) => s + l.kgUsed, 0);
  const leftovers: SupplyLot[] = [...stock.entries()]
    .filter(([, kg]) => kg > 0.5)
    .map(([key, kg]) => ({
      veg_key: key,
      name_zh: names.get(key)?.name_zh ?? key,
      name_en: names.get(key)?.name_en ?? key,
      kg: Math.round(kg * 10) / 10,
    }));

  return {
    lines,
    totalMeals,
    kgAvailable: Math.round(kgAvailable * 10) / 10,
    kgUsed: Math.round(kgUsed * 10) / 10,
    utilization: kgAvailable ? kgUsed / kgAvailable : 0,
    leftovers,
    unmetPortions: Math.max(0, demandPortions - totalMeals),
  };
}

/** Rough, clearly-labelled impact estimates derived from diverted kilos. */
export function impactOf(kgDiverted: number, meals: number) {
  return {
    kg: Math.round(kgDiverted),
    meals,
    co2e: Math.round(kgDiverted * 2.5), // kg CO2e avoided per kg food saved
    water: Math.round(kgDiverted * 210), // litres of embedded water kept in use
    savedNtd: Math.round(meals * 45), // vs. a NT$110 meal bought outside
  };
}

/** Recipes ranked by how much of a month's surplus list they can absorb. */
export function recommendForVegKeys(recipes: Recipe[], vegKeys: string[], limit = 4) {
  const set = new Set(vegKeys);
  return recipes
    .map((r) => {
      const matched = r.ingredients.filter((i) => set.has(i.veg_key));
      const coreMatch = matched.some((i) => i.is_core);
      const kg = matched.reduce((s, i) => s + i.kg_per_100, 0);
      return { recipe: r, matched, score: kg * (coreMatch ? 2 : 1) };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
