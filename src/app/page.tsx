'use client';

import styles from './page.module.css';
import Link from 'next/link';
import { 
  Calculator, 
  FlaskConical, 
  BookOpen, 
  PencilLine, 
  Zap, 
  Palette, 
  Package, 
  Layers 
} from 'lucide-react';

export default function DesktopHome() {
  const categories = [
    { name: 'Alat Hitung', icon: Calculator },
    { name: 'Alat Lab', icon: FlaskConical },
    { name: 'Buku', icon: BookOpen },
    { name: 'Alat Tulis', icon: PencilLine },
    { name: 'Elektronika', icon: Zap },
    { name: 'Alat Studio', icon: Palette },
    { name: 'Penyimpanan', icon: Package },
    { name: 'Lainnya', icon: Layers },
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
      <main className={styles.main}>
        {/* Kategori */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Lagi cari barang apa?</h2>
          <div className={styles.categoryGrid}>
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div key={idx} className={styles.categoryItem}>
                  <div className={styles.categoryIcon}>
                    <Icon size={40} color="#008585" strokeWidth={1.5} />
                  </div>
                  <span className={styles.categoryName}>{cat.name}</span>
                </div>
              );
            })}
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
