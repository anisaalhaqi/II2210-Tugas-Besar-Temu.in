DO $$
DECLARE
    old_id UUID := '7b27154b-884e-4a05-a89f-0654d0fed203'; -- Anisa's ID
    new_id UUID;
BEGIN
    -- Get the new ID from public.users for the new active account
    SELECT id INTO new_id FROM public.users WHERE email = 'aufarfk5@gmail.com' LIMIT 1;
    
    IF new_id IS NULL THEN
        RAISE NOTICE 'User aufarfk5@gmail.com not found. Please sign up with this email first.';
        RETURN;
    END IF;

    RAISE NOTICE 'Migrating data from % to %', old_id, new_id;

    -- 1. Update Products (Seller)
    UPDATE public.products SET seller_id = new_id WHERE seller_id = old_id;
    
    -- 2. Update Conversations (Buyer and Seller)
    UPDATE public.conversations SET buyer_id = new_id WHERE buyer_id = old_id;
    UPDATE public.conversations SET seller_id = new_id WHERE seller_id = old_id;
    
    -- 3. Update Messages (Sender)
    UPDATE public.messages SET sender_id = new_id WHERE sender_id = old_id;
    
    -- 4. Update Orders (Buyer and Seller)
    UPDATE public.orders SET buyer_id = new_id WHERE buyer_id = old_id;
    UPDATE public.orders SET seller_id = new_id WHERE seller_id = old_id;
    
    -- 5. Update Favorites
    UPDATE public.favorites SET user_id = new_id WHERE user_id = old_id;
    
    -- 6. Update Cart Items
    UPDATE public.cart_items SET user_id = new_id WHERE user_id = old_id;
    
    -- 7. Update Reviews (Reviewer)
    UPDATE public.reviews SET reviewer_id = new_id WHERE reviewer_id = old_id;
    
    -- 8. Update Notifications
    UPDATE public.notifications SET user_id = new_id WHERE user_id = old_id;

    RAISE NOTICE 'Migration completed successfully.';
END $$;
