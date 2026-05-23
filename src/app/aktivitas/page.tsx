'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart, MessageCircle, Check, Inbox, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from './aktivitas.module.css';

interface Activity {
  id: number;
  user: string;
  role: string;
  status: string;
  title: string;
  action: string;
  price: string;
  originalPrice: string;
  note: string;
  img: string;
  transactionType: 'Jual' | 'Beli';
}

export default function AktivitasPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Menunggu Konfirmasi');
  const [jualChecked, setJualChecked] = useState(true);
  const [beliChecked, setBeliChecked] = useState(true);

  // Counter Modal States
  const [showCounterModal, setShowCounterModal] = useState(false);
  const [activeCounterId, setActiveCounterId] = useState<number | null>(null);
  const [counterPrice, setCounterPrice] = useState('31.000');

  const tabs = [
    'Menunggu Konfirmasi',
    'Belum Bayar',
    'Diproses',
    'Dibatalkan',
    'Selesai'
  ];

  const [activities, setActivities] = useState<Activity[]>([
    {
      id: 1,
      user: 'zizadhrmaa',
      role: 'Pembeli',
      status: 'Menunggu Konfirmasi',
      title: 'Jas Laboratorium Fisika ITB',
      action: 'Mengajukan Tawaran',
      price: 'Rp30.000',
      originalPrice: 'Rp40.000',
      note: 'Turun 10 ribu dari harga awal',
      img: 'https://placehold.co/100x110',
      transactionType: 'Jual'
    },
    {
      id: 2,
      user: 'Dino',
      role: 'Penjual',
      status: 'Menunggu Konfirmasi',
      title: 'Buku Chempro Edisi IV',
      action: 'Mengajukan Tawaran',
      price: 'Rp26.000',
      originalPrice: 'Rp40.000',
      note: 'Turun 14 ribu dari harga awal',
      img: 'https://placehold.co/100x110',
      transactionType: 'Beli'
    },
    {
      id: 3,
      user: 'Bagas',
      role: 'Penjual',
      status: 'Menunggu Konfirmasi',
      title: 'Buku Phiwiki Fisika',
      action: 'Mengajukan Tawaran',
      price: 'Rp26.000',
      originalPrice: 'Rp40.000',
      note: 'Turun 14 ribu dari harga awal',
      img: 'https://placehold.co/100x110',
      transactionType: 'Beli'
    }
  ]);

  const updateStatus = (id: number, newStatus: string) => {
    setActivities(prev => prev.map(act => 
      act.id === id ? { ...act, status: newStatus } : act
    ));
  };

  const handleTawarBalik = (id: number) => {
    setActiveCounterId(id);
    const act = activities.find(a => a.id === id);
    if (act) setCounterPrice(act.price.replace('Rp', ''));
    setShowCounterModal(true);
  };

  const submitCounterOffer = () => {
    if (activeCounterId !== null) {
      setActivities(prev => prev.map(act => 
        act.id === activeCounterId ? { 
          ...act, 
          price: `Rp${counterPrice}`,
          note: `Penjual menawar balik ke Rp${counterPrice}`
        } : act
      ));
      setShowCounterModal(false);
    }
  };

  const filteredActivities = activities.filter(item => {
    const matchesTab = item.status === activeTab;
    const matchesType = (item.transactionType === 'Jual' && jualChecked) || (item.transactionType === 'Beli' && beliChecked);
    return matchesTab && matchesType;
  });

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div className={styles.headerTop}>
          <div className={styles.titleArea}>
            <button 
              onClick={() => router.back()} 
              style={{ 
                padding: '10px', 
                borderRadius: '12px', 
                background: 'white', 
                border: '1px solid #e5e7eb', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center',
                color: '#292929'
              }}
              title="Kembali"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className={styles.pageTitle}>Aktivitas</h1>
          </div>
          <div className={styles.headerIcons}>
            <Link href="/favorites" className={styles.headerIconBtn} title="Favorit">
              <Heart size={24} />
            </Link>
            <Link href="/chat" className={styles.headerIconBtn} title="Chat">
              <MessageCircle size={24} />
            </Link>
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
                <span className={styles.counterparty}>{item.user} ({item.role})</span>
                <span className={styles.statusText}>{item.status}</span>
              </div>
              <div className={styles.cardBody}>
                <img src={item.img} alt={item.title} className={styles.productImg} />
                <div className={styles.productDetails}>
                  <h3 className={styles.productTitle}>{item.title}</h3>
                  <p className={styles.actionType}>{item.action}</p>
                  <p className={styles.priceInfo}>{item.price} <span style={{ fontWeight: 400, color: '#A5A5A5', fontSize: '14px' }}>dari {item.originalPrice}</span></p>
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
            <div className={styles.emptyIconBox}>
              <Inbox size={64} strokeWidth={1} color="#A5A5A5" />
            </div>
            <h3 className={styles.emptyTitle}>Belum ada aktivitas</h3>
            <p className={styles.emptySub}>
              Aktivitas transaksi untuk status <strong>{activeTab}</strong> akan muncul di sini.
            </p>
          </div>
        )}
      </div>

      {/* Tawar Balik Modal */}
      {showCounterModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.counterModal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Tawar Balik</h3>
              <button className={styles.navBtn} onClick={() => setShowCounterModal(false)}><X size={24} /></button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.priceChips}>
                {['31.000', '29.000', '26.000', '24.000'].map(p => (
                  <button 
                    key={p} 
                    className={`${styles.priceChip} ${counterPrice === p ? styles.priceChipActive : ''}`} 
                    onClick={() => setCounterPrice(p)}
                  >
                    Rp{p}
                  </button>
                ))}
              </div>
              
              <div className={styles.priceInputArea}>
                <span className={styles.rpLabel}>Rp</span>
                <input 
                  type="text" 
                  className={styles.largeInput} 
                  value={counterPrice} 
                  onChange={(e) => setCounterPrice(e.target.value)} 
                  autoFocus
                />
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={`${styles.modalBtn} ${styles.btnBatalModal}`} onClick={() => setShowCounterModal(false)}>
                Batal
              </button>
              <button className={`${styles.modalBtn} ${styles.btnAjukanModal}`} onClick={submitCounterOffer}>
                Ajukan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
