'use client';

import { useState } from 'react';
import styles from './page.module.css';
import Link from 'next/link';

export default function DesktopHome() {
  const [showNotifPopup, setShowNotifPopup] = useState(false);
  const [showLocDropdown, setShowLocDropdown] = useState(false);
  const [selectedLoc, setSelectedLoc] = useState('ITB Jatinangor');

  const locations = ['ITB Ganesha', 'ITB Jatinangor', 'ITB Cirebon'];

  // Mock notifications for the popup
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'Pengajuan Tawaran',
      message: '@zizadhrmaa mengajukan tawaran Rp31.000 untuk Jas Lab',
      unread: true,
      img: 'https://placehold.co/60x60'
    },
    {
      id: 2,
      type: 'Penawaran Ditolak',
      message: '@parkjihoon menolak tawaranmu Rp35.000 untuk Cat Sakura',
      unread: true,
      img: 'https://placehold.co/60x60'
    },
    {
      id: 3,
      type: 'Penawaran Balik',
      message: '@hayosiapa menawar balik sebesar Rp27.000 untuk Jas Lab',
      unread: false,
      img: 'https://placehold.co/60x60'
    }
  ]);

  const categories = [
    { name: 'Alat Hitung', icon: '🧮' },
    { name: 'Alat Lab', icon: '🔬' },
    { name: 'Buku', icon: '📚' },
    { name: 'Alat Tulis', icon: '✏️' },
    { name: 'Elektronika', icon: '🔌' },
    { name: 'Alat Studio', icon: '🎨' },
    { name: 'Penyimpanan', icon: '📦' },
    { name: 'Lainnya', icon: '⋯' },
  ];

  const favorites = [
    { id: 1, title: 'Jas lab fisika bekas', price: 'Rp50.000', location: 'Ganesha', img: 'https://placehold.co/300x200' },
    { id: 2, title: 'Penggaris besi 30cm', price: 'Rp15.000', location: 'Jatinangor', img: 'https://placehold.co/300x200' },
    { id: 3, title: 'Jas Laboratorium TPB', price: 'Rp32.000', location: 'Cirebon', img: 'https://placehold.co/300x200' },
    { id: 4, title: 'BMP280 Sensor Tekanan Udara Pressure Altimeter', price: 'Rp10.000', location: 'Cirebon', img: 'https://placehold.co/300x200' },
  ];

  const recommended = [
    { id: 5, title: 'Buku Chempro Edisi 2025 masih bersih', price: 'Rp50.000', location: 'Cirebon', img: 'https://placehold.co/300x200' },
    { id: 6, title: 'Jas Laboratorium Fisika TPB', price: 'Rp32.000', location: 'Ganesha', img: 'https://placehold.co/300x200' },
    { id: 7, title: 'Phiwiki FISIKA DASAR II Soal dan Pembahasan', price: 'Rp50.000', location: 'Cirebon', img: 'https://placehold.co/300x200' },
    { id: 8, title: 'ESP32 Bekas Micro USB', price: 'Rp50.000', location: 'Cirebon', img: 'https://placehold.co/300x200' },
  ];

  return (
    <div className={styles.container}>
      {/* Top Navigation Bar */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <Link href="/">
              <img src="/img/logo.png" alt="Temu.in Logo" className={styles.logo} />
            </Link>
            
            {/* Location Picker with Dropdown */}
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
                <div className={styles.locationDropdown} onClick={(e) => e.stopPropagation()}>
                  {locations.map((loc) => (
                    <div 
                      key={loc} 
                      className={`${styles.locDropdownItem} ${selectedLoc === loc ? styles.locDropdownItemActive : ''}`}
                      onClick={() => {
                        setSelectedLoc(loc);
                        setShowLocDropdown(false);
                      }}
                    >
                      {loc}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <form 
              className={styles.searchBar}
              style={{ flex: '1' }}
              onSubmit={(e) => {
                e.preventDefault();
                const q = (e.currentTarget.elements.namedItem('q') as HTMLInputElement).value;
                if (q) window.location.href = `/search?q=${encodeURIComponent(q)}`;
              }}
            >
              <input 
                name="q"
                type="text" 
                placeholder="Buku Phiwiki 2025" 
                className={styles.searchInput} 
              />
              <button type="submit" className={styles.searchIconWrapper} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <img src="/img/icons/search.png" alt="Search" className={styles.searchIcon} />
              </button>
            </form>
          </div>

          <div className={styles.headerActions}>
            <div className={styles.iconsGroup}>
              {/* Notification Icon with Popup */}
              <div className={styles.iconItem} onClick={() => setShowNotifPopup(!showNotifPopup)}>
                <img src="/img/icons/notification.png" alt="Notification" className={styles.actionIcon} />
                
                {showNotifPopup && (
                  <div className={styles.notifPopup} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.popupHeader}>Notifikasi</div>
                    <div className={styles.popupList}>
                      {notifications.map((n) => (
                        <Link 
                          href="/notifications" 
                          key={n.id} 
                          className={`${styles.popupItem} ${n.unread ? styles.popupItemUnread : ''}`}
                        >
                          <img src={n.img} alt="" className={styles.popupImg} />
                          <div className={styles.popupContent}>
                            <div className={styles.popupStatus}>{n.type}</div>
                            <div className={styles.popupMsg}>{n.message}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <Link href="/notifications" className={styles.seeMore}>Lihat lebih banyak</Link>
                  </div>
                )}
              </div>

              <Link href="/chat" className={styles.iconItem}>
                <img src="/img/icons/chat.png" alt="Chat" className={styles.actionIcon} />
              </Link>
              <div className={styles.iconItem}>
                <img src="/img/icons/cart.png" alt="Cart" className={styles.actionIcon} />
              </div>
              <Link href="/upload" className={styles.uploadButton}>
                + Upload Barang
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className={styles.main}>
        {/* Kategori */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Lagi cari barang apa?</h2>
          <div className={styles.categoryGrid}>
            {categories.map((cat, idx) => (
              <div key={idx} className={styles.categoryItem}>
                <div className={styles.categoryIcon}>{cat.icon}</div>
                <span className={styles.categoryName}>{cat.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Barang Favorit */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Cek barang favoritmu di sini!</h2>
            <Link href="/favorites" className={styles.seeAll}>Lihat Semua &rarr;</Link>
          </div>
          <div className={styles.productGrid}>
            {favorites.map((item) => (
              <Link href={`/product/${item.id}`} key={item.id} className={styles.productCard}>
                <img src={item.img} alt={item.title} className={styles.productImage} />
                <div className={styles.productInfo}>
                  <h3 className={styles.productTitle}>{item.title}</h3>
                  <p className={styles.productPrice}>{item.price}</p>
                  <div className={styles.productFooter}>
                    <div className={styles.productLocation}>
                      <img src="/img/icons/location.png" alt="" className={styles.locIcon} />
                      <span>{item.location}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Pilihan Produk */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Pilihan produk untuk kamu</h2>
          <div className={styles.productGrid}>
            {recommended.map((item) => (
              <Link href={`/product/${item.id}`} key={item.id} className={styles.productCard}>
                <img src={item.img} alt={item.title} className={styles.productImage} />
                <div className={styles.productInfo}>
                  <h3 className={styles.productTitle}>{item.title}</h3>
                  <p className={styles.productPrice}>{item.price}</p>
                  <div className={styles.productFooter}>
                    <div className={styles.productLocation}>
                      <img src="/img/icons/location.png" alt="" className={styles.locIcon} />
                      <span>{item.location}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
