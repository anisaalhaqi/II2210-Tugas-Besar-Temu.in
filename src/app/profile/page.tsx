'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  MapPin, 
  Star, 
  Edit3, 
  Share2, 
  MoreVertical, 
  Search, 
  ChevronDown, 
  Heart,
  TrendingUp,
  MoreHorizontal,
  Loader2,
  Inbox
} from 'lucide-react';
import styles from './profile.module.css';
import { supabase } from '@/lib/supabase';

interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
  campus_location: string;
  rating_avg: number;
  rating_count: number;
  created_at: string;
  bio: string;
}

interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];
  status: string;
  categories: {
    name: string;
  };
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [inventory, setInventory] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [localQuery, setLocalQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<'Semua' | 'Tersedia' | 'Tidak Tersedia'>('Semua');
  const [categoryFilter, setCategoryFilter] = useState<string>('Semua');
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [openDropdown, setOpenDropdown] = useState<'availability' | 'category' | null>(null);

  useEffect(() => {
    async function fetchProfileData() {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          window.location.href = '/auth';
          return;
        }
        
        // 1. Fetch Profile
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData as any);

        // 2. Fetch Products with Category
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select(`
            id, title, price, images, status,
            categories:category_id (name)
          `)
          .eq('seller_id', user.id);

        if (productsError) throw productsError;
        setInventory(productsData as any || []);

        // 3. Fetch All Categories for filter
        const { data: catData } = await supabase
          .from('categories')
          .select('name')
          .order('name');
        if (catData) setAllCategories(catData.map(c => c.name));

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfileData();
  }, []);

  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      const matchesQuery = item.title.toLowerCase().includes(localQuery.toLowerCase());
      
      let matchesAvailability = true;
      if (availabilityFilter === 'Tersedia') {
        matchesAvailability = item.status === 'available';
      } else if (availabilityFilter === 'Tidak Tersedia') {
        matchesAvailability = item.status !== 'available';
      }
      
      let matchesCategory = true;
      if (categoryFilter !== 'Semua') {
        matchesCategory = item.categories?.name === categoryFilter;
      }
      
      return matchesQuery && matchesAvailability && matchesCategory;
    });
  }, [localQuery, availabilityFilter, categoryFilter, inventory]);

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
      <div className={styles.container} style={{ justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loader2 className="animate-spin" size={48} color="#008585" />
        <p style={{ marginTop: '16px', color: '#767676', fontWeight: '600' }}>Memuat profil...</p>
      </div>
    );
  }

  if (!profile) return <div className={styles.container}>Profil tidak ditemukan.</div>;

  return (
    <div className={styles.container}>
      <div className={styles.banner}></div>

      <main className={styles.content}>
        <section className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <div className={styles.mainInfo}>
              <img src={profile.avatar_url || 'https://placehold.co/100x100?text=User'} alt={profile.full_name} className={styles.avatar} />
              <div className={styles.nameSection}>
                <h1>{profile.full_name}</h1>
                <div className={styles.locationInfo}>
                  <MapPin size={16} />
                  <span>{profile.campus_location}</span>
                </div>
              </div>
            </div>

            <div className={styles.statsSection}>
              <div className={styles.statItem}>
                <div className={styles.statValue}>
                  <span>{profile.rating_avg?.toFixed(1) || '0.0'}</span>
                  <Star size={16} fill="#008585" color="#008585" />
                </div>
                <span className={styles.statLabel}>{profile.rating_count || 0} reviews</span>
              </div>
              <div className={styles.divider}></div>
              <div className={styles.statItem}>
                <div className={styles.statValue}>2 tahun</div>
                <span className={styles.statLabel}>di Temu.in</span>
              </div>
            </div>

            <div className={styles.actionRow}>
              <button className={styles.editBtn}>
                <Edit3 size={18} />
                Edit profil
              </button>
              <button className={styles.iconBtn} aria-label="Share">
                <Share2 size={18} />
              </button>
              <button className={styles.iconBtn} aria-label="More">
                <MoreVertical size={18} />
              </button>
            </div>
          </div>

          <div className={styles.bioSection}>
            <p className={styles.bioText}>
              {profile.bio || 'Belum ada bio.'}
            </p>
          </div>
        </section>

        <section className={styles.insightsCard}>
          <div className={styles.insightIconBox}>
            <TrendingUp size={24} />
          </div>
          <div className={styles.insightText}>
            <h3 className={styles.insightTitle}>Tidak ada kunjungan profil hari ini</h3>
            <p className={styles.insightSub}>Tambahkan item untuk menarik pengunjung</p>
          </div>
          <MoreHorizontal size={20} color="#767676" />
        </section>

        <section className={styles.inventorySection}>
          <div className={styles.inventoryHeader}>
            <h2 className={styles.inventoryTitle}>{filteredInventory.length} barang</h2>
            <div className={styles.searchFilterRow}>
              <div className={styles.searchBox}>
                <Search size={18} color="#A5A5A5" />
                <input 
                  type="text" 
                  placeholder="Cari barang" 
                  className={styles.searchInput} 
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                />
              </div>
              <div className={styles.filterGroup}>
                <div 
                  className={`${styles.filterChip} ${availabilityFilter === 'Semua' && categoryFilter === 'Semua' ? styles.filterChipActive : styles.filterChipInactive}`}
                  onClick={() => { setAvailabilityFilter('Semua'); setCategoryFilter('Semua'); setOpenDropdown(null); }}
                >
                  Semua
                </div>

                <div className={styles.filterWrapper}>
                  <div 
                    className={`${styles.filterChip} ${availabilityFilter !== 'Semua' ? styles.filterChipActive : styles.filterChipInactive}`}
                    onClick={() => toggleDropdown('availability')}
                  >
                    {availabilityFilter === 'Semua' ? 'Ketersediaan' : availabilityFilter}
                    <ChevronDown size={16} style={{ transform: openDropdown === 'availability' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </div>
                  {openDropdown === 'availability' && (
                    <div className={styles.dropdownMenu}>
                      <div className={`${styles.dropdownItem} ${availabilityFilter === 'Semua' ? styles.dropdownItemActive : ''}`} onClick={() => { setAvailabilityFilter('Semua'); setOpenDropdown(null); }}>Semua</div>
                      <div className={`${styles.dropdownItem} ${availabilityFilter === 'Tersedia' ? styles.dropdownItemActive : ''}`} onClick={() => { setAvailabilityFilter('Tersedia'); setOpenDropdown(null); }}>Tersedia</div>
                      <div className={`${styles.dropdownItem} ${availabilityFilter === 'Tidak Tersedia' ? styles.dropdownItemActive : ''}`} onClick={() => { setAvailabilityFilter('Tidak Tersedia'); setOpenDropdown(null); }}>Tidak Tersedia</div>
                    </div>
                  )}
                </div>

                <div className={styles.filterWrapper}>
                  <div 
                    className={`${styles.filterChip} ${categoryFilter !== 'Semua' ? styles.filterChipActive : styles.filterChipInactive}`}
                    onClick={() => toggleDropdown('category')}
                  >
                    {categoryFilter === 'Semua' ? 'Kategori' : categoryFilter}
                    <ChevronDown size={16} style={{ transform: openDropdown === 'category' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </div>
                  {openDropdown === 'category' && (
                    <div className={styles.dropdownMenu}>
                      <div className={`${styles.dropdownItem} ${categoryFilter === 'Semua' ? styles.dropdownItemActive : ''}`} onClick={() => { setCategoryFilter('Semua'); setOpenDropdown(null); }}>Semua Kategori</div>
                      {allCategories.map(cat => (
                        <div key={cat} className={`${styles.dropdownItem} ${categoryFilter === cat ? styles.dropdownItemActive : ''}`} onClick={() => { setCategoryFilter(cat); setOpenDropdown(null); }}>{cat}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.productGrid}>
            {filteredInventory.length > 0 ? (
              filteredInventory.map((item) => (
                <div key={item.id} className={styles.productCard}>
                  <img src={item.images[0] || 'https://placehold.co/300x300'} alt={item.title} className={styles.productImg} />
                  <div className={styles.productInfo}>
                    <div className={styles.productTitleRow}>
                      <h3 className={styles.productTitle}>{item.title}</h3>
                      <Heart size={20} className={styles.favIcon} />
                    </div>
                    <div className={styles.productPriceRow}>
                      <span className={styles.productPrice}>{formatPrice(item.price)}</span>
                      <MoreVertical size={18} className={styles.moreBtn} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIconBox}>
                  <Inbox size={64} strokeWidth={1} color="#A5A5A5" />
                </div>
                <h3 className={styles.emptyTitle}>Tidak ada barang ditemukan</h3>
                <p className={styles.emptySub}>Coba ubah kata kunci atau filter untuk menemukan barang Anda.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
