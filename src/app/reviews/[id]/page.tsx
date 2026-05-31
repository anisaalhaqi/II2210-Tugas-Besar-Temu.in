'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Star, 
  Inbox, 
  Loader2,
  Flag,
  X
} from 'lucide-react';
import styles from './reviews.module.css';
import { supabase } from '@/lib/supabase';
import Skeleton from '@/components/Skeleton/Skeleton';

interface Review {
  id: string;
  rating: number;
  comment: string;
  seller_reply: string | null;
  created_at: string;
  role: 'buyer' | 'seller';
  reviewer: {
    full_name: string;
    avatar_url: string;
  };
  product: {
    id: string;
    title: string;
    price: number;
    images: string[];
  };
}

interface Profile {
  id: string;
  full_name: string;
  rating_avg: number;
  rating_count: number;
}

function ReviewsSkeleton() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.header}>
          <Skeleton width={120} height={40} borderRadius={12} />
          <Skeleton width={200} height={32} />
        </div>
        <div className={styles.statsCard}>
          <Skeleton width={80} height={60} />
          <Skeleton width={160} height={32} />
        </div>
        <div className={styles.tabs}>
           <Skeleton width={100} height={40} />
           <Skeleton width={140} height={40} />
           <Skeleton width={140} height={40} />
        </div>
        <div className={styles.reviewList}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className={styles.reviewCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Skeleton width={44} height={44} borderRadius="50%" />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <Skeleton width={120} height={16} />
                    <Skeleton width={80} height={14} />
                  </div>
                </div>
                <Skeleton width={60} height={14} />
              </div>
              <Skeleton width="100%" height={60} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default function UserReviewsPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id as string;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'Semua' | 'Penjual' | 'Pembeli'>('Semua');

  // Report Modal States
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReportReason, setSelectedReportReason] = useState("");
  const [otherReportReason, setOtherReportReason] = useState("");
  const [reportingReviewId, setReportingReviewId] = useState<string | null>(null);

  const reportOptionsList = [
    "Ulasan mengandung unsur SARA, diskriminasi, pornografi, ancaman, dan pelanggaran nilai/normal sosial",
    "Ulasan tidak sesuai dengan kenyataan",
    "Ulasan menyesatkan karena promosi terselubung",
    "Ulasan menyebarkan informasi pribadi orang lain",
    "Ulasan duplikat/diulang-ulang oleh akun yang sama",
    "Alasan lainnya"
  ];

  const handleOpenReportModal = (revId: string) => {
    setReportingReviewId(revId);
    setIsReportModalOpen(true);
  };

  const handleReportSubmit = () => {
    if (!selectedReportReason) return;
    alert('Laporan ulasan berhasil dikirim. Terima kasih atas masukan Anda.');
    setIsReportModalOpen(false);
    setSelectedReportReason("");
    setOtherReportReason("");
    setReportingReviewId(null);
  };

  useEffect(() => {
    if (!userId) return;

    async function fetchData() {
      try {
        setLoading(true);

        // 1. Fetch Profile Info
        const { data: profData } = await supabase
          .from('users')
          .select('id, full_name, rating_avg, rating_count')
          .eq('id', userId)
          .single();
        
        if (profData) setProfile(profData as any);

        // 2. Fetch Reviews for this user
        const { data: reviewData, error } = await supabase
          .from('reviews')
          .select(`
            id, rating, comment, seller_reply, created_at, role,
            reviewer:reviewer_id (full_name, avatar_url),
            product:product_id (id, title, price, images)
          `)
          .eq('reviewee_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setReviews(reviewData as any || []);

      } catch (err) {
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [userId]);

  const filteredReviews = useMemo(() => {
    if (activeTab === 'Semua') return reviews;
    if (activeTab === 'Penjual') return reviews.filter(r => r.role === 'buyer'); // They were reviewed AS a seller by a buyer
    if (activeTab === 'Pembeli') return reviews.filter(r => r.role === 'seller'); // They were reviewed AS a buyer by a seller
    return reviews;
  }, [reviews, activeTab]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  if (loading) return <ReviewsSkeleton />;
  if (!profile) return <div className={styles.container} style={{ padding: '100px', textAlign: 'center' }}>User tidak ditemukan.</div>;

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.header}>
          <button onClick={() => router.back()} className={styles.backBtn}>
            <ArrowLeft size={18} />
            Kembali
          </button>
          <h1 className={styles.title}>Penilaian dan Ulasan</h1>
        </div>

        <section className={styles.statsCard}>
          <div className={styles.largeRating}>{profile.rating_avg?.toFixed(1) || '0.0'}</div>
          <div className={styles.starsRow}>
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={28} 
                fill={i < Math.floor(profile.rating_avg || 0) ? '#FFC118' : 'none'} 
                color={i < Math.floor(profile.rating_avg || 0) ? '#FFC118' : '#D6D6D6'} 
                strokeWidth={1.5}
              />
            ))}
          </div>
          <p style={{ color: '#767676', fontWeight: '500' }}>Berdasarkan {profile.rating_count} ulasan</p>
        </section>

        <nav className={styles.tabs}>
          <button className={`${styles.tab} ${activeTab === 'Semua' ? styles.activeTab : ''}`} onClick={() => setActiveTab('Semua')}>
            Semua ({reviews.length})
          </button>
          <button className={`${styles.tab} ${activeTab === 'Penjual' ? styles.activeTab : ''}`} onClick={() => setActiveTab('Penjual')}>
            Sebagai Penjual ({reviews.filter(r => r.role === 'buyer').length})
          </button>
          <button className={`${styles.tab} ${activeTab === 'Pembeli' ? styles.activeTab : ''}`} onClick={() => setActiveTab('Pembeli')}>
            Sebagai Pembeli ({reviews.filter(r => r.role === 'seller').length})
          </button>
        </nav>

        <div className={styles.reviewList}>
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <div key={review.id} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <div className={styles.reviewerInfo}>
                    <img 
                      src={review.reviewer?.avatar_url || 'https://placehold.co/44x44?text=User'} 
                      alt="" 
                      className={styles.reviewerAvatar} 
                    />
                    <div className={styles.reviewerNameRow}>
                      <span className={styles.reviewerName}>
                        {review.reviewer?.full_name} ({review.role === 'buyer' ? 'Pembeli' : 'Penjual'})
                      </span>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={14} 
                            fill={i < review.rating ? '#FFBD14' : 'none'} 
                            color={i < review.rating ? '#FFBD14' : '#D6D6D6'} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className={styles.reviewMeta}>
                    <span className={styles.reportLink} onClick={() => handleOpenReportModal(review.id)}>Laporkan</span>
                    <span className={styles.reviewDate}>{formatDate(review.created_at)}</span>
                  </div>
                </div>

                <p className={styles.reviewComment}>{review.comment}</p>

                {review.product && (
                  <Link href={`/product/${review.product.id}`} className={styles.productMiniCard}>
                    <img src={review.product.images?.[0] || 'https://placehold.co/50x50'} alt="" className={styles.productImg} />
                    <div className={styles.productInfo}>
                      <span className={styles.productTitle}>{review.product.title}</span>
                      <span className={styles.productPrice}>{formatPrice(review.product.price)}</span>
                    </div>
                  </Link>
                )}

                {review.seller_reply && (
                  <div className={styles.sellerReply}>
                    <span className={styles.replyTitle}>Respons {review.role === 'buyer' ? 'Penjual' : 'Pembeli'}</span>
                    <p className={styles.replyText}>{review.seller_reply}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <Inbox size={64} color="#D6D6D6" strokeWidth={1} />
              <h3 className={styles.emptyTitle}>Belum ada ulasan</h3>
              <p className={styles.emptySub}>Ulasan untuk kategori ini akan muncul di sini.</p>
            </div>
          )}
        </div>
      </main>

      {/* Report Review Modal */}
      {isReportModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsReportModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Laporkan Ulasan</h2>
              <button className={styles.closeBtn} onClick={() => setIsReportModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className={styles.modalBody}>
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
                <div className={styles.inputGroup}>
                  <textarea 
                    className={styles.textAreaField}
                    placeholder="Tulis alasan pelaporan di sini"
                    value={otherReportReason}
                    onChange={(e) => setOtherReportReason(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
              <button 
                className={styles.submitBtn} 
                disabled={!selectedReportReason || (selectedReportReason === 'Alasan lainnya' && !otherReportReason.trim())}
                onClick={handleReportSubmit}
              >
                Kirim Laporan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
