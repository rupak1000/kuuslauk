-- Insert default admin user (password: kuuslauk2024)
-- Password hash generated with bcrypt
INSERT INTO admin_users (email, password_hash, name)
VALUES ('admin@kuuslauk.ee', '$2b$10$8K1p/a0dL1LXMw0HvQrPvOJvkKE3rJhXHCz3l8t7uJ5bR3u5T5F5u', 'Admin')
ON CONFLICT (email) DO NOTHING;

-- Insert default site settings
INSERT INTO site_settings (id, restaurant_name, address, phone, email, map_link)
VALUES (1, 'KÜÜSLAUK', 'Sadama tn 7, 10111 Tallinn', '5424 0020', 'info@kuuslauk.ee', 'https://maps.app.goo.gl/MC6A1CWw34dXzTsk9')
ON CONFLICT (id) DO UPDATE SET
  restaurant_name = EXCLUDED.restaurant_name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  map_link = EXCLUDED.map_link;

-- Insert categories
INSERT INTO categories (slug, name_en, name_et, name_ru, sort_order) VALUES
('starters', 'Starters', 'Eelroad', 'Закуски', 1),
('wok', 'Wok Dishes', 'Wok-road', 'Вок блюда', 2),
('kebab', 'Kebab', 'Kebab', 'Кебаб', 3),
('kids', 'Kids Menu', 'Lastemenüü', 'Детское меню', 4),
('desserts', 'Desserts', 'Magustoidud', 'Десерты', 5)
ON CONFLICT (slug) DO NOTHING;

-- Insert default offers
INSERT INTO offers (title_en, title_et, title_ru, description_en, description_et, description_ru, original_price, discount_price, offer_type, valid_from, valid_until, image_url, is_active) VALUES
('Lunch Special - Wok + Drink', 'Lõuna erimenüü - Wok + Jook', 'Обеденное предложение - Вок + Напиток', 
 'Get any wok dish with a soft drink for a special price. Available Monday to Friday, 11:00 - 15:00.',
 'Saa ükskõik milline wok-roog koos karastusjoogiga eripakkumise hinnaga. Saadaval E-R, 11:00 - 15:00.',
 'Получите любое блюдо вок с безалкогольным напитком по специальной цене. Доступно Пн-Пт, 11:00 - 15:00.',
 15.00, 11.00, 'daily', '2026-01-01', '2026-12-31', '/wok-lunch-special-deal.jpg', true),
('Weekend Family Deal', 'Nädalavahetuse pere pakkumine', 'Семейное предложение на выходные',
 '2 Main courses + 2 Kids meals + 4 Drinks. Perfect for family weekends!',
 '2 Põhirooga + 2 Lasteeine + 4 Jooki. Ideaalne perekondlikuks nädalavahetuseks!',
 '2 Основных блюда + 2 Детских блюда + 4 Напитка. Идеально для семейных выходных!',
 45.00, 35.00, 'weekly', '2026-01-01', '2026-12-31', '/family-meal-deal-restaurant.jpg', true);
