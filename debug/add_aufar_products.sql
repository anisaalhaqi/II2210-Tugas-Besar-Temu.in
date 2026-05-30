DO $$
DECLARE
    v_uid UUID := '9ea8edbb-a8d6-4a1a-a82e-905cc5119d0e'; -- ID Aufar
    v_cat_buku UUID;
    v_cat_elek UUID;
    v_cat_tulis UUID;
    v_cat_fashion UUID;
BEGIN
    -- Ambil ID Kategori
    SELECT id INTO v_cat_buku FROM categories WHERE slug = 'buku-modul' LIMIT 1;
    SELECT id INTO v_cat_elek FROM categories WHERE slug = 'elektronik' LIMIT 1;
    SELECT id INTO v_cat_tulis FROM categories WHERE slug = 'alat-tulis' LIMIT 1;
    SELECT id INTO v_cat_fashion FROM categories WHERE slug = 'fashion-lab' LIMIT 1;

    -- Masukkan 5 Produk untuk Aufar
    INSERT INTO public.products (id, seller_id, category_id, title, description, price, condition, status, location, images, deal_method)
    VALUES 
    (gen_random_uuid(), v_uid, v_cat_elek, 'Arduino Uno R3 Starter Kit Lengkap', 'Jual santai kit arduino bekas praktikum sistel. Komponen masih lengkap semua, kabel-kabel rapi.', 150000, 'seperti baru', 'available', 'ITB Ganesha', ARRAY['https://images.unsplash.com/photo-1553406830-ef2513450d76?q=80&w=1000'], ARRAY['meet-up']),
    
    (gen_random_uuid(), v_uid, v_cat_buku, 'Buku Fisika Dasar Halliday Resnick Jilid 1', 'Buku wajib TPB. Masih bersih banget, ga ada coretan pulpen, cuma ada stabilo dikit di bab awal.', 120000, 'bekas layak', 'available', 'ITB Ganesha', ARRAY['https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000'], ARRAY['meet-up', 'jasa ojol']),
    
    (gen_random_uuid(), v_uid, v_cat_tulis, 'Set Rapido Rotring 0.1, 0.3, 0.5', 'Jual murah satu set rapido. Jarang dipake krn pindah ke digital. Tinta masih ada dikit.', 250000, 'bekas', 'available', 'ITB Jatinangor', ARRAY['https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=1000'], ARRAY['meet-up']),
    
    (gen_random_uuid(), v_uid, v_cat_fashion, 'Jas Laboratorium Kimia Ukuran L', 'Jas lab bersih, baru dipake 4 kali praktikum. Bahan tebel dan ga panas.', 75000, 'seperti baru', 'available', 'ITB Ganesha', ARRAY['https://images.unsplash.com/photo-1518152006812-edab29b069ac?q=80&w=1000'], ARRAY['meet-up', 'titip teman']),
    
    (gen_random_uuid(), v_uid, v_cat_elek, 'Mouse Logitech G304 Wireless White', 'Mouse gaming buat nugas. Masih mulus, box lengkap, klik masih sangat taktil.', 300000, 'bekas layak', 'available', 'ITB Ganesha', ARRAY['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=1000'], ARRAY['meet-up']);

    RAISE NOTICE '5 Produk baru telah ditambahkan untuk akun Aufar.';
END $$;
