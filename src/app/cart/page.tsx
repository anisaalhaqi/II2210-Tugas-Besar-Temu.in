'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart, MessageCircle, Check, MessageSquare, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from './cart.module.css';
import { supabase } from '@/lib/supabase';

interface CartItem {
  id: string;
  product: {
    id: string;
    title: string;
    price: number;
    images: string[];
    users: {
      full_name: string;
      id: string;
    }
  }
}

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const JAE_HWAN_ID = '7b27154b-884e-4a05-a89f-0654d0fed203';

  async function fetchCart() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          product:product_id (
            id, title, price, images,
            users:seller_id (id, full_name)
          )
        `)
        .eq('user_id', JAE_HWAN_ID);

      if (error) throw error;
      setItems(data as any || []);
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCart();
  }, []);

  const toggleItem = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const toggleSeller = (sellerId: string) => {
    const sellerItemIds = items.filter(item => item.product.users.id === sellerId).map(item => item.id);
    const allSelected = sellerItemIds.every(id => selectedIds.includes(id));

    if (allSelected) {
      setSelectedIds(selectedIds.filter(id => !sellerItemIds.includes(id)));
    } else {
      const newSelected = [...new Set([...selectedIds, ...sellerItemIds])];
      setSelectedIds(newSelected);
    }
  };

  const toggleAll = () => {
    if (selectedIds.length === items.length && items.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map(item => item.id));
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setItems(items.filter(item => item.id !== id));
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  const totalPrice = items
    .filter(item => selectedIds.includes(item.id))
    .reduce((sum, item) => sum + (item.product?.price || 0), 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Group items by seller
  const groupedItems = items.reduce((acc, item) => {
    if (!item.product) return acc;
    const sellerName = item.product.users.full_name;
    const sellerId = item.product.users.id;
    if (!acc[sellerId]) acc[sellerId] = { name: sellerName, items: [] };
    acc[sellerId].items.push(item);
    return acc;
  }, {} as Record<string, { name: string, items: CartItem[] }>);

  if (loading) {
    return (
      <div className={styles.container} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Loader2 className="animate-spin" size={48} color="#008585" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <header className={styles.pageHeader}>
          <div className={styles.headerLeft}>
            <button 
              onClick={() => router.back()} 
              style={{ 
                padding: '10px', 
                borderRadius: '12px', 
                background: 'white', 
                border: '1px solid #e5e7eb', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center',
                color: '#292929'
              }}
              title="Kembali"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className={styles.pageTitle}>Keranjang</h1>
          </div>
          <div className={styles.headerIcons}>
            <Link href="/favorites" className={styles.headerIconBtn} title="Favorit">
              <Heart size={24} />
            </Link>
            <Link href="/chat" className={styles.headerIconBtn} title="Chat">
              <MessageCircle size={24} />
            </Link>
          </div>
        </header>

        <div className={styles.cartList}>
          {Object.entries(groupedItems).map(([sellerId, group]) => {
            const allSellerSelected = group.items.every(item => selectedIds.includes(item.id));
            return (
              <div key={sellerId} className={styles.sellerGroup}>
                <div className={styles.sellerHeader}>
                  <div className={styles.sellerTitleArea} onClick={() => toggleSeller(sellerId)} style={{ cursor: 'pointer' }}>
                    <div className={`${styles.checkbox} ${allSellerSelected ? styles.checkboxChecked : ''}`}>
                      {allSellerSelected && <Check size={16} color="white" strokeWidth={3} />}
                    </div>
                    <Link href="/profile" className={styles.sellerNameLink} onClick={(e) => e.stopPropagation()}>
                      <span className={styles.sellerName}>{group.name}</span>
                    </Link>
                  </div>
                  <Link href="/chat" className={styles.sellerChatBtn}>
                    <MessageSquare size={16} />
                    <span>Chat Seller</span>
                  </Link>
                </div>
                
                {group.items.map((item) => {
                  const isSelected = selectedIds.includes(item.id);
                  return (
                    <div key={item.id} className={styles.cartItem}>
                      <div 
                        className={`${styles.checkbox} ${isSelected ? styles.checkboxChecked : ''}`}
                        onClick={() => toggleItem(item.id)}
                      >
                        {isSelected && <Check size={16} color="white" strokeWidth={3} />}
                      </div>
                      <img src={item.product.images[0] || 'https://placehold.co/110x110'} alt={item.product.title} className={styles.productImg} />
                      <div className={styles.productInfo}>
                        <h3 className={styles.productTitle}>{item.product.title}</h3>
                        <span className={styles.productPrice}>{formatPrice(item.product.price)}</span>
                      </div>
                      <button className={styles.deleteBtn} onClick={() => deleteItem(item.id)}>
                        Hapus
                      </button>
                    </div>
                  );
                })}
              </div>
            );
          })}

          {items.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#767676' }}>
              <p>Keranjangmu masih kosong. Yuk cari barang kuliahmu!</p>
            </div>
          )}
        </div>
      </main>

      <footer className={styles.bottomBar}>
        <div className={styles.bottomBarContent}>
          <div className={styles.selectAllArea} onClick={toggleAll}>
            <div className={`${styles.checkbox} ${selectedIds.length === items.length && items.length > 0 ? styles.checkboxChecked : ''}`}>
              {selectedIds.length === items.length && items.length > 0 && <Check size={16} color="white" strokeWidth={3} />}
            </div>
            <span className={styles.selectAllText}>Semua</span>
          </div>

          <div className={styles.summaryArea}>
            <div className={styles.totalPrice}>
              {formatPrice(totalPrice)}
            </div>
            <Link 
              href="/order"
              className={`${styles.buyBtn} ${selectedIds.length === 0 ? styles.buyBtnDisabled : ''}`}
              style={{ pointerEvents: selectedIds.length === 0 ? 'none' : 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
            >
              Beli ({selectedIds.length})
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
