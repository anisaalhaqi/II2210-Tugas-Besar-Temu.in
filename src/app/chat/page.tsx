'use client';

import { useState, useEffect, useMemo } from 'react';
import styles from './chat.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MessageSquareOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Skeleton from '@/components/Skeleton/Skeleton';

interface Conversation {
  id: number;
  last_message: string;
  updated_at: string;
  opponent: {
    full_name: string;
    avatar_url: string;
  };
}

function ChatSkeleton() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <Skeleton width={40} height={40} borderRadius={12} />
          <Skeleton width={100} height={32} />
        </div>

        <div className={styles.tabRow} style={{ marginTop: '32px' }}>
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} width={100} height={42} borderRadius={21} />
          ))}
        </div>

        <div className={styles.chatList} style={{ marginTop: '32px' }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className={styles.chatItem} style={{ padding: '24px' }}>
              <Skeleton width={64} height={64} borderRadius="50%" />
              <div className={styles.chatContent}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <Skeleton width={120} height={20} />
                  <Skeleton width={80} height={16} />
                </div>
                <Skeleton width="80%" height={24} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default function ChatPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Semua');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const tabs = ['Semua', 'Ketemuan', 'Belum dibaca'];

  const formatLastMsg = (content: string, type: string) => {
    if (type === 'image') return '[Gambar]';
    if (type === 'location') return '[Lokasi]';
    if (type === 'offer') return '[Tawaran Harga]';
    return content;
  };

  const formatRelativeTime = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return 'Baru saja';
    if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  useEffect(() => {
    async function fetchConversations() {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/auth');
          return;
        }

        // Fetch conversations where current user is participant
        const { data, error } = await supabase
          .from('conversations')
          .select(`
            id, last_message_at,
            buyer:users!conversations_buyer_id_fkey (id, full_name, avatar_url),
            seller:users!conversations_seller_id_fkey (id, full_name, avatar_url),
            messages (content, message_type, created_at)
          `)
          .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
          .order('last_message_at', { ascending: false });

        if (error) throw error;

        // Process data to identify the opponent
        const formatted = data?.map((con: any) => {
          const isBuyerMe = con.buyer?.id === user.id;
          const opponent = isBuyerMe ? con.seller : con.buyer;
          
          // Sort messages to get the actual last one
          const sortedMsgs = (con.messages || []).sort((a: any, b: any) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          const lastMsgObj = sortedMsgs[0];
          
          return {
            id: con.id,
            last_message: lastMsgObj ? formatLastMsg(lastMsgObj.content, lastMsgObj.message_type) : 'Belum ada pesan',
            last_message_at: con.last_message_at,
            opponent: opponent || { full_name: 'User', avatar_url: '' }
          };
        });

        setConversations(formatted || []);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchConversations();
  }, []);

  const filteredChats = useMemo(() => {
    if (activeTab === 'Semua') return conversations;
    return conversations; 
  }, [activeTab, conversations]);

  if (loading) {
    return <ChatSkeleton />;
  }

  return (
    <div className={styles.container} style={{ fontFamily: 'var(--font-plus-jakarta-sans)' }}>
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <button 
            className={styles.backButton} 
            onClick={() => router.back()} 
            title="Kembali"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className={styles.pageTitle}>Chat</h1>
        </div>

        <div className={styles.tabRow}>
          {tabs.map((tab) => (
            <div 
              key={tab} 
              className={`${styles.tabChip} ${activeTab === tab ? styles.tabChipActive : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </div>
          ))}
        </div>

        <div className={styles.chatList}>
          {filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
              <Link href={`/chat/${chat.id}`} key={chat.id} className={styles.chatItem} style={{ textDecoration: 'none' }}>
                <img src={chat.opponent.avatar_url || 'https://placehold.co/58x58?text=User'} alt="" className={styles.avatar} />
                <div className={styles.chatContent}>
                  <div className={styles.chatHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={styles.userName}>{chat.opponent.full_name}</span>
                    </div>
                    <span className={styles.timestamp}>{formatRelativeTime(chat.last_message_at)}</span>
                  </div>
                  <p className={styles.lastMessage}>{chat.last_message}</p>
                </div>
              </Link>
            ))
          ) : (
            <div className={styles.emptyState}>
              <MessageSquareOff size={64} strokeWidth={1} color="#A5A5A5" />
              <h3 className={styles.emptyTitle}>Chat tidak ditemukan</h3>
              <p className={styles.emptySub}>Tidak ada pesan di kategori <strong>{activeTab}</strong>.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
