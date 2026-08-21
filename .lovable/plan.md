# Chinese-First, Image-Led Redesign

Keep the current theme (cream / cocoa / olive-sage, Cormorant + logo) — change the *language priority* and the *content density* so the site reads like a Taiwanese brand site (in the spirit of 印花樂 inBlooom): big imagery, short punchy lines, gentle motion.

## 1. Traditional Chinese becomes the default

- Site loads in 繁體中文 by default; EN is the secondary toggle (order becomes 中 / EN).
- `<html lang>` follows the active language.
- Every page title / description also gets a Chinese version, applied when zh is active.
- Chinese typography gets its own display face (Noto Serif TC) so headlines look intentional, not fallback. Latin keeps Cormorant.
- Existing stored language preference still respected; new visitors get 中文.

## 2. Fewer words, stronger words

Rewrite the copy so each section carries one headline (4–10 characters in Chinese) plus at most one short supporting line. Long paragraphs on Home, Culture, Mission and Box are cut down or replaced by:

- Big number / big character statements (94%, NT$10, 「盲」).
- Short caption lines under images instead of body blocks.
- Vertical Chinese label strips (writing-mode) as decorative section markers.

Nothing factual is removed — the detail that matters moves into small captions or the Mission data blocks.

## 3. Image + motion led layout

- **Home**: full-bleed hero with slow zoom kept; below it a horizontal image band (culture / box / mission) where each card reveals its Chinese headline on scroll. Add a full-width quiet image break between sections.
- **Culture**: switch from story blocks to an editorial image grid — large photo, short title, one caption line; hover reveals a second line.
- **Box**: keep the flip interaction (it's the signature moment), reduce surrounding text to a three-word rhythm: 封 → 拆 → 嚐.
- **Mission**: numbers become the visual — oversized figures animating up on scroll, image backdrops behind each stat.
- **Join**: single short prompt + form; remove explanatory paragraphs.

Motion vocabulary (restrained, reused everywhere): fade-and-rise on scroll (IntersectionObserver), slow image zoom on hover, count-up numbers, soft parallax on full-bleed images. All respect `prefers-reduced-motion`.

## 4. Imagery

Add ~4 new generated images so the site can lean on pictures instead of text: pickling jars close-up, student hands holding a sealed box, harvest crates in a field, a table set with simple Hakka dishes. Existing 6 images stay.

## Technical notes

- `src/lib/i18n.tsx`: default `zh`, expose lang to `__root.tsx` for `<html lang>`.
- `src/lib/translations.ts`: rewritten values (shorter zh-first copy), plus new keys for captions and meta titles; keys stay stable where possible.
- New `src/components/Reveal.tsx` (scroll-reveal wrapper) and `src/components/CountUp.tsx`, used across routes.
- Font link added in `__root.tsx` head; `--font-display-zh` token in `src/styles.css`, applied via a `:lang(zh)` rule so no component logic changes.
- Route `head()` functions get zh titles/descriptions.
- No colour/token changes — the palette stays exactly as is.

## Out of scope

- No new pages, no backend, no e-commerce.
