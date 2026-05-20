import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.jpg";
import { useLang } from "@/lib/i18n";

export function SiteNav() {
  const { lang, setLang, t } = useLang();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/culture", label: t("nav.culture") },
    { to: "/box", label: t("nav.box") },
    { to: "/mission", label: t("nav.mission") },
    { to: "/join", label: t("nav.join") },
  ] as const;

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const LangToggle = (
    <div
      role="group"
      aria-label="Language"
      className="flex items-center font-mono text-[10px] uppercase tracking-[0.2em] border border-border rounded-full overflow-hidden"
    >
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={`px-2.5 py-1 transition-colors ${
          lang === "en" ? "bg-foreground text-background" : "text-clay hover:text-foreground"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang("zh")}
        aria-pressed={lang === "zh"}
        className={`px-2.5 py-1 transition-colors ${
          lang === "zh" ? "bg-foreground text-background" : "text-clay hover:text-foreground"
        }`}
      >
        中
      </button>
    </div>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 h-16 flex items-center justify-between gap-3">
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2 sm:gap-2.5 group min-w-0"
        >
          <img
            src={logo}
            alt="Mangshi 盲食"
            width={36}
            height={36}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover shrink-0"
          />
          <span className="font-display italic text-lg sm:text-xl md:text-2xl tracking-tight text-foreground truncate">
            Mangshi <span className="not-italic text-clay text-sm sm:text-base">盲食</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-10">
          <div className="flex gap-10 text-[11px] uppercase tracking-[0.2em] font-medium text-clay">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="hover:text-foreground transition-colors"
                activeProps={{ className: "text-foreground" }}
              >
                {l.label}
              </Link>
            ))}
          </div>
          {LangToggle}
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-2">
          {LangToggle}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="p-2 -mr-2 text-foreground"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 ease-out border-t border-border bg-background ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="px-6 py-6 flex flex-col gap-5 text-sm uppercase tracking-[0.2em] font-medium text-clay">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="hover:text-foreground transition-colors"
              activeProps={{ className: "text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
