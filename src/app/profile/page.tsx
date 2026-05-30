'use client';

import { useState, useEffect } from 'react';
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
  Loader2
} from 'lucide-react';
import styles from './profile.module.css';
import { supabase } from '@/lib/supabase';

interface Profile {
  full_name: string;
  avatar_url: string;
  campus_location: string;
  rating_avg: number;
  rating_count: number;
  created_at: string;
}

interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [inventory, setInventory] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Menggunakan ID Jae Hwan dari SEED.sql
  const JAE_HWAN_ID = '00000000-0000-0000-0000-000000000001';

  useEffect(() => {
    async function fetchProfileData() {
      try {
        setLoading(true);
        
        // 1. Fetch Profile (using users table)
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', JAE_HWAN_ID)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData as any);

        // 2. Fetch Products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('seller_id', JAE_HWAN_ID);

        if (productsError) throw productsError;
        setInventory(productsData || []);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfileData();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className={styles.container} style={{ justifyContent: 'center', alignItems: 'center' }}>
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
              <img src={profile.avatar_url} alt={profile.full_name} className={styles.avatar} />
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
                  <span>{profile.rating_avg.toFixed(1)}</span>
                  <Star size={16} fill="#008585" color="#008585" />
                </div>
                <span className={styles.statLabel}>{profile.rating_count} reviews</span>
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
              IF’22 yang pengen jual barang krn kosnya udh kepenuhan. bisa nego yh tp kemungkinan slow resp. ty
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
            <h2 className={styles.inventoryTitle}>{inventory.length} barang</h2>
            <div className={styles.searchFilterRow}>
              <div className={styles.searchBox}>
                <Search size={18} color="#A5A5A5" />
                <input type="text" placeholder="Cari barang" className={styles.searchInput} />
              </div>
              <div className={styles.filterGroup}>
                <button className={styles.filterChip}>
                  Filters <ChevronDown size={16} />
                </button>
                <button className={styles.filterChip}>
                  Ketersediaan: Semua <ChevronDown size={16} />
                </button>
                <button className={styles.filterChip}>
                  Kategori: Semua <ChevronDown size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className={styles.productGrid}>
            {inventory.map((item) => (
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
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
