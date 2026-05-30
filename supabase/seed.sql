-- ==========================================================
-- TEMU.IN - REALISTIC SEED DATA
-- Designed for ITB Student Marketplace
-- ==========================================================

-- Note: This script uses DO blocks and temporary variables to ensure UUID consistency
-- across tables without hardcoding hundreds of UUIDs manually.

DO $$
DECLARE
    -- User IDs
    u_ids UUID[] := ARRAY[]::UUID[];
    -- Category IDs
    cat_buku UUID; cat_elektronik UUID; cat_tulis UUID; cat_fashion UUID; cat_asrama UUID; cat_hobi UUID; cat_jasarider UUID; cat_lainnya UUID;
    -- Product IDs
    p_ids UUID[] := ARRAY[]::UUID[];
    -- Conversation IDs
    c_ids UUID[] := ARRAY[]::UUID[];
    -- Order IDs
    o_ids UUID[] := ARRAY[]::UUID[];
    
    i INT;
    j INT;
    temp_uid UUID;
    temp_pid UUID;
    temp_cid UUID;
    temp_oid UUID;
    
    -- Names for users
    first_names TEXT[] := ARRAY['Ahmad', 'Budi', 'Citra', 'Dewi', 'Eko', 'Fajar', 'Gita', 'Hadi', 'Indah', 'Joko', 'Kartika', 'Lutfi', 'Maya', 'Naufal', 'Olivia', 'Putu', 'Qory', 'Rian', 'Santi', 'Taufik', 'Umar', 'Vina', 'Wawan', 'Xena', 'Yanto', 'Zul', 'Arif', 'Bella', 'Chandra', 'Dina'];
    last_names TEXT[] := ARRAY['Hidayat', 'Saputra', 'Lestari', 'Wulandari', 'Prasetyo', 'Kusuma', 'Putri', 'Gunawan', 'Permata', 'Santoso', 'Wijaya', 'Sari', 'Utami', 'Ramadhan', 'Siregar', 'Manurung', 'Ginting', 'Sitorus', 'Nasution', 'Lubis'];
    faculties TEXT[] := ARRAY['STEI', 'FTI', 'FTMD', 'FSRD', 'SBM', 'FMIPA', 'FITB', 'FTSL', 'FTTM', 'SF', 'SAPPK', 'SITB'];
    locations TEXT[] := ARRAY['Ganesha', 'Jatinangor', 'Cirebon'];
    
    -- Product data
    prod_titles_buku TEXT[] := ARRAY['Kalkulus Purcell Edisi 9', 'Fisika Dasar Halliday Vol 1', 'Kimia Dasar Chang', 'Algoritma & Struktur Data CLRS', 'Manajemen Keuangan SBM', 'Pengantar Teknik Industri', 'Mekanika Teknik Hibbeler', 'Termodinamika Moran Shapiro', 'Buku Gambar A3 STEI', 'Diktat Kuliah TPB'];
    prod_titles_elek TEXT[] := ARRAY['Kalkulator Casio fx-991EX', 'Mouse Logitech G102', 'Keyboard Mechanical Vortex', 'Arduino Uno R3 Starter Kit', 'Monitor LG 24 Inch', 'RAM Laptop 8GB DDR4', 'Powerbank Anker 10000mAh', 'Headphone Sennheiser HD206', 'Multimeter Digital Sanwa', 'Soldering Iron Goot'];
    
    campus_spots TEXT[] := ARRAY['Sekre HMIF GKU Timur', 'Perpustakaan Pusat', 'Kantin Barat', 'Labtek V', 'Asrama Kidang Pananjung', 'Selasar Sipil', 'Plaza Widya', 'Kantin Boroma'];

BEGIN
    -- ==================== USERS ====================
    -- Create 30 Users
    FOR i IN 1..30 LOOP
        temp_uid := gen_random_uuid();
        u_ids := array_append(u_ids, temp_uid);
        
        -- Insert into auth.users (dummy entry for reference integrity)
        -- In actual Supabase, these would exist in auth.users first.
        -- For seed purposes, we insert into public.users.
        -- NOTE: Since users.id references auth.users(id), we might need to handle this carefully.
        -- However, for a direct psql seed, we'll assume the FK is to public.users or handled by the user.
        -- In this context, I will skip the auth side and focus on the public schema.
        
        -- Since the schema has REFERENCES auth.users(id), we MUST insert into auth.users first.
        INSERT INTO auth.users (id, email, raw_user_meta_data)
        VALUES (temp_uid, lower(first_names[i]) || i || '@mahasiswa.itb.ac.id', jsonb_build_object('full_name', first_names[i] || ' ' || last_names[(i % 20) + 1]));

        INSERT INTO public.users (id, email, full_name, username, faculty, department, campus_location, is_verified, created_at, last_seen_at)
        VALUES (
            temp_uid,
            lower(first_names[i]) || i || '@mahasiswa.itb.ac.id',
            first_names[i] || ' ' || last_names[(i % 20) + 1],
            lower(first_names[i]) || i,
            faculties[(floor(random() * 12) + 1)::int],
            'Jurusan ' || i,
            locations[(floor(random() * 3) + 1)::int],
            CASE WHEN i <= 20 THEN true ELSE false END,
            now() - (i || ' days')::interval,
            now() - (random() * 30 || ' hours')::interval
        );
    END LOOP;

    -- ==================== CATEGORIES ====================
    cat_buku := gen_random_uuid();
    cat_elektronik := gen_random_uuid();
    cat_tulis := gen_random_uuid();
    cat_fashion := gen_random_uuid();
    cat_asrama := gen_random_uuid();
    cat_hobi := gen_random_uuid();
    cat_jasarider := gen_random_uuid();
    cat_lainnya := gen_random_uuid();

    INSERT INTO categories (id, name, slug, icon) VALUES
    (cat_buku, 'Buku & Modul', 'buku-modul', 'book'),
    (cat_elektronik, 'Elektronik', 'elektronik', 'cpu'),
    (cat_tulis, 'Alat Tulis', 'alat-tulis', 'pen'),
    (cat_fashion, 'Fashion & Atribut', 'fashion-atribut', 'shirt'),
    (cat_asrama, 'Perlengkapan Asrama', 'perlengkapan-asrama', 'home'),
    (cat_hobi, 'Hobi & Olahraga', 'hobi-olahraga', 'activity'),
    (cat_jasarider, 'Jasa & Rider', 'jasa-rider', 'truck'),
    (cat_lainnya, 'Lainnya', 'lainnya', 'more-horizontal');

    -- ==================== PRODUCTS ====================
    -- Generate ~160 products
    FOR i IN 1..160 LOOP
        temp_pid := gen_random_uuid();
        p_ids := array_append(p_ids, temp_pid);
        
        -- Assign seller: 
        -- 1-10: heavy sellers (10 prods each = 100)
        -- 11-20: light sellers (3 prods each = 30)
        -- 21-30: buyers (3 prods each = 30)
        IF i <= 100 THEN
            temp_uid := u_ids[(floor((i-1)/10) + 1)::int];
        ELSIF i <= 130 THEN
            temp_uid := u_ids[(floor((i-101)/3) + 11)::int];
        ELSE
            temp_uid := u_ids[(floor((i-131)/3) + 21)::int];
        END IF;

        INSERT INTO products (
            id, seller_id, category_id, title, description, price, condition, status, deal_method, location, images, created_at
        ) VALUES (
            temp_pid,
            temp_uid,
            CASE 
                WHEN i <= 20 THEN cat_buku
                WHEN i <= 40 THEN cat_elektronik
                WHEN i <= 60 THEN cat_tulis
                WHEN i <= 80 THEN cat_fashion
                WHEN i <= 100 THEN cat_asrama
                WHEN i <= 120 THEN cat_hobi
                WHEN i <= 140 THEN cat_jasarider
                ELSE cat_lainnya
            END,
            CASE 
                WHEN i <= 20 THEN prod_titles_buku[((i-1)%10)+1] || ' #' || i
                WHEN i <= 40 THEN prod_titles_elek[((i-21)%10)+1] || ' #' || i
                ELSE 'Barang Mahasiswa ' || i
            END,
            'Jual santai barang bekas kuliah. Kondisi masih oke banget, jarang dipake sejak semester kemarin. Bisa cek langsung pas COD.',
            (floor(random() * 100 + 5) * 5000)::int,
            (ARRAY['baru', 'seperti baru', 'bekas layak', 'bekas'])[(floor(random() * 4) + 1)::int],
            CASE WHEN i % 10 < 7 THEN 'available' WHEN i % 10 < 8.5 THEN 'reserved' ELSE 'sold' END,
            ARRAY['meet-up', 'titip teman'],
            campus_spots[(floor(random() * 8) + 1)::int],
            ARRAY['https://picsum.photos/seed/prod-' || i || '/600/400'],
            now() - (random() * 14 || ' days')::interval
        );
    END LOOP;

    -- ==================== CONVERSATIONS & MESSAGES ====================
    FOR i IN 1..25 LOOP
        temp_cid := gen_random_uuid();
        c_ids := array_append(c_ids, temp_cid);
        
        temp_pid := p_ids[i]; -- Product 1-25
        -- Buyer is from users 21-30
        temp_uid := u_ids[(floor(random() * 10) + 21)::int]; 
        
        INSERT INTO conversations (id, product_id, buyer_id, seller_id, created_at, last_message_at)
        VALUES (temp_cid, temp_pid, temp_uid, (SELECT seller_id FROM products WHERE id = temp_pid), now() - '5 days'::interval, now() - (i || ' hours')::interval);

        -- Messages for each conversation
        FOR j IN 1..6 LOOP
            INSERT INTO messages (conversation_id, sender_id, content, message_type, is_read, created_at)
            VALUES (
                temp_cid,
                CASE WHEN j % 2 = 1 THEN temp_uid ELSE (SELECT seller_id FROM products WHERE id = temp_pid) END,
                CASE 
                    WHEN j = 1 THEN 'Halo kak, barangnya masih ada?'
                    WHEN j = 2 THEN 'Masih ada nih, minat?'
                    WHEN j = 3 THEN 'Bisa kurang gak harganya?'
                    WHEN j = 4 THEN 'Udah nett itu kak, udah murah banget.'
                    WHEN j = 5 THEN 'Oke deh, ketemuan di mana?'
                    ELSE 'Di Kantin Barat aja gimana jam 4 sore?'
                END,
                'text',
                CASE WHEN i <= 8 AND j >= 5 THEN false ELSE true END,
                now() - (6-j || ' hours')::interval
            );
        END LOOP;
        
        -- Add Offer for some
        IF i <= 5 THEN
            INSERT INTO messages (conversation_id, sender_id, content, message_type, offer_price, offer_status, created_at)
            VALUES (temp_cid, temp_uid, 'Nego tipis ya kak', 'offer', (SELECT price FROM products WHERE id = temp_pid) * 0.9, 'pending', now() - '1 hour'::interval);
        END IF;
    END LOOP;

    -- ==================== ORDERS ====================
    FOR i IN 1..20 LOOP
        temp_cid := c_ids[i];
        temp_pid := (SELECT product_id FROM conversations WHERE id = temp_cid);
        temp_oid := gen_random_uuid();
        o_ids := array_append(o_ids, temp_oid);
        
        INSERT INTO orders (
            id, conversation_id, product_id, buyer_id, seller_id, final_price, deal_method, meetup_location, status, created_at
        ) VALUES (
            temp_oid,
            temp_cid,
            temp_pid,
            (SELECT buyer_id FROM conversations WHERE id = temp_cid),
            (SELECT seller_id FROM conversations WHERE id = temp_cid),
            (SELECT price FROM products WHERE id = temp_pid),
            'meet-up',
            'Selasar GKU Timur',
            CASE 
                WHEN i <= 4 THEN 'waiting_confirmation'
                WHEN i <= 7 THEN 'confirmed'
                WHEN i <= 15 THEN 'completed'
                ELSE 'cancelled'
            END,
            now() - '2 days'::interval
        );
        
        -- Update cancelled reason
        IF i > 15 THEN
            UPDATE orders SET cancel_reason = 'Maaf kak, gak jadi butuh barangnya.', cancelled_by = buyer_id WHERE id = temp_oid;
        END IF;
    END LOOP;

    -- ==================== REVIEWS ====================
    FOR i IN 8..15 LOOP -- Completed orders
        INSERT INTO reviews (order_id, reviewer_id, reviewee_id, product_id, role, rating, comment, seller_reply)
        VALUES (
            o_ids[i],
            (SELECT buyer_id FROM orders WHERE id = o_ids[i]),
            (SELECT seller_id FROM orders WHERE id = o_ids[i]),
            (SELECT product_id FROM orders WHERE id = o_ids[i]),
            'buyer',
            CASE WHEN i = 15 THEN 3 ELSE 5 END,
            CASE WHEN i = 15 THEN 'Barang agak lecet tapi gapapa.' ELSE 'Mantap kak, barangnya masih mulus banget!' END,
            CASE WHEN i < 12 THEN 'Sama-sama kak, semoga awet ya!' ELSE NULL END
        );
    END LOOP;

    -- ==================== NOTIFICATIONS ====================
    FOR i IN 1..40 LOOP
        INSERT INTO notifications (user_id, type, title, body, is_read, created_at)
        VALUES (
            u_ids[(floor(random() * 30) + 1)::int],
            (ARRAY['order_confirmed', 'new_message', 'offer_received', 'product_reserved'])[(floor(random() * 4) + 1)::int],
            'Notifikasi Baru',
            'Ada aktivitas baru di akun kamu nih, yuk dicek!',
            CASE WHEN i <= 20 THEN true ELSE false END,
            now() - (random() * 14 || ' days')::interval
        );
    END LOOP;

END $$;
