'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Inbox } from 'lucide-react';
import styles from './favorites.module.css';
import { supabase } from '@/lib/supabase';
import Skeleton from '@/components/Skeleton/Skeleton';

interface FavoriteItem {
  id: string;
  product: {
    id: string;
    title: string;
    price: number;
    location: string;
    images: string[];
    status: string;
    categories: {
      name: string;
    };
  }
}

function FavoritesSkeleton() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <section className={styles.pageHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Skeleton width={32} height={32} borderRadius="50%" />
            <Skeleton width={120} height={32} />
          </div>
          <div className={styles.localSearchWrapper}>
            <Skeleton width="100%" height={48} borderRadius={24} />
          </div>
        </section>

        <section className={styles.filterSection} style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} width={100} height={40} borderRadius={20} />
          ))}
        </section>

        <div className={styles.statusRow} style={{ marginTop: '24px', marginBottom: '16px' }}>
          <Skeleton width={100} height={20} />
        </div>

        <section className={styles.productGrid}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className={styles.productCard}>
              <div className={styles.imageContainer}>
                <Skeleton width="100%" height="100%" borderRadius={0} />
              </div>
              <div className={styles.productInfo}>
                <Skeleton width="90%" height={16} style={{ marginBottom: '8px' }} />
                <Skeleton width="60%" height={22} style={{ marginBottom: '12px' }} />
                <div className={styles.productFooter}>
                  <Skeleton width={80} height={14} />
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [localQuery, setLocalQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<'Semua' | 'Tersedia' | 'Tidak Tersedia'>('Semua');
  const [categoryFilter, setCategoryFilter] = useState<string>('Semua');
  const [openDropdown, setOpenDropdown] = useState<'availability' | 'category' | null>(null);
  const [allCategories, setAllCategories] = useState<string[]>([]);

  async function fetchFavorites(uid: string) {
    try {
      setLoading(true);
      // Fetch user favorites
      const { data: favData, error: favError } = await supabase
        .from('favorites')
        .select(`
          id,
          product:product_id (
            id, title, price, location, images, status,
            categories:category_id (name)
          )
        `)
        .eq('user_id', uid);

      if (favError) throw favError;
      setFavorites(favData as any || []);

      // Fetch ALL categories for the filter
      const { data: catData } = await supabase
        .from('categories')
        .select('name')
        .order('name');
      
      if (catData) {
        setAllCategories(catData.map(c => c.name));
      }
    } catch (err) {
      console.error('Error fetching favorites:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
        return;
      }
      fetchFavorites(user.id);
    }
    init();
  }, []);

  const filteredFavorites = useMemo(() => {
    return favorites.filter(item => {
      if (!item.product) return false;
      
      // 1. Search Filter
      const matchesQuery = item.product.title.toLowerCase().includes(localQuery.toLowerCase());
      
      // 2. Availability Filter
      let matchesAvailability = true;
      if (availabilityFilter === 'Tersedia') {
        matchesAvailability = item.product.status === 'available';
      } else if (availabilityFilter === 'Tidak Tersedia') {
        matchesAvailability = item.product.status !== 'available';
      }
      
      // 3. Category Filter
      let matchesCategory = true;
      if (categoryFilter !== 'Semua') {
        matchesCategory = item.product.categories?.name === categoryFilter;
      }
      
      return matchesQuery && matchesAvailability && matchesCategory;
    });
  }, [localQuery, availabilityFilter, categoryFilter, favorites]);

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
    return <FavoritesSkeleton />;
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
                 {allCategories.map(cat => (
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
                  {item.product.status !== 'available' && (
                    <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
                      {item.product.status.toUpperCase()}
                    </div>
                  )}
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
