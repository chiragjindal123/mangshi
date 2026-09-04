import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Sparkles, Utensils, Shuffle } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { useLang } from "@/lib/i18n";
import heroSteam from "@/assets/hero-steam.jpg";
import grandmaCooking from "@/assets/grandma-cooking.jpg";
import boxSealed from "@/assets/box-sealed.jpg";
import missionFarm from "@/assets/mission-farm.jpg";
import sealedBoxHands from "@/assets/sealed-box-hands-v2.png";
import hakkaTable from "@/assets/hakka-table.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mangshi 盲食 — 就吃盲食!" },
      {
        name: "description",
        content:
          "Homecook meals from rescued surplus produce — mama's recipes across cultures (Taiwanese, Indian, Indonesian, Vietnamese, Korean), sealed for surprise.",
      },
      { property: "og:title", content: "Mangshi 盲食" },
      {
        property: "og:description",
        content: "What will we eat today? 就吃盲食!",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

export interface CuisineTheme {
  id: string;
  flag: string;
  nameEn: string;
  nameZh: string;
  heroTitle1En: string;
  heroTitle1Zh: string;
  heroTitle2En: string;
  heroTitle2Zh: string;
  subEn: string;
  subZh: string;
  introTitle1En: string;
  introTitle1Zh: string;
  introTitle2En: string;
  introTitle2Zh: string;
  cultureTitle1En: string;
  cultureTitle1Zh: string;
  cultureTitle2En: string;
  cultureTitle2Zh: string;
  cultureBodyEn: string;
  cultureBodyZh: string;
  signatureDishesEn: string[];
  signatureDishesZh: string[];
}

const CUISINE_THEMES: CuisineTheme[] = [
  {
    id: "all",
    flag: "🍱",
    nameEn: "Global Fusion",
    nameZh: "跨文化誠食",
    heroTitle1En: "Every culture has a recipe",
    heroTitle1Zh: "每一個文化，都有屬於",
    heroTitle2En: "for home.",
    heroTitle2Zh: "家的滋味。",
    subEn: "A student-run kitchen rescuing surplus harvest — cooking authentic homecook recipes from Taiwan, India, Indonesia, Vietnam, Korea, and beyond.",
    subZh: "由學生經營的廚房，搶救農地剩食 —— 重現台灣、印度、印尼、越南、韓國的經典家常菜，封盒成驚喜。",
    introTitle1En: "We rescue Taiwan's surplus harvest before it's lost —",
    introTitle1Zh: "我們搶救台灣即將被丟棄的剩食 ——",
    introTitle2En: "and cook it the way mothers across cultures always have.",
    introTitle2Zh: "用各國媽媽的方式把它煮成一熱騰騰的頓飯。",
    cultureTitle1En: "Heritage recipes,",
    cultureTitle1Zh: "多元文化的廚房，",
    cultureTitle2En: "remembered.",
    cultureTitle2Zh: "溫暖重現。",
    cultureBodyEn: "From Taiwanese pickled mustard greens to Indian dal tadka, Indonesian rendang, and Vietnamese fresh herbs — home cooking everywhere was born from valuing every harvest.",
    cultureBodyZh: "從台灣客家酸菜到印度黃豆咖哩、印尼仁當與越南新鮮香草 —— 各地的家常菜源於對每一份收成的珍惜。我們把這份智慧帶回校園。",
    signatureDishesEn: ["Taiwanese Braised Pork", "Halal Butter Chicken", "Indonesian Rendang", "Vietnamese Pho", "Korean Kimchi Stew"],
    signatureDishesZh: ["台灣古早控肉", "印度清真奶油雞", "印尼巴東仁當", "越南清甜河粉", "韓式泡菜豬肉鍋"],
  },
  {
    id: "taiwan",
    flag: "🇹🇼",
    nameEn: "Taiwanese Homecook",
    nameZh: "台灣古早味",
    heroTitle1En: "Mama's Taiwanese kitchen,",
    heroTitle1Zh: "阿嬤與媽媽的台灣廚房，",
    heroTitle2En: "warm & nostalgic.",
    heroTitle2Zh: "溫暖的回憶。",
    subEn: "Sun-dried daikon, braised pork belly, pickled mustard greens — preserving Taiwan's richest farm harvests into comforting meals.",
    subZh: "曬乾蘿蔔絲、控肉、客家酸菜 —— 保存台灣最豐美的農地收成，化為最溫暖的台味家常餐盒。",
    introTitle1En: "Taiwan's traditional kitchens refuse to waste —",
    introTitle1Zh: "台灣傳統廚房珍惜每一份土地賜予 ——",
    introTitle2En: "turning simple farm produce into unforgettable soul food.",
    introTitle2Zh: "把簡單的農產煮成令人懷念的靈魂美食。",
    cultureTitle1En: "The mountain kitchen,",
    cultureTitle1Zh: "寶島的廚房，",
    cultureTitle2En: "remembered.",
    cultureTitle2Zh: "被世代記得。",
    cultureBodyEn: "Taiwan's farming villages built a cuisine of preservation — pickled greens, sun-dried radish, cured pork — born from never wasting a harvest.",
    cultureBodyZh: "台灣農村發展出一套保存食材的美味工藝 —— 酸菜、蘿蔔乾、臘肉 —— 源於對每一份收成的感激。",
    signatureDishesEn: ["Braised Pork Rice (滷肉飯)", "Pickled Mustard Pork (酸菜五花肉)", "Sun-Dried Daikon Soup (老菜脯湯)", "Seasonal Stir-fry (當季時菜)"],
    signatureDishesZh: ["古早味滷肉飯", "客家酸菜五花肉", "老菜脯燉湯", "清甜當季時菜"],
  },
  {
    id: "india",
    flag: "🇮🇳",
    nameEn: "Authentic Indian",
    nameZh: "印度道地風味",
    heroTitle1En: "Rich spices & home-cooked",
    heroTitle1Zh: "濃郁香料與家的溫暖，",
    heroTitle2En: "Indian warmth.",
    heroTitle2Zh: "印度道地美味。",
    subEn: "Aromatics, lentils, halal poultry, and farm-fresh spinach turned into wholesome, comforting Indian curries.",
    subZh: "以產地新鮮蔬菜、豆類與清真肉品，運用道地香料慢火熬煮出溫暖心靈的印度咖哩餐盒。",
    introTitle1En: "Spices, lentils, and fresh greens —",
    introTitle1Zh: "香料、豆類與新鮮時菜 ——",
    introTitle2En: "bringing authentic home-style Indian cooking to your campus.",
    introTitle2Zh: "將最道地的印度的家常滋味帶進校園餐盒。",
    cultureTitle1En: "The spice hearth,",
    cultureTitle1Zh: "香料的火爐，",
    cultureTitle2En: "nourishing body & soul.",
    cultureTitle2Zh: "滋養身心。",
    cultureBodyEn: "Indian home cooking transforms humble seasonal vegetables and pulses into vibrant curries using turmeric, cumin, and ginger.",
    cultureBodyZh: "印度家常菜擅長將平實的當季蔬菜與豆類，運用薑黃、孜然與生薑轉化為充滿生命力的美味佳餚。",
    signatureDishesEn: ["Halal Chicken Tikka Box", "Palak Paneer (Spinach Curry)", "Dal Tadka (Spiced Lentils)", "Vegetable Biryani"],
    signatureDishesZh: ["清真香料雞肉飯", "菠菜起司咖哩", "黃豆香料咖哩", "蔬菜香料香米飯"],
  },
  {
    id: "indonesia",
    flag: "🇮🇩",
    nameEn: "Indonesian Comfort",
    nameZh: "印尼家鄉味",
    heroTitle1En: "Nasi, sambal & island",
    heroTitle1Zh: "印尼家鄉味 ——",
    heroTitle2En: "comfort food.",
    heroTitle2Zh: "香料與南洋風情。",
    subEn: "Lemongrass, coconut, galangal, and slow-braised spices bringing Jakarta & Bali mamas' cooking straight to your box.",
    subZh: "香茅、椰奶、南薑與慢火香料，將雅加達與巴里島媽媽的溫暖帶到校園。",
    introTitle1En: "Fragrant coconut and rich slow-braised herbs —",
    introTitle1Zh: "濃郁椰香與慢火香草燉煮 ——",
    introTitle2En: "rescuing fresh produce into authentic Indonesian home meals.",
    introTitle2Zh: "將新鮮產地食材轉化為最道地的印尼家常菜。",
    cultureTitle1En: "The island table,",
    cultureTitle1Zh: "群島的餐桌，",
    cultureTitle2En: "shared with love.",
    cultureTitle2Zh: "滿載熱情與分享。",
    cultureBodyEn: "Indonesian cuisine relies on rich sambals, coconut milk, and aromatic roots to preserve and elevate fresh vegetables and proteins.",
    cultureBodyZh: "印尼料理善用獨特的辣椒醬 (Sambal)、椰奶與芳香根莖，賦予當季食材豐富迷人的層次風味。",
    signatureDishesEn: ["Beef / Chicken Rendang", "Nasi Goreng Special", "Sayur Lodeh (Veg Curry)", "Tempeh Sambal"],
    signatureDishesZh: ["巴東仁當燉肉", "印尼風味炒飯", "南洋椰香燉蔬菜", "香辣天貝豆腐"],
  },
  {
    id: "vietnam",
    flag: "🇻🇳",
    nameEn: "Vietnamese Flavors",
    nameZh: "越南道地好味",
    heroTitle1En: "Fresh herbs & fragrant broths,",
    heroTitle1Zh: "新鮮香草與清甜高湯，",
    heroTitle2En: "light & comforting.",
    heroTitle2Zh: "越南家常好味。",
    subEn: "Crisp seasonal greens, star anise, lemongrass, and light rice dishes crafted from morning farm picks.",
    subZh: "爽脆的當季蔬菜、八角與香茅，以當晨採收的食材做出清爽滋補的越南家常餐盒。",
    introTitle1En: "Fresh mint, coriander, and light broths —",
    introTitle1Zh: "新鮮薄荷、香菜與清爽高湯 ——",
    introTitle2En: "healthy, delicate Vietnamese recipes using rescued greens.",
    introTitle2Zh: "運用新鮮剩食蔬菜打造清爽健康無負擔的越南料理。",
    cultureTitle1En: "The Saigon garden,",
    cultureTitle1Zh: "清爽的越式園圃，",
    cultureTitle2En: "fresh & balanced.",
    cultureTitle2Zh: "平衡與清新。",
    cultureBodyEn: "Vietnamese home cooking emphasizes balance, raw herbs, and light seasoning that highlight the natural sweetness of freshly harvested vegetables.",
    cultureBodyZh: "越南家常菜講求五味平衡，以大量新鮮生草與輕柔調味，凸顯新鮮採收蔬菜的原汁原味。",
    signatureDishesEn: ["Lemongrass Chicken Rice", "Fresh Summer Rolls", "Vegetable Pho Broth", "Vietnamese Caramelized Pork"],
    signatureDishesZh: ["香茅雞肉飯", "越式鮮蝦蔬菜春捲", "清甜蔬菜河粉湯", "越式香茅焦糖肉"],
  },
  {
    id: "korea",
    flag: "🇰🇷",
    nameEn: "Korean Comfort",
    nameZh: "韓國家常菜",
    heroTitle1En: "Kimchi warmth & slow-simmered",
    heroTitle1Zh: "泡菜的溫暖與慢火燉煮，",
    heroTitle2En: "Korean stews.",
    heroTitle2Zh: "韓式經典家常餐盒。",
    subEn: "Fermented cabbages, sesame oil, garlic, and comforting stews made to nourish every hungry student.",
    subZh: "發酵白菜、麻油與蒜香，微辣溫暖的家常燉菜，給每一位學生最實在的飽足與溫暖。",
    introTitle1En: "Hearty kimchi stews and sesame aromas —",
    introTitle1Zh: "濃郁泡菜鍋與芝麻香氣 ——",
    introTitle2En: "nourishing Korean comfort dishes from local farm harvests.",
    introTitle2Zh: "以本地農場採收食材，做出一碗碗無比飽足的韓式家常菜。",
    cultureTitle1En: "The home hearth,",
    cultureTitle1Zh: "韓式的暖爐，",
    cultureTitle2En: "warmth in winter.",
    cultureTitle2Zh: "飽足與溫暖。",
    cultureBodyEn: "Korean home cooks excel at preserving cabbages and radishes through fermentation, creating savory pastes and stews that sustain through all seasons.",
    cultureBodyZh: "韓國家常大廚擅長透過發酵保存大白菜與蘿蔔，調配出濃郁的醬料與燉湯，陪伴人們度過季節變換。",
    signatureDishesEn: ["Kimchi Pork Stew Box", "Bibimbap Harvest Bowl", "Braised Korean Daikon", "Sweet & Spicy Tofu"],
    signatureDishesZh: ["韓式泡菜豬肉鍋", "繽紛拌飯餐盒", "醬燉大根蘿蔔", "韓式甜辣豆腐"],
  },
];

function Home() {
  const { lang, t } = useLang();
  const [selectedThemeId, setSelectedThemeId] = useState<string>("all");

  const currentTheme = CUISINE_THEMES.find((th) => th.id === selectedThemeId) || CUISINE_THEMES[0]!;
  const isZh = lang === "zh";

  // Auto rotate random theme every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setSelectedThemeId((prevId) => {
        const others = CUISINE_THEMES.filter((th) => th.id !== prevId);
        const random = others[Math.floor(Math.random() * others.length)]!;
        return random.id;
      });
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const handleRandomTheme = () => {
    const others = CUISINE_THEMES.filter((th) => th.id !== selectedThemeId);
    const random = others[Math.floor(Math.random() * others.length)]!;
    setSelectedThemeId(random.id);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* HERO */}
      <section className="relative min-h-[100svh] w-full overflow-hidden">
        <img
          src={heroSteam}
          alt="Steam rising from a bamboo steamer in a Taiwanese kitchen"
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/80" />
        <div className="relative z-10 min-h-[100svh] flex flex-col items-center justify-center text-center px-6 py-28 animate-reveal">
          
          {/* CONTROL BAR: CURRENT THEME BADGE + SURPRISE BUTTON */}
          <div className="mb-6 flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-paper/20 shadow-2xl">
            <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-paper font-medium">
              <span className="text-base">{currentTheme.flag}</span>
              <span>{isZh ? currentTheme.nameZh : currentTheme.nameEn}</span>
            </span>

            <span className="w-px h-3.5 bg-paper/30" />

            <button
              type="button"
              onClick={handleRandomTheme}
              title={isZh ? "隨機切換主題 (每7秒自動更換)" : "Surprise Me (Auto-changes every 7s)"}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[11px] uppercase tracking-wider text-amber-300 bg-amber-400/20 hover:bg-amber-400/30 transition-all border border-amber-400/40 active:scale-95 cursor-pointer"
            >
              <Shuffle size={12} />
              <span>{isZh ? "隨機" : "Surprise"}</span>
            </button>
          </div>

          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.35em] text-paper/70 mb-4">
            {t("home.hero.kicker")} · {currentTheme.flag} {isZh ? currentTheme.nameZh : currentTheme.nameEn}
          </span>

          <h1 className="font-display text-[2.2rem] leading-[1.05] sm:text-6xl md:text-8xl text-paper sm:leading-[0.95] text-balance max-w-5xl transition-all duration-500">
            {isZh ? currentTheme.heroTitle1Zh : currentTheme.heroTitle1En} <br className="hidden md:block" />
            <span className="italic">{isZh ? currentTheme.heroTitle2Zh : currentTheme.heroTitle2En}</span>
          </h1>

          <p className="mt-6 max-w-lg text-paper/80 text-base leading-relaxed transition-all duration-500">
            {isZh ? currentTheme.subZh : currentTheme.subEn}
          </p>

          {/* Signature dishes tags */}
          <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-2xl">
            {(isZh ? currentTheme.signatureDishesZh : currentTheme.signatureDishesEn).map((dish) => (
              <span
                key={dish}
                className="font-mono text-[10px] uppercase tracking-wider bg-paper/15 text-paper/90 px-3 py-1 rounded-md backdrop-blur-sm border border-paper/20"
              >
                <Utensils size={10} className="inline mr-1 opacity-70" />
                {dish}
              </span>
            ))}
          </div>

          <Link
            to="/box"
            className="mt-8 group inline-flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.25em] text-paper"
          >
            <span>{t("home.hero.cta")}</span>
            <span className="block w-10 h-px bg-paper transition-all duration-500 group-hover:w-16" />
          </Link>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <span className="block w-px h-12 bg-paper/30" />
        </div>
      </section>

      {/* INTRO STRIP */}
      <section className="py-20 md:py-28 px-6 md:px-8 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-clay">
            {t("home.intro.kicker")}
          </span>
          <h2 className="mt-6 font-display text-3xl md:text-5xl leading-tight text-foreground text-balance">
            {isZh ? currentTheme.introTitle1Zh : currentTheme.introTitle1En}
            <br />
            <span className="italic"> {isZh ? currentTheme.introTitle2Zh : currentTheme.introTitle2En}</span>
          </h2>
        </div>
      </section>

      {/* CULTURE TEASER */}
      <section className="px-6 md:px-8 pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-10 md:gap-16 items-end">
          <div className="md:col-span-7 img-hover-zoom">
            <img
              src={grandmaCooking}
              alt="Grandma cooking in traditional kitchen"
              loading="lazy"
              width={1200}
              height={1500}
              className="w-full aspect-[4/5] object-cover rounded-xl"
            />
          </div>
          <div className="md:col-span-5 pb-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-indigo-dye flex items-center gap-2">
              <Sparkles size={12} />
              {currentTheme.flag} {isZh ? currentTheme.nameZh : currentTheme.nameEn}
            </span>
            <h3 className="mt-4 font-display text-4xl md:text-5xl leading-tight">
              {isZh ? currentTheme.cultureTitle1Zh : currentTheme.cultureTitle1En}{" "}
              <span className="italic">{isZh ? currentTheme.cultureTitle2Zh : currentTheme.cultureTitle2En}</span>
            </h3>
            <p className="mt-6 text-clay leading-relaxed max-w-md">
              {isZh ? currentTheme.cultureBodyZh : currentTheme.cultureBodyEn}
            </p>
            <Link
              to="/today"
              className="mt-8 inline-flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.25em] text-indigo-dye group"
            >
              <span>{t("home.culture.cta")}</span>
              <span className="block w-8 h-px bg-indigo-dye transition-all duration-500 group-hover:w-12" />
            </Link>
          </div>
        </div>
      </section>

      {/* BOX TEASER */}
      <section className="bg-indigo-dye text-paper py-24 md:py-32 px-6 md:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-5 md:order-2 img-hover-zoom">
            <img
              src={boxSealed}
              alt="A sealed kraft meal box with an indigo paper band"
              loading="lazy"
              width={1200}
              height={1200}
              className="w-full aspect-square object-cover rounded-xl"
            />
          </div>
          <div className="md:col-span-7 md:order-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-60">
              {t("home.box.kicker")}
            </span>
            <h3 className="mt-4 font-display text-4xl md:text-5xl leading-tight">
              {t("home.box.title1")} <br />
              <span className="italic">{t("home.box.title2")}</span>
            </h3>
            <p className="mt-6 max-w-md leading-relaxed opacity-80">
              {t("home.box.body")}
            </p>
            <Link
              to="/box"
              className="mt-8 inline-flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.25em] group"
            >
              <span>{t("home.box.cta")}</span>
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
            {t("home.mission.kicker")}
          </span>
          <p className="mt-8 font-display text-7xl md:text-9xl text-indigo-dye italic leading-none">
            94%
          </p>
          <p className="mt-6 font-display text-2xl md:text-3xl max-w-2xl mx-auto text-balance leading-snug text-foreground">
            {t("home.mission.body")}
          </p>
          <Link
            to="/impact"
            className="mt-10 inline-flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.25em] text-indigo-dye group"
          >
            <span>{t("home.mission.cta")}</span>
            <span className="block w-8 h-px bg-indigo-dye transition-all duration-500 group-hover:w-12" />
          </Link>
        </div>
      </section>

      {/* SYSTEM SECTION */}
      <section className="border-y border-border bg-paper py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-clay">Mangshi / system</p>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl">盒子背後的系統</h2>
            </div>
            <Link to="/system" className="shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-indigo-dye hover:text-foreground">
              {t("nav.system")} →
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Link to="/system" className="group relative min-h-72 overflow-hidden rounded-xl">
              <img src={sealedBoxHands} alt="Student holding a sealed lunch box" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-foreground/35" />
              <div className="relative flex min-h-72 items-end p-6 text-paper"><p className="font-display text-3xl">收成，成為一餐。</p></div>
            </Link>
            <Link to="/system/match" className="group relative min-h-72 overflow-hidden rounded-xl">
              <img src={hakkaTable} alt="Simple Hakka dishes set on a table" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-foreground/35" />
              <div className="relative flex min-h-72 items-end p-6 text-paper"><p className="font-display text-3xl">每一口，都有來處。</p></div>
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
