'use client';

import { useState } from 'react';
import styles from './reviews.module.css';
import Link from 'next/link';

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState('Semua');
  const [showLocDropdown, setShowLocDropdown] = useState(false);
  const [selectedLoc, setSelectedLoc] = useState('ITB Jatinangor');

  const locations = ['ITB Ganesha', 'ITB Jatinangor', 'ITB Cirebon'];

  const tabs = [
    { name: 'Semua', count: 2 },
    { name: 'Sebagai Penjual', count: null },
    { name: 'Sebagai Pembeli', count: null }
  ];

  const reviews = [
    {
      id: 1,
      user: 'zizadhrmaaa',
      role: 'Pembeli',
      rating: 5,
      date: '27 April 2026',
      content: 'Bukunya nyampe dengan selamat📚✨ Seller juga gercep, ramah, dan enak diajak chat. Kondisi buku masih oke, sesuai ekspektasi. Pokoknya belanja di sini rasanya kayak nemu harta karun kecil. Makasih ya kak, semoga toko kakak makin laris manis 🫶😂',
      photos: ['https://placehold.co/171x126', 'https://placehold.co/171x126'],
      product: {
        title: 'Buku Chempro Edisi 2025',
        price: 'Rp50.000',
        img: 'https://placehold.co/45x45'
      },
      response: 'Hai kak! Terima kasih banyak atas ulasannya <3'
    },
    {
      id: 2,
      user: 'nizaajayah',
      role: 'Penjual',
      rating: 5,
      date: '20 April 2026',
      content: 'Terima kasih banyak ya kak, sudah membeli kalkulator preloved ini 🤍 Kakaknya baik banget dan proses transaksinya juga lancar sekali. Semoga kalkulatornya bermanfaat dan awet dipakai yaa. Sehat dan lancar selalu kak, recommended buyer banget 🥰',
      photos: [],
      product: {
        title: 'Kalkulator Casio fx-991CW Hitam',
        price: 'Rp150.000',
        img: 'https://placehold.co/45x45'
      },
      response: null
    }
  ];

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className={styles.container}>
      {/* Synchronized Header */}
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

            <form 
              className={styles.searchBar}
              onSubmit={(e) => {
                e.preventDefault();
                const q = (e.currentTarget.elements.namedItem('q') as HTMLInputElement).value;
                if (q) window.location.href = `/search?q=${encodeURIComponent(q)}`;
              }}
            >
              <input name="q" type="text" placeholder="Cari barang kuliahmu..." className={styles.searchInput} />
              <button type="submit" className={styles.searchIconWrapper} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <img src="/img/icons/search.png" alt="Search" className={styles.searchIcon} />
              </button>
            </form>
          </div>

          <div className={styles.headerActions}>
            <div className={styles.iconsGroup}>
              <Link href="/notifications" className={styles.iconItem}>
                <img src="/img/icons/notification.png" alt="Notification" className={styles.actionIcon} />
              </Link>
              <div className={styles.iconItem}><img src="/img/icons/chat.png" alt="Chat" className={styles.actionIcon} /></div>
              <div className={styles.iconItem}><img src="/img/icons/cart.png" alt="Cart" className={styles.actionIcon} /></div>
              <Link href="/upload" className={styles.uploadButton}>+ Upload Barang</Link>
            </div>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.pageTitleRow}>
          <button className={styles.backButton} onClick={handleBack} title="Kembali">
            <img src="/img/icons/back-left.png" alt="Back" width={20} height={20} />
          </button>
          <h1 className={styles.pageTitle}>Penilaian dan Ulasan</h1>
        </div>

        <div className={styles.tabRow}>
          {tabs.map((tab) => (
            <div 
              key={tab.name} 
              className={`${styles.tab} ${activeTab === tab.name ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.name)}
            >
              {tab.name} {tab.count !== null ? `(${tab.count})` : ''}
            </div>
          ))}
        </div>

        <section className={styles.ratingSummary}>
          <span className={styles.ratingValue}>5.0</span>
          <div className={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={styles.starFill}></div>
            ))}
          </div>
        </section>

        <section className={styles.reviewList}>
          {reviews
            .filter(r => activeTab === 'Semua' || `Sebagai ${r.role}` === activeTab)
            .map((r) => (
            <div key={r.id} className={styles.reviewCard}>
              <div className={styles.reviewHeader}>
                <div className={styles.reviewerInfo}>
                  <img src="https://placehold.co/50x50" alt={r.user} className={styles.avatar} />
                  <div>
                    <span className={styles.reviewerName}>{r.user} ({r.role})</span>
                    <div className={styles.smallStars}>
                      {[...Array(r.rating)].map((_, i) => (
                        <div key={i} className={styles.smallStar}></div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className={styles.metaActions}>
                  <span className={styles.reportLink}>Laporkan</span>
                  <span className={styles.dateText}>{r.date}</span>
                </div>
              </div>

              <p className={styles.reviewText}>{r.content}</p>

              {r.photos.length > 0 && (
                <div className={styles.reviewPhotos}>
                  {r.photos.map((photo, idx) => (
                    <img key={idx} src={photo} alt="Review" className={styles.reviewPhoto} />
                  ))}
                </div>
              )}

              <div className={styles.productRef}>
                <img src={r.product.img} alt={r.product.title} className={styles.prodImg} />
                <div>
                  <div className={styles.prodTitle}>{r.product.title}</div>
                  <div className={styles.prodPrice}>{r.product.price}</div>
                </div>
              </div>

              {r.response && (
                <div className={styles.sellerResponse}>
                  <span className={styles.responseTitle}>Respons Penjual</span>
                  <p className={styles.responseText}>{r.response}</p>
                </div>
              )}
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
