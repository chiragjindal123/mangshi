import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/join")({
  head: () => ({
    meta: [
      { title: "Join — Hakka Blind Box" },
      {
        name: "description",
        content:
          "Be among the first students to open a box, or partner with us as a farm, school, or volunteer.",
      },
      { property: "og:title", content: "Join · Hakka Blind Box" },
      {
        property: "og:description",
        content: "Sign up for the first batch of Hakka surprise meals.",
      },
      { property: "og:url", content: "/join" },
    ],
    links: [{ rel: "canonical", href: "/join" }],
  }),
  component: Join;
});

function Join() {
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteNav />

      <section className="flex-1 pt-40 pb-24 px-6 md:px-8">
        <div className="max-w-3xl mx-auto">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-indigo-dye">
            Chapter Four · Join
          </span>
          <h1 className="mt-6 font-display text-5xl md:text-7xl leading-[1.05] text-balance">
            Open the first box <br />
            <span className="italic">with us.</span>
          </h1>
          <p className="mt-8 max-w-xl text-clay leading-relaxed text-lg">
            We&rsquo;re launching a pilot in Taoyuan. Leave your email or LINE
            ID and we&rsquo;ll let you know when the first batch is ready —
            and how to claim a box at student price.
          </p>

          {/* FORM */}
          <div className="mt-14 border-t border-foreground/10 pt-10">
            {submitted ? (
              <div className="py-12 text-center">
                <p className="font-display italic text-3xl md:text-4xl text-indigo-dye">
                  Thank you.
                </p>
                <p className="mt-4 text-clay max-w-md mx-auto leading-relaxed">
                  We&rsquo;ll be in touch when the first batch leaves the
                  kitchen. Until then — eat well, waste less.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="grid gap-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <label className="block">
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-clay">
                      Name
                    </span>
                    <input
                      required
                      type="text"
                      className="mt-2 w-full bg-transparent border-b border-foreground/30 focus:border-indigo-dye outline-none py-3 text-lg font-display"
                      placeholder="Your name"
                    />
                  </label>
                  <label className="block">
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-clay">
                      Email
                    </span>
                    <input
                      required
                      type="email"
                      className="mt-2 w-full bg-transparent border-b border-foreground/30 focus:border-indigo-dye outline-none py-3 text-lg font-display"
                      placeholder="you@university.edu"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-clay">
                    I am a…
                  </span>
                  <select
                    className="mt-2 w-full bg-transparent border-b border-foreground/30 focus:border-indigo-dye outline-none py-3 text-lg font-display appearance-none"
                    defaultValue="student"
                  >
                    <option value="student">Student in Taiwan</option>
                    <option value="intl">International student</option>
                    <option value="farm">Farmer / cooperative</option>
                    <option value="school">School / university</option>
                    <option value="volunteer">Volunteer or cook</option>
                  </select>
                </label>

                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-clay">
                    Anything we should know? (optional)
                  </span>
                  <textarea
                    rows={3}
                    className="mt-2 w-full bg-transparent border-b border-foreground/30 focus:border-indigo-dye outline-none py-3 text-base resize-none"
                    placeholder="Allergies, your campus, why you're interested…"
                  />
                </label>

                <button
                  type="submit"
                  className="mt-6 self-start group inline-flex items-center gap-4 bg-indigo-dye text-paper px-8 py-4 font-mono text-[11px] uppercase tracking-[0.25em] hover:opacity-90 transition-opacity"
                >
                  <span>Reserve my box</span>
                  <span className="block w-6 h-px bg-paper transition-all duration-500 group-hover:w-10" />
                </button>
              </form>
            )}
          </div>

          {/* SECONDARY */}
          <div className="mt-24 grid md:grid-cols-2 gap-10 border-t border-foreground/10 pt-10">
            <div>
              <h3 className="font-display text-2xl">For farmers</h3>
              <p className="mt-3 text-clay leading-relaxed">
                If you&rsquo;re a Taoyuan, Hsinchu or Miaoli grower with
                surplus produce, we&rsquo;ll come pick it up. Email{" "}
                <a className="underline text-indigo-dye" href="mailto:farm@hakkabox.tw">
                  farm@hakkabox.tw
                </a>
                .
              </p>
            </div>
            <div>
              <h3 className="font-display text-2xl">For universities</h3>
              <p className="mt-3 text-clay leading-relaxed">
                Bring the box to your campus dining program. Email{" "}
                <a className="underline text-indigo-dye" href="mailto:campus@hakkabox.tw">
                  campus@hakkabox.tw
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
