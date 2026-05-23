'use client';

import { useState, useEffect } from 'react';
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
  Layers,
  Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Product {
  id: number;
  title: string;
  price: number;
  location: string;
  images: string[];
  category: string;
}

export default function DesktopHome() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    async function fetchHomeData() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchHomeData();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className={styles.container} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Loader2 className="animate-spin" size={48} color="#008585" />
      </div>
    );
  }

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

        {/* Barang Terbaru / Favorit Mock */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Terbaru di Temu.in</h2>
            <Link href="/search" className={styles.seeAll}>Lihat Semua &rarr;</Link>
          </div>
          <div className={styles.productGrid}>
            {products.slice(0, 4).map((item) => (
              <Link href={`/product/${item.id}`} key={item.id} className={styles.productCard}>
                <img src={item.images[0] || 'https://placehold.co/300x200'} alt={item.title} className={styles.productImage} />
                <div className={styles.productInfo}>
                  <h3 className={styles.productTitle}>{item.title}</h3>
                  <p className={styles.productPrice}>{formatPrice(item.price)}</p>
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

        {/* Rekomendasi */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Mungkin Kamu Butuh</h2>
          <div className={styles.productGrid}>
            {products.slice(4, 8).map((item) => (
              <Link href={`/product/${item.id}`} key={item.id} className={styles.productCard}>
                <img src={item.images[0] || 'https://placehold.co/300x200'} alt={item.title} className={styles.productImage} />
                <div className={styles.productInfo}>
                  <h3 className={styles.productTitle}>{item.title}</h3>
                  <p className={styles.productPrice}>{formatPrice(item.price)}</p>
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
          {products.length === 0 && (
            <p style={{ textAlign: 'center', color: '#767676' }}>Belum ada barang tersedia.</p>
          )}
        </section>
      </main>
    </div>
  );
}
