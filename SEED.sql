-- SEED DATA UNTUK TEMU.IN
-- Gunakan SQL Editor di Supabase untuk menjalankan query ini.

-- 1. BERSIHKAN DATA LAMA (Opsional, gunakan jika ingin reset total)
-- TRUNCATE profiles, products, favorites, cart_items, activities, conversations, messages CASCADE;

-- 2. INSERT PROFILES
-- Kita gunakan UUID buatan untuk simulasi (ID ini harus valid format UUID)
INSERT INTO profiles (id, username, full_name, avatar_url, location, role, rating, review_count)
VALUES 
('00000000-0000-0000-0000-000000000001', 'jaehwan', 'Jae Hwan', 'https://placehold.co/100x100', 'ITB Ganesha', 'Mahasiswa ITB', 5.0, 20),
('00000000-0000-0000-0000-000000000002', 'jessica', 'Jessica', 'https://placehold.co/100x100', 'ITB Ganesha', 'Mahasiswa ITB', 4.8, 15),
('00000000-0000-0000-0000-000000000003', 'lily', 'Lily', 'https://placehold.co/100x100', 'ITB Jatinangor', 'Mahasiswa ITB', 4.9, 8);

-- 3. INSERT PRODUCTS
-- Seller: Jae Hwan (0...01)
INSERT INTO products (seller_id, title, price, location, description, category, originality, usage_period, images, ai_analysis)
VALUES 
('00000000-0000-0000-0000-000000000001', 'Jas Laboratorium Fisika ITB', 32000, 'Ganesha', 'Jas lab kondisi mulus, kancing lengkap.', 'Alat Lab', 'Original', '1 tahun', '{"https://placehold.co/600x600"}', '{"color": "Putih", "condition": "Baik"}'),
('00000000-0000-0000-0000-000000000001', 'BMP280 Sensor Tekanan Udara', 23000, 'Ganesha', 'Sensor baru belum pernah dipakai proyek.', 'Elektronika', 'Original', 'Baru', '{"https://placehold.co/600x600"}', '{"color": "Ungu", "condition": "Baru"}'),
('00000000-0000-0000-0000-000000000001', 'Cat Poster Sakura Full Set', 230000, 'Ganesha', 'Warna lengkap, isi masih 90%.', 'Alat Studio', 'Original', '3 bulan', '{"https://placehold.co/600x600"}', '{"color": "Colorful", "condition": "Mulus"}'),
('00000000-0000-0000-0000-000000000001', 'Buku Phiwiki Edisi Lama', 30000, 'Ganesha', 'Banyak coretan catatan penting.', 'Buku', 'Original', '2 tahun', '{"https://placehold.co/600x600"}', '{"color": "Kuning", "condition": "Bekas"}');

-- 4. INSERT FAVORITES
-- User Jessica menyukai barang Jae Hwan
INSERT INTO favorites (user_id, product_id)
VALUES 
('00000000-0000-0000-0000-000000000002', 1),
('00000000-0000-0000-0000-000000000002', 3);

-- 5. INSERT CART ITEMS
-- User Jessica memasukkan barang ke keranjang
INSERT INTO cart_items (user_id, product_id)
VALUES 
('00000000-0000-0000-0000-000000000002', 1),
('00000000-0000-0000-0000-000000000002', 2);

-- 6. INSERT ACTIVITIES
-- Menunggu Konfirmasi: Jessica menawar barang Jae Hwan
INSERT INTO activities (user_id, counterparty_id, product_id, type, status, price, note)
VALUES 
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 1, 'Jual', 'Menunggu Konfirmasi', 30000, 'Turun 2 ribu dari harga awal'),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 1, 'Beli', 'Menunggu Konfirmasi', 30000, 'Mohon konfirmasi kak');

-- 7. INSERT CONVERSATIONS & MESSAGES
-- Conversation antara Jae Hwan dan Jessica
INSERT INTO conversations (id, participant1_id, participant2_id, last_message)
VALUES 
(1, '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', '31rb deh bungkus.');

INSERT INTO messages (conversation_id, sender_id, type, content)
VALUES 
(1, '00000000-0000-0000-0000-000000000002', 'text', 'Halo kak, jas labnya masih ada?'),
(1, '00000000-0000-0000-0000-000000000001', 'text', 'Masih ada kak, minat?');

-- Insert offer message
INSERT INTO messages (conversation_id, sender_id, type, content, metadata)
VALUES 
(1, '00000000-0000-0000-0000-000000000002', 'offer', 'Tawaranmu', '{"price": "Rp30.000", "product_title": "Jas Laboratorium TPB", "status": "pending"}');
