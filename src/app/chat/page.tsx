'use client';

import { useState, useEffect, useMemo } from 'react';
import styles from './chat.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MessageSquareOff, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Conversation {
  id: number;
  last_message: string;
  updated_at: string;
  opponent: {
    full_name: string;
    avatar_url: string;
  };
}

export default function ChatPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Semua');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const JAE_HWAN_ID = '00000000-0000-0000-0000-000000000001';

  const tabs = ['Semua', 'Ketemuan', 'Belum dibaca'];

  useEffect(() => {
    async function fetchConversations() {
      try {
        setLoading(true);
        // Fetch conversations where current user is participant1 or participant2
        const { data, error } = await supabase
          .from('conversations')
          .select(`
            id, last_message, updated_at,
            participant1:participant1_id (full_name, avatar_url),
            participant2:participant2_id (full_name, avatar_url)
          `)
          .or(`participant1_id.eq.${JAE_HWAN_ID},participant2_id.eq.${JAE_HWAN_ID}`)
          .order('updated_at', { ascending: false });

        if (error) throw error;

        // Process data to identify the opponent
        const formatted = data?.map((con: any) => {
          const isP1Me = con.participant1_id === JAE_HWAN_ID;
          const opponent = isP1Me ? con.participant2 : con.participant1;
          return {
            id: con.id,
            last_message: con.last_message,
            updated_at: con.updated_at,
            opponent: opponent
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
    // Basic filtering for demo - can be expanded with more DB columns later
    if (activeTab === 'Semua') return conversations;
    return conversations; 
  }, [activeTab, conversations]);

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
        <div className={styles.pageHeader}>
          <button 
            className={styles.backButton} 
            onClick={() => router.back()} 
            title="Kembali"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: '#292929',
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '10px',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={24} />
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
                <img src={chat.opponent.avatar_url || 'https://placehold.co/58x58'} alt="" className={styles.avatar} />
                <div className={styles.chatContent}>
                  <div className={styles.chatHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={styles.userName}>{chat.opponent.full_name}</span>
                    </div>
                    <span className={styles.timestamp}>1 hari lalu</span>
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
