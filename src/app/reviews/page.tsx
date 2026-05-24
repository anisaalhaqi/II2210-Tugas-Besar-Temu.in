'use client';

import { useState } from 'react';
import styles from './reviews.module.css';
import { ArrowLeft } from 'lucide-react';

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState('Semua');

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
      <main className={styles.main}>
        <div className={styles.pageTitleRow}>
          <button className={styles.backButton} onClick={handleBack} title="Kembali">
            <ArrowLeft size={20} />
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
