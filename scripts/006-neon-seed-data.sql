-- Seed Data for Restaurant Website
-- Run this after 005-neon-complete-schema.sql

-- =====================================================
-- DEFAULT ADMIN USER
-- Password: kuuslauk2024 (hashed with bcrypt, 10 rounds)
-- You can generate a new hash at: https://bcrypt-generator.com/
-- =====================================================
INSERT INTO admin_users (email, password_hash, name) 
VALUES (
  'admin@kuuslauk.ee', 
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'Admin'
) ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- DEFAULT SITE SETTINGS
-- =====================================================
INSERT INTO site_settings (id, restaurant_name, address, phone, email, map_link) 
VALUES (
  1,
  'KÜÜSLAUK',
  'Sadama tn 7, 10111 Tallinn',
  '5424 0020',
  'info@kuuslauk.ee',
  'https://maps.app.goo.gl/MC6A1CWw34dXzTsk9'
) ON CONFLICT (id) DO UPDATE SET
  restaurant_name = EXCLUDED.restaurant_name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  map_link = EXCLUDED.map_link;

-- =====================================================
-- CATEGORIES
-- =====================================================
INSERT INTO categories (slug, name_en, name_et, name_ru, sort_order) VALUES
  ('appetizers', 'Appetizers', 'Eelroad', 'Закуски', 1),
  ('wok', 'Wok Dishes', 'Wok road', 'Вок блюда', 2),
  ('kebab', 'Kebab', 'Kebab', 'Кебаб', 3),
  ('kids', 'Kids Menu', 'Lastemenüü', 'Детское меню', 4),
  ('desserts', 'Desserts', 'Magustoidud', 'Десерты', 5),
  ('drinks', 'Drinks', 'Joogid', 'Напитки', 6)
ON CONFLICT (slug) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_et = EXCLUDED.name_et,
  name_ru = EXCLUDED.name_ru,
  sort_order = EXCLUDED.sort_order;

-- =====================================================
-- SAMPLE MENU ITEMS
-- =====================================================

-- Appetizers
INSERT INTO menu_items (category_slug, name_en, name_et, name_ru, description_en, description_et, description_ru, price, is_spicy, is_extra_spicy, is_vegan) VALUES
  ('appetizers', 'Crispy Wings', 'Krõbedad tiivad', 'Хрустящие крылышки', 'Crispy fried chicken wings with fries', 'Krõbedad praetud kanatiivad friikartulitega', 'Хрустящие жареные куриные крылышки с картофелем фри', 8.90, false, false, false),
  ('appetizers', 'Fried Drumsticks', 'Praetud koivad', 'Жареные голени', 'Golden fried chicken drumsticks', 'Kuldsed praetud kanakoivad', 'Золотистые жареные куриные голени', 7.90, false, false, false),
  ('appetizers', 'Buffalo Wings', 'Buffalo tiivad', 'Крылышки Баффало', 'Spicy buffalo style wings', 'Vürtsikad buffalo stiilis tiivad', 'Острые крылышки в стиле Баффало', 9.90, true, false, false),
  ('appetizers', 'Chili Prawns', 'Tšilli krevetid', 'Креветки с чили', 'Spicy chili prawns appetizer', 'Vürtsikad tšilli krevetid', 'Острые креветки с чили', 12.90, true, true, false),
  ('appetizers', 'Vegetable Tempura', 'Köögivilja tempura', 'Овощная темпура', 'Crispy vegetable tempura with hot sauce', 'Krõbe köögivilja tempura vürtsikas kastmega', 'Хрустящая овощная темпура с острым соусом', 7.50, false, false, true),
  ('appetizers', 'Spring Rolls', 'Kevadrulle', 'Спринг-роллы', 'Crispy vegetable spring rolls', 'Krõbedad köögivilja kevadrulle', 'Хрустящие овощные спринг-роллы', 6.90, false, false, true)
ON CONFLICT DO NOTHING;

-- Wok Dishes
INSERT INTO menu_items (category_slug, name_en, name_et, name_ru, description_en, description_et, description_ru, price, is_spicy, is_extra_spicy, is_vegan) VALUES
  ('wok', 'Honey Chicken Noodles', 'Mee-kana nuudlid', 'Лапша с курицей в меду', 'Honey glazed chicken with wok noodles and sesame', 'Meeglasuuriga kana wok-nuudlite ja seesamiga', 'Курица в медовой глазури с вок-лапшой и кунжутом', 11.90, false, false, false),
  ('wok', 'Peking Chicken', 'Pekingi kana', 'Пекинская курица', 'Classic Peking style chicken with noodles', 'Klassikaline Pekingi stiilis kana nuudlitega', 'Классическая курица по-пекински с лапшой', 12.50, false, false, false),
  ('wok', 'Spicy Vegetable Wok', 'Vürtsikas köögiviljawok', 'Острый овощной вок', 'Spicy stir-fried vegetables with noodles', 'Vürtsikad praetud köögiviljad nuudlitega', 'Острые обжаренные овощи с лапшой', 9.90, true, false, true),
  ('wok', 'Coconut Curry Noodles', 'Kookose karri nuudlid', 'Лапша с кокосовым карри', 'Thai style coconut curry with noodles', 'Tai stiilis kookose karri nuudlitega', 'Тайская кокосовая лапша карри', 11.50, true, false, true),
  ('wok', 'Chili Chicken Rice Noodles', 'Tšilli kana riisi nuudlid', 'Рисовая лапша с курицей чили', 'Spicy chili chicken with rice noodles', 'Vürtsikas tšilli kana riisi nuudlitega', 'Острая курица чили с рисовой лапшой', 12.90, true, true, false),
  ('wok', 'Pad Thai', 'Pad Thai', 'Пад Тай', 'Classic Thai stir-fried noodles with peanuts', 'Klassikalised Tai praetud nuudlid maapähklitega', 'Классическая тайская жареная лапша с арахисом', 11.90, false, false, false),
  ('wok', 'Black Pepper Beef', 'Musta pipra veiseliha', 'Говядина с черным перцем', 'Tender beef with black pepper and noodles', 'Õrn veiseliha musta pipra ja nuudlitega', 'Нежная говядина с черным перцем и лапшой', 13.90, true, false, false)
ON CONFLICT DO NOTHING;

-- Kebab
INSERT INTO menu_items (category_slug, name_en, name_et, name_ru, description_en, description_et, description_ru, price, is_spicy, is_extra_spicy, is_vegan) VALUES
  ('kebab', 'Kebab Wrap', 'Kebab rullo', 'Кебаб в лаваше', 'Kebab meat wrapped in tortilla with vegetables', 'Kebabiliha tortilla sees köögiviljadega', 'Мясо кебаба в тортилье с овощами', 8.90, false, false, false),
  ('kebab', 'Kebab Plate', 'Kebab taldrik', 'Кебаб тарелка', 'Kebab plate with rice, salad and meat', 'Kebab taldrik riisi, salati ja lihaga', 'Тарелка кебаба с рисом, салатом и мясом', 11.90, false, false, false),
  ('kebab', 'Kebab Bowl', 'Kebab kauss', 'Кебаб боул', 'Fresh kebab bowl with vegetables', 'Värske kebab kauss köögiviljadega', 'Свежий боул с кебабом и овощами', 10.90, false, false, false),
  ('kebab', 'Pita Kebab', 'Pita kebab', 'Кебаб в пите', 'Kebab in pita bread Mediterranean style', 'Kebab pita leivas Vahemere stiilis', 'Кебаб в пите по-средиземноморски', 9.50, false, false, false)
ON CONFLICT DO NOTHING;

-- Kids Menu
INSERT INTO menu_items (category_slug, name_en, name_et, name_ru, description_en, description_et, description_ru, price, is_spicy, is_extra_spicy, is_vegan) VALUES
  ('kids', 'Fries with Sausage', 'Friikartulid vorsitga', 'Картофель фри с сосиской', 'French fries with sausage for kids', 'Friikartulid vorsitga lastele', 'Картофель фри с сосиской для детей', 5.90, false, false, false),
  ('kids', 'Honey Chicken Kids', 'Mee kana lastele', 'Медовая курица детская', 'Honey chicken with fries for kids', 'Mee kana friikartulitega lastele', 'Медовая курица с картофелем для детей', 6.90, false, false, false)
ON CONFLICT DO NOTHING;

-- Desserts
INSERT INTO menu_items (category_slug, name_en, name_et, name_ru, description_en, description_et, description_ru, price, is_spicy, is_extra_spicy, is_vegan) VALUES
  ('desserts', 'Cheesecake', 'Juustukook', 'Чизкейк', 'Creamy cheesecake with berry jam', 'Kreemjas juustukook marjamoosiga', 'Сливочный чизкейк с ягодным джемом', 5.50, false, false, false),
  ('desserts', 'Tiramisu', 'Tiramisu', 'Тирамису', 'Classic Italian tiramisu', 'Klassikaline Itaalia tiramisu', 'Классический итальянский тирамису', 5.90, false, false, false)
ON CONFLICT DO NOTHING;

-- Drinks
INSERT INTO menu_items (category_slug, name_en, name_et, name_ru, description_en, description_et, description_ru, price, is_spicy, is_extra_spicy, is_vegan) VALUES
  ('drinks', 'Coca-Cola', 'Coca-Cola', 'Кока-Кола', 'Classic Coca-Cola 0.33L', 'Klassikaline Coca-Cola 0.33L', 'Классическая Кока-Кола 0.33L', 2.50, false, false, true),
  ('drinks', 'Fanta', 'Fanta', 'Фанта', 'Orange Fanta 0.33L', 'Apelsini Fanta 0.33L', 'Апельсиновая Фанта 0.33L', 2.50, false, false, true),
  ('drinks', 'Sprite', 'Sprite', 'Спрайт', 'Sprite 0.33L', 'Sprite 0.33L', 'Спрайт 0.33L', 2.50, false, false, true),
  ('drinks', 'Water', 'Vesi', 'Вода', 'Still water 0.5L', 'Gaseerimata vesi 0.5L', 'Негазированная вода 0.5L', 1.90, false, false, true),
  ('drinks', 'Sparkling Water', 'Gaseeritud vesi', 'Газированная вода', 'Sparkling water 0.5L', 'Gaseeritud vesi 0.5L', 'Газированная вода 0.5L', 1.90, false, false, true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- SAMPLE OFFERS
-- =====================================================
INSERT INTO offers (title_en, title_et, title_ru, description_en, description_et, description_ru, original_price, discount_price, offer_type, valid_from, valid_until, is_active) VALUES
  ('Lunch Special', 'Lõuna Pakkumine', 'Обеденное предложение', 'Any wok dish + drink for a special price', 'Mis tahes wok roog + jook eripakkumise hinnaga', 'Любое вок-блюдо + напиток по специальной цене', 14.90, 11.90, 'daily', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', true),
  ('Family Meal Deal', 'Peremenüü Pakkumine', 'Семейное предложение', '2 main dishes + 2 appetizers + 4 drinks', '2 põhiroog + 2 eelroog + 4 jooki', '2 основных блюда + 2 закуски + 4 напитка', 45.90, 39.90, 'weekly', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', true)
ON CONFLICT DO NOTHING;
