'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Inbox, Loader2 } from 'lucide-react';
import styles from './favorites.module.css';
import { supabase } from '@/lib/supabase';

interface FavoriteItem {
  id: number;
  product: {
    id: number;
    title: string;
    price: number;
    location: string;
    images: string[];
    category: string;
  }
}

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [localQuery, setLocalQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<'Semua' | 'Tersedia' | 'Tidak Tersedia'>('Semua');
  const [categoryFilter, setCategoryFilter] = useState<string>('Semua');
  const [openDropdown, setOpenDropdown] = useState<'availability' | 'category' | null>(null);

  const JAE_HWAN_ID = '00000000-0000-0000-0000-000000000001';

  async function fetchFavorites() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          id,
          product:product_id (
            id, title, price, location, images, category
          )
        `)
        .eq('user_id', JAE_HWAN_ID);

      if (error) throw error;
      setFavorites(data as any || []);
    } catch (err) {
      console.error('Error fetching favorites:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFavorites();
  }, []);

  const filteredFavorites = useMemo(() => {
    return favorites.filter(item => {
      if (!item.product) return false;
      const matchesQuery = item.product.title.toLowerCase().includes(localQuery.toLowerCase());
      
      // Since mock doesn't have availability in DB yet, we assume true for now
      let matchesAvailability = true;
      
      let matchesCategory = true;
      if (categoryFilter !== 'Semua') matchesCategory = item.product.category === categoryFilter;
      
      return matchesQuery && matchesAvailability && matchesCategory;
    });
  }, [localQuery, availabilityFilter, categoryFilter, favorites]);

  const categories = useMemo(() => {
    const cats = favorites.map(f => f.product?.category).filter(Boolean);
    return Array.from(new Set(cats));
  }, [favorites]);

  const toggleDropdown = (type: 'availability' | 'category') => {
    setOpenDropdown(openDropdown === type ? null : type);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

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
        <section className={styles.pageHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={() => router.back()} className={styles.backButton} title="Kembali">
              <ArrowLeft size={20} />
            </button>
            <h1 className={styles.pageTitle}>Favorit</h1>
          </div>
          <div className={styles.localSearchWrapper}>
            <div className={styles.localSearchBar}>
              <Search size={20} style={{ color: '#A5A5A5' }} />
              <input type="text" placeholder="Cari barang" className={styles.localSearchInput} value={localQuery} onChange={(e) => setLocalQuery(e.target.value)} />
            </div>
          </div>
        </section>

        <section className={styles.filterSection}>
           <div className={`${styles.filterChip} ${availabilityFilter === 'Semua' && categoryFilter === 'Semua' ? styles.filterChipActive : styles.filterChipInactive}`} onClick={() => { setAvailabilityFilter('Semua'); setCategoryFilter('Semua'); setOpenDropdown(null); }}>Semua</div>
           <div className={styles.filterGroup}>
             <div className={`${styles.filterChip} ${availabilityFilter !== 'Semua' ? styles.filterChipActive : styles.filterChipInactive}`} onClick={() => toggleDropdown('availability')}>
               {availabilityFilter === 'Semua' ? 'Ketersediaan' : availabilityFilter} 
               <img src="/img/icons/arrow-down.png" alt="" className={styles.filterIcon} style={{ opacity: 0.5, transform: openDropdown === 'availability' ? 'rotate(180deg)' : 'none' }} />
             </div>
             {openDropdown === 'availability' && (
               <div className={styles.dropdownMenu}>
                 <div className={`${styles.dropdownItem} ${availabilityFilter === 'Semua' ? styles.dropdownItemActive : ''}`} onClick={() => { setAvailabilityFilter('Semua'); setOpenDropdown(null); }}>Semua</div>
                 <div className={`${styles.dropdownItem} ${availabilityFilter === 'Tersedia' ? styles.dropdownItemActive : ''}`} onClick={() => { setAvailabilityFilter('Tersedia'); setOpenDropdown(null); }}>Tersedia</div>
                 <div className={`${styles.dropdownItem} ${availabilityFilter === 'Tidak Tersedia' ? styles.dropdownItemActive : ''}`} onClick={() => { setAvailabilityFilter('Tidak Tersedia'); setOpenDropdown(null); }}>Tidak Tersedia</div>
               </div>
             )}
           </div>
           <div className={styles.filterGroup}>
             <div className={`${styles.filterChip} ${categoryFilter !== 'Semua' ? styles.filterChipActive : styles.filterChipInactive}`} onClick={() => toggleDropdown('category')}>
               {categoryFilter === 'Semua' ? 'Kategori' : categoryFilter}
               <img src="/img/icons/arrow-down.png" alt="" className={styles.filterIcon} style={{ opacity: 0.5, transform: openDropdown === 'category' ? 'rotate(180deg)' : 'none' }} />
             </div>
             {openDropdown === 'category' && (
               <div className={styles.dropdownMenu}>
                 <div className={`${styles.dropdownItem} ${categoryFilter === 'Semua' ? styles.dropdownItemActive : ''}`} onClick={() => { setCategoryFilter('Semua'); setOpenDropdown(null); }}>Semua Kategori</div>
                 {categories.map(cat => (
                   <div key={cat} className={`${styles.dropdownItem} ${categoryFilter === cat ? styles.dropdownItemActive : ''}`} onClick={() => { setCategoryFilter(cat!); setOpenDropdown(null); }}>{cat}</div>
                 ))}
               </div>
             )}
           </div>
        </section>

        <div className={styles.statusRow}>
          <div className={styles.itemCount}><span>{filteredFavorites.length}</span> barang</div>
        </div>

        <section className={styles.productGrid}>
          {filteredFavorites.length > 0 ? (
            filteredFavorites.map((item) => (
              <Link href={`/product/${item.product.id}`} key={item.id} className={styles.productCard}>
                <div className={styles.imageContainer}>
                  <img src={item.product.images[0] || 'https://placehold.co/300x200'} alt={item.product.title} className={styles.productImage} />
                </div>
                <div className={styles.productInfo}>
                  <h3 className={styles.productTitle}>{item.product.title}</h3>
                  <p className={styles.productPrice}>{formatPrice(item.product.price)}</p>
                  <div className={styles.productFooter}><div className={styles.productLocation}><img src="/img/icons/location.png" alt="" className={styles.locIcon} /><span>{item.product.location}</span></div></div>
                </div>
              </Link>
            ))
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIconBox}>
                <Inbox size={64} strokeWidth={1} color="#A5A5A5" />
              </div>
              <h3 className={styles.emptyTitle}>Tidak ada barang ditemukan</h3>
              <p className={styles.emptySub}>Coba ubah kata kunci atau filter untuk menemukan barang favoritmu.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
