'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart, MessageCircle, Check, Inbox, X, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './aktivitas.module.css';
import { supabase } from '@/lib/supabase';
import Skeleton from '@/components/Skeleton/Skeleton';

interface Activity {
  id: string;
  type: 'Jual' | 'Beli';
  status: string;
  final_price: number;
  notes: string;
  created_at: string;
  product: {
    title: string;
    images: string[];
  };
  counterparty: {
    full_name: string;
  };
}

function AktivitasSkeleton() {
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
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <Skeleton width={180} height={20} />
              <Skeleton width={100} height={20} />
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <Skeleton width={100} height={110} borderRadius={12} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Skeleton width="70%" height={24} />
                <Skeleton width="40%" height={16} />
                <Skeleton width="30%" height={20} />
                <Skeleton width="50%" height={16} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AktivitasPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('Menunggu Konfirmasi');
  const [jualChecked, setJualChecked] = useState(true);
  const [beliChecked, setBeliChecked] = useState(true);
  
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const tabs = [
    'Menunggu Konfirmasi',
    'Belum Bayar',
    'Diproses',
    'Dibatalkan',
    'Selesai'
  ];

  // Set tab from URL if present
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && tabs.includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const statusMap: Record<string, string> = {
    'waiting_confirmation': 'Menunggu Konfirmasi',
    'confirmed': 'Belum Bayar',
    'completed': 'Selesai',
    'cancelled': 'Dibatalkan'
  };

  async function fetchActivities(uid: string) {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id, status, final_price, notes, created_at,
          buyer_id, seller_id,
          product:product_id (title, images),
          buyer:buyer_id (full_name),
          seller:seller_id (full_name)
        `)
        .or(`buyer_id.eq.${uid},seller_id.eq.${uid}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formatted = (data as any[]).map(order => {
        const isSeller = order.seller_id === uid;
        return {
          id: order.id,
          type: isSeller ? 'Jual' : 'Beli',
          status: statusMap[order.status] || order.status,
          price: order.final_price,
          note: order.notes,
          created_at: order.created_at,
          product: order.product,
          counterparty: isSeller ? order.buyer : order.seller
        };
      });

      setActivities(formatted);
    } catch (err) {
      console.error('Error fetching activities:', err);
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
      setUserId(user.id);
      fetchActivities(user.id);
    }
    init();
  }, []);

  const filteredActivities = activities.filter(item => {
    const matchesTab = item.status === activeTab;
    const matchesType = (item.type === 'Jual' && jualChecked) || (item.type === 'Beli' && beliChecked);
    return matchesTab && matchesType;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) return <AktivitasSkeleton />;

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div className={styles.headerTop}>
          <div className={styles.titleArea}>
            <button onClick={() => router.back()} className={styles.backButton}>
              <ArrowLeft size={20} />
            </button>
            <h1 className={styles.pageTitle}>Aktivitas</h1>
          </div>
          <div className={styles.headerIcons}>
            <Link href="/favorites" className={styles.headerIconBtn}><Heart size={24} /></Link>
            <Link href="/chat" className={styles.headerIconBtn}><MessageCircle size={24} /></Link>
          </div>
        </div>

        <nav className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>

        <section className={styles.filterRow}>
          <p className={styles.filterLabel}>Filter berdasarkan jenis transaksi</p>
          <div className={styles.checkboxGroup}>
            <div className={styles.checkboxItem} onClick={() => setJualChecked(!jualChecked)}>
              <div className={`${styles.checkbox} ${jualChecked ? styles.checkboxChecked : ''}`}>
                {jualChecked && <Check size={14} color="white" strokeWidth={3} />}
              </div>
              <span className={styles.checkboxLabel}>Transaksi Jual</span>
            </div>
            <div className={styles.checkboxItem} onClick={() => setBeliChecked(!beliChecked)}>
              <div className={`${styles.checkbox} ${beliChecked ? styles.checkboxChecked : ''}`}>
                {beliChecked && <Check size={14} color="white" strokeWidth={3} />}
              </div>
              <span className={styles.checkboxLabel}>Transaksi Beli</span>
            </div>
          </div>
        </section>
      </header>

      <div className={styles.activityList}>
        {filteredActivities.length > 0 ? (
          filteredActivities.map((item: any) => (
            <div key={item.id} className={styles.transactionCard}>
              <div className={styles.cardHeader}>
                <span className={styles.counterparty}>
                  {item.counterparty?.full_name || 'User'} ({item.type === 'Jual' ? 'Pembeli' : 'Penjual'})
                </span>
                <span className={styles.statusText}>{item.status}</span>
              </div>
              <div className={styles.cardBody}>
                <img src={item.product?.images?.[0] || 'https://placehold.co/100x110'} alt="" className={styles.productImg} />
                <div className={styles.productDetails}>
                  <h3 className={styles.productTitle}>{item.product?.title || 'Produk'}</h3>
                  <p className={styles.actionType}>{item.type === 'Jual' ? 'Pesanan Masuk' : 'Pesanan Saya'}</p>
                  <p className={styles.priceInfo}>{formatPrice(item.price)}</p>
                  <p className={styles.priceNote}>{item.note}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIconBox}><Inbox size={64} strokeWidth={1} color="#A5A5A5" /></div>
            <h3 className={styles.emptyTitle}>Belum ada aktivitas</h3>
            <p className={styles.emptySub}>Aktivitas transaksi untuk status <strong>{activeTab}</strong> akan muncul di sini.</p>
          </div>
        )}
      </div>
    </div>
  );
}
