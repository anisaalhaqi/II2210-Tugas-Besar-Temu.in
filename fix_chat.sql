DO $$
DECLARE
    uid UUID := '9ea8edbb-a8d6-4a1a-a82e-905cc5119d0e'; -- ID Aufar
    v_conv_id UUID := 'ca11ec7f-2e74-4d17-bf9a-38514b132fa7'; -- ID Percakapan dengan Anisa Gunawan
    v_anisa_id UUID;
BEGIN
    -- 1. Ambil ID Anisa Gunawan dari percakapan tersebut
    SELECT CASE WHEN buyer_id = uid THEN seller_id ELSE buyer_id END INTO v_anisa_id
    FROM public.conversations
    WHERE id = v_conv_id;

    -- 2. Update semua pesan di percakapan tersebut agar pengirimnya adalah Anisa
    -- (Atau kita bisa spesifik update pesan terakhir saja)
    UPDATE public.messages 
    SET sender_id = v_anisa_id 
    WHERE conversation_id = v_conv_id;

    -- 3. Jika belum ada pesan, kita tambahkan satu pesan baru dari Anisa
    IF NOT FOUND THEN
        INSERT INTO public.messages (conversation_id, sender_id, type, content, created_at)
        VALUES (v_conv_id, v_anisa_id, 'text', 'Halo kak, barangnya masih ada?', NOW());
    END IF;

    RAISE NOTICE 'Pesan chat telah dialihkan: Anisa Gunawan sebagai pengirim.';
END $$;
