'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  MapPin, 
  Star, 
  Share2, 
  Search, 
  ChevronDown, 
  Heart,
  TrendingUp,
  MoreHorizontal,
  Loader2,
  Inbox,
  ArrowLeft,
  MessageSquare,
  X
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

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const sellerId = params?.id as string;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [inventory, setInventory] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Review Modal States
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Filter States
  const [localQuery, setLocalQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<'Semua' | 'Tersedia' | 'Tidak Tersedia'>('Semua');
  const [categoryFilter, setCategoryFilter] = useState<string>('Semua');
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [openDropdown, setOpenDropdown] = useState<'availability' | 'category' | null>(null);

  const fetchProfileData = async () => {
    if (!sellerId) return;
    try {
      setLoading(true);
      
      // 1. Fetch Profile
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', sellerId)
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
        .eq('seller_id', sellerId);

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
  };

  useEffect(() => {
    fetchProfileData();
  }, [sellerId]);

  const handleShareProfile = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Profil ${profile?.full_name} di Temu.in`,
          url: url
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert('Tautan profil disalin ke clipboard!');
    }
  };

  const handleSubmitReview = async () => {
    if (rating === 0) return;
    
    try {
      setSubmittingReview(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert('Anda harus login untuk memberikan ulasan.');
        router.push('/auth');
        return;
      }

      if (user.id === sellerId) {
        alert('Anda tidak dapat mengulas diri sendiri.');
        return;
      }

      const { data: validOrder } = await supabase
        .from('orders')
        .select('id, product_id')
        .eq('buyer_id', user.id)
        .eq('seller_id', sellerId)
        .limit(1)
        .maybeSingle();
        
      if (!validOrder) {
         alert('Anda hanya dapat mengulas penjual jika pernah bertransaksi (melakukan pemesanan) dengan mereka.');
         return;
      }

      const { error: insertError } = await supabase
        .from('reviews')
        .insert([{
          order_id: validOrder.id,
          product_id: validOrder.product_id,
          reviewer_id: user.id,
          reviewee_id: sellerId,
          role: 'buyer',
          rating: rating,
          comment: reviewText
        }]);

      if (insertError) throw insertError;

      // MANUALLY UPDATE SELLER STATS
      // Since the trigger might be missing, we calculate and update the aggregate in the users table
      const { data: allReviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('reviewee_id', sellerId);
      
      if (allReviews && allReviews.length > 0) {
        const count = allReviews.length;
        const sum = allReviews.reduce((acc, curr) => acc + curr.rating, 0);
        const avg = sum / count;

        await supabase
          .from('users')
          .update({ 
            rating_avg: parseFloat(avg.toFixed(2)), 
            rating_count: count 
          })
          .eq('id', sellerId);
      }

      alert('Ulasan berhasil dikirim! Terima kasih atas penilaian Anda.');
      
      // Fixed: Potential race condition causing 'removeChild' error
      // We reset state and then close the modal
      setRating(0);
      setReviewText('');
      
      // Auto-update local profile view
      await fetchProfileData();
      
      // Small delay before closing modal helps avoid React/DOM sync issues
      setTimeout(() => {
        setIsReviewModalOpen(false);
      }, 100);
      
    } catch (err: any) {
      console.error('Error submitting review:', err);
      alert('Gagal mengirim ulasan. Pastikan Anda memiliki transaksi yang valid.');
    } finally {
      setSubmittingReview(false);
    }
  };

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

  const getJoinDuration = (dateStr: string) => {
    if (!dateStr) return '-';
    const start = new Date(dateStr);
    const now = new Date();
    
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} hari`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} bulan`;
    return `${Math.floor(diffDays / 365)} tahun`;
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
      <div className={styles.banner}>
        <button onClick={() => router.back()} className={styles.backButtonBanner}>
           <ArrowLeft size={20} />
           Kembali
        </button>
      </div>

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
              <Link href={`/reviews/${profile.id}`} className={styles.statItem} style={{ textDecoration: 'none', cursor: 'pointer' }}>
                <div className={styles.statValue}>
                  <span>{profile.rating_avg?.toFixed(1) || '0.0'}</span>
                  <Star size={16} fill="#008585" color="#008585" />
                </div>
                <span className={styles.statLabel}>{profile.rating_count || 0} ulasan</span>
              </Link>
              <div className={styles.divider}></div>
              <div className={styles.statItem}>
                <div className={styles.statValue}>{getJoinDuration(profile.created_at)}</div>
                <span className={styles.statLabel}>di Temu.in</span>
              </div>
            </div>

            <div className={styles.actionRow}>
              <button className={styles.primaryActionBtn} onClick={() => setIsReviewModalOpen(true)}>
                <MessageSquare size={18} />
                Berikan Ulasan
              </button>
              <button className={styles.iconBtn} aria-label="Share" onClick={handleShareProfile}>
                <Share2 size={18} />
              </button>
            </div>
          </div>

          <div className={styles.bioSection}>
            <p className={styles.bioText}>
              {profile.bio || 'Belum ada bio.'}
            </p>
          </div>
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
                <Link href={`/product/${item.id}`} key={item.id} className={styles.productCard}>
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>
                    <img src={item.images[0] || 'https://placehold.co/300x300'} alt={item.title} className={styles.productImg} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {item.status !== 'available' && (
                      <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
                        {item.status.toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className={styles.productInfo}>
                    <div className={styles.productTitleRow}>
                      <h3 className={styles.productTitle}>{item.title}</h3>
                    </div>
                    <div className={styles.productPriceRow}>
                      <span className={styles.productPrice}>{formatPrice(item.price)}</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIconBox}>
                  <Inbox size={64} strokeWidth={1} color="#A5A5A5" />
                </div>
                <h3 className={styles.emptyTitle}>Tidak ada barang</h3>
                <p className={styles.emptySub}>Pengguna ini belum memiliki barang untuk dijual.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsReviewModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setIsReviewModalOpen(false)}>
              <X size={24} />
            </button>
            
            <div className={styles.modalBody}>
              <h2 className={styles.reviewPromptTitle}>Nilai Profil</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <img 
                  src={profile.avatar_url || 'https://placehold.co/100x100?text=User'} 
                  alt={profile.full_name} 
                  className={styles.reviewerAvatar} 
                />
                <span className={styles.reviewerName}>{profile.full_name}</span>
              </div>

              <div className={styles.starRatingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star}
                    className={styles.starButton}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star 
                      size={36} 
                      fill={(hoveredRating || rating) >= star ? '#FFC118' : 'none'} 
                      color={(hoveredRating || rating) >= star ? '#FFC118' : '#A5A5A5'} 
                      strokeWidth={1.5}
                    />
                  </button>
                ))}
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#292929', margin: '8px 0' }}>Bagaimana transaksimu?</h3>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Ulasan</label>
                <textarea 
                  className={styles.textAreaField}
                  placeholder="Masukkan ulasan"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button 
                className={styles.submitBtn} 
                disabled={rating === 0 || submittingReview}
                onClick={handleSubmitReview}
              >
                {submittingReview ? 'Mengirim...' : 'Kirim Penilaian dan Ulasan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
