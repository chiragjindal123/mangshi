import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { useLang } from "@/lib/i18n";
import boxBlue from "@/assets/box-blue.png";
import boxRed from "@/assets/box-red.png";
import boxYellow from "@/assets/box-yellow.png";

export const Route = createFileRoute("/box")({
  head: () => ({
    meta: [
      { title: "Today's Menu — Mangshi 盲食" },
      {
        name: "description",
        content:
          "Tap to reveal today's meal — ingredients, allergens, pickup time and price. The dish stays a surprise until you open the lid.",
      },
      { property: "og:title", content: "Today's Menu — Mangshi" },
      {
        property: "og:description",
        content:
          "What will we eat today? Tap to reveal.",
      },
      { property: "og:url", content: "/box" },
    ],
    links: [{ rel: "canonical", href: "/box" }],
  }),
  component: BoxPage,
});

interface MealCard {
  id: string;
  image: string;
  typeLabel: string;
  name: string;
  nameZh: string;
  ingredients: Array<{ emoji: string; name: string; nameZh: string }>;
  mealType: string[];
  allergens: string;
  allergensZh: string;
  pickup: string;
  pickupZh: string;
  price: string;
  todayMenu: string;
  kcal: number;
  protein: string;
  carbs: string;
  fat: string;
  weight: string;
}

const meals: MealCard[] = [
  {
    id: "halal-chicken",
    image: boxBlue,
    typeLabel: "REGULAR 01",
    name: "HALAL CHICKEN BOX",
    nameZh: "清真雞肉盒",
    ingredients: [
      { emoji: "🥬", name: "Cabbage", nameZh: "高麗菜" },
      { emoji: "🥕", name: "Carrot", nameZh: "紅蘿蔔" },
      { emoji: "🍠", name: "Sweet Potato", nameZh: "地瓜" },
      { emoji: "🍗", name: "Halal Chicken", nameZh: "清真雞肉" },
      { emoji: "🍚", name: "Rice", nameZh: "白飯" },
    ],
    mealType: ["Halal", "Regular", "Chicken"],
    allergens: "Soy · Sesame",
    allergensZh: "大豆 · 芝麻",
    pickup: "NCU Campus · 12:00–13:30",
    pickupZh: "中央大學 · 12:00–13:30",
    price: "NT$100",
    todayMenu: "???",
    kcal: 520,
    protein: "26g",
    carbs: "58g",
    fat: "14g",
    weight: "450g",
  },
  {
    id: "pork-box",
    image: boxRed,
    typeLabel: "REGULAR 02",
    name: "BRAISED PORK BOX",
    nameZh: "滷肉盒",
    ingredients: [
      { emoji: "🥬", name: "Mustard Greens", nameZh: "芥菜" },
      { emoji: "🍖", name: "Pork Belly", nameZh: "五花肉" },
      { emoji: "🥕", name: "Daikon Radish", nameZh: "蘿蔔" },
      { emoji: "🫚", name: "Ginger", nameZh: "薑" },
      { emoji: "🍚", name: "Rice", nameZh: "白飯" },
    ],
    mealType: ["Regular", "Pork"],
    allergens: "Soy · Wheat",
    allergensZh: "大豆 · 小麥",
    pickup: "NCU Campus · 12:00–13:30",
    pickupZh: "中央大學 · 12:00–13:30",
    price: "NT$100",
    todayMenu: "???",
    kcal: 580,
    protein: "24g",
    carbs: "52g",
    fat: "22g",
    weight: "470g",
  },
  {
    id: "harvest-box",
    image: boxYellow,
    typeLabel: "SEASONAL 01",
    name: "HARVEST BOX",
    nameZh: "時蔬盒",
    ingredients: [
      { emoji: "🥦", name: "Broccoli", nameZh: "青花菜" },
      { emoji: "🍆", name: "Eggplant", nameZh: "茄子" },
      { emoji: "🌽", name: "Corn", nameZh: "玉米" },
      { emoji: "🥬", name: "Seasonal Greens", nameZh: "時令蔬菜" },
      { emoji: "🍚", name: "Rice", nameZh: "白飯" },
    ],
    mealType: ["Vegetarian", "Seasonal"],
    allergens: "Soy",
    allergensZh: "大豆",
    pickup: "NCU Campus · 12:00–13:30",
    pickupZh: "中央大學 · 12:00–13:30",
    price: "NT$90",
    todayMenu: "???",
    kcal: 420,
    protein: "14g",
    carbs: "62g",
    fat: "10g",
    weight: "430g",
  },
];

function BoxPage() {
  const { lang, t } = useLang();
  const [activeIndex, setActiveIndex] = useState(0);
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  const isZh = lang === "zh";

  const prev = () => {
    setActiveIndex((i) => (i === 0 ? meals.length - 1 : i - 1));
  };
  const next = () => {
    setActiveIndex((i) => (i === meals.length - 1 ? 0 : i + 1));
  };
  const toggleFlip = () => {
    setFlipped((f) => ({ ...f, [activeIndex]: !f[activeIndex] }));
  };

  const meal = meals[activeIndex]!;
  const isOpen = !!flipped[activeIndex];

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      {/* HEADER */}
      <section className="pt-40 pb-10 px-6 md:px-8 max-w-5xl mx-auto text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-indigo-dye">
          {t("box.kicker")}
        </span>
        <h1 className="mt-6 font-display text-5xl md:text-7xl leading-[1.05] text-balance">
          {t("box.title1")}{" "}
          <span className="italic">{t("box.title.see")}</span>
        </h1>
        <p className="mt-8 max-w-xl mx-auto text-clay leading-relaxed text-lg">
          {t("box.body")}
        </p>
      </section>

      {/* INTERACTIVE CARDS */}
      <section className="px-6 md:px-8 pb-24">
        <div className="max-w-md mx-auto">
          {/* Card */}
          <button
            type="button"
            onClick={toggleFlip}
            className="relative w-full aspect-[4/5] cursor-pointer group [perspective:1500px] focus:outline-none"
          >
            <div
              className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d]"
              style={{
                transform: isOpen ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* FRONT — Blind Box Image */}
              <div className="absolute inset-0 [backface-visibility:hidden] flex flex-col items-center justify-center rounded-2xl overflow-hidden">
                <img
                  src={meal.image}
                  alt={meal.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                  <span className="bg-white/90 text-foreground font-display text-lg md:text-xl px-6 py-3 rounded-full shadow-lg">
                    {isZh ? "點擊揭曉!" : "Tap here to reveal!"}
                  </span>
                </div>
              </div>

              {/* BACK — Meal Details */}
              <div className="absolute inset-0 bg-[#f2f1eb] text-foreground p-6 md:p-8 flex flex-col [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl border border-foreground/10 overflow-y-auto">
                {/* Type label */}
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-clay">
                  {meal.typeLabel}
                </span>
                <h3 className="mt-1 font-display text-2xl md:text-3xl font-bold leading-tight">
                  {isZh ? meal.nameZh : meal.name}
                </h3>

                {/* Today's Ingredients */}
                <div className="mt-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-clay font-semibold">
                    {isZh ? "今日食材" : "Today's Ingredients"}
                  </span>
                  <p className="mt-2 text-sm leading-relaxed">
                    {meal.ingredients.map((ing, i) => (
                      <span key={ing.name}>
                        {i > 0 && " · "}
                        {ing.emoji} {isZh ? ing.nameZh : ing.name}
                      </span>
                    ))}
                  </p>
                </div>

                {/* Meal Type */}
                <div className="mt-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-clay font-semibold">
                    {isZh ? "餐點類型" : "Meal Type"}
                  </span>
                  <p className="mt-1 text-sm font-semibold">
                    {meal.mealType.join(" · ")}
                  </p>
                </div>

                {/* Allergens */}
                <div className="mt-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-clay font-semibold">
                    {isZh ? "過敏原" : "Allergens"}
                  </span>
                  <p className="mt-1 text-sm">
                    {isZh ? meal.allergensZh : meal.allergens}
                  </p>
                </div>

                {/* Pickup */}
                <div className="mt-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-clay font-semibold">
                    {isZh ? "取餐" : "Pickup"}
                  </span>
                  <p className="mt-1 text-sm">
                    {isZh ? meal.pickupZh : meal.pickup}
                  </p>
                </div>

                {/* Price */}
                <p className="mt-3 text-xl font-bold">{meal.price}</p>

                {/* Nutrition row */}
                <div className="mt-3 pt-3 border-t border-foreground/10 grid grid-cols-4 gap-2 text-center">
                  <div>
                    <span className="block text-foreground text-base font-display">{meal.kcal}</span>
                    <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-clay">{t("box.kcal")}</span>
                  </div>
                  <div>
                    <span className="block text-foreground text-base font-display">{meal.protein}</span>
                    <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-clay">{t("box.protein")}</span>
                  </div>
                  <div>
                    <span className="block text-foreground text-base font-display">{meal.carbs}</span>
                    <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-clay">{t("box.carbs")}</span>
                  </div>
                  <div>
                    <span className="block text-foreground text-base font-display">{meal.fat}</span>
                    <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-clay">{t("box.fat")}</span>
                  </div>
                </div>

                {/* Today's Menu teaser */}
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-sm font-semibold">{isZh ? "今日菜單:" : "Today's Menu:"}</span>
                  <span className="bg-foreground text-background text-xs px-2 py-0.5 rounded font-mono">
                    {meal.todayMenu}
                  </span>
                </div>
              </div>
            </div>
          </button>

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-center gap-6">
            <button
              type="button"
              onClick={prev}
              className="p-2 border border-foreground/20 rounded-full hover:bg-foreground/5 transition-colors"
              aria-label="Previous box"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex gap-2">
              {meals.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    i === activeIndex ? "bg-foreground" : "bg-foreground/20"
                  }`}
                  aria-label={`Box ${i + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={next}
              className="p-2 border border-foreground/20 rounded-full hover:bg-foreground/5 transition-colors"
              aria-label="Next box"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-clay">
            {isOpen
              ? (isZh ? "← 重新封盒" : "Sealed again →")
              : (isZh ? "揭開盲食 →" : "← Reveal meal")}
          </p>

          {/* PREORDER BUTTON */}
          <div className="mt-8 text-center">
            <Link
              to="/system/supply"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-mono text-[11px] uppercase tracking-[0.2em] font-bold shadow-lg border border-black/15 transition-all transform hover:scale-105 animate-bounce"
              style={{ backgroundColor: "#ffffff", color: "#000000" }}
            >
              <Sparkles size={15} className="animate-spin" style={{ color: "#d97706" }} />
              <span style={{ color: "#000000" }}>START TO PREORDER - FARMER / STUDENT</span>
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
