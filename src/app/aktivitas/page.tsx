'use client';

import styles from './aktivitas.module.css';

export default function AktivitasPage() {
  const activities = [
    { id: 1, type: 'Pembelian', title: 'Jas Laboratorium TPB', status: 'Selesai', date: '20 Mei 2026', price: 'Rp32.000', img: 'https://placehold.co/100x100' },
    { id: 2, type: 'Penjualan', title: 'Buku Kalkulus Purcel', status: 'Dikirim', date: '19 Mei 2026', price: 'Rp50.000', img: 'https://placehold.co/100x100' },
    { id: 3, type: 'Penawaran', title: 'ESP32 DevKit V1', status: 'Menunggu', date: '18 Mei 2026', price: 'Rp45.000', img: 'https://placehold.co/100x100' },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Aktivitas Saya</h1>
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${styles.activeTab}`}>Semua</button>
          <button className={styles.tab}>Pembelian</button>
          <button className={styles.tab}>Penjualan</button>
        </div>
      </header>

      <div className={styles.activityList}>
        {activities.map((item) => (
          <div key={item.id} className={styles.activityItem}>
            <img src={item.img} alt={item.title} className={styles.itemImg} />
            <div className={styles.itemInfo}>
              <div className={styles.itemType}>{item.type}</div>
              <h3 className={styles.itemTitle}>{item.title}</h3>
              <div className={styles.itemDate}>{item.date}</div>
            </div>
            <div className={styles.itemStatus}>
              <span className={`${styles.statusBadge} ${styles[item.status.toLowerCase()]}`}>
                {item.status}
              </span>
              <div className={styles.itemPrice}>{item.price}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
