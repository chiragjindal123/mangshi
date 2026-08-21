
CREATE TABLE public.recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name_zh text NOT NULL,
  name_en text NOT NULL,
  prep_min int NOT NULL DEFAULT 20,
  cook_min int NOT NULL DEFAULT 25,
  cost_ntd numeric NOT NULL DEFAULT 28,
  kcal int NOT NULL DEFAULT 520,
  vegetarian boolean NOT NULL DEFAULT false,
  allergens text[] NOT NULL DEFAULT '{}',
  max_batch int NOT NULL DEFAULT 200,
  note_zh text,
  note_en text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.recipe_ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  veg_key text NOT NULL,
  name_zh text NOT NULL,
  name_en text NOT NULL,
  kg_per_100 numeric NOT NULL,
  is_core boolean NOT NULL DEFAULT true
);

CREATE TABLE public.seasonal_surplus (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month int NOT NULL CHECK (month BETWEEN 1 AND 12),
  veg_key text NOT NULL,
  name_zh text NOT NULL,
  name_en text NOT NULL,
  typical_surplus_kg numeric NOT NULL,
  severity text NOT NULL DEFAULT 'medium',
  note_zh text,
  note_en text,
  UNIQUE (month, veg_key)
);

CREATE TABLE public.farm_supply (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_name text NOT NULL DEFAULT '示範農友',
  veg_key text NOT NULL,
  name_zh text NOT NULL,
  name_en text NOT NULL,
  kg numeric NOT NULL CHECK (kg > 0),
  available_from date NOT NULL DEFAULT CURRENT_DATE,
  available_to date NOT NULL DEFAULT (CURRENT_DATE + 3),
  status text NOT NULL DEFAULT 'available',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.preorders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_date date NOT NULL DEFAULT CURRENT_DATE,
  campus text NOT NULL DEFAULT '中央大學',
  portions int NOT NULL CHECK (portions > 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.production_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_date date NOT NULL DEFAULT CURRENT_DATE,
  total_meals int NOT NULL DEFAULT 0,
  kg_used numeric NOT NULL DEFAULT 0,
  kg_available numeric NOT NULL DEFAULT 0,
  utilization numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.plan_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL REFERENCES public.production_plans(id) ON DELETE CASCADE,
  recipe_id uuid NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  portions int NOT NULL,
  kg_used numeric NOT NULL DEFAULT 0
);

GRANT SELECT ON public.recipes TO anon, authenticated;
GRANT SELECT ON public.recipe_ingredients TO anon, authenticated;
GRANT SELECT ON public.seasonal_surplus TO anon, authenticated;
GRANT SELECT, INSERT ON public.farm_supply TO anon, authenticated;
GRANT SELECT, INSERT ON public.preorders TO anon, authenticated;
GRANT SELECT, INSERT ON public.production_plans TO anon, authenticated;
GRANT SELECT, INSERT ON public.plan_items TO anon, authenticated;
GRANT ALL ON public.recipes, public.recipe_ingredients, public.seasonal_surplus,
  public.farm_supply, public.preorders, public.production_plans, public.plan_items TO service_role;

ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seasonal_surplus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_supply ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preorders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read recipes" ON public.recipes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public read recipe_ingredients" ON public.recipe_ingredients FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public read seasonal_surplus" ON public.seasonal_surplus FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public read farm_supply" ON public.farm_supply FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public add farm_supply" ON public.farm_supply FOR INSERT TO anon, authenticated WITH CHECK (kg > 0 AND kg <= 5000);
CREATE POLICY "public read preorders" ON public.preorders FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public add preorders" ON public.preorders FOR INSERT TO anon, authenticated WITH CHECK (portions > 0 AND portions <= 5000);
CREATE POLICY "public read production_plans" ON public.production_plans FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public add production_plans" ON public.production_plans FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "public read plan_items" ON public.plan_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public add plan_items" ON public.plan_items FOR INSERT TO anon, authenticated WITH CHECK (true);

-- ---------- Mama Recipe Library ----------
INSERT INTO public.recipes (code, name_zh, name_en, prep_min, cook_min, cost_ntd, kcal, vegetarian, allergens, max_batch, note_zh, note_en) VALUES
('hakka_stirfry','客家小炒','Hakka Stir-Fry',35,25,32,610,false,'{soy}',250,'客家經典,鹹香下飯','The classic Hakka plate'),
('tomato_egg','番茄炒蛋','Tomato & Egg',20,15,26,480,true,'{egg}',300,'學生最熟悉的家常味','The most familiar home taste'),
('cabbage_carrot','高麗菜炒紅蘿蔔','Cabbage & Carrot Stir-Fry',18,12,22,390,true,'{}',300,'高麗菜盛產期主力','Backbone of cabbage glut season'),
('braised_eggplant','滷茄子','Braised Eggplant',20,30,28,430,true,'{soy}',200,'軟嫩入味','Slow, soft, savoury'),
('garlic_broccoli','蒜炒青花菜','Garlic Broccoli',15,10,30,360,true,'{}',250,'解決冬季花椰菜過剩','Answers the winter broccoli glut'),
('daikon_soup','白蘿蔔燉湯','Daikon Soup',20,45,24,300,false,'{}',300,'冬季暖身','Winter warmth'),
('pickled_mustard','客家鹹菜滷','Pickled Mustard Braise',30,40,30,520,false,'{soy}',200,'阿嬤的醃漬智慧','Grandmother preservation wisdom'),
('pumpkin_rice','南瓜飯','Pumpkin Rice',25,30,27,560,true,'{}',250,'夏末南瓜盛產','Late-summer pumpkin'),
('bitter_melon','苦瓜封','Stuffed Bitter Melon',40,35,34,470,false,'{soy}',150,'夏日退火','Cools the summer'),
('sweet_potato_leaf','炒地瓜葉','Sweet Potato Leaves',12,8,18,280,true,'{}',300,'最便宜的營養','Cheapest nutrition on the island'),
('bamboo_braise','筍絲滷','Braised Bamboo Shoots',30,40,29,540,false,'{soy}',200,'春筍時節','Spring bamboo season'),
('seasonal_bowl','時蔬飯','Seasonal Veg Bowl',20,20,25,500,true,'{}',350,'什麼多就用什麼','Built from whatever is abundant');

INSERT INTO public.recipe_ingredients (recipe_id, veg_key, name_zh, name_en, kg_per_100, is_core)
SELECT r.id, v.veg_key, v.name_zh, v.name_en, v.kg, v.core FROM public.recipes r
JOIN (VALUES
 ('hakka_stirfry','cabbage','高麗菜','Cabbage',12,true),
 ('hakka_stirfry','carrot','紅蘿蔔','Carrot',3,false),
 ('hakka_stirfry','onion','洋蔥','Onion',4,false),
 ('tomato_egg','tomato','番茄','Tomato',18,true),
 ('tomato_egg','onion','洋蔥','Onion',2,false),
 ('cabbage_carrot','cabbage','高麗菜','Cabbage',20,true),
 ('cabbage_carrot','carrot','紅蘿蔔','Carrot',5,false),
 ('braised_eggplant','eggplant','茄子','Eggplant',18,true),
 ('braised_eggplant','tomato','番茄','Tomato',3,false),
 ('garlic_broccoli','broccoli','青花菜','Broccoli',20,true),
 ('daikon_soup','daikon','白蘿蔔','Daikon',22,true),
 ('daikon_soup','carrot','紅蘿蔔','Carrot',4,false),
 ('pickled_mustard','mustard_greens','芥菜','Mustard Greens',15,true),
 ('pickled_mustard','daikon','白蘿蔔','Daikon',5,false),
 ('pumpkin_rice','pumpkin','南瓜','Pumpkin',16,true),
 ('pumpkin_rice','onion','洋蔥','Onion',2,false),
 ('bitter_melon','bitter_melon','苦瓜','Bitter Melon',16,true),
 ('bitter_melon','carrot','紅蘿蔔','Carrot',2,false),
 ('sweet_potato_leaf','sweet_potato_leaf','地瓜葉','Sweet Potato Leaves',14,true),
 ('bamboo_braise','bamboo','竹筍','Bamboo Shoots',15,true),
 ('bamboo_braise','carrot','紅蘿蔔','Carrot',2,false),
 ('seasonal_bowl','cabbage','高麗菜','Cabbage',8,true),
 ('seasonal_bowl','carrot','紅蘿蔔','Carrot',4,false),
 ('seasonal_bowl','corn','玉米','Corn',4,false),
 ('seasonal_bowl','cauliflower','白花椰菜','Cauliflower',4,false)
) AS v(code, veg_key, name_zh, name_en, kg, core) ON v.code = r.code;

-- ---------- 12-month seasonal surplus ----------
INSERT INTO public.seasonal_surplus (month, veg_key, name_zh, name_en, typical_surplus_kg, severity, note_zh, note_en) VALUES
(1,'cabbage','高麗菜','Cabbage',4200,'high','冬季高麗菜崩盤期','Winter cabbage price collapse'),
(1,'broccoli','青花菜','Broccoli',3100,'high','一顆十元的季節','The NT$10 head season'),
(1,'daikon','白蘿蔔','Daikon',2600,'medium','產地價低','Farm-gate price bottoms out'),
(2,'cabbage','高麗菜','Cabbage',3800,'high','年後需求驟降','Demand drops after New Year'),
(2,'cauliflower','白花椰菜','Cauliflower',2400,'medium','採收高峰','Harvest peak'),
(2,'mustard_greens','芥菜','Mustard Greens',2100,'medium','客家醃漬旺季','Hakka pickling season'),
(3,'bamboo','竹筍','Bamboo Shoots',1800,'medium','春筍出土','Spring shoots emerge'),
(3,'cabbage','高麗菜','Cabbage',2200,'medium','春作尾聲','Tail of the spring crop'),
(3,'carrot','紅蘿蔔','Carrot',1600,'low','外觀不良品多','Many cosmetically rejected roots'),
(4,'bamboo','竹筍','Bamboo Shoots',2100,'medium','盛產期','Peak season'),
(4,'onion','洋蔥','Onion',2600,'high','恆春洋蔥採收','Hengchun onion harvest'),
(4,'cucumber','小黃瓜','Cucumber',1500,'low','溫室過量','Greenhouse overflow'),
(5,'tomato','番茄','Tomato',2400,'medium','梅雨前搶收','Rushed pre-monsoon harvest'),
(5,'cucumber','小黃瓜','Cucumber',1900,'medium','價格走低','Prices sag'),
(5,'bitter_melon','苦瓜','Bitter Melon',1400,'low','初夏上市','Early summer arrival'),
(6,'bitter_melon','苦瓜','Bitter Melon',2000,'medium','盛夏產量高','High summer yield'),
(6,'pumpkin','南瓜','Pumpkin',2200,'medium','南部大出','Southern glut'),
(6,'corn','玉米','Corn',1800,'low','夏收集中','Concentrated harvest'),
(7,'pumpkin','南瓜','Pumpkin',2600,'high','儲運壓力大','Storage and transport pressure'),
(7,'sweet_potato_leaf','地瓜葉','Sweet Potato Leaves',1700,'medium','生長極快','Grows faster than demand'),
(7,'corn','玉米','Corn',2000,'medium','價格低迷','Weak prices'),
(8,'sweet_potato_leaf','地瓜葉','Sweet Potato Leaves',2100,'medium','颱風前搶收','Pre-typhoon harvest'),
(8,'eggplant','茄子','Eggplant',1900,'medium','外觀不良率高','High cosmetic rejection'),
(8,'tomato','番茄','Tomato',1500,'low','小果偏多','Too many small fruits'),
(9,'eggplant','茄子','Eggplant',2200,'medium','秋作大出','Autumn crop surge'),
(9,'tomato','番茄','Tomato',1800,'medium','轉作期過剩','Rotation-period surplus'),
(9,'cabbage','高麗菜','Cabbage',1600,'low','高冷地供應','Highland supply'),
(10,'daikon','白蘿蔔','Daikon',2400,'medium','秋蘿蔔上市','Autumn daikon arrives'),
(10,'cabbage','高麗菜','Cabbage',2600,'medium','平地種植開始','Lowland planting begins'),
(10,'carrot','紅蘿蔔','Carrot',1800,'low','雲林產區','Yunlin production belt'),
(11,'cabbage','高麗菜','Cabbage',3400,'high','超種警戒','Over-planting alert'),
(11,'broccoli','青花菜','Broccoli',2700,'high','花椰菜同時採收','Simultaneous broccoli harvest'),
(11,'daikon','白蘿蔔','Daikon',2500,'medium','醃蘿蔔季','Pickled radish season'),
(12,'broccoli','青花菜','Broccoli',3600,'high','年度過剩高峰','Annual surplus peak'),
(12,'cabbage','高麗菜','Cabbage',4000,'high','價格崩跌','Prices collapse'),
(12,'cauliflower','白花椰菜','Cauliflower',2300,'medium','同期競爭','Competing with broccoli');

-- ---------- demo supply + preorders ----------
INSERT INTO public.farm_supply (farmer_name, veg_key, name_zh, name_en, kg) VALUES
('楊梅 · 邱大哥','cabbage','高麗菜','Cabbage',80),
('新埔 · 范姊','carrot','紅蘿蔔','Carrot',30),
('公館 · 劉伯','tomato','番茄','Tomato',25),
('三義 · 徐家','eggplant','茄子','Eggplant',18),
('關西 · 羅媽媽','daikon','白蘿蔔','Daikon',26);

INSERT INTO public.preorders (campus, portions) VALUES
('中央大學',180),
('清華大學',120),
('聯合大學',90);
