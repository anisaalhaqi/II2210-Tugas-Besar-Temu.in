'use client';

import { useState } from 'react';
import styles from './chat.module.css';
import Link from 'next/link';

export default function ChatPage() {
  const [activeTab, setActiveTab] = useState('Semua');
  const tabs = ['Semua', 'Ketemuan', 'Belum dibaca'];

  const chats = [
    { id: 1, name: 'zizadhrmaa', time: '1 hari yang lalu', message: 'Tawar Harga', img: 'https://placehold.co/58x58' },
    { id: 2, name: 'Kevin', time: '2 hari yang lalu', message: 'Okk makasih banyak', img: 'https://placehold.co/58x58' },
    { id: 3, name: 'Bagas', time: '5 hari yang lalu', message: 'Iyaaaa', img: 'https://placehold.co/58x58' },
    { id: 4, name: 'Jessica', time: '6 hari yang lalu', message: 'Iyah bubb', img: 'https://placehold.co/58x58' }
  ];

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <button className={styles.backButton} onClick={handleBack} title="Kembali">
            <img src="/img/icons/back-left.png" alt="Back" width={24} height={24} />
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
          {chats.map((chat) => (
            <Link href={`/chat/${chat.id}`} key={chat.id} className={styles.chatItem} style={{ textDecoration: 'none' }}>
              <img src={chat.img} alt={chat.name} className={styles.avatar} />
              <div className={styles.chatContent}>
                <div className={styles.chatHeader}>
                  <span className={styles.userName}>{chat.name}</span>
                  <span className={styles.timestamp}>{chat.time}</span>
                </div>
                <p className={styles.lastMessage}>{chat.message}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
