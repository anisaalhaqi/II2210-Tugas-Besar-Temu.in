'use client';

import { useState, useMemo } from 'react';
import styles from './notifications.module.css';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Inbox } from 'lucide-react';

export default function NotificationsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Semua');

  const tabs = ['Semua', 'Sebagai Penjual', 'Sebagai Pembeli'];

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'Pengajuan Tawaran',
      role: '(Pembeli)',
      userRole: 'Sebagai Penjual', // User acts as Seller
      message: '@zizadhrmaa mengajukan tawaran Rp31.000 untuk Jas Lab',
      time: '29-03-2026 18:22',
      status: 'pengajuan',
      unread: true,
      img: 'https://placehold.co/60x60'
    },
    {
      id: 2,
      type: 'Penawaran Ditolak',
      role: '(Penjual)',
      userRole: 'Sebagai Pembeli', // User acts as Buyer
      message: '@parkjihoon menolak tawaranmu Rp35.000 untuk Cat Sakura masih banyak',
      time: '26-03-2026 23:08',
      status: 'ditolak',
      unread: true,
      img: 'https://placehold.co/60x60'
    },
    {
      id: 3,
      type: 'Penawaran Balik',
      role: '(Penjual)',
      userRole: 'Sebagai Pembeli', // User acts as Buyer
      message: '@hayosiapa menawar balik sebesar Rp27.000 untuk Jas Lab',
      time: '24-03-2026 21:08',
      status: 'tawarbalik',
      unread: false,
      img: 'https://placehold.co/60x60'
    },
    {
      id: 4,
      type: 'Penawaran Diterima',
      role: '(Penjual)',
      userRole: 'Sebagai Pembeli', // User acts as Buyer
      message: '@seonho menerima tawaranmu Rp15.000 untuk Sensor IoT',
      time: '24-03-2026 19:08',
      status: 'diterima',
      unread: false,
      img: 'https://placehold.co/60x60'
    }
  ]);

  const filteredNotifications = useMemo(() => {
    if (activeTab === 'Semua') return notifications;
    return notifications.filter(n => n.userRole === activeTab);
  }, [activeTab, notifications]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const handleNotificationClick = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, unread: false } : n
    ));
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.topRow}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              onClick={handleBack} 
              className={styles.backButton}
              title="Kembali"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className={styles.pageTitle}>Notifications</h1>
          </div>
          <span className={styles.markAll} onClick={markAllAsRead}>Tandai Baca Semua</span>
        </div>

        <div className={styles.tabRow}>
          {tabs.map((tab) => (
            <div 
              key={tab} 
              className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </div>
          ))}
        </div>

        <div className={styles.notifList}>
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((n) => (
              <div 
                key={n.id} 
                className={`${styles.notifItem} ${n.unread ? styles.unread : ''}`}
                onClick={() => handleNotificationClick(n.id)}
              >
                <img src={n.img} alt="Product" className={styles.itemImage} />
                <div className={styles.itemContent}>
                  <div className={styles.contentHeader}>
                    <span className={`${styles.statusText} ${styles[`status_${n.status}`]}`}>
                      {n.type}
                    </span>
                    <span className={styles.roleText}>{n.role}</span>
                  </div>
                  <p className={styles.message}>{n.message}</p>
                  <span className={styles.timestamp}>{n.time}</span>
                </div>
              </div>
            ))
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', textAlign: 'center' }}>
              <div style={{ width: 100, height: 100, backgroundColor: '#f9fafb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                <Inbox size={48} strokeWidth={1} color="#A5A5A5" />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#292929', marginBottom: 8 }}>Belum ada notifikasi</h3>
              <p style={{ fontSize: 15, color: '#767676', maxWidth: 350, lineHeight: 1.6 }}>Notifikasi {activeTab.toLowerCase()} akan muncul di sini.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
