import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { systemQueryOptions } from "@/lib/systemQuery";
import { addPreorder, addSupply } from "@/lib/system.functions";
import { VEG_OPTIONS } from "@/lib/matching";

export const Route = createFileRoute("/system/supply")({
  head: () => ({
    meta: [
      { title: "產地登錄 Farmer Supply — Mangshi 盲食" },
      {
        name: "description",
        content:
          "Farmers log surplus batches by vegetable and weight; campuses add meal preorders. Live stock for the Mangshi matching system.",
      },
      { property: "og:title", content: "產地登錄 Farmer Supply — Mangshi 盲食" },
      {
        property: "og:description",
        content: "Log surplus harvest and campus preorders into the Mangshi food-rescue system.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SupplyScreen,
});

function SupplyScreen() {
  const { t, lang } = useLang();
  const qc = useQueryClient();
  const { data } = useQuery(systemQueryOptions);
  const submitSupply = useServerFn(addSupply);
  const submitOrder = useServerFn(addPreorder);

  const [farmer, setFarmer] = useState("");
  const [veg, setVeg] = useState<string>(VEG_OPTIONS[0].veg_key);
  const [kg, setKg] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");

  const [campus, setCampus] = useState("");
  const [portions, setPortions] = useState("");
  const [orderState, setOrderState] = useState<"idle" | "saving" | "saved">("idle");

  const label = (zh: string, en: string) => (lang === "zh" ? zh : en);

  const onSupply = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = VEG_OPTIONS.find((o) => o.veg_key === veg)!;
    const n = Number(kg);
    if (!Number.isFinite(n) || n <= 0) return;
    setState("saving");
    await submitSupply({
      data: { farmer_name: farmer, veg_key: v.veg_key, name_zh: v.name_zh, name_en: v.name_en, kg: n },
    });
    await qc.invalidateQueries({ queryKey: ["system-data"] });
    setKg("");
    setState("saved");
  };

  const onOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const n = Number(portions);
    if (!Number.isFinite(n) || n <= 0) return;
    setOrderState("saving");
    await submitOrder({ data: { campus, portions: n } });
    await qc.invalidateQueries({ queryKey: ["system-data"] });
    setPortions("");
    setOrderState("saved");
  };

  const field =
    "w-full bg-transparent border-b border-input py-2 text-sm focus:outline-none focus:border-foreground transition-colors";
  const btn =
    "mt-6 inline-flex items-center gap-2 border border-foreground px-6 py-3 text-[11px] uppercase tracking-[0.25em] hover:bg-foreground hover:text-background transition-colors disabled:opacity-50";

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16">
      <Reveal>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl">{t("sys.supply.title")}</h1>
        <p className="mt-3 text-clay max-w-xl text-sm sm:text-base">{t("sys.supply.body")}</p>
      </Reveal>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <Reveal className="border border-border p-6 sm:p-8">
          <form onSubmit={onSupply}>
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-clay">
                  {t("sys.supply.farmer")}
                </span>
                <input
                  className={field}
                  value={farmer}
                  onChange={(e) => setFarmer(e.target.value)}
                  placeholder={label("陳大哥 / 客庄合作社", "Chen / cooperative")}
                />
              </label>
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-clay">
                  {t("sys.supply.veg")}
                </span>
                <select className={field} value={veg} onChange={(e) => setVeg(e.target.value)}>
                  {VEG_OPTIONS.map((o) => (
                    <option key={o.veg_key} value={o.veg_key}>
                      {lang === "zh" ? o.name_zh : o.name_en}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-clay">
                  {t("sys.supply.kg")}
                </span>
                <input
                  className={field}
                  inputMode="decimal"
                  value={kg}
                  onChange={(e) => setKg(e.target.value)}
                  placeholder="120"
                />
              </label>
            </div>
            <button className={btn} disabled={state === "saving"}>
              {state === "saving" ? t("sys.supply.saving") : t("sys.supply.submit")}
            </button>
            {state === "saved" && (
              <p className="mt-4 text-sm text-sage">{t("sys.supply.saved")}</p>
            )}
          </form>
        </Reveal>

        <Reveal className="border border-border p-6 sm:p-8" delay={100}>
          <h2 className="font-display text-2xl">{t("sys.order.title")}</h2>
          <form onSubmit={onOrder} className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-clay">
                  {t("sys.order.campus")}
                </span>
                <input
                  className={field}
                  value={campus}
                  onChange={(e) => setCampus(e.target.value)}
                  placeholder={label("中央大學", "NCU")}
                />
              </label>
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-clay">
                  {t("sys.order.portions")}
                </span>
                <input
                  className={field}
                  inputMode="numeric"
                  value={portions}
                  onChange={(e) => setPortions(e.target.value)}
                  placeholder="80"
                />
              </label>
            </div>
            <button className={btn} disabled={orderState === "saving"}>
              {orderState === "saving" ? t("sys.supply.saving") : t("sys.order.submit")}
            </button>
            {orderState === "saved" && (
              <p className="mt-4 text-sm text-sage">{t("sys.supply.saved")}</p>
            )}
          </form>
        </Reveal>
      </div>

      <div className="mt-16 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-clay">
            {t("sys.supply.list")}
          </h2>
          <ul className="mt-4 divide-y divide-border border-t border-border">
            {(data?.supply ?? []).map((s) => (
              <li key={s.id} className="py-4 flex items-baseline justify-between gap-4">
                <div>
                  <p className="font-display text-xl">{lang === "zh" ? s.name_zh : s.name_en}</p>
                  <p className="text-xs text-clay mt-1">
                    {s.farmer_name} · {t("sys.supply.window")} {s.available_from} → {s.available_to}
                  </p>
                </div>
                <p className="font-mono text-sm shrink-0">{Number(s.kg).toLocaleString()} kg</p>
              </li>
            ))}
            {(data?.supply ?? []).length === 0 && (
              <li className="py-4 text-sm text-clay">{t("sys.supply.empty")}</li>
            )}
          </ul>
        </div>
        <div>
          <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-clay">
            {t("sys.order.list")}
          </h2>
          <ul className="mt-4 divide-y divide-border border-t border-border">
            {(data?.preorders ?? []).map((p) => (
              <li key={p.id} className="py-4 flex items-baseline justify-between gap-4">
                <div>
                  <p className="font-display text-xl">{p.campus}</p>
                  <p className="text-xs text-clay mt-1">{p.order_date}</p>
                </div>
                <p className="font-mono text-sm shrink-0">
                  {p.portions} {t("sys.match.portions")}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
