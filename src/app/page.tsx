import styles from './page.module.css';
import Link from 'next/link';

export default function DesktopHome() {
  // Data statis berdasarkan desain HTML
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
    { title: 'Jas lab fisika bekas', price: 'Rp50.000', location: 'Ganesha', img: 'https://placehold.co/300x200' },
    { title: 'Penggaris besi 30cm', price: 'Rp15.000', location: 'Jatinangor', img: 'https://placehold.co/300x200' },
    { title: 'Jas Laboratorium TPB', price: 'Rp32.000', location: 'Cirebon', img: 'https://placehold.co/300x200' },
    { title: 'BMP280 Sensor Tekanan Udara Pressure Altimeter', price: 'Rp10.000', location: 'Cirebon', img: 'https://placehold.co/300x200' },
  ];

  const recommended = [
    { title: 'Buku Chempro Edisi 2025 masih bersih', price: 'Rp50.000', location: 'Cirebon', img: 'https://placehold.co/300x200' },
    { title: 'Jas Laboratorium Fisika TPB', price: 'Rp32.000', location: 'Ganesha', img: 'https://placehold.co/300x200' },
    { title: 'Phiwiki FISIKA DASAR II Soal dan Pembahasan', price: 'Rp50.000', location: 'Cirebon', img: 'https://placehold.co/300x200' },
    { title: 'ESP32 Bekas Micro USB', price: 'Rp50.000', location: 'Cirebon', img: 'https://placehold.co/300x200' },
  ];

  return (
    <div className={styles.container}>
      {/* Top Navigation Bar - Adjusted Scale */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <img src="/img/logo.png" alt="Temu.in Logo" className={styles.logo} />
            <div className={styles.searchBar}>
              <input 
                type="text" 
                placeholder="Buku Phiwiki 2025" 
                className={styles.searchInput} 
              />
              <div className={styles.searchIconWrapper}>
                <img src="/img/icons/search.png" alt="Search" className={styles.searchIcon} />
              </div>
            </div>
          </div>

          <div className={styles.headerActions}>
            <div className={styles.iconsGroup}>
              <div className={styles.iconItem}>
                <img src="/img/icons/notification.png" alt="Notification" className={styles.actionIcon} />
              </div>
              <div className={styles.iconItem}>
                <img src="/img/icons/chat.png" alt="Chat" className={styles.actionIcon} />
              </div>
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
            <a href="#" className={styles.seeAll}>Lihat Semua &rarr;</a>
          </div>
          <div className={styles.productGrid}>
            {favorites.map((item, idx) => (
              <div key={idx} className={styles.productCard}>
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
              </div>
            ))}
          </div>
        </section>

        {/* Pilihan Produk */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Pilihan produk untuk kamu</h2>
          <div className={styles.productGrid}>
            {recommended.map((item, idx) => (
              <div key={idx} className={styles.productCard}>
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
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
