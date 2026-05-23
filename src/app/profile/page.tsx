'use client';

import { 
  MapPin, 
  Star, 
  Edit3, 
  Share2, 
  MoreVertical, 
  Search, 
  ChevronDown, 
  Heart,
  TrendingUp,
  MoreHorizontal
} from 'lucide-react';
import styles from './profile.module.css';

export default function ProfilePage() {
  const inventory = [
    { id: 1, title: 'Jas Laboratorium Fisika ITB', price: 'Rp32.000', img: 'https://placehold.co/300x300' },
    { id: 2, title: 'BMP280 Sensor Tekanan Udara Pressure Altimeter Thermometer', price: 'Rp23.000', img: 'https://placehold.co/300x300' },
    { id: 3, title: 'Cat Poster Sakura Full Set (boleh nego)', price: 'Rp230.000', img: 'https://placehold.co/300x300' },
    { id: 4, title: 'Buku Phiwiki Edisi lama banyak minus', price: 'Rp30.000', img: 'https://placehold.co/300x300' },
  ];

  return (
    <div className={styles.container}>
      {/* Teal Banner */}
      <div className={styles.banner}></div>

      {/* Profile Content Area */}
      <main className={styles.content}>
        
        {/* Profile Info Card */}
        <section className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <div className={styles.mainInfo}>
              <img src="https://placehold.co/100x100" alt="Jae Hwan" className={styles.avatar} />
              <div className={styles.nameSection}>
                <h1>Jae Hwan</h1>
                <div className={styles.locationInfo}>
                  <MapPin size={16} />
                  <span>ITB Ganesha</span>
                </div>
              </div>
            </div>

            <div className={styles.statsSection}>
              <div className={styles.statItem}>
                <div className={styles.statValue}>
                  <span>5.0</span>
                  <Star size={16} fill="#008585" color="#008585" />
                </div>
                <span className={styles.statLabel}>20 reviews</span>
              </div>
              <div className={styles.divider}></div>
              <div className={styles.statItem}>
                <div className={styles.statValue}>2 tahun</div>
                <span className={styles.statLabel}>di Temu.in</span>
              </div>
            </div>

            <div className={styles.actionRow}>
              <button className={styles.editBtn}>
                <Edit3 size={18} />
                Edit profil
              </button>
              <button className={styles.iconBtn} aria-label="Share">
                <Share2 size={18} />
              </button>
              <button className={styles.iconBtn} aria-label="More">
                <MoreVertical size={18} />
              </button>
            </div>
          </div>

          <div className={styles.bioSection}>
            <p className={styles.bioText}>
              IF’22 yang pengen jual barang krn kosnya udh kepenuhan. bisa nego yh tp kemungkinan slow resp. ty
            </p>
          </div>
        </section>

        {/* Insight Card */}
        <section className={styles.insightsCard}>
          <div className={styles.insightIconBox}>
            <TrendingUp size={24} />
          </div>
          <div className={styles.insightText}>
            <h3 className={styles.insightTitle}>Tidak ada kunjungan profil hari ini</h3>
            <p className={styles.insightSub}>Tambahkan item untuk menarik pengunjung</p>
          </div>
          <MoreHorizontal size={20} color="#767676" />
        </section>

        {/* Inventory Section */}
        <section className={styles.inventorySection}>
          <div className={styles.inventoryHeader}>
            <h2 className={styles.inventoryTitle}>4 barang</h2>
            <div className={styles.searchFilterRow}>
              <div className={styles.searchBox}>
                <Search size={18} color="#A5A5A5" />
                <input type="text" placeholder="Cari barang" className={styles.searchInput} />
              </div>
              <div className={styles.filterGroup}>
                <button className={styles.filterChip}>
                  Filters
                  <ChevronDown size={16} />
                </button>
                <button className={styles.filterChip}>
                  Ketersediaan: Semua
                  <ChevronDown size={16} />
                </button>
                <button className={styles.filterChip}>
                  Kategori: Semua
                  <ChevronDown size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className={styles.productGrid}>
            {inventory.map((item) => (
              <div key={item.id} className={styles.productCard}>
                <img src={item.img} alt={item.title} className={styles.productImg} />
                <div className={styles.productInfo}>
                  <div className={styles.productTitleRow}>
                    <h3 className={styles.productTitle}>{item.title}</h3>
                    <Heart size={20} className={styles.favIcon} />
                  </div>
                  <div className={styles.productPriceRow}>
                    <span className={styles.productPrice}>{item.price}</span>
                    <MoreVertical size={18} className={styles.moreBtn} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
