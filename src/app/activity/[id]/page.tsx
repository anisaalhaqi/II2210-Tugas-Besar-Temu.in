'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  MapPin, 
  CreditCard, 
  Calendar, 
  User, 
  Package, 
  CheckCircle2, 
  XCircle, 
  Clock,
  MessageCircle,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import styles from './activity-detail.module.css';
import { supabase } from '@/lib/supabase';
import Skeleton from '@/components/Skeleton/Skeleton';

interface Order {
  id: string;
  status: string;
  final_price: number;
  deal_method: string;
  meetup_location: string | null;
  meetup_time: string | null;
  notes: string | null;
  created_at: string;
  product_id: string;
  product: {
    title: string;
    images: string[];
    price: number;
  };
  buyer: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
  seller: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
}

export default function ActivityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const statusMap: Record<string, string> = {
    'waiting_confirmation': 'Menunggu Konfirmasi',
    'confirmed': 'Belum Bayar',
    'processing': 'Diproses',
    'completed': 'Selesai',
    'cancelled': 'Dibatalkan'
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/auth');
          return;
        }
        setUserId(user.id);

        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            product:product_id (title, images, price),
            buyer:buyer_id (id, full_name, avatar_url),
            seller:seller_id (id, full_name, avatar_url)
          `)
          .eq('id', orderId)
          .single();

        if (error) throw error;
        setOrder(data as any);
      } catch (err) {
        console.error('Error fetching order detail:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [orderId]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
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

  const handleAction = async (newStatus: string, actionName: string, customPrice?: number) => {
    try {
      setLoading(true);
      const updateData: any = { status: newStatus };
      
      if (customPrice) {
        updateData.final_price = customPrice;
        updateData.notes = isSeller ? 'Tawar balik dari Penjual' : 'Tawar balik dari Pembeli';
      }

      const { error } = await supabase.from('orders').update(updateData).eq('id', orderId);
      if (error) throw error;

      // Create Notification for the counterparty
      const title = `Pesanan ${actionName}`;
      const body = `Pesanan untuk "${order?.product.title}" telah ${actionName.toLowerCase()} oleh ${isSeller ? 'Penjual' : 'Pembeli'}. ${customPrice ? `Harga tawaran baru: ${formatPrice(customPrice)}` : ''}`;
      
      if (counterparty?.id) {
        await createNotification(counterparty.id, `order_${newStatus}`, title, body, orderId, 'order');
      }

      // Re-fetch data
      const { data: updatedOrder } = await supabase
        .from('orders')
        .select(`
          *,
          product:product_id (title, images, price),
          buyer:buyer_id (id, full_name, avatar_url),
          seller:seller_id (id, full_name, avatar_url)
        `)
        .eq('id', orderId)
        .single();
      
      if (updatedOrder) setOrder(updatedOrder as any);
      
      alert(`Berhasil: ${actionName}!`);
    } catch (err) {
      console.error('Action error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !order) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <Skeleton width={150} height={40} borderRadius={12} />
          <Skeleton width="100%" height={100} borderRadius={20} />
          <Skeleton width="100%" height={300} borderRadius={20} />
        </main>
      </div>
    );
  }

  if (!order) {
    return <div className={styles.container} style={{ padding: '100px', textAlign: 'center' }}>Pesanan tidak ditemukan.</div>;
  }

  const isSeller = userId === order.seller.id;
  const counterparty = isSeller ? order.buyer : order.seller;

  const isNegotiating = order.final_price !== order.product.price;
  const sellerTurn = order.notes === 'Tawar balik dari Pembeli' || !order.notes || order.notes === '';
  const buyerTurn = order.notes === 'Tawar balik dari Penjual';

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.header}>
          <button onClick={() => router.back()} className={styles.backBtn}>
            <ArrowLeft size={18} />
            Kembali
          </button>
          <h1 className={styles.title}>Rincian Transaksi</h1>
        </div>

        {/* Status Card */}
        <div className={styles.statusCard}>
          <div className={styles.statusInfo}>
            <h3>Status Pesanan</h3>
            <div className={styles.statusValue}>
              {statusMap[order.status] || order.status}
            </div>
            <p className={styles.statusDate}>Dibuat pada {formatDate(order.created_at)}</p>
          </div>
          {order.status === 'completed' ? (
            <CheckCircle2 size={48} color="#008585" />
          ) : order.status === 'cancelled' ? (
            <XCircle size={48} color="#DC2626" />
          ) : (
            <Clock size={48} color="#008585" />
          )}
        </div>

        {/* Product Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Informasi Produk</h2>
          <Link href={`/product/${order.product_id}`} className={styles.productBox}>
            <img src={order.product.images?.[0] || 'https://placehold.co/100x100'} alt="" className={styles.productImg} />
            <div className={styles.productDetails}>
              <h3 className={styles.productName}>{order.product.title}</h3>
              <p className={styles.productPrice}>{formatPrice(order.final_price)}</p>
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#008585', fontWeight: '600' }}>
                Lihat Detail Barang <ExternalLink size={14} />
              </div>
            </div>
          </Link>
        </section>

        {/* Transaction Details */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Detail Pembayaran & Pengiriman</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>ID Pesanan</span>
              <span className={styles.infoValue}>{order.id.slice(0, 13).toUpperCase()}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Metode Transaksi</span>
              <span className={styles.infoValue}>{order.deal_method === 'meetup' ? 'Ketemuan (COD)' : 'Pengiriman'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Total Pembayaran</span>
              <span className={styles.infoValueBold}>{formatPrice(order.final_price)}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Lokasi Ketemuan</span>
              <span className={styles.infoValue}>{order.meetup_location || '-'}</span>
            </div>
          </div>

          {order.notes && (
            <div className={styles.noteBox}>
              <span className={styles.infoLabel}>Catatan Khusus:</span>
              <p className={styles.noteText}>"{order.notes}"</p>
            </div>
          )}
        </section>

        {/* Counterparty Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{isSeller ? 'Informasi Pembeli' : 'Informasi Penjual'}</h2>
          <div className={styles.counterpartyBox}>
            <img 
              src={counterparty.avatar_url || 'https://placehold.co/50x50?text=User'} 
              alt="" 
              className={styles.counterpartyAvatar} 
            />
            <div className={styles.counterpartyInfo}>
              <h4>{counterparty.full_name}</h4>
              <p>User Temu.in</p>
            </div>
            <button 
              className={styles.secondaryBtnSmall} 
              onClick={() => router.push('/chat')}
            >
              <MessageCircle size={16} />
              Hubungi {isSeller ? 'Pembeli' : 'Penjual'}
            </button>
          </div>
        </section>
      </main>

      {/* Sticky Action Bar */}
      <div className={styles.actionBar}>
        <div className={styles.actionContent}>
          {order.status === 'confirmed' && !isSeller && (
            <button 
              className={styles.primaryBtn}
              onClick={() => router.push(`/payment/qris?amount=${order.final_price.toLocaleString('id-ID')}&orderIds=${order.id}`)}
            >
              Bayar Sekarang
            </button>
          )}
          
          {order.status === 'processing' && isSeller && (
            <button className={styles.primaryBtn} onClick={() => handleAction('completed', 'Selesai')}>
              Selesaikan Pesanan
            </button>
          )}

          {order.status === 'waiting_confirmation' && (
            <>
              {isSeller ? (
                // SELLER logic
                isNegotiating ? (
                  sellerTurn ? (
                    <>
                      <button className={styles.primaryBtn} onClick={() => handleAction('confirmed', 'Diterima')}>Terima</button>
                      <button className={styles.secondaryBtn} onClick={() => {
                        const newPrice = prompt('Masukkan harga tawar balik Anda:', order.final_price.toString());
                        if (newPrice) handleAction('waiting_confirmation', 'Tawar Balik', parseInt(newPrice));
                      }}>Tawar Balik</button>
                      <button className={styles.dangerBtn} onClick={() => handleAction('cancelled', 'Ditolak')}>Tolak</button>
                    </>
                  ) : (
                    <p style={{ color: '#767676', fontStyle: 'italic', fontSize: '14px' }}>Menunggu jawaban pembeli...</p>
                  )
                ) : (
                  <button className={styles.primaryBtn} onClick={() => handleAction('confirmed', 'Konfirmasi & Kemas')}>Konfirmasi & Kemas</button>
                )
              ) : (
                // BUYER logic
                isNegotiating ? (
                  buyerTurn ? (
                    <>
                      <button className={styles.primaryBtn} onClick={() => handleAction('confirmed', 'Diterima')}>Terima</button>
                      <button className={styles.secondaryBtn} onClick={() => {
                        const newPrice = prompt('Masukkan harga tawar balik baru:', order.final_price.toString());
                        if (newPrice) handleAction('waiting_confirmation', 'Tawar Balik', parseInt(newPrice));
                      }}>Tawar Balik</button>
                      <button className={styles.dangerBtn} onClick={() => handleAction('cancelled', 'Ditolak')}>Tolak</button>
                    </>
                  ) : (
                    <p style={{ color: '#008585', fontWeight: '600', fontSize: '14px' }}>Menunggu jawaban penjual...</p>
                  )
                ) : (
                  <p style={{ color: '#767676', fontStyle: 'italic', fontSize: '14px' }}>Menunggu konfirmasi penjual...</p>
                )
              )}
            </>
          )}

          {order.status === 'completed' && (
             <button className={styles.primaryBtn} onClick={() => router.push(`/reviews/${counterparty.id}`)}>
                Beri Ulasan
             </button>
          )}

          <button className={styles.secondaryBtn} onClick={() => router.push('/chat')}>Tanya CS</button>
        </div>
      </div>
    </div>
  );
}
