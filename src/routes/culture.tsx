import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import cultureHands from "@/assets/culture-hands.jpg";
import cultureVillage from "@/assets/culture-village.jpg";
import ingredients from "@/assets/ingredients.jpg";

export const Route = createFileRoute("/culture")({
  head: () => ({
    meta: [
      { title: "Hakka Culture — Hakka Blind Box" },
      {
        name: "description",
        content:
          "Hakka heritage in Taiwan: pickling, preservation, indigo textiles, and the philosophy of wasting nothing.",
      },
      { property: "og:title", content: "Hakka Culture" },
      {
        property: "og:description",
        content:
          "The mountain kitchen of Taiwan — preservation, indigo, and a cuisine that refuses waste.",
      },
      { property: "og:url", content: "/culture" },
    ],
    links: [{ rel: "canonical", href: "/culture" }],
  }),
  component: Culture,
});

const stories = [
  {
    no: "01",
    title: "Lei Cha — the bowl of pounded tea",
    body: "Roasted seeds, herbs, and tea leaves ground with a wooden pestle into a savoury broth. A Hakka welcome older than tea ceremony itself.",
  },
  {
    no: "02",
    title: "Pickled mustard greens (酸菜)",
    body: "Surplus winter greens were buried in salt and time. The same jars now feed our kitchen — every bite is a ledger of patience.",
  },
  {
    no: "03",
    title: "Indigo dyeing of Sanyi",
    body: "The deep blue on our box wraps comes from a Hakka craft that turned mountain plants into the cloth a whole people wore to work.",
  },
  {
    no: "04",
    title: "The migrant table",
    body: "Hakka means 'guest family' — four hundred years of moving across China and Taiwan. Their food learned to travel, store, and share.",
  },
];

function Culture() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      {/* OPENING */}
      <section className="pt-40 pb-20 px-6 md:px-8 max-w-5xl mx-auto">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-indigo-dye">
          Chapter One · Heritage
        </span>
        <h1 className="mt-6 font-display text-5xl md:text-7xl leading-[1.05] text-balance">
          A cuisine taught by <span className="italic">scarcity,</span>{" "}
          remembered through <span className="italic">generosity.</span>
        </h1>
        <p className="mt-8 max-w-2xl text-clay leading-relaxed text-lg">
          The Hakka people of Taiwan settled the harder land — the foothills,
          the marginal soil. Their cooking became a quiet engineering of time:
          how to make a single harvest feed a family until the next one came.
        </p>
      </section>

      {/* FULL-BLEED IMAGE */}
      <section className="px-6 md:px-8">
        <img
          src={cultureVillage}
          alt="Traditional Hakka village courtyard with pickling jars and indigo textiles"
          loading="lazy"
          width={1400}
          height={1000}
          className="w-full aspect-[16/9] object-cover"
        />
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-clay/70">
          A village courtyard in Miaoli — pickling jars, dried herbs, indigo cloth.
        </p>
      </section>

      {/* STORIES GRID */}
      <section className="py-24 md:py-32 px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-clay">
            Field notes
          </span>
          <h2 className="mt-4 font-display text-4xl md:text-5xl">
            Four traditions, still warm.
          </h2>

          <div className="mt-16 grid md:grid-cols-2 gap-x-12 gap-y-16">
            {stories.map((s) => (
              <article key={s.no} className="border-t border-foreground/10 pt-6">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-indigo-dye">
                  {s.no}
                </span>
                <h3 className="mt-3 font-display text-3xl leading-tight">
                  {s.title}
                </h3>
                <p className="mt-4 text-clay leading-relaxed">{s.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PORTRAIT + QUOTE */}
      <section className="px-6 md:px-8 pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-6">
            <img
              src={cultureHands}
              alt="An elderly weaver's hands at an indigo loom"
              loading="lazy"
              width={1080}
              height={1620}
              className="w-full aspect-[3/4] object-cover"
            />
          </div>
          <div className="md:col-span-6">
            <blockquote className="font-display text-3xl md:text-5xl italic leading-tight text-balance">
              &ldquo;We never threw food out. The pot just got older, and so
              did the flavour.&rdquo;
            </blockquote>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-clay">
              — Grandmother Liu, Beipu, 87
            </p>
          </div>
        </div>
      </section>

      {/* CLOSING IMAGE */}
      <section className="px-6 md:px-8 pb-32">
        <div className="max-w-7xl mx-auto">
          <img
            src={ingredients}
            alt="Surplus broccoli, mustard greens, daikon and ginger on linen"
            loading="lazy"
            width={1400}
            height={1000}
            className="w-full aspect-[16/10] object-cover"
          />
          <div className="mt-10 max-w-2xl">
            <p className="font-display text-2xl md:text-3xl leading-snug text-balance">
              These are the ingredients today&rsquo;s market called{" "}
              <span className="italic">surplus.</span> A Hakka kitchen would
              just call them <span className="italic">dinner.</span>
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
