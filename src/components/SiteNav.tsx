import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.jpg";

const links = [
  { to: "/culture", label: "Culture" },
  { to: "/box", label: "The Box" },
  { to: "/mission", label: "Mission" },
  { to: "/join", label: "Join" },
] as const;

export function SiteNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src={logo}
            alt="Mangshi 盲食"
            width={36}
            height={36}
            className="w-9 h-9 rounded-full object-cover"
          />
          <span className="font-display italic text-xl md:text-2xl tracking-tight text-foreground">
            Mangshi <span className="not-italic text-clay text-base">盲食</span>
          </span>
        </Link>
        <div className="flex gap-5 md:gap-10 text-[11px] uppercase tracking-[0.2em] font-medium text-clay">
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
      </div>
    </nav>
  );
}
