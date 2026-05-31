'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from './search.module.css';
import Link from 'next/link';
import { Search, Bell, MessageCircle, PlusCircle, ArrowLeft, MapPin, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const suggestions = [
  'Calculus Purcell',
  'Jas Lab',
  'Casio Classwiz',
  'Rotring Isograph'
];

const filters = ['Terkait', 'Terbaru', 'Harga Tertinggi', 'Harga Terendah'];

interface Product {
  id: string;
  title: string;
  price: number;
  location: string;
  images: string[];
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('cat') || '';
  const initialFilter = searchParams.get('filter') || 'Terkait';
  
  const [query, setQuery] = useState(initialQuery);
  const [selectedCat, setSelectedCategory] = useState(initialCategory);
  const [isSearching, setIsSearching] = useState(initialQuery.length > 0 || initialCategory.length > 0 || initialFilter !== 'Terkait');
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q') || '';
    const cat = searchParams.get('cat') || '';
    const f = searchParams.get('filter') || 'Terkait';
    
    setQuery(q);
    setSelectedCategory(cat);
    
    if (q || cat || f !== 'Terkait') {
      setIsSearching(true);
      if (f !== activeFilter) setActiveFilter(f);
      fetchResults(q, cat, f);
    } else {
      setIsSearching(false);
      setResults([]);
    }
  }, [searchParams, activeFilter]);

  async function fetchResults(q: string, cat: string, f?: string) {
    try {
      setLoading(true);
      let queryBuilder = supabase
        .from('products')
        .select(`
          id, title, price, location, images,
          categories:category_id (name, slug)
        `);

      if (q) {
        queryBuilder = queryBuilder.ilike('title', `%${q}%`);
      }

      const currentFilter = f || activeFilter;

      if (currentFilter === 'Terbaru') {
        queryBuilder = queryBuilder.order('created_at', { ascending: false });
      } else if (currentFilter === 'Harga Tertinggi') {
        queryBuilder = queryBuilder.order('price', { ascending: false });
      } else if (currentFilter === 'Harga Terendah') {
        queryBuilder = queryBuilder.order('price', { ascending: true });
      }

      const { data, error } = await queryBuilder;

      if (error) throw error;
      
      let filteredData = data || [];
      if (cat) {
        filteredData = filteredData.filter((item: any) => item.categories?.slug === cat);
      }
      
      setResults(filteredData);
    } catch (err) {
      console.error('Error searching:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsSearching(true);
      router.push(`/search?q=${encodeURIComponent(query)}&filter=${encodeURIComponent(activeFilter)}`);
    }
  };

  const handleSuggestionClick = (s: string) => {
    setQuery(s);
    setIsSearching(true);
    router.push(`/search?q=${encodeURIComponent(s)}&filter=${encodeURIComponent(activeFilter)}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const categoryMap: Record<string, string> = {
    'buku-modul': 'Buku & Modul',
    'elektronik': 'Elektronika',
    'alat-tulis': 'Alat Gambar & Tulis',
    'fashion-lab': 'Fashion & Perlengkapan Lab',
    'perlengkapan-asrama': 'Perlengkapan Asrama',
    'hobi-olahraga': 'Hobi & Olahraga',
    'jasa-rider': 'Jasa & Rider',
    'lainnya': 'Lainnya'
  };

  const getPageTitle = () => {
    if (selectedCat && categoryMap[selectedCat]) {
      return categoryMap[selectedCat];
    }
    if (query) {
      return `Hasil Pencarian: "${query}"`;
    }
    if (activeFilter === 'Terbaru') {
      return 'Terbaru di Temu.in';
    }
    return 'Cari Barang';
  };

  return (
    <div className={styles.container}>
      <header className={styles.simpleHeader}>
        <div className={styles.headerLeftSimple}>
          <button onClick={() => router.back()} className={styles.backButtonSimple}>
            <ArrowLeft size={20} color="#292929" />
          </button>
          <h1 className={styles.pageTitle}>{getPageTitle()}</h1>
        </div>
      </header>

      {!isSearching ? (
        <main className={styles.suggestionsMain}>
          {suggestions.map((s, idx) => (
            <div key={idx} className={styles.suggestionItem} onClick={() => handleSuggestionClick(s)}>
              <span className={styles.suggestionText}>{s}</span>
              <div className={styles.recentIcon}>
                <div className={styles.recentIconInner}></div>
              </div>
            </div>
          ))}
        </main>
      ) : (
        <main className={styles.resultsMain}>
          <div className={styles.filterRow}>
            {filters.map((f) => (
              <div 
                key={f} 
                className={`${styles.filterChip} ${activeFilter === f ? styles.filterChipActive : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </div>
            ))}
          </div>

          <div className={styles.productGrid}>
            {loading ? (
              <div style={{ gridColumn: '1/-1', display: 'flex', justifyContent: 'center', padding: '40px' }}>
                <Loader2 className="animate-spin" size={32} color="#008585" />
              </div>
            ) : results.length > 0 ? (
              results.map((item) => (
                <Link href={`/product/${item.id}`} key={item.id} className={styles.productCard}>
                  <img src={item.images[0] || 'https://placehold.co/300x200'} alt={item.title} className={styles.productImage} />
                  <div className={styles.productInfo}>
                    <h3 className={styles.productTitle}>{item.title}</h3>
                    <p className={styles.productPrice}>{formatPrice(item.price)}</p>
                    <div className={styles.productFooter}>
                      <MapPin size={14} color="#767676" style={{ marginRight: '6px' }} />
                      <span className={styles.locationText}>{item.location}</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#767676', padding: '40px' }}>Tidak ada barang ditemukan.</p>
            )}
          </div>
        </main>
      )}
    </div>
  );
}
