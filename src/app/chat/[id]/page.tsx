'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import styles from './chat-detail.module.css';
import Link from 'next/link';

export default function ChatDetailPage() {
  const params = useParams();
  const id = params?.id;
  const [message, setMessage] = useState('');

  // Mock data for the specific conversation based on reference
  const chatData = {
    user: 'Jessica',
    avatar: 'https://placehold.co/75x75',
    lastActive: '10 jam yang lalu',
    location: 'Ganesha',
    rating: '5.0',
    totalRatings: 5,
    product: {
      title: 'Jas Laboratorium TPB',
      price: 'Rp32.000',
      img: 'https://placehold.co/125x125'
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className={styles.container}>
      {/* Focused Conversation Header - Fixed & Teal */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.conversationInfo}>
            <button className={styles.backButton} onClick={handleBack} title="Kembali">
              <img src="/img/icons/back-left.png" alt="Back" className={styles.backIcon} />
            </button>
            <img src={chatData.avatar} alt="" className={styles.avatarCircle} />
            <div className={styles.userDetails}>
              <div className={styles.userNameRow}>
                <span className={styles.userName}>{chatData.user}</span>
                <div className={styles.verifiedBadge}></div>
              </div>
              <span className={styles.statusText}>{chatData.lastActive}</span>
            </div>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {/* Date Separator */}
        <div className={styles.dateSeparator}>1 hari yang lalu</div>
        
        {/* Message Area */}
        <div className={styles.messageArea}>
          {/* Product Bargain Card Message */}
          <div className={styles.productMessageWrapper}>
            <div className={styles.productCard}>
              <img src={chatData.product.img} alt="" className={styles.prodImg} />
              <div className={styles.prodInfo}>
                <div className={styles.prodTitle}>{chatData.product.title}</div>
                <div className={styles.prodPrice}>{chatData.product.price}</div>
                <button className={styles.tawarButton}>Tawar Harga</button>
              </div>
            </div>
          </div>

          {/* Seller Summary Box at bottom of feed */}
          <section className={styles.sellerSection}>
             <img src={chatData.avatar} alt="" className={styles.sellerAvatarLarge} />
             <div className={styles.sellerDetails}>
                <div className={styles.sellerNameRow}>
                   <span className={styles.sellerName}>{chatData.user}</span>
                   <div className={styles.blueBadge}></div>
                </div>
                <div className={styles.locRow}>
                   <img src="/img/icons/location.png" alt="" className={styles.iconSmall} />
                   <span>{chatData.location}</span>
                </div>
                <div className={styles.ratingRow}>
                   <span className={styles.ratingValue}>{chatData.rating}</span>
                   <div style={{ display: 'flex', gap: '2px' }}>
                      {[1,2,3,4,5].map(i => <div key={i} style={{ width: '14px', height: '14px', background: 'black', clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}></div>)}
                   </div>
                   <span className={styles.ratingCount}>/{chatData.totalRatings} ratings</span>
                </div>
             </div>
          </section>
        </div>
      </main>

      {/* Fixed Desktop Chat Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          {/* Quick Reply Chips */}
          <div className={styles.chipsRow}>
            <div className={styles.chip} onClick={() => setMessage('Mau beli dong')}>Mau beli dong</div>
            <div className={styles.chip} onClick={() => setMessage('Kondisi bagus?')}>Kondisi bagus?</div>
            <div className={styles.chip} onClick={() => setMessage('Punya berapa?')}>Punya berapa?</div>
          </div>
          
          {/* Input Bar */}
          <div className={styles.inputBar}>
            <div className={styles.plusButton} title="Attach">
              <div className={styles.plusIcon}></div>
            </div>
            <div className={styles.textFieldWrapper}>
              <input 
                type="text" 
                placeholder="Ketik pesanmu..." 
                className={styles.textField}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <div className={styles.sendBtn} title="Send">
              <div className={styles.sendIcon}></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
