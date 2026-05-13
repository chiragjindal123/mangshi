import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import missionFarm from "@/assets/mission-farm.jpg";
import ingredients from "@/assets/ingredients.jpg";

export const Route = createFileRoute("/mission")({
  head: () => ({
    meta: [
      { title: "Mission — Hakka Blind Box" },
      {
        name: "description",
        content:
          "Why we exist: 94% of Taiwan's vegetables stay domestic, fields are tilled back under, and students still can't afford a balanced meal.",
      },
      { property: "og:title", content: "Mission · Hakka Blind Box" },
      {
        property: "og:description",
        content:
          "The numbers behind the box — food waste, student affordability, and cultural disconnect in Taiwan.",
      },
      { property: "og:url", content: "/mission" },
    ],
    links: [{ rel: "canonical", href: "/mission" }],
  }),
  component: Mission,
});

const stats = [
  {
    figure: "94%",
    label: "Vegetable supply",
    body: "Of Taiwan's annual vegetable harvest must be absorbed by the saturated domestic market — only ~6% is exported.",
  },
  {
    figure: "NT$10",
    label: "A head of broccoli",
    body: "Farm-gate price during the 2025 winter glut. The crate to ship it cost NT$45 — so it was left to rot in the field.",
  },
  {
    figure: "330k T",
    label: "Fruit lost yearly",
    body: "Up to 339,000 tonnes of fruit spoil before reaching consumers each year — roughly 11% of national output.",
  },
  {
    figure: "1,600",
    label: "Crates a day",
    body: "Surge volume from a single Chiayi cooperative during the 2025 broccoli crisis — a market that simply could not absorb the supply.",
  },
];

function Mission() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      {/* HEADER */}
      <section className="pt-40 pb-20 px-6 md:px-8 max-w-5xl mx-auto">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-indigo-dye">
          Chapter Three · Why We Exist
        </span>
        <h1 className="mt-6 font-display text-5xl md:text-7xl leading-[1.05] text-balance">
          Produce wasted at the farm. <br />
          Students who <span className="italic">can&rsquo;t afford</span> dinner.
        </h1>
        <p className="mt-8 max-w-2xl text-clay leading-relaxed text-lg">
          Two crises sit on opposite ends of the same broken chain. We shorten
          the chain — directly from cooperative to campus — and pay for it by
          reviving Hakka recipes that were always built for surplus.
        </p>
      </section>

      {/* FULL-BLEED FARM */}
      <section className="px-6 md:px-8">
        <img
          src={missionFarm}
          alt="Misty terraced farm in Miaoli highlands"
          loading="lazy"
          width={1600}
          height={1000}
          className="w-full aspect-[16/8] object-cover"
        />
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-clay/70">
          Miaoli highlands at dawn — a harvest that may never reach a plate.
        </p>
      </section>

      {/* DATA */}
      <section className="py-24 md:py-32 px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-clay">
            The numbers
          </span>
          <h2 className="mt-4 font-display text-4xl md:text-5xl">
            What &ldquo;sell more, lose more&rdquo; really looks like.
          </h2>

          <div className="mt-16 grid md:grid-cols-2 gap-x-16 gap-y-20">
            {stats.map((s) => (
              <article key={s.label} className="border-t border-foreground/10 pt-8">
                <p className="font-display italic text-7xl md:text-8xl text-indigo-dye leading-none">
                  {s.figure}
                </p>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-clay">
                  {s.label}
                </p>
                <p className="mt-4 text-foreground/80 leading-relaxed max-w-md">
                  {s.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* THREE PROBLEMS, ONE ANSWER */}
      <section className="bg-indigo-dye text-paper py-24 md:py-32 px-6 md:px-8">
        <div className="max-w-5xl mx-auto">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-60">
            Three problems · One plate
          </span>
          <h2 className="mt-4 font-display text-4xl md:text-6xl leading-tight">
            Food waste. Student hunger. <br />
            <span className="italic">Cultural disconnect.</span>
          </h2>
          <p className="mt-8 max-w-2xl leading-relaxed opacity-80">
            Taiwan&rsquo;s international students rely on convenience food.
            Local students eat out three meals a day. Meanwhile, Hakka villages
            still know how to make produce last for a season — and farmers tilling
            their unsold crops back into the soil could feed all of them. We exist to
            close that loop, one box at a time.
          </p>
        </div>
      </section>

      {/* MODEL */}
      <section className="py-24 md:py-32 px-6 md:px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-6">
            <img
              src={ingredients}
              alt="Rescued surplus vegetables"
              loading="lazy"
              width={1400}
              height={1000}
              className="w-full aspect-square object-cover"
            />
          </div>
          <div className="md:col-span-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-indigo-dye">
              The loop
            </span>
            <h3 className="mt-4 font-display text-4xl md:text-5xl leading-tight">
              Rescue · Cook · Seal · Surprise.
            </h3>
            <ol className="mt-8 space-y-6">
              {[
                ["Rescue", "Daily pick-ups from cooperative farms in Taoyuan, Hsinchu and Miaoli — produce that would have been tilled under."],
                ["Cook", "A small Hakka kitchen prepares a single menu per day, using only what arrived that morning."],
                ["Seal", "Each meal is sealed with a label of ingredients and nutrition — the dish stays hidden."],
                ["Surprise", "Students open the box on campus. A meal that costs less than convenience food, made by hand."],
              ].map(([t, b], i) => (
                <li key={t} className="flex gap-6">
                  <span className="font-display italic text-3xl text-indigo-dye/60 w-8 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h4 className="font-display text-2xl">{t}</h4>
                    <p className="mt-2 text-clay leading-relaxed">{b}</p>
                  </div>
                </li>
              ))}
            </ol>

            <Link
              to="/join"
              className="mt-10 inline-flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.25em] text-indigo-dye group"
            >
              <span>Join the first batch</span>
              <span className="block w-8 h-px bg-indigo-dye transition-all duration-500 group-hover:w-12" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
