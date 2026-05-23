'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart, MessageCircle, Check, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from './cart.module.css';

interface CartItem {
  id: number;
  seller: string;
  title: string;
  price: number;
  img: string;
}

export default function CartPage() {
  const router = useRouter();
  
  const [items, setItems] = useState<CartItem[]>([
    {
      id: 1,
      seller: 'Jessica',
      title: 'Jas Laboratorium Fisika TPB',
      price: 32000,
      img: 'https://placehold.co/110x110'
    },
    {
      id: 2,
      seller: 'Lily',
      title: 'sensor barometric pressure masih baru bgt',
      price: 32000,
      img: 'https://placehold.co/110x110'
    }
  ]);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const toggleSeller = (seller: string) => {
    const sellerItemIds = items.filter(item => item.seller === seller).map(item => item.id);
    const allSelected = sellerItemIds.every(id => selectedIds.includes(id));

    if (allSelected) {
      setSelectedIds(selectedIds.filter(id => !sellerItemIds.includes(id)));
    } else {
      const newSelected = [...new Set([...selectedIds, ...sellerItemIds])];
      setSelectedIds(newSelected);
    }
  };

  const toggleAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map(item => item.id));
    }
  };

  const deleteItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
    setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
  };

  const totalPrice = items
    .filter(item => selectedIds.includes(item.id))
    .reduce((sum, item) => sum + item.price, 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price).replace('Rp', 'Rp');
  };

  // Group items by seller
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.seller]) acc[item.seller] = [];
    acc[item.seller].push(item);
    return acc;
  }, {} as Record<string, CartItem[]>);

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
          {Object.entries(groupedItems).map(([seller, sellerItems]) => {
            const allSellerSelected = sellerItems.every(item => selectedIds.includes(item.id));
            return (
              <div key={seller} className={styles.sellerGroup}>
                <div className={styles.sellerHeader}>
                  <div className={styles.sellerTitleArea} onClick={() => toggleSeller(seller)} style={{ cursor: 'pointer' }}>
                    <div className={`${styles.checkbox} ${allSellerSelected ? styles.checkboxChecked : ''}`}>
                      {allSellerSelected && <Check size={16} color="white" strokeWidth={3} />}
                    </div>
                    <Link href="/profile" className={styles.sellerNameLink} onClick={(e) => e.stopPropagation()}>
                      <span className={styles.sellerName}>{seller}</span>
                    </Link>
                  </div>
                  <Link href="/chat" className={styles.sellerChatBtn}>
                    <MessageSquare size={16} />
                    <span>Chat Seller</span>
                  </Link>
                </div>
                
                {sellerItems.map((item) => {
                  const isSelected = selectedIds.includes(item.id);
                  return (
                    <div key={item.id} className={styles.cartItem}>
                      <div 
                        className={`${styles.checkbox} ${isSelected ? styles.checkboxChecked : ''}`}
                        onClick={() => toggleItem(item.id)}
                      >
                        {isSelected && <Check size={16} color="white" strokeWidth={3} />}
                      </div>
                      <img src={item.img} alt={item.title} className={styles.productImg} />
                      <div className={styles.productInfo}>
                        <h3 className={styles.productTitle}>{item.title}</h3>
                        <span className={styles.productPrice}>{formatPrice(item.price)}</span>
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

      {/* Fixed Bottom Bar */}
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
