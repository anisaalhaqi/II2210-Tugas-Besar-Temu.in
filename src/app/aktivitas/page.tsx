'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart, MessageCircle, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from './aktivitas.module.css';

export default function AktivitasPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Menunggu Konfirmasi');
  const [jualChecked, setJualChecked] = useState(true);
  const [beliChecked, setBeliChecked] = useState(true);

  const tabs = [
    'Menunggu Konfirmasi',
    'Belum Bayar',
    'Diproses',
    'Dibatalkan',
    'Selesai'
  ];

  const activities = [
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
      img: 'https://placehold.co/100x110'
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
      img: 'https://placehold.co/100x110'
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
      img: 'https://placehold.co/100x110'
    }
  ];

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
        {activities.map((item) => (
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
            <div className={styles.cardActions}>
              <button className={`${styles.btnAction} ${styles.btnTolak}`}>Tolak</button>
              <button className={`${styles.btnAction} ${styles.btnTawar}`}>Tawar Balik</button>
              <button className={`${styles.btnAction} ${styles.btnTerima}`}>Terima</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
