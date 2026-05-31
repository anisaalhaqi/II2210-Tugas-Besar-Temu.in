'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart, MessageCircle, Check, Inbox, X, Loader2, Star } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './activity.module.css';
import { supabase } from '@/lib/supabase';
import Skeleton from '@/components/Skeleton/Skeleton';

interface Activity {
  id: string;
  type: 'Jual' | 'Beli';
  status: string;
  db_status: string;
  final_price: number;
  original_price: number;
  notes: string;
  created_at: string;
  product_id: string;
  product: {
    title: string;
    images: string[];
    price: number;
  };
  counterparty: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

function ActivitySkeleton() {
  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div className={styles.headerTop}>
          <div className={styles.titleArea}>
            <Skeleton width={32} height={32} borderRadius="50%" />
            <Skeleton width={120} height={32} style={{ marginLeft: '16px' }} />
          </div>
        </div>
        <div className={styles.tabs} style={{ display: 'flex', gap: '20px', marginTop: '20px', overflow: 'hidden' }}>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} width={120} height={40} borderRadius={12} />
          ))}
        </div>
      </header>
      <div className={styles.activityList}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className={styles.transactionCard} style={{ padding: '20px', marginBottom: '16px' }}>
            <Skeleton width="100%" height={150} borderRadius={16} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ActivityPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('Menunggu Konfirmasi');
  const [jualChecked, setJualChecked] = useState(true);
  const [beliChecked, setBeliChecked] = useState(true);
  
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Review Modal States
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const tabs = ['Menunggu Konfirmasi', 'Belum Bayar', 'Diproses', 'Dibatalkan', 'Selesai'];

  const statusMap: Record<string, string> = {
    'waiting_confirmation': 'Menunggu Konfirmasi',
    'confirmed': 'Belum Bayar',
    'processing': 'Diproses',
    'completed': 'Selesai',
    'cancelled': 'Dibatalkan'
  };

  async function createNotification(targetUserId: string, type: string, title: string, body: string, relatedId: string, relatedType: string) {
    try {
      await supabase.from('notifications').insert([{
        user_id: targetUserId,
        type,
        title,
        body,
        related_id: relatedId,
        related_type: relatedType,
        is_read: false
      }]);
    } catch (e) {
      console.error('Notification error:', e);
    }
  }

  async function fetchActivities(uid: string) {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id, status, final_price, notes, created_at, buyer_id, seller_id, product_id,
          product:product_id (title, images, price),
          buyer:buyer_id (id, full_name, avatar_url),
          seller:seller_id (id, full_name, avatar_url)
        `)
        .or(`buyer_id.eq.${uid},seller_id.eq.${uid}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formatted = (data as any[] || []).map(order => {
        const isSeller = order.seller_id === uid;
        return {
          id: order.id,
          type: isSeller ? 'Jual' : 'Beli',
          db_status: order.status,
          status: statusMap[order.status] || order.status,
          final_price: order.final_price,
          original_price: order.product?.price || 0,
          notes: order.notes,
          created_at: order.created_at,
          product_id: order.product_id,
          product: order.product,
          counterparty: isSeller ? order.buyer : order.seller
        };
      });

      setActivities(formatted);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmitReview = async () => {
    if (!selectedActivity || rating === 0) return;
    
    try {
      setSubmittingReview(true);
      
      const { error: insertError } = await supabase
        .from('reviews')
        .insert([{
          order_id: selectedActivity.id,
          product_id: selectedActivity.product_id,
          reviewer_id: userId,
          reviewee_id: selectedActivity.counterparty.id,
          role: selectedActivity.type === 'Beli' ? 'buyer' : 'seller',
          rating: rating,
          comment: reviewText
        }]);

      if (insertError) throw insertError;

      // Update aggregate stats for the counterparty
      const { data: allReviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('reviewee_id', selectedActivity.counterparty.id);
      
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
          .eq('id', selectedActivity.counterparty.id);
      }

      alert('Ulasan berhasil dikirim!');
      setIsReviewModalOpen(false);
      setRating(0);
      setReviewText('');
    } catch (err: any) {
      console.error('Error submitting review:', err);
      alert('Gagal mengirim ulasan.');
    } finally {
      setSubmittingReview(false);
    }
  };

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
        return;
      }
      setUserId(user.id);
      fetchActivities(user.id);
    }
    init();
  }, []);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && tabs.includes(tabParam)) setActiveTab(tabParam);
  }, [searchParams]);

  // ACTION HANDLERS
  const handleAction = async (activity: Activity, newStatus: string, actionName: string, customPrice?: number) => {
    try {
      setLoading(true);
      const isSeller = activity.type === 'Jual';
      const updateData: any = { status: newStatus };
      
      if (customPrice) {
        updateData.final_price = customPrice;
        updateData.notes = isSeller ? 'Tawar balik dari Penjual' : 'Tawar balik dari Pembeli';
      }

      const { error } = await supabase.from('orders').update(updateData).eq('id', activity.id);
      if (error) throw error;

      // Create Notification for the counterparty
      const title = `Pesanan ${actionName}`;
      const body = `Pesanan untuk "${activity.product.title}" telah ${actionName.toLowerCase()} oleh ${isSeller ? 'Penjual' : 'Pembeli'}. ${customPrice ? `Harga tawaran baru: ${formatPrice(customPrice)}` : ''}`;
      
      if (activity.counterparty?.id) {
        await createNotification(activity.counterparty.id, `order_${newStatus}`, title, body, activity.id, 'order');
      }

      await fetchActivities(userId!);
      
      // AUTO-NAVIGATE to the next logical tab
      const nextTab = statusMap[newStatus];
      if (nextTab) setActiveTab(nextTab);
      
      alert(`Berhasil: ${actionName}!`);
    } catch (err) {
      console.error('Action error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredActivities = activities.filter(item => {
    const matchesTab = item.status === activeTab;
    const matchesType = (item.type === 'Jual' && jualChecked) || (item.type === 'Beli' && beliChecked);
    return matchesTab && matchesType;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  if (loading && activities.length === 0) return <ActivitySkeleton />;

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div className={styles.headerTop}>
          <div className={styles.titleArea}>
            <button onClick={() => router.back()} className={styles.backButton}><ArrowLeft size={20} /></button>
            <h1 className={styles.pageTitle}>Aktivitas</h1>
          </div>
          <div className={styles.headerIcons}>
            <Link href="/favorites" className={styles.headerIconBtn}><Heart size={24} /></Link>
            <Link href="/chat" className={styles.headerIconBtn}><MessageCircle size={24} /></Link>
          </div>
        </div>

        <nav className={styles.tabs}>
          {tabs.map((tab) => (
            <button key={tab} className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`} onClick={() => setActiveTab(tab)}>{tab}</button>
          ))}
        </nav>

        <section className={styles.filterRow}>
          <p className={styles.filterLabel}>Filter berdasarkan jenis transaksi</p>
          <div className={styles.checkboxGroup}>
            <div className={styles.checkboxItem} onClick={() => setJualChecked(!jualChecked)}>
              <div className={`${styles.checkbox} ${jualChecked ? styles.checkboxChecked : ''}`}>{jualChecked && <Check size={14} color="white" strokeWidth={3} />}</div>
              <span className={styles.checkboxLabel}>Transaksi Jual</span>
            </div>
            <div className={styles.checkboxItem} onClick={() => setBeliChecked(!beliChecked)}>
              <div className={`${styles.checkbox} ${beliChecked ? styles.checkboxChecked : ''}`}>{beliChecked && <Check size={14} color="white" strokeWidth={3} />}</div>
              <span className={styles.checkboxLabel}>Transaksi Beli</span>
            </div>
          </div>
        </section>
      </header>

      <div className={styles.activityList}>
        {filteredActivities.length > 0 ? (
          filteredActivities.map((item) => {
            const isNegotiating = item.final_price !== item.original_price;
            const isSeller = item.type === 'Jual';
            const sellerTurn = item.notes === 'Tawar balik dari Pembeli' || !item.notes || item.notes === '';
            const buyerTurn = item.notes === 'Tawar balik dari Penjual';
            
            return (
              <div key={item.id} className={styles.transactionCard}>
                <div className={styles.cardHeader}>
                  <span className={styles.counterparty}>{item.counterparty?.full_name} ({isSeller ? 'Pembeli' : 'Penjual'})</span>
                  <span className={`${styles.statusText} ${item.status === 'Dibatalkan' ? styles.statusTextRed : ''}`}>{item.status}</span>
                </div>
                <div 
                  className={styles.cardBody} 
                  onClick={() => {
                    if (item.db_status === 'confirmed' && item.type === 'Beli') {
                      router.push(`/payment/qris?amount=${item.final_price.toLocaleString('id-ID')}&orderIds=${item.id}`);
                    }
                  }}
                  style={{ cursor: (item.db_status === 'confirmed' && item.type === 'Beli') ? 'pointer' : 'default' }}
                >
                  <img src={item.product?.images?.[0] || 'https://placehold.co/100x110'} alt="" className={styles.productImg} />
                  <div className={styles.productDetails}>
                    <h3 className={styles.productTitle}>{item.product?.title}</h3>
                    <p className={styles.actionType}>{isSeller ? 'Pesanan Masuk' : 'Pesanan Saya'}</p>
                    <p className={styles.priceInfo}>
                      {formatPrice(item.final_price)} 
                      {isNegotiating && <span style={{fontSize: '12px', color: '#767676', fontWeight: '400', textDecoration: 'line-through', marginLeft: '8px'}}>(Asli: {formatPrice(item.original_price)})</span>}
                    </p>
                    {item.notes && <p className={styles.priceNote}>"{item.notes}"</p>}
                  </div>
                </div>

                {/* DYNAMIC BUTTON LOGIC */}
                {item.db_status === 'waiting_confirmation' && (
                  <div className={styles.cardActions}>
                    {isSeller ? (
                      // SELLER SIDE
                      isNegotiating ? (
                        sellerTurn ? (
                          <div className={styles.actionGrid3}>
                            <button className={`${styles.btnAction} ${styles.btnTerima} ${styles.btnTerimaGrid}`} onClick={() => handleAction(item, 'confirmed', 'Diterima')}>Terima</button>
                            <button className={`${styles.btnAction} ${styles.btnTawar} ${styles.btnTawarGrid}`} onClick={() => {
                              const newPrice = prompt('Masukkan harga tawar balik Anda:', item.final_price.toString());
                              if (newPrice) handleAction(item, 'waiting_confirmation', 'Tawar Balik', parseInt(newPrice));
                            }}>Tawar Balik</button>
                            <button className={`${styles.btnAction} ${styles.btnTolakGrid}`} onClick={() => handleAction(item, 'cancelled', 'Ditolak')}>Tolak</button>
                          </div>
                        ) : (
                          <div style={{ padding: '8px 0', color: '#767676', fontSize: '14px', fontStyle: 'italic' }}>Menunggu jawaban pembeli atas tawaran balik Anda...</div>
                        )
                      ) : (
                        <button className={`${styles.btnAction} ${styles.btnTerima}`} onClick={() => handleAction(item, 'confirmed', 'Konfirmasi & Kemas')}>Konfirmasi & Kemas</button>
                      )
                    ) : (
                      // BUYER SIDE
                      isNegotiating ? (
                        buyerTurn ? (
                          <div className={styles.actionGrid3}>
                            <button className={`${styles.btnAction} ${styles.btnTerima} ${styles.btnTerimaGrid}`} onClick={() => handleAction(item, 'confirmed', 'Diterima')}>Terima</button>
                            <button className={`${styles.btnAction} ${styles.btnTawar} ${styles.btnTawarGrid}`} onClick={() => {
                              const newPrice = prompt('Masukkan harga tawar balik baru:', item.final_price.toString());
                              if (newPrice) handleAction(item, 'waiting_confirmation', 'Tawar Balik', parseInt(newPrice));
                            }}>Tawar Balik</button>
                            <button className={`${styles.btnAction} ${styles.btnTolakGrid}`} onClick={() => handleAction(item, 'cancelled', 'Ditolak')}>Tolak</button>
                          </div>
                        ) : (
                          <div style={{ padding: '8px 0', color: '#008585', fontWeight: '600', fontSize: '13px' }}>Menunggu jawaban penjual...</div>
                        )
                      ) : (
                        <div style={{ padding: '8px 0', color: '#767676', fontSize: '14px', fontStyle: 'italic' }}>Menunggu konfirmasi penjual...</div>
                      )
                    )}
                  </div>
                )}
                
                {/* Belum Bayar items */}
                {item.db_status === 'confirmed' && (
                  <div className={styles.cardActions}>
                    {isSeller ? (
                      <div style={{ padding: '8px 0', color: '#767676', fontSize: '14px', fontStyle: 'italic' }}>Menunggu pembeli melakukan pembayaran...</div>
                    ) : (
                      <button 
                        className={`${styles.btnAction} ${styles.btnTerima}`} 
                        onClick={() => router.push(`/payment/qris?amount=${item.final_price.toLocaleString('id-ID')}&orderIds=${item.id}`)}
                      >
                        Bayar Sekarang
                      </button>
                    )}
                  </div>
                )}

                {/* Diproses items */}
                {item.db_status === 'processing' && (
                   <div className={styles.cardActions}>
                      {isSeller ? (
                        <button className={`${styles.btnAction} ${styles.btnTerima}`} onClick={() => handleAction(item, 'completed', 'Selesai')}>Selesaikan Pesanan</button>
                      ) : (
                        <div style={{ padding: '8px 0', color: '#008585', fontWeight: '600', fontSize: '14px' }}>Pesanan sedang dikemas oleh penjual...</div>
                      )}
                   </div>
                )}

                {/* Selesai items */}
                {item.db_status === 'completed' && (
                  <div className={styles.cardActions}>
                    <button 
                      className={`${styles.btnAction} ${styles.btnTerima}`} 
                      onClick={() => {
                        setSelectedActivity(item);
                        setIsReviewModalOpen(true);
                      }}
                    >
                      Berikan Ulasan
                    </button>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIconBox}><Inbox size={64} strokeWidth={1} color="#A5A5A5" /></div>
            <h3 className={styles.emptyTitle}>Belum ada aktivitas</h3>
            <p className={styles.emptySub}>Aktivitas transaksi untuk status <strong>{activeTab}</strong> akan muncul di sini.</p>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {isReviewModalOpen && selectedActivity && (
        <div className={styles.modalOverlay} onClick={() => setIsReviewModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setIsReviewModalOpen(false)}>
              <X size={24} />
            </button>
            
            <div className={styles.modalBody}>
              <h2 className={styles.reviewPromptTitle}>Beri Nilai</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <img 
                  src={selectedActivity.counterparty?.avatar_url || 'https://placehold.co/100x100?text=User'} 
                  alt={selectedActivity.counterparty?.full_name} 
                  className={styles.reviewerAvatar} 
                />
                <span className={styles.reviewerName}>
                  {selectedActivity.counterparty?.full_name} ({selectedActivity.type === 'Beli' ? 'Penjual' : 'Pembeli'})
                </span>
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
              <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#292929', margin: '8px 0' }}>Bagaimana transaksimu?</h3>

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
