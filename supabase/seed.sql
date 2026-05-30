-- ==========================================================
-- TEMU.IN - HYPER-REALISTIC SEED DATA
-- Version: 6.0 (Final Polished Data)
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
    f_names TEXT[] := ARRAY['Rizky', 'Nadya', 'Bagas', 'Dito', 'Fadhil', 'Ayu', 'Dimas', 'Salsabila', 'Zaki', 'Anisa', 'Kevin', 'Laras', 'Farhan', 'Tiara', 'Arif', 'Hana', 'Raka', 'Maya', 'Eko', 'Santi', 'Taufik', 'Vina', 'Wawan', 'Putri', 'Yanto', 'Indah', 'Budi', 'Citra', 'Adit', 'Gita'];
    l_names TEXT[] := ARRAY['Firmansyah', 'Putri Kusuma', 'Wicaksono', 'Pratama', 'Hidayat', 'Lestari', 'Saputra', 'Ramadhani', 'Iskandar', 'Sari', 'Gunawan', 'Utami', 'Siregar', 'Permata', 'Santoso', 'Wijaya', 'Kusuma', 'Aulia', 'Prasetyo', 'Wulandari'];
    usernames TEXT[] := ARRAY['rizkyf23', 'nadyapk', 'bagas_w', 'the.real.dito', 'fadhil_h', 'ayu.lestari', 'dimas_pratama', 'salsa.bil', 'zaki_isk', 'anisa_sari', 'kevin.g', 'laras_ut', 'farhan_sir', 'tiarapermata', 'arif_santos', 'hana_wijaya', 'raka_kusuma', 'maya_aulia', 'eko_pras', 'santi_wulan', 'taufik_h', 'vina_l', 'wawan_s', 'putri_r', 'yanto_w', 'indah_s', 'budi_p', 'citra_k', 'adit_m', 'gita_a'];
    bios TEXT[] := ARRAY['Maba STEI 2023, jual barang eks ospek', 'Wisudawan Juli, beresin barang kos', 'Ngekos di Cisitu, open jual beli bareng temen', 'Lagi BU buat bayar ukt hiks', 'Jual santai barang ga kepake', 'Beres-beres kamar, banyak harta karun', 'Dulu beli buat praktikum doang', 'Pindah kosan jadi mau ngurangin muatan', 'Titipan temen yang udah balik kampung', 'Preloved berkualitas harga mahasiswa'];

    t_buku TEXT[] := ARRAY['Calculus Early Transcendentals Stewart Edisi 8', 'Kimia Dasar Oxtoby Jilid 1', 'Buku Ajar Mekanika Fluida ITB', 'Algoritma dan Pemrograman Rinaldi Munir', 'Purcell Calculus 9th Edition', 'Diktat Kuliah Fisika Dasar TPB', 'Biologi Campbell Edisi 11 Bahasa Indo', 'Manajemen Keuangan Gitman', 'Pengantar Rekayasa Desain SAPPK', 'Kumpulan Soal UTS UAS STEI'];
    t_elek TEXT[] := ARRAY['Laptop ASUS VivoBook 14 A416 RAM 8GB', 'Kalkulator Casio fx-991EX ClassWiz', 'Drawing Tablet Wacom CTL-472', 'Earphone Sony WF-C500 Black', 'Charger MacBook 61W USB-C Original', 'Mouse Logitech G102 Lightsync', 'Monitor Samsung 24 Inch Curved', 'Arduino Uno R3 Starter Kit', 'RAM Laptop 8GB DDR4 Sodimm', 'Powerbank Anker 10000mAh'];
    t_tulis TEXT[] := ARRAY['Rapido Rotring Isograph 0.1/0.2/0.3 set', 'Pensil Mekanik Pentel GraphGear 1000', 'Cat Poster Talens set 12 warna', 'Fineliner Staedtler set 8 warna', 'Drawing Pen Snowman set 0.1-0.8', 'Sketchbook Canson A4 200gsm', 'Set Penggaris Segitiga Rotring Besar', 'Kuas Lukis Eterna set 5', 'Busur Derajat Besi 180', 'Cutter Olfa Heavy Duty'];
    t_fashion TEXT[] := ARRAY['Jas Lab ukuran M kondisi baik', 'Goggles Lab merk Kimberly-Clark', 'Kemeja Putih Polos Buat Magang', 'Sepatu Safety Krisbow Ori', 'Kaos ITB Ganesha Navy', 'Tas Ransel Eiger 25L', 'Jaket Angkatan Polos Hitam', 'Sepatu Pantofel Pria 42', 'Toga Wisuda ITB (Sewa)', 'Dasi Hitam Instan'];
    t_asrama TEXT[] := ARRAY['Rice Cooker Miyako Kecil (0.6L)', 'Kipas Angin Meja Sanex', 'Kasur Lipat Inoac Single', 'Dispenser Air Galon Bawah', 'Jemuran Handuk Aluminium', 'Lampu Belajar LED Philips', 'Rak Sepatu 4 Susun Plastic', 'Gantungan Baju (Hanger) 1 Lusin', 'Cermin Dinding Sedang', 'Kotak Kontainer Plastik (Large)'];
    t_hobi TEXT[] := ARRAY['Raket Badminton Yonex Nanoray', 'Bola Basket Spalding TF-150', 'Gitar Akustik Yamaha F310', 'Matras Yoga Speeds 6mm', 'Jersey Futsal ITB Custom', 'Novel Bumi Manusia - Pramoedya', 'Papan Catur Kayu Standar Percasi', 'Tumbler Corkcicle 16oz', 'Kamera Analog Canon AE-1', 'Lensa Kit Sony 16-50mm'];
    t_jasa TEXT[] := ARRAY['Jasa Print & Jilid Antar Kos', 'Jasa Install Software (Matlab/AutoCAD)', 'Jasa Desain Poster/PPT Pro', 'Jasa Tutor Sebaya TPB', 'Jasa Antar Jatinangor - DU', 'Jasa Ketik Tugas / Transkrip', 'Jasa Pindahan Kos Ganesha', 'Jasa Cuci Sepatu (Deep Clean)', 'Jasa Perbaikan Laptop Ringan', 'Jasa Titip Beli Makanan'];
    t_lainnya TEXT[] := ARRAY['Token Listrik 100rb (Jual 95rb)', 'Payung Lipat Jualan', 'Jas Hujan Gajah Asli (Ponco)', 'Botol Minum Tupperware 1L', 'Obat-obatan P3K Set', 'Kabel Extension 5 Lubang', 'Gembok Pagar/Loker Besar', 'Set Alat Makan Stainless', 'Scale Timbangan Badan Digital', 'Kain Lap Microfiber'];

    meet_spots TEXT[] := ARRAY['Depan Perpustakaan Pusat ITB', 'Kantin Barat (Kantine) area foodcourt', 'Lobby GKU Barat lt. 1', 'Depan Masjid Salman ITB', 'Area parkir CC Barat', 'Sekre HMIF lt. 2 GKU Timur', 'Gerbang ITB Jalan Ganesha'];

BEGIN
    -- CLEANUP
    DELETE FROM public.notifications; DELETE FROM public.reviews; DELETE FROM public.orders; DELETE FROM public.messages;
    DELETE FROM public.conversations; DELETE FROM public.favorites; DELETE FROM public.products;
    DELETE FROM public.categories; DELETE FROM public.users;
    DELETE FROM auth.users WHERE email LIKE '%@mahasiswa.itb.ac.id';

    -- USERS
    FOR i IN 1..30 LOOP
        temp_uid := gen_random_uuid(); u_ids := array_append(u_ids, temp_uid);
        INSERT INTO auth.users (id, email, raw_user_meta_data) VALUES (temp_uid, lower(usernames[i]) || '@mahasiswa.itb.ac.id', jsonb_build_object('full_name', f_names[i] || ' ' || l_names[(i % 20) + 1]));
        INSERT INTO public.users (id, email, full_name, username, faculty, department, campus_location, bio, is_verified)
        VALUES (temp_uid, lower(usernames[i]) || '@mahasiswa.itb.ac.id', f_names[i] || ' ' || l_names[(i % 20) + 1], usernames[i], (ARRAY['STEI', 'FTI', 'FTMD', 'FSRD', 'SBM', 'FMIPA', 'FITB', 'FTSL', 'FTTM', 'SF', 'SAPPK', 'SITB'])[(floor(random() * 12) + 1)::int], 'Jurusan ' || i, locs[(floor(random() * 3) + 1)::int], bios[(floor(random() * 10) + 1)::int], i <= 20);
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
        (CASE WHEN i<=10 THEN t_buku[((i-1)%10)+1] WHEN i<=20 THEN t_elek[((i-11)%10)+1] WHEN i<=30 THEN t_tulis[((i-21)%10)+1] WHEN i<=40 THEN t_fashion[((i-31)%10)+1] WHEN i<=50 THEN t_asrama[((i-41)%10)+1] WHEN i<=60 THEN t_hobi[((i-51)%10)+1] WHEN i<=70 THEN t_jasa[((i-61)%10)+1] ELSE t_lainnya[((i-71)%10)+1] END),
        'Jual santai barang bekas kuliah. Kondisi masih sangat oke, jarang dipakai sejak semester kemarin. Bisa cek langsung pas COD di kampus.', (floor(random() * 80 + 10) * 5000)::int, (ARRAY['baru', 'seperti baru', 'bekas layak', 'bekas'])[(floor(random() * 4) + 1)::int], CASE WHEN i % 5 = 0 THEN 'sold' WHEN i % 7 = 0 THEN 'reserved' ELSE 'available' END, ARRAY['meet-up'], locs[(floor(random() * 3) + 1)::int], ARRAY['https://picsum.photos/seed/temu-' || i || '/600/400']);
    END LOOP;

    -- CONVERSATIONS & ORDERS
    FOR i IN 1..25 LOOP
        temp_cid := gen_random_uuid(); c_ids := array_append(c_ids, temp_cid);
        temp_pid := p_ids[i]; temp_uid := u_ids[(floor(random() * 10) + 21)::int];
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

END $$;
