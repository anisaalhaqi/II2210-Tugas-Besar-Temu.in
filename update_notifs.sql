DO $$
DECLARE
    uid UUID := '9ea8edbb-a8d6-4a1a-a82e-905cc5119d0e'; -- ID Aufar
    v_conv_id UUID;
    v_order_id UUID;
    v_opponent_name TEXT;
BEGIN
    -- 1. Bersihkan notifikasi lama agar tidak berantakan
    DELETE FROM public.notifications WHERE user_id = uid;

    -- 2. Ambil satu percakapan asli yang ada
    SELECT c.id, u.full_name INTO v_conv_id, v_opponent_name
    FROM public.conversations c
    JOIN public.users u ON (u.id = CASE WHEN c.buyer_id = uid THEN c.seller_id ELSE c.buyer_id END)
    WHERE c.buyer_id = uid OR c.seller_id = uid
    LIMIT 1;

    -- 3. Ambil satu order asli (completed)
    SELECT id INTO v_order_id FROM public.orders WHERE (buyer_id = uid OR seller_id = uid) AND status = 'completed' LIMIT 1;

    -- 4. Masukkan notifikasi baru yang VALID
    IF v_conv_id IS NOT NULL THEN
        INSERT INTO public.notifications (id, user_id, type, title, body, related_id, related_type, is_read, created_at)
        VALUES (gen_random_uuid(), uid, 'new_message', 'Pesan baru dari ' || v_opponent_name, 
        v_opponent_name || ': "Halo kak, barangnya masih ada?"', v_conv_id, 'conversation', false, NOW());
    END IF;

    IF v_order_id IS NOT NULL THEN
        INSERT INTO public.notifications (id, user_id, type, title, body, related_id, related_type, is_read, created_at)
        VALUES (gen_random_uuid(), uid, 'order_completed', 'Transaksi Selesai!', 
        'Pesanan kamu telah selesai diproses. Cek detailnya di sini.', v_order_id, 'order', false, NOW() - INTERVAL '1 hour');
    END IF;

    -- Tambahkan notifikasi dummy untuk waiting confirmation (direct ke tab perundingan/waiting)
    INSERT INTO public.notifications (id, user_id, type, title, body, related_id, related_type, is_read, created_at)
    VALUES (gen_random_uuid(), uid, 'offer_received', 'Penawaran Masuk', 
    'Ada penawaran baru untuk item kamu. Segera cek!', uid, 'product', true, NOW() - INTERVAL '2 hours');

END $$;
