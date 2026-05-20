'use client';

import { useState } from 'react';
import styles from './chat.module.css';
import Link from 'next/link';

export default function ChatPage() {
  const [activeTab, setActiveTab] = useState('Semua');
  const [showLocDropdown, setShowLocDropdown] = useState(false);
  const [selectedLoc, setSelectedLoc] = useState('ITB Jatinangor');

  const locations = ['ITB Ganesha', 'ITB Jatinangor', 'ITB Cirebon'];
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
      {/* Global Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <Link href="/">
              <img src="/img/logo.png" alt="Temu.in Logo" className={styles.logo} />
            </Link>
            
            <div className={styles.locationPicker} onClick={() => setShowLocDropdown(!showLocDropdown)}>
              <img src="/img/icons/location.png" alt="" className={styles.locIconHeader} />
              <span className={styles.locText}>{selectedLoc}</span>
              <img 
                src="/img/icons/arrow-down.png" 
                alt="" 
                className={styles.dropdownIcon} 
                style={{ transform: showLocDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} 
              />
              
              {showLocDropdown && (
                <div style={{
                  position: 'absolute', top: '50px', left: 0, background: 'white', borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid #f0f0f0', zIndex: 1050,
                  minWidth: '180px', padding: '8px 0', display: 'flex', flexDirection: 'column'
                }} onClick={(e) => e.stopPropagation()}>
                  {locations.map((loc) => (
                    <div 
                      key={loc} 
                      style={{
                        padding: '12px 20px', fontSize: '15px', color: '#434343', cursor: 'pointer',
                        backgroundColor: selectedLoc === loc ? '#EEFFFC' : 'transparent',
                        fontWeight: selectedLoc === loc ? '600' : '400'
                      }}
                      onClick={() => { setSelectedLoc(loc); setShowLocDropdown(false); }}
                    >
                      {loc}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <form className={styles.searchBar} onSubmit={(e) => {
              e.preventDefault();
              const q = (e.currentTarget.elements.namedItem('q') as HTMLInputElement).value;
              if (q) window.location.href = `/search?q=${encodeURIComponent(q)}`;
            }}>
              <input name="q" type="text" placeholder="Cari barang kuliahmu..." className={styles.searchInput} />
              <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <img src="/img/icons/search.png" alt="Search" width={20} height={20} />
              </button>
            </form>
          </div>

          <div className={styles.headerActions}>
            <div className={styles.iconsGroup}>
              <Link href="/notifications" className={styles.iconItem}>
                <img src="/img/icons/notification.png" alt="Notification" className={styles.actionIcon} />
              </Link>
              <Link href="/chat" className={styles.iconItem}>
                <img src="/img/icons/chat.png" alt="Chat" className={styles.actionIcon} />
              </Link>
              <div className={styles.iconItem}>
                <img src="/img/icons/cart.png" alt="Cart" className={styles.actionIcon} />
              </div>
              <Link href="/upload" className={styles.uploadButton}>+ Upload Barang</Link>
            </div>
          </div>
        </div>
      </header>

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
