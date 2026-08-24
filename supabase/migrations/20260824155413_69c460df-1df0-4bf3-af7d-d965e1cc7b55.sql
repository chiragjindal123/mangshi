ALTER TABLE public.recipes
  ADD COLUMN IF NOT EXISTS protein_g numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS carbs_g numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS fat_g numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS fiber_g numeric NOT NULL DEFAULT 0;

UPDATE public.recipes SET protein_g = v.p, carbs_g = v.c, fat_g = v.f, fiber_g = v.fi
FROM (VALUES
  ('cabbage_carrot', 9, 58, 11, 6),
  ('hakka_stirfry', 26, 62, 24, 5),
  ('tomato_egg', 18, 64, 16, 4),
  ('braised_eggplant', 11, 60, 13, 7),
  ('garlic_broccoli', 13, 48, 10, 8),
  ('daikon_soup', 12, 42, 6, 6),
  ('pickled_mustard', 24, 58, 20, 5),
  ('pumpkin_rice', 12, 88, 12, 7),
  ('bamboo_braise', 20, 66, 18, 9),
  ('bitter_melon', 21, 52, 16, 7),
  ('sweet_potato_leaf', 8, 36, 8, 6),
  ('seasonal_bowl', 14, 76, 12, 8)
) AS v(code, p, c, f, fi)
WHERE public.recipes.code = v.code;