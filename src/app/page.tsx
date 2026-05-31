'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import { 
  BookOpen, 
  Zap, 
  PencilLine, 
  FlaskConical, 
  Home, 
  Dumbbell, 
  Truck, 
  MoreHorizontal,
  MapPin,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Skeleton from '@/components/Skeleton/Skeleton';

interface Product {
  id: string;
  title: string;
  price: number;
  location: string;
  images: string[];
  category_id: string;
  status: string;
}

const ITEMS_PER_PAGE = 8;

function HomeSkeleton() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <section className={styles.section}>
          <Skeleton width={200} height={28} style={{ marginBottom: '24px' }} />
          <div className={styles.categoryGrid}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className={styles.categoryItem}>
                <Skeleton width={100} height={100} borderRadius={16} />
                <Skeleton width={60} height={14} style={{ marginTop: '12px' }} />
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Skeleton width={180} height={28} />
          </div>
          <div className={styles.productGrid}>
            {[...Array(8)].map((_, i) => (
              <div key={i} className={styles.productCard}>
                <Skeleton width="100%" height={220} borderRadius={0} />
                <div className={styles.productInfo}>
                  <Skeleton width="90%" height={16} style={{ marginBottom: '8px' }} />
                  <Skeleton width="60%" height={22} style={{ marginBottom: '12px' }} />
                  <div className={styles.productFooter}>
                    <Skeleton width={80} height={14} />
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

export default function DesktopHome() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState('Semua Kampus');
  const [mounted, setMounted] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastProductElementRef = useCallback((node: any) => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleLocationChange = (e: any) => {
      setSelectedLocation(e.detail);
      setProducts([]); // Reset products when location changes
      setPage(0);
      setHasMore(true);
    };

    window.addEventListener('campusLocationChange', handleLocationChange);
    return () => window.removeEventListener('campusLocationChange', handleLocationChange);
  }, []);

  const categories = [
    { name: 'Buku & Modul', slug: 'buku-modul', icon: BookOpen },
    { name: 'Elektronika', slug: 'elektronik', icon: Zap },
    { name: 'Alat Gambar & Tulis', slug: 'alat-tulis', icon: PencilLine },
    { name: 'Fashion & Perlengkapan Lab', slug: 'fashion-lab', icon: FlaskConical },
    { name: 'Perlengkapan Asrama', slug: 'perlengkapan-asrama', icon: Home },
    { name: 'Hobi & Olahraga', slug: 'hobi-olahraga', icon: Dumbbell },
    { name: 'Jasa & Rider', slug: 'jasa-rider', icon: Truck },
    { name: 'Lainnya', slug: 'lainnya', icon: MoreHorizontal },
  ];

  const fetchProducts = async (pageNumber: number, isInitial: boolean = false) => {
    try {
      if (isInitial) setLoading(true);
      else setLoadingMore(true);

      let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .range(pageNumber * ITEMS_PER_PAGE, (pageNumber + 1) * ITEMS_PER_PAGE - 1);

      if (selectedLocation !== 'Semua Kampus') {
        query = query.eq('location', selectedLocation);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      const newProducts = data || [];
      if (isInitial) {
        setProducts(newProducts);
      } else {
        setProducts(prev => [...prev, ...newProducts]);
      }
      
      setHasMore(newProducts.length === ITEMS_PER_PAGE);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchProducts(page, page === 0);
  }, [page, selectedLocation]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading && page === 0 || !mounted) {
    return <HomeSkeleton />;
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
                <Link 
                  href={`/search?cat=${cat.slug}`} 
                  key={idx} 
                  className={styles.categoryItem}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className={styles.categoryIcon}>
                    <Icon size={40} color="#008585" strokeWidth={1.5} />
                  </div>
                  <span className={styles.categoryName}>{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Barang Terbaru - Continuous Grid */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              {selectedLocation === 'Semua Kampus' ? 'Terbaru di Temu.in' : `Terbaru di ${selectedLocation}`}
            </h2>
          </div>
          
          <div className={styles.productGrid}>
            {products.map((item, index) => {
              const isLastElement = products.length === index + 1;
              return (
                <Link 
                  href={`/product/${item.id}`} 
                  key={item.id} 
                  className={styles.productCard}
                  ref={isLastElement ? lastProductElementRef : null}
                >
                  <div style={{ position: 'relative', width: '100%', height: '220px' }}>
                    <img 
                      src={item.images[0] || 'https://placehold.co/300x200'} 
                      alt={item.title} 
                      className={styles.productImage} 
                    />
                    {item.status && item.status !== 'available' && (
                      <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
                        {item.status.toUpperCase()}
                      </div>
                    )}
                  </div>
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
              );
            })}
          </div>

          {loadingMore && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
              <Loader2 className="animate-spin" size={32} color="#008585" />
            </div>
          )}

          {!hasMore && products.length > 0 && (
            <p style={{ textAlign: 'center', color: '#A5A5A5', marginTop: '40px', fontSize: '14px' }}>
              Kamu telah melihat semua barang.
            </p>
          )}

          {products.length === 0 && !loading && (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <Inbox size={64} color="#D6D6D6" strokeWidth={1} style={{ marginBottom: '16px' }} />
              <p style={{ color: '#767676' }}>Belum ada barang tersedia di {selectedLocation}.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
