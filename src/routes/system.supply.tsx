import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useRef, useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import {
  systemQueryOptions,
  recordSupplyDelete,
  recordSupplyUpdate,
  recordPreorderDelete,
  recordPreorderUpdate,
} from "@/lib/systemQuery";
import {
  addPreorder,
  addSupply,
  deleteSupply,
  updateSupply,
  deletePreorder,
  updatePreorder,
} from "@/lib/system.functions";
import { VEG_OPTIONS } from "@/lib/matching";

export const Route = createFileRoute("/system/supply")({
  head: () => ({
    meta: [
      { title: "Supply Input / Output — Mangshi 盲食" },
      {
        name: "description",
        content:
          "Farmers log surplus batches by vegetable and weight; campuses add meal preorders. Live stock for the Mangshi matching system.",
      },
      { property: "og:title", content: "Supply Input / Output — Mangshi 盲食" },
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

/* ------------------------------------------------------------------ */
/*  Kebab (⋮) dropdown                                                */
/* ------------------------------------------------------------------ */

function KebabMenu({
  onEdit,
  onDelete,
  editLabel,
  deleteLabel,
}: {
  onEdit: () => void;
  onDelete: () => void;
  editLabel: string;
  deleteLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="p-1.5 rounded hover:bg-border/60 transition-colors text-clay hover:text-foreground"
        aria-label="Actions"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="8" cy="3" r="1.5" />
          <circle cx="8" cy="8" r="1.5" />
          <circle cx="8" cy="13" r="1.5" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-20 min-w-[120px] border border-border bg-background shadow-lg rounded-md overflow-hidden">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
            className="w-full text-left px-4 py-2.5 text-sm hover:bg-border/40 transition-colors"
          >
            {editLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            {deleteLabel}
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main screen                                                        */
/* ------------------------------------------------------------------ */

function SupplyScreen() {
  const { t, lang } = useLang();
  const qc = useQueryClient();
  const { data } = useQuery(systemQueryOptions);
  const submitSupply = useServerFn(addSupply);
  const submitOrder = useServerFn(addPreorder);
  const execDeleteSupply = useServerFn(deleteSupply);
  const execUpdateSupply = useServerFn(updateSupply);
  const execDeletePreorder = useServerFn(deletePreorder);
  const execUpdatePreorder = useServerFn(updatePreorder);

  const [farmer, setFarmer] = useState("");
  const [veg, setVeg] = useState<string>(VEG_OPTIONS[0].veg_key);
  const [kg, setKg] = useState("");
  const [availableFrom, setAvailableFrom] = useState(() => new Date().toISOString().slice(0, 10));
  const [availableTo, setAvailableTo] = useState(() => new Date().toISOString().slice(0, 10));
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");

  const [campus, setCampus] = useState("");
  const [portions, setPortions] = useState("");
  const [orderState, setOrderState] = useState<"idle" | "saving" | "saved">("idle");

  // Edit/delete state for supply rows
  const [editingSupplyId, setEditingSupplyId] = useState<string | null>(null);
  const [editSupplyKg, setEditSupplyKg] = useState("");
  const [editSupplyFarmer, setEditSupplyFarmer] = useState("");
  const [editSupplyFrom, setEditSupplyFrom] = useState("");
  const [editSupplyTo, setEditSupplyTo] = useState("");

  // Edit/delete state for preorder rows
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [editOrderCampus, setEditOrderCampus] = useState("");
  const [editOrderPortions, setEditOrderPortions] = useState("");

  const refresh = useCallback(
    () => qc.invalidateQueries({ queryKey: systemQueryOptions.queryKey }),
    [qc],
  );

  const label = (zh: string, en: string) => (lang === "zh" ? zh : en);

  const onSupply = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(kg);
    if (!farmer.trim() || !Number.isFinite(val) || val <= 0) return;
    setState("saving");
    try {
      await submitSupply({
        data: {
          farmer_name: farmer.trim(),
          veg_key: veg,
          kg: val,
          available_from: availableFrom,
          available_to: availableTo,
        },
      });
      setFarmer("");
      setKg("");
      setState("saved");
      setTimeout(() => setState("idle"), 2500);
      await refresh();
    } catch (err) {
      console.error(err);
      setState("idle");
    }
  };

  const onOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const p = Number(portions);
    if (!campus.trim() || !Number.isFinite(p) || p <= 0) return;
    setOrderState("saving");
    try {
      await submitOrder({
        data: {
          campus: campus.trim(),
          portions: p,
          order_date: new Date().toISOString().slice(0, 10),
        },
      });
      setCampus("");
      setPortions("");
      setOrderState("saved");
      setTimeout(() => setOrderState("idle"), 2500);
      await refresh();
    } catch (err) {
      console.error(err);
      setOrderState("idle");
    }
  };

  const handleDeleteSupply = async (id: string) => {
    if (!window.confirm(t("sys.supply.confirmDelete"))) return;
    recordSupplyDelete(id);
    try {
      await execDeleteSupply({ data: { id } });
    } catch (e) {
      console.warn("Server delete supply failed, local override applied", e);
    }
    await refresh();
  };

  const handleEditSupply = (s: {
    id: string;
    farmer_name: string;
    kg: number;
    available_from: string;
    available_to: string;
  }) => {
    setEditingSupplyId(s.id);
    setEditSupplyKg(String(s.kg));
    setEditSupplyFarmer(s.farmer_name);
    setEditSupplyFrom(s.available_from);
    setEditSupplyTo(s.available_to);
  };

  const handleSaveSupply = async () => {
    if (!editingSupplyId) return;
    const n = Number(editSupplyKg);
    if (!Number.isFinite(n) || n <= 0) return;
    const patch = {
      farmer_name: editSupplyFarmer,
      kg: n,
      available_from: editSupplyFrom,
      available_to: editSupplyTo,
    };
    recordSupplyUpdate(editingSupplyId, patch);
    try {
      await execUpdateSupply({
        data: {
          id: editingSupplyId,
          ...patch,
        },
      });
    } catch (e) {
      console.warn("Server update supply failed, local override applied", e);
    }
    setEditingSupplyId(null);
    await refresh();
  };

  const handleDeletePreorder = async (id: string) => {
    if (!window.confirm(t("sys.order.confirmDelete"))) return;
    recordPreorderDelete(id);
    try {
      await execDeletePreorder({ data: { id } });
    } catch (e) {
      console.warn("Server delete preorder failed, local override applied", e);
    }
    await refresh();
  };

  const handleEditPreorder = (p: { id: string; campus: string; portions: number }) => {
    setEditingOrderId(p.id);
    setEditOrderCampus(p.campus);
    setEditOrderPortions(String(p.portions));
  };

  const handleSavePreorder = async () => {
    if (!editingOrderId) return;
    const n = Number(editOrderPortions);
    if (!Number.isFinite(n) || n <= 0) return;
    const patch = { campus: editOrderCampus, portions: n };
    recordPreorderUpdate(editingOrderId, patch);
    try {
      await execUpdatePreorder({
        data: { id: editingOrderId, ...patch },
      });
    } catch (e) {
      console.warn("Server update preorder failed, local override applied", e);
    }
    setEditingOrderId(null);
    await refresh();
  };

  const field =
    "w-full bg-transparent border-b border-input py-2 text-sm focus:outline-none focus:border-foreground transition-colors";
  const btn =
    "mt-6 inline-flex items-center gap-2 border border-foreground px-6 py-3 text-[11px] uppercase tracking-[0.25em] hover:bg-foreground hover:text-background transition-colors disabled:opacity-50 rounded-md cursor-pointer";
  const inlineField =
    "bg-transparent border-b border-input py-1 text-sm focus:outline-none focus:border-foreground transition-colors";
  const smallBtn =
    "px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] border transition-colors rounded";

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16">
      <Reveal>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl">{t("sys.supply.title")}</h1>
        <p className="mt-3 text-clay max-w-xl text-sm sm:text-base">{t("sys.supply.body")}</p>
      </Reveal>

      {/* TWO COLUMN SECTION WITH FULL VERTICAL DIVIDING LINE */}
      <div className="relative mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Full-height vertical dividing line for desktop */}
        <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />

        {/* LEFT COLUMN: FARMER SUPPLY INPUT */}
        <div className="flex flex-col space-y-10">
          <div>
            {/* Header above Farmer Input box */}
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-indigo-dye font-semibold block mb-1">
                {lang === "zh" ? "01 / 農友端" : "01 / Farmer Section"}
              </span>
              <h2 className="font-display text-2xl font-bold text-foreground">
                {lang === "zh" ? "農友剩食登錄" : "Farmer supply input"}
              </h2>
              <p className="mt-1.5 text-xs text-clay leading-relaxed">
                {lang === "zh"
                  ? "登錄一批剩食。立即成為下一輪配對的可用庫存。"
                  : "Log a surplus batch. It becomes available stock for the next matching run."}
              </p>
            </div>

            {/* Separate Farmer Input Box */}
            <Reveal className="mt-6 border border-border p-6 sm:p-8 bg-card rounded-xl shadow-sm">
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
                  <label className="block">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-clay">
                      {lang === "zh" ? "可取開始日" : "Available from"}
                    </span>
                    <input
                      type="date"
                      className={field}
                      value={availableFrom}
                      onChange={(e) => setAvailableFrom(e.target.value)}
                    />
                  </label>
                  <label className="block">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-clay">
                      {lang === "zh" ? "可取結束日" : "Available until"}
                    </span>
                    <input
                      type="date"
                      min={availableFrom}
                      className={field}
                      value={availableTo}
                      onChange={(e) => setAvailableTo(e.target.value)}
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
          </div>

          {/* Supply Batch List */}
          <div className="pt-6 border-t border-border/60">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-indigo-dye font-semibold">
                {t("sys.supply.list")}
              </h3>
              <span className="font-mono text-[10px] text-clay">
                {lang === "zh" ? "已登記批次" : "Logged Batches"}
              </span>
            </div>
            <div className="mt-4 max-h-[380px] overflow-y-auto pr-1">
              <ul className="divide-y divide-border">
                {(data?.supply ?? []).map((s) => (
                  <li key={s.id} className="py-4">
                    {editingSupplyId === s.id ? (
                      /* ---- Inline edit mode ---- */
                      <div className="space-y-3">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <input
                            className={inlineField}
                            value={editSupplyFarmer}
                            onChange={(e) => setEditSupplyFarmer(e.target.value)}
                            placeholder={t("sys.supply.farmer")}
                          />
                          <input
                            className={inlineField}
                            inputMode="decimal"
                            value={editSupplyKg}
                            onChange={(e) => setEditSupplyKg(e.target.value)}
                            placeholder="kg"
                          />
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <input
                            type="date"
                            className={inlineField}
                            value={editSupplyFrom}
                            onChange={(e) => setEditSupplyFrom(e.target.value)}
                          />
                          <input
                            type="date"
                            className={inlineField}
                            value={editSupplyTo}
                            onChange={(e) => setEditSupplyTo(e.target.value)}
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleSaveSupply}
                            className={`${smallBtn} border-foreground hover:bg-foreground hover:text-background`}
                          >
                            {t("sys.supply.save")}
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingSupplyId(null)}
                            className={`${smallBtn} border-border text-clay hover:border-foreground`}
                          >
                            {t("sys.supply.cancel")}
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* ---- Normal display mode ---- */
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="font-display text-xl">{lang === "zh" ? s.name_zh : s.name_en}</p>
                          <p className="text-xs text-clay mt-1">
                            {s.farmer_name} · {t("sys.supply.window")} {s.available_from} →{" "}
                            {s.available_to}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <p className="font-mono text-sm">{Number(s.kg).toLocaleString()} kg</p>
                          <KebabMenu
                            editLabel={t("sys.supply.edit")}
                            deleteLabel={t("sys.supply.delete")}
                            onEdit={() => handleEditSupply(s)}
                            onDelete={() => handleDeleteSupply(s.id)}
                          />
                        </div>
                      </div>
                    )}
                  </li>
                ))}
                {(data?.supply ?? []).length === 0 && (
                  <li className="py-4 text-sm text-clay">{t("sys.supply.empty")}</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CAMPUS PREORDER INPUT */}
        <div className="flex flex-col space-y-10">
          <div>
            {/* Header above Campus Preorder box */}
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-indigo-dye font-semibold block mb-1">
                {lang === "zh" ? "02 / 校園端" : "02 / Campus Section"}
              </span>
              <h2 className="font-display text-2xl font-bold text-foreground">
                {lang === "zh" ? "校園預訂需求" : "Campus preorders"}
              </h2>
              <p className="mt-1.5 text-xs text-clay leading-relaxed">
                {lang === "zh"
                  ? "新增校園餐盒預訂。設定每日出餐與菜單比例的目標需求。"
                  : "Add meal preorders. It sets the target volume for daily menu matching."}
              </p>
            </div>

            {/* Separate Campus Preorder Box */}
            <Reveal className="mt-6 border border-border p-6 sm:p-8 bg-card rounded-xl shadow-sm" delay={100}>
              <form onSubmit={onOrder}>
                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="block sm:col-span-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-clay">
                      {t("sys.order.campus")}
                    </span>
                    <input
                      className={field}
                      value={campus}
                      onChange={(e) => setCampus(e.target.value)}
                      placeholder={label("中央大學 NCU", "NCU Campus")}
                    />
                  </label>
                  <label className="block sm:col-span-2">
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

          {/* Preorder List */}
          <div className="pt-6 border-t border-border/60">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-indigo-dye font-semibold">
                {t("sys.order.list")}
              </h3>
              <span className="font-mono text-[10px] text-clay">
                {lang === "zh" ? "已確認預訂" : "Confirmed Preorders"}
              </span>
            </div>
            <div className="mt-4 max-h-[380px] overflow-y-auto pr-1">
              <ul className="divide-y divide-border">
                {(data?.preorders ?? []).map((p) => (
                  <li key={p.id} className="py-4">
                    {editingOrderId === p.id ? (
                      /* ---- Inline edit mode ---- */
                      <div className="space-y-3">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <input
                            className={inlineField}
                            value={editOrderCampus}
                            onChange={(e) => setEditOrderCampus(e.target.value)}
                            placeholder={t("sys.order.campus")}
                          />
                          <input
                            className={inlineField}
                            inputMode="numeric"
                            value={editOrderPortions}
                            onChange={(e) => setEditOrderPortions(e.target.value)}
                            placeholder={t("sys.order.portions")}
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleSavePreorder}
                            className={`${smallBtn} border-foreground hover:bg-foreground hover:text-background`}
                          >
                            {t("sys.supply.save")}
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingOrderId(null)}
                            className={`${smallBtn} border-border text-clay hover:border-foreground`}
                          >
                            {t("sys.supply.cancel")}
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* ---- Normal display mode ---- */
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-display text-xl">{p.campus}</p>
                          <p className="text-xs text-clay mt-1">{p.order_date}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <p className="font-mono text-sm">
                            {p.portions} {t("sys.match.portions")}
                          </p>
                          <KebabMenu
                            editLabel={t("sys.order.edit")}
                            deleteLabel={t("sys.order.delete")}
                            onEdit={() => handleEditPreorder(p)}
                            onDelete={() => handleDeletePreorder(p.id)}
                          />
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
