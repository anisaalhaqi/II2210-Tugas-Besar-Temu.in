'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart, MessageCircle, Check, Inbox, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from './aktivitas.module.css';
import { supabase } from '@/lib/supabase';

interface Activity {
  id: number;
  type: 'Jual' | 'Beli';
  status: string;
  price: number;
  note: string;
  created_at: string;
  product: {
    title: string;
    images: string[];
  };
  counterparty: {
    full_name: string;
    role: string;
  };
}

export default function AktivitasPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Menunggu Konfirmasi');
  const [jualChecked, setJualChecked] = useState(true);
  const [beliChecked, setBeliChecked] = useState(true);
  
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [showCounterModal, setShowCounterModal] = useState(false);
  const [activeCounterId, setActiveCounterId] = useState<number | null>(null);
  const [counterPrice, setCounterPrice] = useState('31.000');

  const JAE_HWAN_ID = '00000000-0000-0000-0000-000000000001';

  const tabs = [
    'Menunggu Konfirmasi',
    'Belum Bayar',
    'Diproses',
    'Dibatalkan',
    'Selesai'
  ];

  async function fetchActivities() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('activities')
        .select(`
          id, type, status, price, note, created_at,
          product:product_id (title, images),
          counterparty:counterparty_id (full_name, role)
        `)
        .eq('user_id', JAE_HWAN_ID)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setActivities(data as any || []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchActivities();
  }, []);

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('activities')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      fetchActivities(); // Refresh list
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  const handleTawarBalik = (id: number) => {
    setActiveCounterId(id);
    const act = activities.find(a => a.id === id);
    if (act) setCounterPrice(act.price.toString());
    setShowCounterModal(true);
  };

  const submitCounterOffer = async () => {
    if (activeCounterId !== null) {
      try {
        const numericPrice = parseInt(counterPrice.replace(/[^0-9]/g, ''));
        const { error } = await supabase
          .from('activities')
          .update({ 
            price: numericPrice,
            note: `Menawar balik ke Rp${counterPrice}` 
          })
          .eq('id', activeCounterId);

        if (error) throw error;
        setShowCounterModal(false);
        fetchActivities();
      } catch (err) {
        console.error('Counter error:', err);
      }
    }
  };

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

  if (loading) {
    return (
      <div className={styles.container} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Loader2 className="animate-spin" size={48} color="#008585" />
      </div>
    );
  }

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
              className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
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
          filteredActivities.map((item) => (
            <div key={item.id} className={styles.transactionCard}>
              <div className={styles.cardHeader}>
                <span className={styles.counterparty}>{item.counterparty?.full_name || 'User'} ({item.type === 'Jual' ? 'Pembeli' : 'Penjual'})</span>
                <span className={styles.statusText}>{item.status}</span>
              </div>
              <div className={styles.cardBody}>
                <img src={item.product?.images[0] || 'https://placehold.co/100x110'} alt="" className={styles.productImg} />
                <div className={styles.productDetails}>
                  <h3 className={styles.productTitle}>{item.product?.title || 'Produk'}</h3>
                  <p className={styles.actionType}>{item.type === 'Jual' ? 'Menerima Tawaran' : 'Mengajukan Tawaran'}</p>
                  <p className={styles.priceInfo}>{formatPrice(item.price)}</p>
                  <p className={styles.priceNote}>{item.note}</p>
                </div>
              </div>
              {item.status === 'Menunggu Konfirmasi' && (
                <div className={styles.cardActions}>
                  <button className={`${styles.btnAction} ${styles.btnTolak}`} onClick={() => updateStatus(item.id, 'Dibatalkan')}>
                    Tolak
                  </button>
                  <button className={`${styles.btnAction} ${styles.btnTawar}`} onClick={() => handleTawarBalik(item.id)}>
                    Tawar Balik
                  </button>
                  <button className={`${styles.btnAction} ${styles.btnTerima}`} onClick={() => updateStatus(item.id, 'Belum Bayar')}>
                    Terima
                  </button>
                </div>
              )}
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

      {showCounterModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.counterModal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Tawar Balik</h3>
              <button className={styles.navBtn} onClick={() => setShowCounterModal(false)}><X size={24} /></button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.priceInputArea}>
                <span className={styles.rpLabel}>Rp</span>
                <input type="text" className={styles.largeInput} value={counterPrice} onChange={(e) => setCounterPrice(e.target.value)} autoFocus />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={`${styles.modalBtn} ${styles.btnBatalModal}`} onClick={() => setShowCounterModal(false)}>Batal</button>
              <button className={`${styles.modalBtn} ${styles.btnAjukanModal}`} onClick={submitCounterOffer}>Ajukan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
