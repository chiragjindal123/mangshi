import { Link } from "@tanstack/react-router";

const links = [
  { to: "/culture", label: "Culture" },
  { to: "/box", label: "The Box" },
  { to: "/mission", label: "Mission" },
  { to: "/join", label: "Join" },
] as const;

export function SiteNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="font-display italic text-xl md:text-2xl tracking-tight text-indigo-dye"
        >
          Hakka Box
        </Link>
        <div className="flex gap-6 md:gap-10 text-[11px] uppercase tracking-[0.2em] font-medium text-clay">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="hover:text-indigo-dye transition-colors"
              activeProps={{ className: "text-indigo-dye" }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
