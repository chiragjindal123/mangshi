import { queryOptions } from "@tanstack/react-query";
import { getSystemData } from "./system.functions";
import type { SupplyRow, Preorder } from "./matching";

export type SystemOverrides = {
  deletedSupply: string[];
  updatedSupply: Record<string, Partial<SupplyRow>>;
  deletedPreorders: string[];
  updatedPreorders: Record<string, Partial<Preorder>>;
};

const STORAGE_KEY = "mangshi_system_overrides";

export function getLocalOverrides(): SystemOverrides {
  if (typeof window === "undefined") {
    return {
      deletedSupply: [],
      updatedSupply: {},
      deletedPreorders: [],
      updatedPreorders: {},
    };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        deletedSupply: [],
        updatedSupply: {},
        deletedPreorders: [],
        updatedPreorders: {},
      };
    }
    const parsed = JSON.parse(raw);
    return {
      deletedSupply: Array.isArray(parsed.deletedSupply) ? parsed.deletedSupply : [],
      updatedSupply: parsed.updatedSupply && typeof parsed.updatedSupply === "object" ? parsed.updatedSupply : {},
      deletedPreorders: Array.isArray(parsed.deletedPreorders) ? parsed.deletedPreorders : [],
      updatedPreorders: parsed.updatedPreorders && typeof parsed.updatedPreorders === "object" ? parsed.updatedPreorders : {},
    };
  } catch {
    return {
      deletedSupply: [],
      updatedSupply: {},
      deletedPreorders: [],
      updatedPreorders: {},
    };
  }
}

export function saveLocalOverrides(overrides: SystemOverrides) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  } catch (err) {
    console.error("Failed to save local system overrides", err);
  }
}

export function recordSupplyDelete(id: string) {
  const overrides = getLocalOverrides();
  if (!overrides.deletedSupply.includes(id)) {
    overrides.deletedSupply.push(id);
    saveLocalOverrides(overrides);
  }
}

export function recordSupplyUpdate(id: string, patch: Partial<SupplyRow>) {
  const overrides = getLocalOverrides();
  overrides.updatedSupply[id] = {
    ...(overrides.updatedSupply[id] ?? {}),
    ...patch,
  };
  saveLocalOverrides(overrides);
}

export function recordPreorderDelete(id: string) {
  const overrides = getLocalOverrides();
  if (!overrides.deletedPreorders.includes(id)) {
    overrides.deletedPreorders.push(id);
    saveLocalOverrides(overrides);
  }
}

export function recordPreorderUpdate(id: string, patch: Partial<Preorder>) {
  const overrides = getLocalOverrides();
  overrides.updatedPreorders[id] = {
    ...(overrides.updatedPreorders[id] ?? {}),
    ...patch,
  };
  saveLocalOverrides(overrides);
}

export const systemQueryOptions = queryOptions({
  queryKey: ["system-data"],
  queryFn: async () => {
    const rawData = await getSystemData();
    const overrides = getLocalOverrides();

    const supply = rawData.supply
      .filter((s) => !overrides.deletedSupply.includes(s.id))
      .map((s) =>
        overrides.updatedSupply[s.id]
          ? { ...s, ...overrides.updatedSupply[s.id] }
          : s,
      );

    const preorders = rawData.preorders
      .filter((p) => !overrides.deletedPreorders.includes(p.id))
      .map((p) =>
        overrides.updatedPreorders[p.id]
          ? { ...p, ...overrides.updatedPreorders[p.id] }
          : p,
      );

    return {
      ...rawData,
      supply,
      preorders,
    };
  },
});
