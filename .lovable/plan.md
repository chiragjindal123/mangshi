
# Hakka Blind Box — Experience Website

A storytelling site (not a shop) that immerses students in Hakka culture and explains the blind-box surplus-food concept. Goal: emotional connection → curiosity about the box → sign-up interest.

## Pages (separate routes for SSR + SEO)

1. **`/` Home — The Hook**
   - Full-bleed hero with looping ambient video (Hakka kitchen / grandma's hands / steam)
   - One line: "Mama's hand, sealed in a box."
   - Scroll-cued sections teasing each pillar: Culture · Surplus · Surprise
   - Soft CTA → "Open the box" (scroll to blind-box section / link to /box)

2. **`/culture` — Hakka Heritage**
   - Video gallery: food traditions, festivals, old-village life, language snippets
   - Short stories ("Why lei cha matters", "The salt-pickling grandmothers")
   - Timeline / map of Hakka migration in Taiwan
   - Designed to feel like a museum exhibit, not a blog

3. **`/box` — The Blind Box Concept**
   - Interactive blind-box reveal: user clicks/taps a sealed box → flips to show only ingredient list + nutrition facts (no dish photo, no name)
   - Explains the rules: surprise meal, homemade, made from rescued surplus produce
   - "Why blind?" — curiosity, anti-bias, anti-waste rationale

4. **`/mission` — Why We Exist**
   - Three problems woven together: food waste (broccoli crisis stat), student affordability, cultural disconnect
   - Quiet data viz: 94% domestic supply, NT$10 broccoli, etc.
   - Closes with our answer: rescue → cook → seal → surprise

5. **`/join` — Get Involved**
   - Email/LINE sign-up for first-batch students
   - Partner with us (farmers, schools, volunteers)
   - Simple form, no payment

## Global

- Sticky minimal nav (logo + 4 links)
- Footer with team, awards (2025 mentions from doc), contact
- Bilingual toggle EN / 中文 (content from the doc supports both — start with EN, structure for 中文)

## Visual Direction

I will generate 3 design directions before building so you can pick — but the brief is:
- Editorial / documentary feel (think *Kinfolk* meets a food museum)
- Warm earthy palette (clay, rice-paper, indigo accent from Hakka textiles)
- Serif display + clean sans body
- Heavy use of video and full-bleed imagery; restrained motion
- The blind-box page is the one moment of playful interaction

## Out of Scope (for v1)

- No checkout / payments / inventory
- No real auth — just email capture
- No admin dashboard

## Tech Notes

- TanStack Start file-based routes under `src/routes/`
- Each route has its own `head()` metadata
- Videos hosted externally (YouTube/Vimeo embed or self-hosted in `/public`) — you'll provide URLs
- Email capture stored via Lovable Cloud (enable when we add `/join`)

## Open Questions (answer or I'll assume defaults)

1. Do you have actual Hakka video/photo assets, or should I use AI-generated imagery + placeholder video embeds for now?
2. Bilingual at launch, or English first?
3. Should `/join` actually save sign-ups (needs Lovable Cloud) or just be a visual mockup for v1?
