import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import heroSteam from "@/assets/hero-steam.jpg";
import cultureHands from "@/assets/culture-hands.jpg";
import boxSealed from "@/assets/box-sealed.jpg";
import missionFarm from "@/assets/mission-farm.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hakka Blind Box — Mama's hand, sealed in a box" },
      {
        name: "description",
        content:
          "Hakka heritage meals from rescued surplus produce, served sealed so the flavor — not the photo — leads the experience.",
      },
      { property: "og:title", content: "Hakka Blind Box" },
      {
        property: "og:description",
        content: "An experiential platform for Taiwan students.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* HERO */}
      <section className="relative h-screen w-full overflow-hidden">
        <img
          src={heroSteam}
          alt="Steam rising from a bamboo steamer in a Taiwanese kitchen"
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 animate-reveal">
          <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-paper/70 mb-8">
            The Hidden Harvest · 客家盲盒
          </span>
          <h1 className="font-display text-5xl sm:text-6xl md:text-8xl text-paper leading-[0.95] text-balance max-w-5xl">
            The steam carries a memory <br className="hidden md:block" />
            <span className="italic">you haven&rsquo;t lived yet.</span>
          </h1>
          <p className="mt-8 max-w-md text-paper/80 text-base leading-relaxed">
            A student-run kitchen rescuing surplus harvest from Taiwanese farms
            — served as Hakka heritage meals, sealed for surprise.
          </p>
          <Link
            to="/box"
            className="mt-10 group inline-flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.25em] text-paper"
          >
            <span>Open the box</span>
            <span className="block w-10 h-px bg-paper transition-all duration-500 group-hover:w-16" />
          </Link>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <span className="block w-px h-12 bg-paper/30" />
        </div>
      </section>

      {/* INTRO STRIP */}
      <section className="py-24 md:py-32 px-6 md:px-8 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-clay">
            Three threads · One plate
          </span>
          <h2 className="mt-6 font-display text-4xl md:text-6xl leading-tight text-foreground text-balance">
            We rescue Taiwan&rsquo;s surplus harvest before it&rsquo;s lost —
            <span className="italic"> and cook it the way grandmothers always have.</span>
          </h2>
        </div>
      </section>

      {/* CULTURE TEASER */}
      <section className="px-6 md:px-8 pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-10 md:gap-16 items-end">
          <div className="md:col-span-7">
            <img
              src={cultureHands}
              alt="Elderly Hakka woman weaving indigo textile"
              loading="lazy"
              width={1200}
              height={1500}
              className="w-full aspect-[4/5] object-cover"
            />
          </div>
          <div className="md:col-span-5 pb-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-indigo-dye">
              01 — Culture
            </span>
            <h3 className="mt-4 font-display text-4xl md:text-5xl leading-tight">
              The mountain kitchen, <span className="italic">remembered.</span>
            </h3>
            <p className="mt-6 text-clay leading-relaxed max-w-md">
              Taiwan&rsquo;s Hakka villages built a cuisine of preservation —
              pickled greens, sun-dried radish, cured pork — born from never
              wasting a harvest. We bring that wisdom back to campus.
            </p>
            <Link
              to="/culture"
              className="mt-8 inline-flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.25em] text-indigo-dye group"
            >
              <span>Inherit the kitchen</span>
              <span className="block w-8 h-px bg-indigo-dye transition-all duration-500 group-hover:w-12" />
            </Link>
          </div>
        </div>
      </section>

      {/* BOX TEASER */}
      <section className="bg-indigo-dye text-paper py-24 md:py-32 px-6 md:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-5 md:order-2">
            <img
              src={boxSealed}
              alt="A sealed kraft meal box with an indigo paper band"
              loading="lazy"
              width={1200}
              height={1200}
              className="w-full aspect-square object-cover"
            />
          </div>
          <div className="md:col-span-7 md:order-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-60">
              02 — The Box
            </span>
            <h3 className="mt-4 font-display text-4xl md:text-5xl leading-tight">
              No name. No photo. <br />
              <span className="italic">Just nature&rsquo;s receipt.</span>
            </h3>
            <p className="mt-6 max-w-md leading-relaxed opacity-80">
              Every box shows only its ingredients and nutrition. The dish stays
              hidden until you open the lid — a small ritual against visual
              bias, and a quiet act of trust in the cook.
            </p>
            <Link
              to="/box"
              className="mt-8 inline-flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.25em] group"
            >
              <span>See the reveal</span>
              <span className="block w-8 h-px bg-paper transition-all duration-500 group-hover:w-12" />
            </Link>
          </div>
        </div>
      </section>

      {/* MISSION TEASER */}
      <section className="relative py-32 md:py-40 px-6 md:px-8 overflow-hidden">
        <img
          src={missionFarm}
          alt="Misty terraced vegetable farm in Miaoli at dawn"
          loading="lazy"
          width={1600}
          height={1000}
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-clay">
            03 — Mission
          </span>
          <p className="mt-8 font-display text-7xl md:text-9xl text-indigo-dye italic leading-none">
            94%
          </p>
          <p className="mt-6 font-display text-2xl md:text-3xl max-w-2xl mx-auto text-balance leading-snug text-foreground">
            of Taiwan&rsquo;s vegetable harvest stays in the country — and when
            the market saturates, fields are tilled back under.
          </p>
          <Link
            to="/mission"
            className="mt-10 inline-flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.25em] text-indigo-dye group"
          >
            <span>The numbers behind the box</span>
            <span className="block w-8 h-px bg-indigo-dye transition-all duration-500 group-hover:w-12" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
