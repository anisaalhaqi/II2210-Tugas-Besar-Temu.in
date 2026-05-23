'use client';

import { useState, useMemo } from 'react';
import styles from './chat.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MessageSquareOff } from 'lucide-react';

export default function ChatPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Semua');
  const tabs = ['Semua', 'Ketemuan', 'Belum dibaca'];

  const chats = [
    { id: 1, name: 'zizadhrmaa', time: '1 hari yang lalu', message: 'Tawar Harga', img: 'https://placehold.co/58x58', unread: true, type: 'Ketemuan' },
    { id: 2, name: 'Kevin', time: '2 hari yang lalu', message: 'Okk makasih banyak', img: 'https://placehold.co/58x58', unread: false, type: 'Reguler' },
    { id: 3, name: 'Bagas', time: '5 hari yang lalu', message: 'Iyaaaa', img: 'https://placehold.co/58x58', unread: true, type: 'Ketemuan' },
    { id: 4, name: 'Jessica', time: '6 hari yang lalu', message: 'Iyah bubb', img: 'https://placehold.co/58x58', unread: false, type: 'Reguler' }
  ];

  const filteredChats = useMemo(() => {
    if (activeTab === 'Semua') return chats;
    if (activeTab === 'Ketemuan') return chats.filter(c => c.type === 'Ketemuan');
    if (activeTab === 'Belum dibaca') return chats.filter(c => c.unread);
    return chats;
  }, [activeTab]);

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
                <img src={chat.img} alt={chat.name} className={styles.avatar} />
                <div className={styles.chatContent}>
                  <div className={styles.chatHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={styles.userName}>{chat.name}</span>
                      {chat.unread && <div className={styles.unreadBadge}></div>}
                    </div>
                    <span className={styles.timestamp}>{chat.time}</span>
                  </div>
                  <p className={styles.lastMessage}>{chat.message}</p>
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
