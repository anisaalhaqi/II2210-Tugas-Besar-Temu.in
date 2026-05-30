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
    // Currently the DB doesn't have explicit seller/buyer role for notifications
    // We can filter by type if they contain keywords or just show all in 'Semua'
    if (activeTab === 'Semua') return notifications;
    
    // Fallback: simple keyword matching if types are defined that way
    if (activeTab === 'Sebagai Penjual') {
      return notifications.filter(n => n.type.toLowerCase().includes('penjual') || n.title.toLowerCase().includes('tawaran masuk'));
    }
    if (activeTab === 'Sebagai Pembeli') {
      return notifications.filter(n => n.type.toLowerCase().includes('pembeli') || n.title.toLowerCase().includes('tawaran diterima'));
    }
    
    return notifications;
  }, [activeTab, notifications]);

  const markAllAsRead = async () => {
    if (!userId) return;
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
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

    // Redirect logic based on related_type
    if (notif.related_type === 'product') {
      router.push(`/product/${notif.related_id}`);
    } else if (notif.related_type === 'conversation') {
      router.push(`/chat/${notif.related_id}`);
    } else if (notif.related_type === 'order') {
      router.push(`/aktivitas`);
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

  const getStatusClass = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('pengajuan')) return 'status_pengajuan';
    if (t.includes('ditolak')) return 'status_ditolak';
    if (t.includes('balik')) return 'status_tawarbalik';
    if (t.includes('terima')) return 'status_diterima';
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
            <button 
              onClick={() => router.back()} 
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
