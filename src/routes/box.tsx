import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/box")({
  head: () => ({
    meta: [
      { title: "The Blind Box — Hakka Blind Box" },
      {
        name: "description",
        content:
          "Every box shows only ingredients and nutrition — no dish photo, no name. Open one and see the philosophy behind the seal.",
      },
      { property: "og:title", content: "The Blind Box" },
      {
        property: "og:description",
        content:
          "Hover, tap, reveal. A small ritual against visual bias and food waste.",
      },
      { property: "og:url", content: "/box" },
    ],
    links: [{ rel: "canonical", href: "/box" }],
  }),
  component: BoxPage,
});

const sample = {
  batch: "#402",
  origin: "Hsinchu Cooperative",
  harvested: "48 hours ago",
  kcal: 520,
  protein: "26g",
  carbs: "58g",
  fat: "14g",
  ingredients: [
    "Pickled Mustard Greens — 120g",
    "Heritage Pork Belly — 85g",
    "Sun-dried Daikon Radish — 40g",
    "Mountain Ginger — 15g",
    "Mountain Rice — 180g",
  ],
};

function BoxPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      {/* HEADER */}
      <section className="pt-40 pb-16 px-6 md:px-8 max-w-5xl mx-auto text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-indigo-dye">
          Chapter Two · The Reveal
        </span>
        <h1 className="mt-6 font-display text-5xl md:text-7xl leading-[1.05] text-balance">
          A meal you can read, <br />
          but cannot <span className="italic">see.</span>
        </h1>
        <p className="mt-8 max-w-xl mx-auto text-clay leading-relaxed text-lg">
          Click the box. The label flips — ingredients and nutrition, nothing
          else. The dish itself waits inside, where surprise should live.
        </p>
      </section>

      {/* INTERACTIVE BOX */}
      <section className="px-6 md:px-8 pb-24">
        <div className="max-w-xl mx-auto">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-pressed={open}
            aria-label={open ? "Hide ingredients" : "Reveal ingredients"}
            className="relative w-full aspect-square cursor-pointer group [perspective:1500px] focus:outline-none"
          >
            <div
              className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d]"
              style={{
                transform: open ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* SEALED FACE */}
              <div className="absolute inset-0 bg-indigo-dye text-paper p-10 flex flex-col items-center justify-center [backface-visibility:hidden]">
                <div className="w-full h-full border border-paper/20 flex flex-col items-center justify-center gap-6">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-60">
                    Sealed for surprise
                  </span>
                  <div className="w-32 h-32 border border-paper/30 rotate-45 flex items-center justify-center">
                    <span className="-rotate-45 font-display text-5xl italic">
                      H
                    </span>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-60">
                    Tap to read the label
                  </span>
                </div>
              </div>

              {/* REVEALED FACE */}
              <div className="absolute inset-0 bg-paper text-foreground p-8 md:p-10 flex flex-col [backface-visibility:hidden] [transform:rotateY(180deg)] border border-foreground/10">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-indigo-dye font-semibold">
                      Batch {sample.batch}
                    </span>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-clay">
                      {sample.origin}
                    </p>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-clay text-right">
                    Harvested
                    <br />
                    {sample.harvested}
                  </span>
                </div>

                <ul className="mt-6 flex-1 flex flex-col justify-center font-display text-xl md:text-2xl leading-snug">
                  {sample.ingredients.map((i) => (
                    <li
                      key={i}
                      className="border-b border-foreground/10 py-2"
                    >
                      {i}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 pt-4 border-t border-foreground/10 grid grid-cols-4 gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-clay">
                  <div>
                    <span className="block text-foreground text-base font-display">
                      {sample.kcal}
                    </span>
                    kcal
                  </div>
                  <div>
                    <span className="block text-foreground text-base font-display">
                      {sample.protein}
                    </span>
                    Protein
                  </div>
                  <div>
                    <span className="block text-foreground text-base font-display">
                      {sample.carbs}
                    </span>
                    Carbs
                  </div>
                  <div>
                    <span className="block text-foreground text-base font-display">
                      {sample.fat}
                    </span>
                    Fat
                  </div>
                </div>
              </div>
            </div>
          </button>

          <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-clay">
            {open ? "Sealed again →" : "← Reveal label"}
          </p>
        </div>
      </section>

      {/* WHY BLIND */}
      <section className="bg-indigo-dye text-paper py-24 md:py-32 px-6 md:px-8">
        <div className="max-w-5xl mx-auto">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-60">
            Why blind?
          </span>
          <h2 className="mt-4 font-display text-4xl md:text-6xl leading-tight">
            Three reasons we don&rsquo;t show the dish.
          </h2>

          <div className="mt-16 grid md:grid-cols-3 gap-12">
            {[
              {
                no: "i.",
                title: "Against visual bias",
                body: "Photos sell appearance. We want students to trust ingredients first — the way grandparents taught their kids to eat.",
              },
              {
                no: "ii.",
                title: "Against waste",
                body: "Today's box uses what farms had to spare today. The menu can't be a fixed image — it changes with the harvest.",
              },
              {
                no: "iii.",
                title: "For surprise",
                body: "Dinner becomes a small ritual: open, smell, taste, guess. Hakka cooking already lives in this kind of attention.",
              },
            ].map((c) => (
              <article key={c.no}>
                <span className="font-display italic text-3xl text-paper/70">
                  {c.no}
                </span>
                <h3 className="mt-3 font-display text-2xl">{c.title}</h3>
                <p className="mt-4 text-paper/80 leading-relaxed">{c.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
