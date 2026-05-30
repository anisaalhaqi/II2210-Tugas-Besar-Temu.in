DO $$
DECLARE
    v_aziza_id UUID := '534df155-eb48-4996-a172-0c3f569e1135'; -- ID Aziza
    v_anisa_id UUID := '2c644728-3615-4ce4-9a29-cf4c1093ddb1'; -- ID Anisa Gunawan
    v_other_id UUID := '9ea8edbb-a8d6-4a1a-a82e-905cc5119d0e'; -- ID Aufar
    v_cat_buku UUID;
    v_cat_elek UUID;
    v_cat_lab UUID;
    
    v_prod_aziza_1 UUID := gen_random_uuid();
    v_prod_aziza_2 UUID := gen_random_uuid();
    v_prod_aziza_3 UUID := gen_random_uuid();
    
    v_conv_1 UUID := gen_random_uuid();
    v_conv_2 UUID := gen_random_uuid();
    v_conv_3 UUID := gen_random_uuid();
    v_conv_4 UUID := gen_random_uuid();
    v_conv_5 UUID := gen_random_uuid();
    v_conv_6 UUID := gen_random_uuid();
BEGIN
    -- Get Categories
    SELECT id INTO v_cat_buku FROM categories WHERE slug = 'buku-modul' LIMIT 1;
    SELECT id INTO v_cat_elek FROM categories WHERE slug = 'elektronik' LIMIT 1;
    SELECT id INTO v_cat_lab FROM categories WHERE slug = 'fashion-lab' LIMIT 1;

    -- A. ADD PRODUCTS FOR AZIZA (She is the Seller)
    INSERT INTO products (id, seller_id, category_id, title, description, price, condition, status, location, images)
    VALUES 
    (v_prod_aziza_1, v_aziza_id, v_cat_elek, 'Multimeter Digital Sanwa CD800a', 'Baru beli bulan lalu, jarang pake.', 350000, 'seperti baru', 'available', 'ITB Ganesha', ARRAY['https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1000']),
    (v_prod_aziza_2, v_aziza_id, v_cat_buku, 'Novel Laskar Pelangi - TTD Penulis', 'Koleksi pribadi, masih mulus.', 150000, 'seperti baru', 'available', 'ITB Jatinangor', ARRAY['https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000']),
    (v_prod_aziza_3, v_aziza_id, v_cat_lab, 'Goggles Safety Honeywell', 'Wajib buat praktikum kimia.', 120000, 'bekas layak', 'available', 'ITB Ganesha', ARRAY['https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?q=80&w=1000']);

    -- B. SCENARIOS (6 Total)

    -- 1. AZIZA (Buyer) - Normal Price (No buttons)
    INSERT INTO conversations (id, product_id, buyer_id, seller_id) VALUES (v_conv_1, '8df107cf-a0c5-4062-8a68-77d277aed17a', v_aziza_id, v_anisa_id);
    INSERT INTO orders (id, conversation_id, product_id, buyer_id, seller_id, final_price, status, deal_method)
    VALUES (gen_random_uuid(), v_conv_1, '8df107cf-a0c5-4062-8a68-77d277aed17a', v_aziza_id, v_anisa_id, 150000, 'waiting_confirmation', 'meet-up');

    -- 2. AZIZA (Buyer) - Offered Price (Waiting response)
    INSERT INTO conversations (id, product_id, buyer_id, seller_id) VALUES (v_conv_2, '1dd123b5-39c6-4ed4-bc36-67db4ddc6b48', v_aziza_id, v_anisa_id);
    INSERT INTO orders (id, conversation_id, product_id, buyer_id, seller_id, final_price, status, deal_method, notes)
    VALUES (gen_random_uuid(), v_conv_2, '1dd123b5-39c6-4ed4-bc36-67db4ddc6b48', v_aziza_id, v_anisa_id, 80000, 'waiting_confirmation', 'meet-up', 'Boleh nego dikit kak?');

    -- 3. AZIZA (Buyer) - Seller Countered (Accept, Counter, Reject buttons)
    INSERT INTO conversations (id, product_id, buyer_id, seller_id) VALUES (v_conv_3, 'c57643eb-452e-49a7-8690-cf8e23673679', v_aziza_id, v_anisa_id);
    INSERT INTO orders (id, conversation_id, product_id, buyer_id, seller_id, final_price, status, deal_method, notes)
    VALUES (gen_random_uuid(), v_conv_3, 'c57643eb-452e-49a7-8690-cf8e23673679', v_aziza_id, v_anisa_id, 95000, 'waiting_confirmation', 'meet-up', 'Tawar balik dari Penjual');

    -- 4. AZIZA (Seller) - Buyer Offered (Accept, Counter, Reject buttons)
    INSERT INTO conversations (id, product_id, buyer_id, seller_id) VALUES (v_conv_4, v_prod_aziza_1, v_other_id, v_aziza_id);
    INSERT INTO orders (id, conversation_id, product_id, buyer_id, seller_id, final_price, status, deal_method, notes)
    VALUES (gen_random_uuid(), v_conv_4, v_prod_aziza_1, v_other_id, v_aziza_id, 300000, 'waiting_confirmation', 'meet-up', 'Nego ya kak.');

    -- 5. AZIZA (Seller) - Buyer paid Normal Price (Confirm button)
    INSERT INTO conversations (id, product_id, buyer_id, seller_id) VALUES (v_conv_5, v_prod_aziza_2, v_other_id, v_aziza_id);
    INSERT INTO orders (id, conversation_id, product_id, buyer_id, seller_id, final_price, status, deal_method)
    VALUES (gen_random_uuid(), v_conv_5, v_prod_aziza_2, v_other_id, v_aziza_id, 150000, 'waiting_confirmation', 'meet-up');

    -- 6. AZIZA (Seller) - Cancelled (Red text)
    INSERT INTO conversations (id, product_id, buyer_id, seller_id) VALUES (v_conv_6, v_prod_aziza_3, v_other_id, v_aziza_id);
    INSERT INTO orders (id, conversation_id, product_id, buyer_id, seller_id, final_price, status, deal_method, cancel_reason)
    VALUES (gen_random_uuid(), v_conv_6, v_prod_aziza_3, v_other_id, v_aziza_id, 120000, 'cancelled', 'meet-up', 'Pembeli berubah pikiran');

    RAISE NOTICE 'Seed Data untuk 6 Test Case Aziza berhasil ditambahkan.';
END $$;
