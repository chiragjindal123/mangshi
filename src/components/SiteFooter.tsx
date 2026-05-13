import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border py-16 px-6 md:px-8 bg-background">
      <div className="max-w-7xl mx-auto grid gap-12 md:grid-cols-3">
        <div>
          <Link
            to="/"
            className="font-display italic text-2xl text-indigo-dye"
          >
            Hakka Blind Box
          </Link>
          <p className="mt-4 text-sm text-clay leading-relaxed max-w-xs">
            A student-led initiative rescuing surplus harvest from Taiwanese
            farms — served as Hakka heritage meals, sealed for surprise.
          </p>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-clay/60">
            Taoyuan · Hsinchu · Miaoli
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-clay/60 mb-1">
            Explore
          </span>
          <Link to="/culture" className="text-sm hover:text-indigo-dye transition-colors">
            Hakka Culture
          </Link>
          <Link to="/box" className="text-sm hover:text-indigo-dye transition-colors">
            The Blind Box
          </Link>
          <Link to="/mission" className="text-sm hover:text-indigo-dye transition-colors">
            Our Mission
          </Link>
          <Link to="/join" className="text-sm hover:text-indigo-dye transition-colors">
            Get Involved
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-clay/60 mb-1">
            Recognition
          </span>
          <span className="text-sm text-clay">2025 Honorable Mention — Social Innovation</span>
          <span className="text-sm text-clay">Partnered with Taoyuan farm cooperatives</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-6 border-t border-border flex flex-col sm:flex-row justify-between gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-clay/60">
        <span>© 2026 Hakka Blind Box Initiative</span>
        <span>客家盲盒 · 誠食與山林</span>
      </div>
    </footer>
  );
}
