'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from './search.module.css';
import Link from 'next/link';
import { Search, Bell, MessageCircle, PlusCircle, ArrowLeft, MapPin } from 'lucide-react';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(initialQuery.length > 0);
  const [activeFilter, setActiveFilter] = useState('Terkait');

  const suggestions = [
    'buku mathco',
    'spek o word',
    'jas lab',
    'esp 32'
  ];

  const filters = ['Terkait', 'Terbaru', 'Harga Tertinggi', 'Harga Terendah'];

  const results = [
    { id: 1, title: 'Jas Laboratorium Fisika TPB', price: 'Rp32.000', location: 'Ganesha', img: 'https://placehold.co/300x200' },
    { id: 2, title: 'Jas lab sudah terbiasa terjadi tante', price: 'Rp28.000', location: 'Jatinangor', img: 'https://placehold.co/300x200' },
    { id: 3, title: 'Jas Laboratorium TPB', price: 'Rp32.000', location: 'Cirebon', img: 'https://placehold.co/300x200' },
    { id: 4, title: 'Jas Laboratorium ITB masih wangi', price: 'Rp30.000', location: 'Jatinangor', img: 'https://placehold.co/300x200' },
    { id: 5, title: 'Jas Lab Mulus Ukuran XL', price: 'Rp35.000', location: 'Ganesha', img: 'https://placehold.co/300x200' },
    { id: 6, title: 'Jas Laboratorium Kimia', price: 'Rp40.000', location: 'Jatinangor', img: 'https://placehold.co/300x200' },
  ];

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

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [initialQuery]);

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
            {results.map((item) => (
              <Link href={`/product/${item.id}`} key={item.id} className={styles.productCard}>
                <img src={item.img} alt={item.title} className={styles.productImage} />
                <div className={styles.productInfo}>
                  <h3 className={styles.productTitle}>{item.title}</h3>
                  <p className={styles.productPrice}>{item.price}</p>
                  <div className={styles.productFooter}>
                    <MapPin size={14} color="#767676" style={{ marginRight: '6px' }} />
                    <span className={styles.locationText}>{item.location}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>
      )}
    </div>
  );
}
