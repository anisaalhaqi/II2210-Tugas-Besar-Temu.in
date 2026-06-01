'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from './page.module.css';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Heart, 
  Clock, 
  Hourglass, 
  ShieldCheck, 
  Tag, 
  ShoppingBag, 
  MapPin, 
  Star,
  Share2,
  Flag,
  ShoppingCart,
  MessageCircle,
  Plus,
  X
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Skeleton from '@/components/Skeleton/Skeleton';
import MapDisplay from '@/components/Map/MapDisplay';

const campusCoords: Record<string, [number, number]> = {
  'ITB Ganesha': [-6.8909, 107.6104],
  'ITB Jatinangor': [-6.9281, 107.7705],
  'ITB Cirebon': [-6.6455, 108.4071],
};

const reportOptionsList = [
  "Barang mengandung unsur SARA, diskriminasi, pornografi, ancaman, dan pelanggaran nilai/norma sosial",
  "Barang tidak sesuai dengan deskripsi/kenyataan",
  "Barang menyesatkan karena promosi terselubung",
  "Barang menyebarkan informasi pribadi orang lain",
  "Barang duplikat/diulang-ulang oleh akun yang sama",
  "Alasan lainnya"
];

interface Seller {
  id: string;
  full_name: string;
  avatar_url: string;
  rating_avg: number;
  rating_count: number;
}

interface Product {
  id: string;
  title: string;
  price: number;
  location: string;
  description: string;
  category_id: string;
  condition: string;
  brand: string | null;
  images: string[];
  created_at: string;
  seller_id: string;
  users?: Seller; // Joined from Supabase
  categories?: {
    name: string;
  };
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  reviewer: {
    full_name: string;
    avatar_url: string;
  };
}

function ProductSkeleton() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.navigationRow}>
          <Skeleton width={100} height={24} />
        </div>

        <div className={styles.productLayout}>
          <div className={styles.imageGallery}>
            <div className={styles.mainImageWrapper}>
              <Skeleton width="100%" height="100%" borderRadius={0} />
            </div>
            <div className={styles.thumbnailList}>
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} width={80} height={80} borderRadius={8} />
              ))}
            </div>
          </div>

          <div className={styles.productInfo}>
            <div className={styles.titleRow}>
              <Skeleton width="80%" height={36} />
              <Skeleton width={24} height={24} borderRadius="50%" />
            </div>
            <Skeleton width="40%" height={40} style={{ marginBottom: '10px' }} />

            <div className={styles.specList}>
              {[...Array(4)].map((_, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '8px', alignItems: 'center' }}>
                  <Skeleton width={20} height={20} borderRadius="50%" />
                  <Skeleton width={80} height={16} />
                  <Skeleton width={120} height={16} />
                </div>
              ))}
            </div>

            <Skeleton width="100%" height={140} borderRadius={16} />
            <Skeleton width="100%" height={80} />
            <Skeleton width="100%" height={56} borderRadius={8} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Share & Report States
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReportReason, setSelectedReportReason] = useState("");
  const [otherReportReason, setOtherReportReason] = useState("");

  // Status Change States
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("available");

  useEffect(() => {
    if (!id) return;

    async function fetchProductData() {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          // Check if already favorited
          const { data: favData } = await supabase
            .from('favorites')
            .select('id')
            .eq('user_id', user.id)
            .eq('product_id', id)
            .maybeSingle();
          setIsFavorited(!!favData);
        }

        // Fetch likes count
        const { count } = await supabase
          .from('favorites')
          .select('*', { count: 'exact', head: true })
          .eq('product_id', id);
        setLikesCount(count || 0);

        // Fetch Product Data
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            users:seller_id (id, full_name, avatar_url, rating_avg, rating_count),
            categories:category_id (name)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        const prodData = data as unknown as Product;
        setProduct(prodData);
        setSelectedStatus(prodData.status || "available");
        setActiveImageIndex(0);

        if (data.seller_id) {
          const { data: reviewData } = await supabase
            .from('reviews')
            .select(`
              id, rating, comment, created_at,
              reviewer:reviewer_id (full_name, avatar_url)
            `)
            .eq('reviewee_id', data.seller_id)
            .order('created_at', { ascending: false })
            .limit(3);
          setReviews(reviewData as any || []);
        }

        const { data: recData } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', data.category_id)
          .neq('id', id)
          .limit(4);
        setRecommended(recData as unknown as Product[] || []);

      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProductData();
  }, [id]);

  const handleLike = async () => {
    if (!userId) {
      router.push('/auth');
      return;
    }

    const previousStatus = isFavorited;
    const previousCount = likesCount;

    setIsFavorited(!previousStatus);
    setLikesCount(prev => previousStatus ? Math.max(0, prev - 1) : prev + 1);

    try {
      if (!previousStatus) {
        await supabase.from('favorites').insert([{ user_id: userId, product_id: id }]);
      } else {
        await supabase.from('favorites').delete().eq('user_id', userId).eq('product_id', id);
      }
    } catch (err) {
      setIsFavorited(previousStatus);
      setLikesCount(previousCount);
    }
  };

  const handleAddToCart = async () => {
    if (!userId) {
      router.push('/auth');
      return;
    }
    try {
      setLoading(true);
      const { error } = await supabase
        .from('cart_items')
        .insert([{ user_id: userId, product_id: id }]);

      if (error) {
        if (error.code === '23505') alert('Barang sudah ada di keranjang Anda!');
        else throw error;
      } else {
        alert('Barang berhasil ditambahkan ke keranjang!');
      }
    } catch (err) {
      alert('Gagal menambahkan ke keranjang.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0
    }).format(price);
  };

  const handleShare = async () => {
    const shareData = {
      title: product?.title || 'Temu.in Product',
      text: `Lihat barang ini di Temu.in: ${product?.title}`,
      url: window.location.href
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Tautan barang telah disalin ke clipboard!');
      } catch (err) {
        alert('Gagal menyalin tautan.');
      }
    }
  };

  const handleReportSubmit = () => {
    if (!selectedReportReason) return;
    // In a real scenario, this would post to a 'reports' table
    alert('Laporan berhasil dikirim. Terima kasih atas masukan Anda.');
    setIsReportModalOpen(false);
    setSelectedReportReason("");
    setOtherReportReason("");
  };

  const handleStatusChangeSubmit = async () => {
    try {
      if (!product) return;
      
      const { error } = await supabase
        .from('products')
        .update({ status: selectedStatus })
        .eq('id', product.id);

      if (error) throw error;

      setProduct({ ...product, status: selectedStatus });
      setIsStatusModalOpen(false);
      alert('Status barang berhasil diubah.');
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Gagal mengubah status barang.');
    }
  };

  if (loading) return <ProductSkeleton />;
  if (!product) return <div className={styles.container} style={{ padding: '100px', textAlign: 'center' }}>Produk tidak ditemukan.</div>;

  const seller = product.users;

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.navigationRow}>
          <button onClick={() => router.back()} className={styles.backButton}>
             <ArrowLeft size={20} />
             Kembali
          </button>
          <div className={styles.headerActions}>
            <Link href="/cart">
              <button className={styles.headerIconBtn} aria-label="Cart"><ShoppingCart size={22} /></button>
            </Link>
            <button className={styles.headerIconBtn} aria-label="Share" onClick={handleShare}><Share2 size={22} /></button>
            <div className={styles.vDivider}></div>
            <button className={`${styles.headerIconBtn} ${styles.reportBtn}`} aria-label="Report" onClick={() => setIsReportModalOpen(true)}><Flag size={20} /></button>
          </div>
        </div>

        <div className={styles.productLayout}>
          <div className={styles.imageGallery}>
            <div className={styles.mainImageWrapper}>
              <img 
                src={product.images[activeImageIndex] || 'https://placehold.co/600x600'} 
                alt={product.title} 
                className={styles.mainImage} 
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x600?text=Gambar+Tidak+Tersedia'; }}
              />
            </div>
            <div className={styles.thumbnailList}>
              {product.images.map((img, i) => (
                <img 
                  key={i} src={img} 
                  className={`${styles.thumbnail} ${activeImageIndex === i ? styles.activeThumbnail : ''}`} 
                  alt="thumb" onClick={() => setActiveImageIndex(i)}
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/80x80?text=x'; }}
                />
              ))}
            </div>
          </div>

          <div className={styles.productInfo}>
            <div className={styles.titleRow}>
              <div className={styles.titleSection}>
                {product.status && product.status !== 'available' && (
                  <div className={`${styles.statusBadge} ${product.status === 'sold' ? styles.soldBadge : styles.reservedBadge}`}>
                    {product.status === 'sold' ? 'SOLD' : 'RESERVED'}
                  </div>
                )}
                <h1 className={styles.productTitle}>{product.title}</h1>
                <p className={styles.productPrice}>{formatPrice(product.price)}</p>
              </div>
              <div className={styles.likes} onClick={handleLike}>
                <Heart size={26} fill={isFavorited ? "#FF4B4B" : "none"} color={isFavorited ? "#FF4B4B" : "#292929"} />
                <span className={styles.likesCount}>{likesCount > 0 ? likesCount : ''}</span>
              </div>
            </div>

            <ul className={styles.specList}>
              <li>
                <Clock size={18} className={styles.specIcon} color="#008585" />
                <span className={styles.specLabel}>Diposting oleh</span>
                <Link href={`/profile/${product.seller_id}`} className={styles.specValueBold}>{seller?.full_name || 'Penjual'}</Link>
              </li>
              <li>
                <Hourglass size={18} className={styles.specIcon} color="#008585" />
                <span className={styles.specLabel}>Kondisi</span>
                <span className={styles.specValue}>{product.condition || 'Tidak disebutkan'}</span>
              </li>
              <li>
                <ShieldCheck size={18} className={styles.specIcon} color="#008585" />
                <span className={styles.specLabel}>Brand</span>
                <span className={styles.specValue}>{product.brand || 'Original'}</span>
              </li>
              <li>
                <Tag size={18} className={styles.specIcon} color="#008585" />
                <span className={styles.specLabel}>Kategori</span>
                <span className={styles.specValueBold}>{product.categories?.name || 'Lainnya'}</span>
              </li>
            </ul>

            <div className={styles.description}>
              <p>{product.description}</p>
            </div>

            <div className={styles.deliverySection}>
              <h3>Metode Pengambilan</h3>
              <ul className={styles.deliveryList}>
                <li>
                  <MapPin size={20} color="#008585" />
                  <span>Ketemuan (Kampus {product.location})</span>
                </li>
                {campusCoords[product.location] && (
                  <div className={styles.mapContainer}>
                    <MapDisplay 
                      center={campusCoords[product.location]} 
                      markerPosition={campusCoords[product.location]} 
                    />
                  </div>
                )}
                <li>
                  <ShoppingBag size={20} color="#008585" />
                  <span>Jasa Pengiriman (Sesuai kesepakatan)</span>
                </li>
              </ul>
            </div>

            <div className={styles.actionButtonsInline}>
              {userId === product.seller_id ? (
                <button className={styles.cartBtnInline} style={{ flex: 1 }} onClick={() => setIsStatusModalOpen(true)}>
                  Ubah Status Barang
                </button>
              ) : (
                <>
                  <button className={styles.chatIconBtnInline} aria-label="Chat">
                    <MessageCircle size={24} />
                  </button>
                  <button className={styles.tawarBtnInline}>Tawar Harga</button>
                  <button className={styles.cartBtnInline} onClick={handleAddToCart}>
                    <Plus size={20} />
                    Keranjang
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className={styles.secondaryContent}>
          <section className={styles.sellerProfile}>
            <div className={styles.sellerMain}>
              <img 
                src={seller?.avatar_url || 'https://placehold.co/90x90'} 
                alt={seller?.full_name} className={styles.sellerAvatar} 
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/90x90?text=User'; }}
              />
              <div className={styles.sellerInfo}>
                <div className={styles.sellerNameRow}>
                  <h3>{seller?.full_name}</h3>
                </div>
                <p className={styles.activeTime}>Aktif 1 jam yang lalu</p>
                <div className={styles.ratingBox}>
                  {seller?.rating_count && seller.rating_count > 0 ? (
                    <>
                      <span className={styles.ratingScore}>{seller.rating_avg?.toFixed(1)}</span>
                      <span className={styles.ratingTotal}>/{seller.rating_count} Penilaian</span>
                    </>
                  ) : (
                    <span className={styles.noRating}>belum ada penilaian</span>
                  )}
                </div>
              </div>
            </div>
          </section>

          {reviews.length > 0 && (
            <section className={styles.reviewsSection}>
              <h2 className={styles.sectionTitle}>Ulasan</h2>
              <div className={styles.reviewsList}>
                {reviews.map((rev) => (
                  <div key={rev.id} className={styles.reviewCard}>
                    <div className={styles.reviewHeader}>
                      <div className={styles.reviewerInfo}>
                        <img src={rev.reviewer?.avatar_url || 'https://placehold.co/40x40'} className={styles.reviewerAvatar} alt="" />
                        <div className={styles.reviewerMeta}>
                          <span className={styles.reviewerName}>{rev.reviewer?.full_name}</span>
                          <div className={styles.stars}>
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={14} fill={i < rev.rating ? "#FFBD14" : "none"} color={i < rev.rating ? "#FFBD14" : "#D6D6D6"} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className={styles.reviewDate}>{formatDate(rev.created_at)}</span>
                    </div>
                    <p className={styles.reviewText}>{rev.comment}</p>
                  </div>
                ))}
              </div>
              <button className={styles.readAllBtn} onClick={() => router.push(`/reviews/${product.seller_id}`)}>Baca Semua</button>
            </section>
          )}

          {recommended.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Pilihan produk lain untuk kamu</h2>
              <div className={styles.productGrid}>
                {recommended.map((item) => (
                  <Link href={`/product/${item.id}`} key={item.id} className={styles.productCard}>
                    <img src={item.images[0] || 'https://placehold.co/300x200'} alt={item.title} className={styles.productImage} />
                    <div className={styles.productInfoMini}>
                      <h3 className={styles.productTitleMini}>{item.title}</h3>
                      <p className={styles.productPriceMini}>{formatPrice(item.price)}</p>
                      <div className={styles.productFooterMini}>
                        <MapPin size={14} color="#767676" />
                        <span>{item.location}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {isReportModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Laporkan Produk</h2>
              <button className={styles.closeBtn} onClick={() => setIsReportModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className={styles.reportOptions}>
              {reportOptionsList.map((reason, idx) => (
                <div key={idx} className={styles.radioItem} onClick={() => setSelectedReportReason(reason)}>
                  <input 
                    type="radio" 
                    name="reportReason" 
                    checked={selectedReportReason === reason}
                    onChange={() => setSelectedReportReason(reason)}
                  />
                  <span className={styles.radioLabel}>{reason}</span>
                </div>
              ))}
            </div>

            {selectedReportReason === 'Alasan lainnya' && (
              <div className={styles.otherReasonContainer}>
                <textarea 
                  className={styles.otherReasonInput}
                  rows={3}
                  placeholder="Tulis alasan pelaporan di sini"
                  value={otherReportReason}
                  onChange={(e) => setOtherReportReason(e.target.value)}
                />
              </div>
            )}

            <button 
              className={styles.submitReportBtn}
              disabled={!selectedReportReason || (selectedReportReason === 'Alasan lainnya' && !otherReportReason.trim())}
              onClick={handleReportSubmit}
            >
              Kirim Laporan
            </button>
          </div>
        </div>
      )}

      {/* Status Change Modal */}
      {isStatusModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Ubah Status Barang</h2>
              <button className={styles.closeBtn} onClick={() => setIsStatusModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className={styles.reportOptions}>
              {[
                { label: 'Tersedia (Available)', value: 'available' },
                { label: 'Dipesan (Reserved)', value: 'reserved' },
                { label: 'Terjual (Sold)', value: 'sold' }
              ].map((statusOption) => (
                <div key={statusOption.value} className={styles.radioItem} onClick={() => setSelectedStatus(statusOption.value)}>
                  <input 
                    type="radio" 
                    name="productStatus" 
                    checked={selectedStatus === statusOption.value}
                    onChange={() => setSelectedStatus(statusOption.value)}
                  />
                  <span className={styles.radioLabel}>{statusOption.label}</span>
                </div>
              ))}
            </div>

            <button 
              className={styles.submitReportBtn}
              onClick={handleStatusChangeSubmit}
              style={{ marginTop: '16px' }}
            >
              Simpan Perubahan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
