-- ============================================================
-- MANGSHI SUPABASE DATABASE SETUP & SEED SCRIPT
-- Run this entire script inside your new Supabase SQL Editor
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. farm_supply
CREATE TABLE IF NOT EXISTS public.farm_supply (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_name TEXT NOT NULL,
    veg_key TEXT NOT NULL,
    name_zh TEXT NOT NULL,
    name_en TEXT NOT NULL,
    kg NUMERIC NOT NULL,
    available_from DATE NOT NULL,
    available_to DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'available',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. preorders
CREATE TABLE IF NOT EXISTS public.preorders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_date DATE NOT NULL,
    campus TEXT NOT NULL,
    portions INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. recipes
CREATE TABLE IF NOT EXISTS public.recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name_zh TEXT NOT NULL,
    name_en TEXT NOT NULL,
    prep_min INTEGER NOT NULL,
    cook_min INTEGER NOT NULL,
    cost_ntd NUMERIC NOT NULL,
    kcal INTEGER NOT NULL,
    protein_g NUMERIC NOT NULL DEFAULT 0,
    carbs_g NUMERIC NOT NULL DEFAULT 0,
    fat_g NUMERIC NOT NULL DEFAULT 0,
    fiber_g NUMERIC NOT NULL DEFAULT 0,
    vegetarian BOOLEAN NOT NULL DEFAULT false,
    allergens TEXT[] DEFAULT '{}',
    max_batch INTEGER NOT NULL DEFAULT 200,
    note_zh TEXT,
    note_en TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. recipe_ingredients
CREATE TABLE IF NOT EXISTS public.recipe_ingredients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id UUID REFERENCES public.recipes(id) ON DELETE CASCADE,
    veg_key TEXT NOT NULL,
    name_zh TEXT NOT NULL,
    name_en TEXT NOT NULL,
    kg_per_100 NUMERIC NOT NULL,
    is_core BOOLEAN NOT NULL DEFAULT false
);

-- 5. seasonal_surplus
CREATE TABLE IF NOT EXISTS public.seasonal_surplus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    month INTEGER NOT NULL,
    veg_key TEXT NOT NULL,
    name_zh TEXT NOT NULL,
    name_en TEXT NOT NULL,
    typical_surplus_kg NUMERIC NOT NULL,
    severity TEXT NOT NULL,
    note_zh TEXT,
    note_en TEXT
);

-- 6. production_plans
CREATE TABLE IF NOT EXISTS public.production_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'planned',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. plan_items
CREATE TABLE IF NOT EXISTS public.plan_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID REFERENCES public.production_plans(id) ON DELETE CASCADE,
    recipe_id UUID REFERENCES public.recipes(id) ON DELETE CASCADE,
    portions INTEGER NOT NULL,
    kg_used NUMERIC NOT NULL
);

-- 8. join_submissions
CREATE TABLE IF NOT EXISTS public.join_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student',
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- RLS POLICIES (Allow ALL operations for public/anon including SELECT, INSERT, UPDATE, DELETE)
-- ============================================================
ALTER TABLE public.farm_supply ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preorders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seasonal_surplus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.join_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public full access on farm_supply" ON public.farm_supply;
CREATE POLICY "Public full access on farm_supply" ON public.farm_supply FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public full access on preorders" ON public.preorders;
CREATE POLICY "Public full access on preorders" ON public.preorders FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public full access on recipes" ON public.recipes;
CREATE POLICY "Public full access on recipes" ON public.recipes FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public full access on recipe_ingredients" ON public.recipe_ingredients;
CREATE POLICY "Public full access on recipe_ingredients" ON public.recipe_ingredients FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public full access on seasonal_surplus" ON public.seasonal_surplus;
CREATE POLICY "Public full access on seasonal_surplus" ON public.seasonal_surplus FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public full access on production_plans" ON public.production_plans;
CREATE POLICY "Public full access on production_plans" ON public.production_plans FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public full access on plan_items" ON public.plan_items;
CREATE POLICY "Public full access on plan_items" ON public.plan_items FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public full access on join_submissions" ON public.join_submissions;
CREATE POLICY "Public full access on join_submissions" ON public.join_submissions FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- SEED DATA
-- ============================================================
TRUNCATE public.plan_items, public.production_plans, public.recipe_ingredients, public.recipes, public.seasonal_surplus, public.farm_supply, public.preorders CASCADE;

-- Recipes
INSERT INTO public.recipes (id, code, name_zh, name_en, prep_min, cook_min, cost_ntd, kcal, protein_g, carbs_g, fat_g, fiber_g, vegetarian, allergens, max_batch, note_zh, note_en) VALUES ('d75c3190-3e98-4926-bb05-425db8900fdd', 'cabbage_carrot', '高麗菜炒紅蘿蔔', 'Cabbage & Carrot Stir-Fry', 18, 12, 22, 390, 9, 58, 11, 6, TRUE, '{}', 300, '高麗菜盛產期主力', 'Backbone of cabbage glut season');
INSERT INTO public.recipes (id, code, name_zh, name_en, prep_min, cook_min, cost_ntd, kcal, protein_g, carbs_g, fat_g, fiber_g, vegetarian, allergens, max_batch, note_zh, note_en) VALUES ('65fb89e5-44e8-42cc-84c5-47d4137eaffd', 'hakka_stirfry', '客家小炒', 'Hakka Stir-Fry', 35, 25, 32, 610, 26, 62, 24, 5, FALSE, ARRAY['soy'], 250, '客家經典,鹹香下飯', 'The classic Hakka plate');
INSERT INTO public.recipes (id, code, name_zh, name_en, prep_min, cook_min, cost_ntd, kcal, protein_g, carbs_g, fat_g, fiber_g, vegetarian, allergens, max_batch, note_zh, note_en) VALUES ('8e6a72fd-5781-4e81-aff3-35a414b1a86a', 'tomato_egg', '番茄炒蛋', 'Tomato & Egg', 20, 15, 26, 480, 18, 64, 16, 4, TRUE, ARRAY['egg'], 300, '學生最熟悉的家常味', 'The most familiar home taste');
INSERT INTO public.recipes (id, code, name_zh, name_en, prep_min, cook_min, cost_ntd, kcal, protein_g, carbs_g, fat_g, fiber_g, vegetarian, allergens, max_batch, note_zh, note_en) VALUES ('4c44ac03-09c4-43fd-a0b1-3e5139fd0181', 'braised_eggplant', '滷茄子', 'Braised Eggplant', 20, 30, 28, 430, 11, 60, 13, 7, TRUE, ARRAY['soy'], 200, '軟嫩入味', 'Slow, soft, savoury');
INSERT INTO public.recipes (id, code, name_zh, name_en, prep_min, cook_min, cost_ntd, kcal, protein_g, carbs_g, fat_g, fiber_g, vegetarian, allergens, max_batch, note_zh, note_en) VALUES ('fb320c70-1273-4331-a85b-b52543107abe', 'garlic_broccoli', '蒜炒青花菜', 'Garlic Broccoli', 15, 10, 30, 360, 13, 48, 10, 8, TRUE, '{}', 250, '解決冬季花椰菜過剩', 'Answers the winter broccoli glut');
INSERT INTO public.recipes (id, code, name_zh, name_en, prep_min, cook_min, cost_ntd, kcal, protein_g, carbs_g, fat_g, fiber_g, vegetarian, allergens, max_batch, note_zh, note_en) VALUES ('40c8f285-4b20-4dd8-be61-dc2480741d96', 'daikon_soup', '白蘿蔔燉湯', 'Daikon Soup', 20, 45, 24, 300, 12, 42, 6, 6, FALSE, '{}', 300, '冬季暖身', 'Winter warmth');
INSERT INTO public.recipes (id, code, name_zh, name_en, prep_min, cook_min, cost_ntd, kcal, protein_g, carbs_g, fat_g, fiber_g, vegetarian, allergens, max_batch, note_zh, note_en) VALUES ('237a239e-95af-42f6-ad27-741dca3242b4', 'pickled_mustard', '客家鹹菜滷', 'Pickled Mustard Braise', 30, 40, 30, 520, 24, 58, 20, 5, FALSE, ARRAY['soy'], 200, '阿嬤的醃漬智慧', 'Grandmother preservation wisdom');
INSERT INTO public.recipes (id, code, name_zh, name_en, prep_min, cook_min, cost_ntd, kcal, protein_g, carbs_g, fat_g, fiber_g, vegetarian, allergens, max_batch, note_zh, note_en) VALUES ('a00f3c84-6fc8-4d2b-9386-ce2c5f233842', 'pumpkin_rice', '南瓜飯', 'Pumpkin Rice', 25, 30, 27, 560, 12, 88, 12, 7, TRUE, '{}', 250, '夏末南瓜盛產', 'Late-summer pumpkin');
INSERT INTO public.recipes (id, code, name_zh, name_en, prep_min, cook_min, cost_ntd, kcal, protein_g, carbs_g, fat_g, fiber_g, vegetarian, allergens, max_batch, note_zh, note_en) VALUES ('b1132623-5f2e-47ba-bbd6-92eb104d352f', 'bamboo_braise', '筍絲滷', 'Braised Bamboo Shoots', 30, 40, 29, 540, 20, 66, 18, 9, FALSE, ARRAY['soy'], 200, '春筍時節', 'Spring bamboo season');
INSERT INTO public.recipes (id, code, name_zh, name_en, prep_min, cook_min, cost_ntd, kcal, protein_g, carbs_g, fat_g, fiber_g, vegetarian, allergens, max_batch, note_zh, note_en) VALUES ('cd3c9e34-ba2f-4fd4-9cc0-f02b6d4b584f', 'bitter_melon', '苦瓜封', 'Stuffed Bitter Melon', 40, 35, 34, 470, 21, 52, 16, 7, FALSE, ARRAY['soy'], 150, '夏日退火', 'Cools the summer');
INSERT INTO public.recipes (id, code, name_zh, name_en, prep_min, cook_min, cost_ntd, kcal, protein_g, carbs_g, fat_g, fiber_g, vegetarian, allergens, max_batch, note_zh, note_en) VALUES ('9268d1ba-f1d1-456e-86b2-d0305a47d89a', 'sweet_potato_leaf', '炒地瓜葉', 'Sweet Potato Leaves', 12, 8, 18, 280, 8, 36, 8, 6, TRUE, '{}', 300, '最便宜的營養', 'Cheapest nutrition on the island');
INSERT INTO public.recipes (id, code, name_zh, name_en, prep_min, cook_min, cost_ntd, kcal, protein_g, carbs_g, fat_g, fiber_g, vegetarian, allergens, max_batch, note_zh, note_en) VALUES ('10cf0271-ecde-431e-808e-f4999177c973', 'seasonal_bowl', '時蔬飯', 'Seasonal Veg Bowl', 20, 20, 25, 500, 14, 76, 12, 8, TRUE, '{}', 350, '什麼多就用什麼', 'Built from whatever is abundant');

-- Recipe Ingredients
INSERT INTO public.recipe_ingredients (id, recipe_id, veg_key, name_zh, name_en, kg_per_100, is_core) VALUES ('da5260d2-2251-4145-8028-71ecaa2ce553', '65fb89e5-44e8-42cc-84c5-47d4137eaffd', 'onion', '洋蔥', 'Onion', 4, FALSE);
INSERT INTO public.recipe_ingredients (id, recipe_id, veg_key, name_zh, name_en, kg_per_100, is_core) VALUES ('b5e17cb7-519f-49ca-b313-af6b148857bb', '65fb89e5-44e8-42cc-84c5-47d4137eaffd', 'carrot', '紅蘿蔔', 'Carrot', 3, FALSE);
INSERT INTO public.recipe_ingredients (id, recipe_id, veg_key, name_zh, name_en, kg_per_100, is_core) VALUES ('a69aa981-b34f-4cf2-94b5-e556cab4bd08', '65fb89e5-44e8-42cc-84c5-47d4137eaffd', 'cabbage', '高麗菜', 'Cabbage', 12, TRUE);
INSERT INTO public.recipe_ingredients (id, recipe_id, veg_key, name_zh, name_en, kg_per_100, is_core) VALUES ('a7bcbcf7-0388-477c-b0b9-6988495fd050', '8e6a72fd-5781-4e81-aff3-35a414b1a86a', 'onion', '洋蔥', 'Onion', 2, FALSE);
INSERT INTO public.recipe_ingredients (id, recipe_id, veg_key, name_zh, name_en, kg_per_100, is_core) VALUES ('cc0cba0a-253a-48fa-bb70-118402ba144e', '8e6a72fd-5781-4e81-aff3-35a414b1a86a', 'tomato', '番茄', 'Tomato', 18, TRUE);
INSERT INTO public.recipe_ingredients (id, recipe_id, veg_key, name_zh, name_en, kg_per_100, is_core) VALUES ('e92e9fc1-a499-4728-b21a-3c75440de377', 'd75c3190-3e98-4926-bb05-425db8900fdd', 'carrot', '紅蘿蔔', 'Carrot', 5, FALSE);
INSERT INTO public.recipe_ingredients (id, recipe_id, veg_key, name_zh, name_en, kg_per_100, is_core) VALUES ('6f0611b9-350d-4cbd-9dff-4fb813c2f1da', 'd75c3190-3e98-4926-bb05-425db8900fdd', 'cabbage', '高麗菜', 'Cabbage', 20, TRUE);
INSERT INTO public.recipe_ingredients (id, recipe_id, veg_key, name_zh, name_en, kg_per_100, is_core) VALUES ('d543ef33-82e5-4029-beaa-fdcd76e14005', '4c44ac03-09c4-43fd-a0b1-3e5139fd0181', 'tomato', '番茄', 'Tomato', 3, FALSE);
INSERT INTO public.recipe_ingredients (id, recipe_id, veg_key, name_zh, name_en, kg_per_100, is_core) VALUES ('35d3c694-deab-4941-8de3-53121ebb9c04', '4c44ac03-09c4-43fd-a0b1-3e5139fd0181', 'eggplant', '茄子', 'Eggplant', 18, TRUE);
INSERT INTO public.recipe_ingredients (id, recipe_id, veg_key, name_zh, name_en, kg_per_100, is_core) VALUES ('34f3002a-69a7-493d-b5e2-d161be9b04e2', 'fb320c70-1273-4331-a85b-b52543107abe', 'broccoli', '青花菜', 'Broccoli', 20, TRUE);
INSERT INTO public.recipe_ingredients (id, recipe_id, veg_key, name_zh, name_en, kg_per_100, is_core) VALUES ('aa5bbba1-6969-4c44-8254-41701901dee7', '40c8f285-4b20-4dd8-be61-dc2480741d96', 'carrot', '紅蘿蔔', 'Carrot', 4, FALSE);
INSERT INTO public.recipe_ingredients (id, recipe_id, veg_key, name_zh, name_en, kg_per_100, is_core) VALUES ('5c449052-783a-4245-9572-fe48e29b85a2', '40c8f285-4b20-4dd8-be61-dc2480741d96', 'daikon', '白蘿蔔', 'Daikon', 22, TRUE);
INSERT INTO public.recipe_ingredients (id, recipe_id, veg_key, name_zh, name_en, kg_per_100, is_core) VALUES ('067bb37e-d211-43e4-9958-59201590c974', '237a239e-95af-42f6-ad27-741dca3242b4', 'daikon', '白蘿蔔', 'Daikon', 5, FALSE);
INSERT INTO public.recipe_ingredients (id, recipe_id, veg_key, name_zh, name_en, kg_per_100, is_core) VALUES ('e6d9a66b-22db-4221-9fdf-b6b8efdce971', '237a239e-95af-42f6-ad27-741dca3242b4', 'mustard_greens', '芥菜', 'Mustard Greens', 15, TRUE);
INSERT INTO public.recipe_ingredients (id, recipe_id, veg_key, name_zh, name_en, kg_per_100, is_core) VALUES ('591e4547-5042-4587-ac6e-5c2c60efa26b', 'a00f3c84-6fc8-4d2b-9386-ce2c5f233842', 'onion', '洋蔥', 'Onion', 2, FALSE);
INSERT INTO public.recipe_ingredients (id, recipe_id, veg_key, name_zh, name_en, kg_per_100, is_core) VALUES ('bd327d92-864b-4f83-8737-b96714dc93df', 'a00f3c84-6fc8-4d2b-9386-ce2c5f233842', 'pumpkin', '南瓜', 'Pumpkin', 16, TRUE);
INSERT INTO public.recipe_ingredients (id, recipe_id, veg_key, name_zh, name_en, kg_per_100, is_core) VALUES ('ba2f7d1d-01b7-4851-9b6c-36cc51dbaff1', 'cd3c9e34-ba2f-4fd4-9cc0-f02b6d4b584f', 'carrot', '紅蘿蔔', 'Carrot', 2, FALSE);
INSERT INTO public.recipe_ingredients (id, recipe_id, veg_key, name_zh, name_en, kg_per_100, is_core) VALUES ('0651bff2-fc28-489a-a5c4-0f394f25d208', 'cd3c9e34-ba2f-4fd4-9cc0-f02b6d4b584f', 'bitter_melon', '苦瓜', 'Bitter Melon', 16, TRUE);
INSERT INTO public.recipe_ingredients (id, recipe_id, veg_key, name_zh, name_en, kg_per_100, is_core) VALUES ('0e899824-e8d8-4621-b1f0-9c8b42bfa7a5', '9268d1ba-f1d1-456e-86b2-d0305a47d89a', 'sweet_potato_leaf', '地瓜葉', 'Sweet Potato Leaves', 14, TRUE);
INSERT INTO public.recipe_ingredients (id, recipe_id, veg_key, name_zh, name_en, kg_per_100, is_core) VALUES ('c61fe5df-9f87-42fd-91cc-0ebb561411ce', 'b1132623-5f2e-47ba-bbd6-92eb104d352f', 'carrot', '紅蘿蔔', 'Carrot', 2, FALSE);
INSERT INTO public.recipe_ingredients (id, recipe_id, veg_key, name_zh, name_en, kg_per_100, is_core) VALUES ('6b1ee8c8-19b1-4ea5-98aa-a1f3dd3f1cac', 'b1132623-5f2e-47ba-bbd6-92eb104d352f', 'bamboo', '竹筍', 'Bamboo Shoots', 15, TRUE);
INSERT INTO public.recipe_ingredients (id, recipe_id, veg_key, name_zh, name_en, kg_per_100, is_core) VALUES ('8591506f-4998-4694-bc08-e509d9d09f6b', '10cf0271-ecde-431e-808e-f4999177c973', 'cauliflower', '白花椰菜', 'Cauliflower', 4, FALSE);
INSERT INTO public.recipe_ingredients (id, recipe_id, veg_key, name_zh, name_en, kg_per_100, is_core) VALUES ('cb7786d6-7a81-43a8-a7d6-ba62aec64812', '10cf0271-ecde-431e-808e-f4999177c973', 'corn', '玉米', 'Corn', 4, FALSE);
INSERT INTO public.recipe_ingredients (id, recipe_id, veg_key, name_zh, name_en, kg_per_100, is_core) VALUES ('6667b33e-ec1d-4522-bde0-7f5a36fd1052', '10cf0271-ecde-431e-808e-f4999177c973', 'carrot', '紅蘿蔔', 'Carrot', 4, FALSE);
INSERT INTO public.recipe_ingredients (id, recipe_id, veg_key, name_zh, name_en, kg_per_100, is_core) VALUES ('784cf5e3-6aa8-43f1-867b-b9a61f7e9422', '10cf0271-ecde-431e-808e-f4999177c973', 'cabbage', '高麗菜', 'Cabbage', 8, TRUE);

-- Seasonal Surplus
INSERT INTO public.seasonal_surplus (id, month, veg_key, name_zh, name_en, typical_surplus_kg, severity, note_zh, note_en) VALUES ('d5bc5d33-84ca-4dba-a91d-eda088d8e187', 1, 'cabbage', '高麗菜', 'Cabbage', 4200, 'high', '冬季高麗菜崩盤期', 'Winter cabbage price collapse');
INSERT INTO public.seasonal_surplus (id, month, veg_key, name_zh, name_en, typical_surplus_kg, severity, note_zh, note_en) VALUES ('d27f4795-4cd2-4425-b12e-6a439052d4fd', 1, 'broccoli', '青花菜', 'Broccoli', 3100, 'high', '一顆十元的季節', 'The NT$10 head season');
INSERT INTO public.seasonal_surplus (id, month, veg_key, name_zh, name_en, typical_surplus_kg, severity, note_zh, note_en) VALUES ('9bd317cd-d67d-4e89-94cc-b0a74a0147b2', 1, 'daikon', '白蘿蔔', 'Daikon', 2600, 'medium', '產地價低', 'Farm-gate price bottoms out');
INSERT INTO public.seasonal_surplus (id, month, veg_key, name_zh, name_en, typical_surplus_kg, severity, note_zh, note_en) VALUES ('b674a988-2aeb-478c-a464-8379ba45900b', 2, 'cabbage', '高麗菜', 'Cabbage', 3800, 'high', '年後需求驟降', 'Demand drops after New Year');
INSERT INTO public.seasonal_surplus (id, month, veg_key, name_zh, name_en, typical_surplus_kg, severity, note_zh, note_en) VALUES ('ae850d73-c7b6-4b73-a9ea-618d06dd86c1', 2, 'cauliflower', '白花椰菜', 'Cauliflower', 2400, 'medium', '採收高峰', 'Harvest peak');
INSERT INTO public.seasonal_surplus (id, month, veg_key, name_zh, name_en, typical_surplus_kg, severity, note_zh, note_en) VALUES ('d71f1ebd-064a-462b-8771-4fae096e44f3', 2, 'mustard_greens', '芥菜', 'Mustard Greens', 2100, 'medium', '客家醃漬旺季', 'Hakka pickling season');
INSERT INTO public.seasonal_surplus (id, month, veg_key, name_zh, name_en, typical_surplus_kg, severity, note_zh, note_en) VALUES ('fb388594-d90a-4051-9588-cb18dd13b7f9', 3, 'bamboo', '竹筍', 'Bamboo Shoots', 1800, 'medium', '春筍出土', 'Spring shoots emerge');
INSERT INTO public.seasonal_surplus (id, month, veg_key, name_zh, name_en, typical_surplus_kg, severity, note_zh, note_en) VALUES ('b4fa24df-9ae9-4dfc-8ddc-e857e30274e4', 3, 'cabbage', '高麗菜', 'Cabbage', 2200, 'medium', '春作尾聲', 'Tail of the spring crop');
INSERT INTO public.seasonal_surplus (id, month, veg_key, name_zh, name_en, typical_surplus_kg, severity, note_zh, note_en) VALUES ('166912e6-18a6-479e-ad03-19770d018c42', 3, 'carrot', '紅蘿蔔', 'Carrot', 1600, 'low', '外觀不良品多', 'Many cosmetically rejected roots');
INSERT INTO public.seasonal_surplus (id, month, veg_key, name_zh, name_en, typical_surplus_kg, severity, note_zh, note_en) VALUES ('de18aacc-f076-4ec5-8fef-1430bfb73ebf', 4, 'bamboo', '竹筍', 'Bamboo Shoots', 2100, 'medium', '盛產期', 'Peak season');
INSERT INTO public.seasonal_surplus (id, month, veg_key, name_zh, name_en, typical_surplus_kg, severity, note_zh, note_en) VALUES ('a1c8a7d8-82fc-43ee-a7f1-e264cb01be8c', 4, 'onion', '洋蔥', 'Onion', 2600, 'high', '恆春洋蔥採收', 'Hengchun onion harvest');
INSERT INTO public.seasonal_surplus (id, month, veg_key, name_zh, name_en, typical_surplus_kg, severity, note_zh, note_en) VALUES ('c6c4cb49-623d-4be5-bf01-57d2f74644e0', 4, 'cucumber', '小黃瓜', 'Cucumber', 1500, 'low', '溫室過量', 'Greenhouse overflow');
INSERT INTO public.seasonal_surplus (id, month, veg_key, name_zh, name_en, typical_surplus_kg, severity, note_zh, note_en) VALUES ('040415ae-a913-47e2-b684-760c42f9c31c', 5, 'tomato', '番茄', 'Tomato', 2400, 'medium', '梅雨前搶收', 'Rushed pre-monsoon harvest');
INSERT INTO public.seasonal_surplus (id, month, veg_key, name_zh, name_en, typical_surplus_kg, severity, note_zh, note_en) VALUES ('4f2363a2-66e7-4727-a82a-48568263eb57', 5, 'cucumber', '小黃瓜', 'Cucumber', 1900, 'medium', '價格走低', 'Prices sag');
INSERT INTO public.seasonal_surplus (id, month, veg_key, name_zh, name_en, typical_surplus_kg, severity, note_zh, note_en) VALUES ('737c0027-1790-42ad-9506-e79b61ac4ba0', 5, 'bitter_melon', '苦瓜', 'Bitter Melon', 1400, 'low', '初夏上市', 'Early summer arrival');
INSERT INTO public.seasonal_surplus (id, month, veg_key, name_zh, name_en, typical_surplus_kg, severity, note_zh, note_en) VALUES ('4144cf85-54c1-4784-9f05-e55e056da99b', 6, 'bitter_melon', '苦瓜', 'Bitter Melon', 2000, 'medium', '盛夏產量高', 'High summer yield');
INSERT INTO public.seasonal_surplus (id, month, veg_key, name_zh, name_en, typical_surplus_kg, severity, note_zh, note_en) VALUES ('0552b5b7-0157-4189-841b-3af71851036d', 6, 'pumpkin', '南瓜', 'Pumpkin', 2200, 'medium', '南部大出', 'Southern glut');
INSERT INTO public.seasonal_surplus (id, month, veg_key, name_zh, name_en, typical_surplus_kg, severity, note_zh, note_en) VALUES ('a2b465a2-ea62-4c34-8e81-aae4bcd740ab', 6, 'corn', '玉米', 'Corn', 1800, 'low', '夏收集中', 'Concentrated harvest');
INSERT INTO public.seasonal_surplus (id, month, veg_key, name_zh, name_en, typical_surplus_kg, severity, note_zh, note_en) VALUES ('edd3ae18-a407-49ca-9593-71ca45a65b5d', 7, 'pumpkin', '南瓜', 'Pumpkin', 2600, 'high', '儲運壓力大', 'Storage and transport pressure');
INSERT INTO public.seasonal_surplus (id, month, veg_key, name_zh, name_en, typical_surplus_kg, severity, note_zh, note_en) VALUES ('5625ec88-af29-46a3-aa62-d682f1b9ba22', 7, 'sweet_potato_leaf', '地瓜葉', 'Sweet Potato Leaves', 1700, 'medium', '生長極快', 'Grows faster than demand');
INSERT INTO public.seasonal_surplus (id, month, veg_key, name_zh, name_en, typical_surplus_kg, severity, note_zh, note_en) VALUES ('48d71e23-a0dc-455d-90b6-a82953d0ddf4', 7, 'corn', '玉米', 'Corn', 2000, 'medium', '價格低迷', 'Weak prices');
INSERT INTO public.seasonal_surplus (id, month, veg_key, name_zh, name_en, typical_surplus_kg, severity, note_zh, note_en) VALUES ('176c48b5-89bb-4022-8b39-915d12fc0761', 8, 'sweet_potato_leaf', '地瓜葉', 'Sweet Potato Leaves', 2100, 'medium', '颱風前搶收', 'Pre-typhoon harvest');
INSERT INTO public.seasonal_surplus (id, month, veg_key, name_zh, name_en, typical_surplus_kg, severity, note_zh, note_en) VALUES ('a55ce43a-f8b1-4dcd-ad9d-738b980ca742', 8, 'eggplant', '茄子', 'Eggplant', 1900, 'medium', '外觀不良率高', 'High cosmetic rejection');
INSERT INTO public.seasonal_surplus (id, month, veg_key, name_zh, name_en, typical_surplus_kg, severity, note_zh, note_en) VALUES ('0e663041-daba-43d8-af14-0325d37702b3', 8, 'tomato', '番茄', 'Tomato', 1500, 'low', '小果偏多', 'Too many small fruits');
INSERT INTO public.seasonal_surplus (id, month, veg_key, name_zh, name_en, typical_surplus_kg, severity, note_zh, note_en) VALUES ('08a8f633-e8d6-4e80-8576-20f82df39bf7', 9, 'eggplant', '茄子', 'Eggplant', 2200, 'medium', '秋作大出', 'Autumn crop surge');
INSERT INTO public.seasonal_surplus (id, month, veg_key, name_zh, name_en, typical_surplus_kg, severity, note_zh, note_en) VALUES ('7791183f-b982-4f55-b80d-f87c54bc5331', 9, 'tomato', '番茄', 'Tomato', 1800, 'medium', '轉作期過剩', 'Rotation-period surplus');
INSERT INTO public.seasonal_surplus (id, month, veg_key, name_zh, name_en, typical_surplus_kg, severity, note_zh, note_en) VALUES ('30c5ab6d-b299-46d9-962e-c951ca7461c2', 9, 'cabbage', '高麗菜', 'Cabbage', 1600, 'low', '高冷地供應', 'Highland supply');
INSERT INTO public.seasonal_surplus (id, month, veg_key, name_zh, name_en, typical_surplus_kg, severity, note_zh, note_en) VALUES ('920a4f82-9746-4ef2-8b69-58c55c3cf011', 10, 'daikon', '白蘿蔔', 'Daikon', 2400, 'medium', '秋蘿蔔上市', 'Autumn daikon arrives');
INSERT INTO public.seasonal_surplus (id, month, veg_key, name_zh, name_en, typical_surplus_kg, severity, note_zh, note_en) VALUES ('ed9a786d-8493-4e14-a88c-34956a84a22e', 10, 'cabbage', '高麗菜', 'Cabbage', 2600, 'medium', '平地種植開始', 'Lowland planting begins');
INSERT INTO public.seasonal_surplus (id, month, veg_key, name_zh, name_en, typical_surplus_kg, severity, note_zh, note_en) VALUES ('fa26e345-89a8-4bf2-8cb1-f461776e2f74', 10, 'carrot', '紅蘿蔔', 'Carrot', 1800, 'low', '雲林產區', 'Yunlin production belt');
INSERT INTO public.seasonal_surplus (id, month, veg_key, name_zh, name_en, typical_surplus_kg, severity, note_zh, note_en) VALUES ('6865ae21-34de-47db-8470-b9db9c0afa8f', 11, 'cabbage', '高麗菜', 'Cabbage', 3400, 'high', '超種警戒', 'Over-planting alert');
INSERT INTO public.seasonal_surplus (id, month, veg_key, name_zh, name_en, typical_surplus_kg, severity, note_zh, note_en) VALUES ('62374c45-f944-480e-b05e-b61794ceb4ed', 11, 'broccoli', '青花菜', 'Broccoli', 2700, 'high', '花椰菜同時採收', 'Simultaneous broccoli harvest');
INSERT INTO public.seasonal_surplus (id, month, veg_key, name_zh, name_en, typical_surplus_kg, severity, note_zh, note_en) VALUES ('a3528437-e7ce-408e-9854-0a990d04479b', 11, 'daikon', '白蘿蔔', 'Daikon', 2500, 'medium', '醃蘿蔔季', 'Pickled radish season');
INSERT INTO public.seasonal_surplus (id, month, veg_key, name_zh, name_en, typical_surplus_kg, severity, note_zh, note_en) VALUES ('c4cbdc7e-536c-4b66-bb12-253d84de6ae4', 12, 'broccoli', '青花菜', 'Broccoli', 3600, 'high', '年度過剩高峰', 'Annual surplus peak');
INSERT INTO public.seasonal_surplus (id, month, veg_key, name_zh, name_en, typical_surplus_kg, severity, note_zh, note_en) VALUES ('b607281c-74e9-4d30-9df2-eec32bf0e050', 12, 'cabbage', '高麗菜', 'Cabbage', 4000, 'high', '價格崩跌', 'Prices collapse');
INSERT INTO public.seasonal_surplus (id, month, veg_key, name_zh, name_en, typical_surplus_kg, severity, note_zh, note_en) VALUES ('e5ca26e4-33c7-4d87-a86e-e49c1204390f', 12, 'cauliflower', '白花椰菜', 'Cauliflower', 2300, 'medium', '同期競爭', 'Competing with broccoli');

-- Farm Supply
INSERT INTO public.farm_supply (id, farmer_name, veg_key, name_zh, name_en, kg, available_from, available_to, status) VALUES ('ec7d6385-82ba-43a7-8fdc-fb0a1862a6e5', '楊梅 · 邱大哥', 'cabbage', '高麗菜', 'Cabbage', 80, '2026-08-21', '2026-08-24', 'available');
INSERT INTO public.farm_supply (id, farmer_name, veg_key, name_zh, name_en, kg, available_from, available_to, status) VALUES ('9ad9df8f-5a28-4ea5-a90b-fb6ea0656dbb', '新埔 · 范姊', 'carrot', '紅蘿蔔', 'Carrot', 30, '2026-08-21', '2026-08-24', 'available');
INSERT INTO public.farm_supply (id, farmer_name, veg_key, name_zh, name_en, kg, available_from, available_to, status) VALUES ('3f494773-68e8-407f-aeef-b687a4f54cfa', '公館 · 劉伯', 'tomato', '番茄', 'Tomato', 25, '2026-08-21', '2026-08-24', 'available');
INSERT INTO public.farm_supply (id, farmer_name, veg_key, name_zh, name_en, kg, available_from, available_to, status) VALUES ('b991a80c-ce74-4b9d-ac6e-5fa3abdff1bd', '三義 · 徐家', 'eggplant', '茄子', 'Eggplant', 18, '2026-08-21', '2026-08-24', 'available');
INSERT INTO public.farm_supply (id, farmer_name, veg_key, name_zh, name_en, kg, available_from, available_to, status) VALUES ('8375165f-0032-4679-adf2-eb5a5e750f72', '關西 · 羅媽媽', 'daikon', '白蘿蔔', 'Daikon', 26, '2026-08-21', '2026-08-24', 'available');
INSERT INTO public.farm_supply (id, farmer_name, veg_key, name_zh, name_en, kg, available_from, available_to, status) VALUES ('04fdf05c-ec65-43da-8ff5-4045889e1dc4', 'cj', 'carrot', '紅蘿蔔', 'Carrot', 100, '2026-08-30', '2026-09-02', 'available');
INSERT INTO public.farm_supply (id, farmer_name, veg_key, name_zh, name_en, kg, available_from, available_to, status) VALUES ('241fe727-73d6-4070-9622-72d6ee98782f', 'pawan', 'cabbage', '高麗菜', 'Cabbage', 200, '2026-08-30', '2026-09-02', 'available');
INSERT INTO public.farm_supply (id, farmer_name, veg_key, name_zh, name_en, kg, available_from, available_to, status) VALUES ('a390fe2f-e14c-40bf-9e83-64ab612dfe2f', 'QA Test Farm', 'broccoli', '青花菜', 'Broccoli', 42, '2026-09-01', '2026-09-01', 'available');

-- Preorders
INSERT INTO public.preorders (id, order_date, campus, portions) VALUES ('5fcc1ac4-2e64-45ab-8c15-f9d23179afc1', '2026-08-21', '中央大學', 180);
INSERT INTO public.preorders (id, order_date, campus, portions) VALUES ('39ac374a-7869-4714-881d-c1d3854988cd', '2026-08-21', '清華大學', 120);
INSERT INTO public.preorders (id, order_date, campus, portions) VALUES ('d73f95cb-7fa4-4dc7-9ad6-76cc0f072eef', '2026-08-21', '聯合大學', 90);
INSERT INTO public.preorders (id, order_date, campus, portions) VALUES ('1d895aca-d976-439e-9464-aa413ffc0406', '2026-08-31', 'ncu', 10);
INSERT INTO public.preorders (id, order_date, campus, portions) VALUES ('88c99c0b-5d8c-41b8-b170-81b1c7ed51fb', '2026-09-01', 'NTU Test Campus', 25);
INSERT INTO public.preorders (id, order_date, campus, portions) VALUES ('0e5cc9a5-ab53-4999-a9e9-65f1e7d6d37c', '2026-09-01', 'NTU Test Campus', 50);
INSERT INTO public.preorders (id, order_date, campus, portions) VALUES ('b5272464-f0de-4f49-8db6-fba4c3e49760', '2026-09-01', 'NTU Test Campus', 33);
INSERT INTO public.preorders (id, order_date, campus, portions) VALUES ('362a3bf4-a0e2-4547-9523-00e547aaa91e', '2026-09-01', 'NTU Test Campus', 44);