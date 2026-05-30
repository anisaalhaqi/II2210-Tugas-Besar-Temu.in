'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from './search.module.css';
import Link from 'next/link';
import { Search, Bell, MessageCircle, PlusCircle, ArrowLeft, MapPin, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

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
  const [query, setQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(initialQuery.length > 0);
  const [activeFilter, setActiveFilter] = useState('Terkait');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const suggestions = [
    'Calculus Purcell',
    'Jas Lab',
    'Casio Classwiz',
    'Rotring Isograph'
  ];

  const filters = ['Terkait', 'Terbaru', 'Harga Tertinggi', 'Harga Terendah'];

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      setIsSearching(true);
      fetchResults(initialQuery);
    } else {
      setIsSearching(false);
      setResults([]);
    }
  }, [initialQuery]);

  async function fetchResults(q: string) {
    try {
      setLoading(true);
      let queryBuilder = supabase
        .from('products')
        .select('id, title, price, location, images')
        .ilike('title', `%${q}%`);

      if (activeFilter === 'Terbaru') {
        queryBuilder = queryBuilder.order('created_at', { ascending: false });
      } else if (activeFilter === 'Harga Tertinggi') {
        queryBuilder = queryBuilder.order('price', { ascending: false });
      } else if (activeFilter === 'Harga Terendah') {
        queryBuilder = queryBuilder.order('price', { ascending: true });
      }

      const { data, error } = await queryBuilder;

      if (error) throw error;
      setResults(data || []);
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
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleSuggestionClick = (s: string) => {
    setQuery(s);
    setIsSearching(true);
    router.push(`/search?q=${encodeURIComponent(s)}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <button onClick={() => router.back()} className={styles.backButton}>
              <ArrowLeft size={20} />
            </button>
            <form onSubmit={handleSearch} className={styles.searchBarWrapper}>
              <Search size={20} className={styles.searchIcon} color="#767676" />
              <input 
                type="text" 
                placeholder="Cari barang kuliahmu..." 
                className={styles.searchInput}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => { if(!query) setIsSearching(false); }}
              />
            </form>
          </div>

          <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginLeft: '32px' }}>
             <Link href="/notifications">
                <Bell size={24} color="white" />
             </Link>
             <Link href="/chat">
                <MessageCircle size={24} color="white" />
             </Link>
             <Link href="/upload" style={{ color: 'white', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PlusCircle size={20} />
                Upload Barang
             </Link>
          </div>
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
