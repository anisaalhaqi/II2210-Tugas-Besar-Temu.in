DO $$
DECLARE
    v_aufar_id UUID := '9ea8edbb-a8d6-4a1a-a82e-905cc5119d0e'; -- ID Aufar
    v_aziza_id UUID := '534df155-eb48-4996-a172-0c3f569e1135'; -- ID Lawan (Aziza)
    v_anisa_id UUID := '2c644728-3615-4ce4-9a29-cf4c1093ddb1'; -- ID Lawan (Anisa)
    v_cat_buku UUID; v_cat_elek UUID; v_cat_lab UUID;
    v_p1 UUID := gen_random_uuid(); v_p2 UUID := gen_random_uuid(); v_p3 UUID := gen_random_uuid();
    v_c1 UUID := gen_random_uuid(); v_c2 UUID := gen_random_uuid(); v_c3 UUID := gen_random_uuid();
    v_c4 UUID := gen_random_uuid(); v_c5 UUID := gen_random_uuid(); v_c6 UUID := gen_random_uuid();
BEGIN
    -- Get Categories
    SELECT id INTO v_cat_buku FROM categories WHERE slug = 'buku-modul' LIMIT 1;
    SELECT id INTO v_cat_elek FROM categories WHERE slug = 'elektronik' LIMIT 1;
    SELECT id INTO v_cat_lab FROM categories WHERE slug = 'fashion-lab' LIMIT 1;

    -- A. ADD PRODUCTS FOR AUFAR (He is the Seller)
    INSERT INTO products (id, seller_id, category_id, title, description, price, condition, status, location, images)
    VALUES 
    (v_p1, v_aufar_id, v_cat_elek, '[TEST] Multimeter Digital Aufar', 'Unit testing untuk seller response.', 350000, 'seperti baru', 'available', 'ITB Ganesha', ARRAY['https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1000']),
    (v_p2, v_aufar_id, v_cat_buku, '[TEST] Novel Laskar Pelangi Aufar', 'Unit testing untuk seller confirm.', 150000, 'seperti baru', 'available', 'ITB Jatinangor', ARRAY['https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000']),
    (v_p3, v_aufar_id, v_cat_lab, '[TEST] Goggles Safety Aufar', 'Unit testing untuk cancelled state.', 120000, 'bekas layak', 'available', 'ITB Ganesha', ARRAY['https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?q=80&w=1000']);

    -- B. SCENARIO TEST CASES

    -- 1. AUFAR (Pembeli) - Harga Normal (No buttons, text: "Menunggu konfirmasi penjual...")
    INSERT INTO conversations (id, product_id, buyer_id, seller_id) VALUES (v_c1, '8df107cf-a0c5-4062-8a68-77d277aed17a', v_aufar_id, v_anisa_id);
    INSERT INTO orders (id, conversation_id, product_id, buyer_id, seller_id, final_price, status, deal_method)
    VALUES (gen_random_uuid(), v_c1, '8df107cf-a0c5-4062-8a68-77d277aed17a', v_aufar_id, v_anisa_id, 150000, 'waiting_confirmation', 'meet-up');

    -- 2. AUFAR (Pembeli) - Menawar Harga (No buttons, text: "Menunggu jawaban penjual...")
    INSERT INTO conversations (id, product_id, buyer_id, seller_id) VALUES (v_c2, '1dd123b5-39c6-4ed4-bc36-67db4ddc6b48', v_aufar_id, v_anisa_id);
    INSERT INTO orders (id, conversation_id, product_id, buyer_id, seller_id, final_price, status, deal_method, notes)
    VALUES (gen_random_uuid(), v_c2, '1dd123b5-39c6-4ed4-bc36-67db4ddc6b48', v_aufar_id, v_anisa_id, 80000, 'waiting_confirmation', 'meet-up', 'Tawar balik dari Pembeli');

    -- 3. AUFAR (Pembeli) - Penjual Tawar Balik (3 Buttons: Terima, Tawar Balik, Tolak)
    INSERT INTO conversations (id, product_id, buyer_id, seller_id) VALUES (v_c3, 'c57643eb-452e-49a7-8690-cf8e23673679', v_aufar_id, v_anisa_id);
    INSERT INTO orders (id, conversation_id, product_id, buyer_id, seller_id, final_price, status, deal_method, notes)
    VALUES (gen_random_uuid(), v_c3, 'c57643eb-452e-49a7-8690-cf8e23673679', v_aufar_id, v_anisa_id, 95000, 'waiting_confirmation', 'meet-up', 'Tawar balik dari Penjual');

    -- 4. AUFAR (Penjual) - Pembeli Menawar (3 Buttons: Terima, Tawar Balik, Tolak)
    INSERT INTO conversations (id, product_id, buyer_id, seller_id) VALUES (v_c4, v_p1, v_aziza_id, v_aufar_id);
    INSERT INTO orders (id, conversation_id, product_id, buyer_id, seller_id, final_price, status, deal_method, notes)
    VALUES (gen_random_uuid(), v_c4, v_p1, v_aziza_id, v_aufar_id, 300000, 'waiting_confirmation', 'meet-up', 'Tawar balik dari Pembeli');

    -- 5. AUFAR (Penjual) - Pembeli Bayar Normal (1 Button: "Konfirmasi & Kemas")
    INSERT INTO conversations (id, product_id, buyer_id, seller_id) VALUES (v_c5, v_p2, v_aziza_id, v_aufar_id);
    INSERT INTO orders (id, conversation_id, product_id, buyer_id, seller_id, final_price, status, deal_method)
    VALUES (gen_random_uuid(), v_c5, v_p2, v_aziza_id, v_aufar_id, 150000, 'waiting_confirmation', 'meet-up');

    -- 6. AUFAR (Penjual) - Pesanan Dibatalkan (Tab Dibatalkan, Text Merah)
    INSERT INTO conversations (id, product_id, buyer_id, seller_id) VALUES (v_c6, v_p3, v_aziza_id, v_aufar_id);
    INSERT INTO orders (id, conversation_id, product_id, buyer_id, seller_id, final_price, status, deal_method, cancel_reason)
    VALUES (gen_random_uuid(), v_c6, v_p3, v_aziza_id, v_aufar_id, 120000, 'cancelled', 'meet-up', 'Gagal negosiasi');

    RAISE NOTICE 'Sukses! 6 skenario testing telah ditambahkan untuk akun Aufar.';
END $$;
