'use client';

import { useState, useEffect, useMemo } from 'react';
import styles from './notifications.module.css';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Inbox, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  related_id: string;
  related_type: string;
  is_read: boolean;
  created_at: string;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Semua');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const tabs = ['Semua', 'Sebagai Penjual', 'Sebagai Pembeli'];

  async function fetchNotifications(uid: string) {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
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
      fetchNotifications(user.id);
    }
    init();
  }, []);

  const filteredNotifications = useMemo(() => {
    if (activeTab === 'Semua') return notifications;
    if (activeTab === 'Sebagai Penjual') {
      return notifications.filter(n => n.type === 'offer_received' || n.type === 'order_confirmed' && n.title.includes('masuk'));
    }
    if (activeTab === 'Sebagai Pembeli') {
      return notifications.filter(n => n.type === 'offer_accepted' || n.type === 'offer_rejected' || n.type === 'order_completed');
    }
    return notifications;
  }, [activeTab, notifications]);

  const markAllAsRead = async () => {
    if (!userId) return;
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const handleNotificationClick = async (notif: Notification) => {
    if (!notif.is_read) {
      try {
        await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('id', notif.id);
        
        setNotifications(notifications.map(n => 
          n.id === notif.id ? { ...n, is_read: true } : n
        ));
      } catch (err) {
        console.error('Error marking as read:', err);
      }
    }

    // SMART REDIRECT LOGIC
    if (notif.related_type === 'conversation') {
      // Redirect to specific chat
      router.push(`/chat/${notif.related_id}`);
    } 
    else if (notif.related_type === 'order') {
      // Redirect to Activity with specific tab based on notif title/type
      const title = notif.title.toLowerCase();
      let tab = 'Menunggu Konfirmasi';
      if (title.includes('selesai') || title.includes('berhasil')) tab = 'Selesai';
      if (title.includes('batal')) tab = 'Dibatalkan';
      if (title.includes('konfirmasi') || title.includes('siap cod')) tab = 'Belum Bayar';
      
      router.push(`/aktivitas?tab=${encodeURIComponent(tab)}`);
    }
    else if (notif.related_type === 'product' || notif.type === 'offer_received') {
      // Offers usually go to 'Menunggu Konfirmasi' in Activity
      router.push(`/aktivitas?tab=Menunggu Konfirmasi`);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(/\//g, '-');
  };

  const getStatusClass = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('penawaran') || t.includes('tawaran')) return 'status_pengajuan';
    if (t.includes('batal') || t.includes('ditolak')) return 'status_ditolak';
    if (t.includes('balik')) return 'status_tawarbalik';
    if (t.includes('selesai') || t.includes('terima') || t.includes('deal')) return 'status_diterima';
    return '';
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
      <main className={styles.main}>
        <div className={styles.topRow}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={() => router.back()} className={styles.backButton} title="Kembali">
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
                className={`${styles.notifItem} ${!n.is_read ? styles.unread : ''}`}
                onClick={() => handleNotificationClick(n)}
              >
                <div className={styles.itemImagePlaceholder}>
                  <Inbox size={24} color="#A5A5A5" />
                </div>
                <div className={styles.itemContent}>
                  <div className={styles.contentHeader}>
                    <span className={`${styles.statusText} ${styles[getStatusClass(n.title)]}`}>
                      {n.title}
                    </span>
                  </div>
                  <p className={styles.message}>{n.body}</p>
                  <span className={styles.timestamp}>{formatDate(n.created_at)}</span>
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
