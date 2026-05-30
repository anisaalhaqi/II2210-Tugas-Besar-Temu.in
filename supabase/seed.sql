-- ==========================================================
-- TEMU.IN - HYPER-REALISTIC SEED DATA
-- Version: 9.0 (Integrated Anisa Alhaqi Edition)
-- ==========================================================

DO $$
DECLARE
    -- IDs
    u_ids UUID[] := ARRAY[]::UUID[];
    cat_buku UUID; cat_elek UUID; cat_tulis UUID; cat_fashion UUID;
    cat_asrama UUID; cat_hobi UUID; cat_jasa UUID; cat_lain UUID;
    p_ids UUID[] := ARRAY[]::UUID[];
    c_ids UUID[] := ARRAY[]::UUID[];
    o_ids UUID[] := ARRAY[]::UUID[];
    
    i INT; j INT; temp_uid UUID; temp_pid UUID; temp_cid UUID; temp_oid UUID;
    
    locs TEXT[] := ARRAY['ITB Ganesha', 'ITB Jatinangor', 'ITB Cirebon'];
    f_names TEXT[] := ARRAY['Anisa', 'Nadya', 'Bagas', 'Dito', 'Fadhil', 'Ayu', 'Dimas', 'Salsabila', 'Zaki', 'Anisa', 'Kevin', 'Laras', 'Farhan', 'Tiara', 'Arif', 'Hana', 'Raka', 'Maya', 'Eko', 'Santi', 'Taufik', 'Vina', 'Wawan', 'Putri', 'Yanto', 'Indah', 'Budi', 'Citra', 'Adit', 'Gita'];
    l_names TEXT[] := ARRAY['Alhaqi', 'Putri Kusuma', 'Wicaksono', 'Pratama', 'Hidayat', 'Lestari', 'Saputra', 'Ramadhani', 'Iskandar', 'Sari', 'Gunawan', 'Utami', 'Siregar', 'Permata', 'Santoso', 'Wijaya', 'Kusuma', 'Aulia', 'Prasetyo', 'Wulandari'];
    usernames TEXT[] := ARRAY['anisaalhaqi', 'nadyapk', 'bagas_w', 'the.real.dito', 'fadhil_h', 'ayu.lestari', 'dimas_pratama', 'salsa.bil', 'zaki_isk', 'anisa_sari', 'kevin.g', 'laras_ut', 'farhan_sir', 'tiarapermata', 'arif_santos', 'hana_wijaya', 'raka_kusuma', 'maya_aulia', 'eko_pras', 'santi_wulan', 'taufik_h', 'vina_l', 'wawan_s', 'putri_r', 'yanto_w', 'indah_s', 'budi_p', 'citra_k', 'adit_m', 'gita_a'];
    bios TEXT[] := ARRAY['IF’22 yang pengen jual barang krn kosnya udh kepenuhan.', 'Wisudawan Juli, beresin barang kos', 'Ngekos di Cisitu, open jual beli bareng temen', 'Lagi BU buat bayar ukt hiks', 'Jual santai barang ga kepake', 'Beres-beres kamar, banyak harta karun', 'Dulu beli buat praktikum doang', 'Pindah kosan jadi mau ngurangin muatan', 'Titipan temen yang udah balik kampung', 'Preloved berkualitas harga mahasiswa'];
    
    facs TEXT[] := ARRAY['STEI', 'FTI', 'FTMD', 'FSRD', 'SBM', 'FMIPA', 'FITB', 'FTSL', 'FTTM', 'SF', 'SAPPK', 'SITB'];
    jurs TEXT[] := ARRAY['Teknik Informatika', 'Teknik Industri', 'Teknik Mesin', 'Desain Komunikasi Visual', 'Manajemen', 'Matematika', 'Teknik Geologi', 'Teknik Sipil', 'Teknik Pertambangan', 'Farmasi', 'Arsitektur', 'Rekayasa Pertanian'];

    t_buku TEXT[] := ARRAY['Calculus Early Transcendentals Stewart Edisi 8', 'Kimia Dasar Oxtoby Jilid 1', 'Buku Ajar Mekanika Fluida ITB', 'Algoritma dan Pemrograman Rinaldi Munir', 'Purcell Calculus 9th Edition', 'Diktat Kuliah Fisika Dasar TPB', 'Biologi Campbell Edisi 11 Bahasa Indo', 'Manajemen Keuangan Gitman', 'Pengantar Rekayasa Desain SAPPK', 'Kumpulan Soal UTS UAS STEI'];
    img_buku TEXT[] := ARRAY[
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000', 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1000', 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=1000', 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=1000', 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1000', 'https://images.unsplash.com/photo-1510172951991-856a654063f9?q=80&w=1000', 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?q=80&w=1000', 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1000', 'https://images.unsplash.com/photo-1513001900722-370f803f498d?q=80&w=1000', 'https://images.unsplash.com/photo-1491843351663-7c116e814852?q=80&w=1000'
    ];

    t_elek TEXT[] := ARRAY['Laptop ASUS VivoBook 14 A416 RAM 8GB', 'Kalkulator Casio fx-991EX ClassWiz', 'Drawing Tablet Wacom CTL-472', 'Earphone Sony WF-C500 Black', 'Charger MacBook 61W USB-C Original', 'Mouse Logitech G102 Lightsync', 'Monitor Samsung 24 Inch Curved', 'Arduino Uno R3 Starter Kit', 'RAM Laptop 8GB DDR4 Sodimm', 'Powerbank Anker 10000mAh'];
    img_elek TEXT[] := ARRAY[
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1000', 'https://images.unsplash.com/photo-1574607383476-f517f220d30b?q=80&w=1000', 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?q=80&w=1000', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1000', 'https://images.unsplash.com/photo-1619143172084-266185885233?q=80&w=1000', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=1000', 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=1000', 'https://images.unsplash.com/photo-1553406830-ef2513450d76?q=80&w=1000', 'https://images.unsplash.com/photo-1562976540-1502c2145186?q=80&w=1000', 'https://images.unsplash.com/photo-1619489646924-b4fce76b1db5?q=80&w=1000'
    ];

    t_tulis TEXT[] := ARRAY['Rapido Rotring Isograph 0.1/0.2/0.3 set', 'Pensil Mekanik Pentel GraphGear 1000', 'Cat Poster Talens set 12 warna', 'Fineliner Staedtler set 8 warna', 'Drawing Pen Snowman set 0.1-0.8', 'Sketchbook Canson A4 200gsm', 'Set Penggaris Segitiga Rotring Besar', 'Kuas Lukis Eterna set 5', 'Busur Derajat Besi 180', 'Cutter Olfa Heavy Duty'];
    img_tulis TEXT[] := ARRAY[
        'https://images.unsplash.com/photo-1518131394553-852402b2361f?q=80&w=1000', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1000', 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000', 'https://images.unsplash.com/photo-1580569214296-5cf2bffc5ccd?q=80&w=1000', 'https://images.unsplash.com/photo-1624395213043-fa2e123b2656?q=80&w=1000', 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1000', 'https://images.unsplash.com/photo-1599423300746-b62533397364?q=80&w=1000', 'https://images.unsplash.com/photo-1544640808-32ca72ac7f67?q=80&w=1000', 'https://images.unsplash.com/photo-1590327318182-f597960337c7?q=80&w=1000'
    ];

    t_fashion TEXT[] := ARRAY['Jas Lab ukuran M kondisi baik', 'Goggles Lab merk Kimberly-Clark', 'Kemeja Putih Polos Buat Magang', 'Sepatu Safety Krisbow Ori', 'Kaos ITB Ganesha Navy', 'Tas Ransel Eiger 25L', 'Jaket Angkatan Polos Hitam', 'Sepatu Pantofel Pria 42', 'Toga Wisuda ITB (Sewa)', 'Dasi Hitam Instan'];
    img_fashion TEXT[] := ARRAY[
        'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?q=80&w=1000', 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?q=80&w=1000', 'https://images.unsplash.com/photo-1598033129183-c4f50c717658?q=80&w=1000', 'https://images.unsplash.com/photo-1591409112622-4883ef634033?q=80&w=1000', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000', 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000', 'https://images.unsplash.com/photo-1523050853051-f6c5bc0e1905?q=80&w=1000', 'https://images.unsplash.com/photo-1589756823851-41a312456457?q=80&w=1000'
    ];

    meet_spots TEXT[] := ARRAY['Depan Perpustakaan Pusat ITB', 'Kantin Barat (Kantine) area foodcourt', 'Lobby GKU Barat lt. 1', 'Depan Masjid Salman ITB', 'Area parkir CC Barat', 'Sekre HMIF lt. 2 GKU Timur', 'Gerbang ITB Jalan Ganesha'];

BEGIN
    -- CLEANUP
    DELETE FROM public.notifications; DELETE FROM public.reviews; DELETE FROM public.orders; DELETE FROM public.messages;
    DELETE FROM public.conversations; DELETE FROM public.favorites; DELETE FROM public.cart_items; DELETE FROM public.products;
    DELETE FROM public.categories; DELETE FROM public.users;
    DELETE FROM auth.users WHERE email LIKE '%@gmail.com';

    -- USERS
    -- Account for Anisa Alhaqi
    INSERT INTO auth.users (id, email, raw_user_meta_data) VALUES ('7b27154b-884e-4a05-a89f-0654d0fed203', 'anisaalhaqi@gmail.com', '{"full_name": "Anisa Alhaqi"}'::jsonb);
    INSERT INTO public.users (id, email, full_name, username, faculty, jurusan, campus_location, bio, is_verified)
    VALUES ('7b27154b-884e-4a05-a89f-0654d0fed203', 'anisaalhaqi@gmail.com', 'Anisa Alhaqi', 'anisaalhaqi', 'STEI', 'Teknik Informatika', 'ITB Ganesha', 'IF’22 yang pengen jual barang krn kosnya udh kepenuhan.', true);
    u_ids := array_append(u_ids, '7b27154b-884e-4a05-a89f-0654d0fed203'::UUID);

    FOR i IN 2..30 LOOP
        DECLARE
            f_idx INT := (floor(random() * 12) + 1)::int;
        BEGIN
            temp_uid := gen_random_uuid(); u_ids := array_append(u_ids, temp_uid);
            INSERT INTO auth.users (id, email, raw_user_meta_data) VALUES (temp_uid, lower(usernames[i]) || '@gmail.com', jsonb_build_object('full_name', f_names[i] || ' ' || l_names[(i % 20) + 1]));
            INSERT INTO public.users (id, email, full_name, username, faculty, jurusan, campus_location, bio, is_verified)
            VALUES (temp_uid, lower(usernames[i]) || '@gmail.com', f_names[i] || ' ' || l_names[(i % 20) + 1], usernames[i], facs[f_idx], jurs[f_idx], locs[(floor(random() * 3) + 1)::int], bios[(floor(random() * 10) + 1)::int], i <= 20);
        END;
    END LOOP;

    -- CATEGORIES
    cat_buku := gen_random_uuid(); cat_elek := gen_random_uuid(); cat_tulis := gen_random_uuid(); cat_fashion := gen_random_uuid();
    cat_asrama := gen_random_uuid(); cat_hobi := gen_random_uuid(); cat_jasa := gen_random_uuid(); cat_lain := gen_random_uuid();
    INSERT INTO categories (id, name, slug, icon) VALUES (cat_buku, 'Buku & Modul', 'buku-modul', 'book'), (cat_elek, 'Elektronik', 'elektronik', 'cpu'), (cat_tulis, 'Alat Gambar & Tulis', 'alat-tulis', 'pen'), (cat_fashion, 'Fashion & Perlengkapan Lab', 'fashion-lab', 'shirt'), (cat_asrama, 'Perlengkapan Asrama', 'perlengkapan-asrama', 'home'), (cat_hobi, 'Hobi & Olahraga', 'hobi-olahraga', 'activity'), (cat_jasa, 'Jasa & Rider', 'jasa-rider', 'truck'), (cat_lain, 'Lainnya', 'lainnya', 'more-horizontal');

    -- PRODUCTS (80 items)
    FOR i IN 1..80 LOOP
        temp_pid := gen_random_uuid(); p_ids := array_append(p_ids, temp_pid);
        INSERT INTO products (id, seller_id, category_id, title, description, price, condition, status, deal_method, location, images)
        VALUES (temp_pid, u_ids[(floor(random() * 30) + 1)::int], 
        (CASE WHEN i<=10 THEN cat_buku WHEN i<=20 THEN cat_elek WHEN i<=30 THEN cat_tulis WHEN i<=40 THEN cat_fashion WHEN i<=50 THEN cat_asrama WHEN i<=60 THEN cat_hobi WHEN i<=70 THEN cat_jasa ELSE cat_lain END),
        (CASE WHEN i<=10 THEN t_buku[((i-1)%10)+1] WHEN i<=20 THEN t_elek[((i-11)%10)+1] WHEN i<=30 THEN t_tulis[((i-21)%10)+1] WHEN i<=40 THEN t_fashion[((i-31)%10)+1] ELSE 'Item Akademik #' || i END),
        'Jual santai barang bekas kuliah. Kondisi masih sangat oke, jarang dipakai sejak semester kemarin. Bisa cek langsung pas COD di kampus.', (floor(random() * 80 + 10) * 5000)::int, (ARRAY['baru', 'seperti baru', 'bekas layak', 'bekas'])[(floor(random() * 4) + 1)::int], CASE WHEN i % 5 = 0 THEN 'sold' WHEN i % 7 = 0 THEN 'reserved' ELSE 'available' END, ARRAY['meet-up'], locs[(floor(random() * 3) + 1)::int], 
        ARRAY[(CASE 
            WHEN i<=10 THEN img_buku[((i-1)%10)+1] WHEN i<=20 THEN img_elek[((i-11)%10)+1] WHEN i<=30 THEN img_tulis[((i-21)%10)+1] WHEN i<=40 THEN img_fashion[((i-31)%10)+1] ELSE 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1000' 
        END)]);
    END LOOP;

    -- CONVERSATIONS & MESSAGES
    FOR i IN 1..25 LOOP
        temp_cid := gen_random_uuid(); c_ids := array_append(c_ids, temp_cid);
        temp_pid := p_ids[i]; 
        temp_uid := CASE WHEN i <= 10 THEN '7b27154b-884e-4a05-a89f-0654d0fed203'::UUID ELSE u_ids[(floor(random() * 29) + 2)::int] END;
        INSERT INTO conversations (id, product_id, buyer_id, seller_id, last_message_at) VALUES (temp_cid, temp_pid, temp_uid, (SELECT seller_id FROM products WHERE id = temp_pid), now());
        INSERT INTO messages (conversation_id, sender_id, content, message_type) VALUES (temp_cid, temp_uid, 'Halo kak, barangnya masih ada?', 'text');
        
        IF i <= 20 THEN
            temp_oid := gen_random_uuid(); o_ids := array_append(o_ids, temp_oid);
            INSERT INTO orders (id, conversation_id, product_id, buyer_id, seller_id, final_price, deal_method, meetup_location, status)
            VALUES (temp_oid, temp_cid, temp_pid, temp_uid, (SELECT seller_id FROM products WHERE id = temp_pid), (SELECT price FROM products WHERE id = temp_pid), 'meet-up', meet_spots[(i%7)+1], CASE WHEN i <= 15 THEN 'completed' ELSE 'waiting_confirmation' END);
            IF i <= 15 THEN
                INSERT INTO reviews (order_id, reviewer_id, reviewee_id, product_id, role, rating, comment) VALUES (temp_oid, temp_uid, (SELECT seller_id FROM products WHERE id = temp_pid), temp_pid, 'buyer', 5, 'Barangnya oke bgt!');
            END IF;
        END IF;
    END LOOP;

    -- FAVORITES FOR ANISA
    FOR i IN 1..10 LOOP
        INSERT INTO favorites (id, user_id, product_id)
        VALUES (gen_random_uuid(), '7b27154b-884e-4a05-a89f-0654d0fed203', p_ids[i+20])
        ON CONFLICT DO NOTHING;
    END LOOP;

END $$;
