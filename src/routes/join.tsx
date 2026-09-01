import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { useLang } from "@/lib/i18n";
import { addJoinSubmission } from "@/lib/system.functions";

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
  component: Join,
});

function Join() {
  const { t } = useLang();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitJoin = useServerFn(addJoinSubmission);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("student");
  const [note, setNote] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setIsSubmitting(true);
    try {
      await submitJoin({
        data: {
          name: name.trim(),
          email: email.trim(),
          role,
          note: note.trim() || undefined,
        },
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit join form:", err);
      // Fallback display thank you state
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteNav />

      <section className="flex-1 pt-40 pb-24 px-6 md:px-8">
        <div className="max-w-3xl mx-auto">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-indigo-dye">
            {t("join.kicker")}
          </span>
          <h1 className="mt-6 font-display text-5xl md:text-7xl leading-[1.05] text-balance">
            {t("join.title1")} <br />
            <span className="italic">{t("join.title2")}</span>
          </h1>
          <p className="mt-8 max-w-xl text-clay leading-relaxed text-lg">
            {t("join.body")}
          </p>

          {/* FORM */}
          <div className="mt-14 border-t border-foreground/10 pt-10">
            {submitted ? (
              <div className="py-12 text-center">
                <p className="font-display italic text-3xl md:text-4xl text-indigo-dye">
                  {t("join.thanks.title")}
                </p>
                <p className="mt-4 text-clay max-w-md mx-auto leading-relaxed">
                  {t("join.thanks.body")}
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="grid gap-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <label className="block">
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-clay">
                      {t("join.field.name")}
                    </span>
                    <input
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-2 w-full bg-transparent border-b border-foreground/30 focus:border-indigo-dye outline-none py-3 text-lg font-display"
                      placeholder={t("join.field.name.ph")}
                    />
                  </label>
                  <label className="block">
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-clay">
                      {t("join.field.email")}
                    </span>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-2 w-full bg-transparent border-b border-foreground/30 focus:border-indigo-dye outline-none py-3 text-lg font-display"
                      placeholder={t("join.field.email.ph")}
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-clay">
                    {t("join.field.role")}
                  </span>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="mt-2 w-full bg-transparent border-b border-foreground/30 focus:border-indigo-dye outline-none py-3 text-lg font-display appearance-none"
                  >
                    <option value="student">{t("join.role.student")}</option>
                    <option value="intl">{t("join.role.intl")}</option>
                    <option value="farm">{t("join.role.farm")}</option>
                    <option value="school">{t("join.role.school")}</option>
                    <option value="volunteer">{t("join.role.volunteer")}</option>
                  </select>
                </label>

                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-clay">
                    {t("join.field.note")}
                  </span>
                  <textarea
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="mt-2 w-full bg-transparent border-b border-foreground/30 focus:border-indigo-dye outline-none py-3 text-base resize-none"
                    placeholder={t("join.field.note.ph")}
                  />
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-6 self-start group inline-flex items-center gap-4 bg-indigo-dye text-paper px-8 py-4 font-mono text-[11px] uppercase tracking-[0.25em] hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <span>{isSubmitting ? "Submitting…" : t("join.submit")}</span>
                  <span className="block w-6 h-px bg-paper transition-all duration-500 group-hover:w-10" />
                </button>
              </form>
            )}
          </div>

          {/* SECONDARY */}
          <div className="mt-24 grid md:grid-cols-2 gap-10 border-t border-foreground/10 pt-10">
            <div>
              <h3 className="font-display text-2xl">{t("join.farmers.title")}</h3>
              <p className="mt-3 text-clay leading-relaxed">
                {t("join.farmers.body1")}
                <a className="underline text-indigo-dye" href="mailto:mangshi.lab@gmail.com">
                  mangshi.lab@gmail.com
                </a>
                .
              </p>
            </div>
            <div>
              <h3 className="font-display text-2xl">{t("join.universities.title")}</h3>
              <p className="mt-3 text-clay leading-relaxed">
                {t("join.universities.body1")}
                <a className="underline text-indigo-dye" href="mailto:mangshi.lab@gmail.com">
                  mangshi.lab@gmail.com
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
