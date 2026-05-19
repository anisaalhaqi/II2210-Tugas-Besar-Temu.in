'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import styles from './favorites.module.css';

const MOCK_FAVORITES = [
  { id: 1, title: 'Pulpen Tanda Tangan Signobal', price: 'Rp50.000', location: 'Ganesha', img: 'https://placehold.co/300x200', available: true, category: 'Alat Tulis' },
  { id: 2, title: 'Penggaris besi 30cm', price: 'Rp15.000', location: 'Jatinangor', img: 'https://placehold.co/300x200', available: true, category: 'Alat Tulis' },
  { id: 3, title: 'Jas Laboratorium TPB', price: 'Rp32.000', location: 'Cirebon', img: 'https://placehold.co/300x200', available: true, category: 'Jas Lab' },
  { id: 4, title: 'BMP280 Sensor Tekanan Udara Pressure Altimeter Thermometer', price: 'Rp10.000', location: 'Cirebon', img: 'https://placehold.co/300x200', available: true, category: 'Elektronika' },
  { id: 5, title: 'Kacamata Lab', price: 'Rp50.000', location: 'Cirebon', img: 'https://placehold.co/300x200', available: true, category: 'Alat Lab' },
  { id: 6, title: 'Buku Mathco bekas', price: 'Rp50.000', location: 'Cirebon', img: 'https://placehold.co/300x200', available: false, category: 'Buku' },
  { id: 7, title: 'Buku Chempro BARUUU', price: 'Rp50.000', location: 'Cirebon', img: 'https://placehold.co/300x200', available: false, category: 'Buku' },
  { id: 8, title: 'Buku catatan kalkulus I lengkap dengan rumus catatan', price: 'Rp50.000', location: 'Cirebon', img: 'https://placehold.co/300x200', available: false, category: 'Buku' },
];

const CATEGORIES = ['Alat Tulis', 'Jas Lab', 'Elektronika', 'Alat Lab', 'Buku'];

export default function FavoritesPage() {
  const [localQuery, setLocalQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<'Semua' | 'Tersedia' | 'Tidak Tersedia'>('Semua');
  const [categoryFilter, setCategoryFilter] = useState<string>('Semua');
  
  // Dropdown States
  const [openDropdown, setOpenDropdown] = useState<'availability' | 'category' | null>(null);

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = (e.currentTarget.elements.namedItem('q') as HTMLInputElement).value;
    if (q) window.location.href = `/search?q=${encodeURIComponent(q)}`;
  };

  const filteredFavorites = useMemo(() => {
    return MOCK_FAVORITES.filter(item => {
      const matchesQuery = item.title.toLowerCase().includes(localQuery.toLowerCase());
      
      let matchesAvailability = true;
      if (availabilityFilter === 'Tersedia') matchesAvailability = item.available;
      if (availabilityFilter === 'Tidak Tersedia') matchesAvailability = !item.available;

      let matchesCategory = true;
      if (categoryFilter !== 'Semua') {
         matchesCategory = item.category === categoryFilter;
      }

      return matchesQuery && matchesAvailability && matchesCategory;
    });
  }, [localQuery, availabilityFilter, categoryFilter]);

  const toggleDropdown = (type: 'availability' | 'category') => {
    setOpenDropdown(openDropdown === type ? null : type);
  };

  return (
    <div className={styles.container}>
      {/* Global Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <Link href="/">
              <img src="/img/logo.png" alt="Temu.in Logo" className={styles.logo} />
            </Link>
            <div className={styles.locationPicker}>
              <img src="/img/icons/location.png" alt="" className={styles.locIconHeader} />
              <span className={styles.locText}>ITB Jatinangor</span>
              <img src="/img/icons/arrow-down.png" alt="" className={styles.dropdownIcon} />
            </div>
            <form className={styles.globalSearchBar} onSubmit={handleGlobalSearch}>
              <input name="q" type="text" placeholder="Cari barang kuliahmu..." className={styles.globalSearchInput} />
              <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <img src="/img/icons/search.png" alt="Search" width={20} height={20} />
              </button>
            </form>
          </div>
          <div className={styles.navActions}>
            <Link href="/notifications" className={styles.iconItem}>
              <img src="/img/icons/notification.png" alt="Notification" className={styles.actionIcon} />
            </Link>
            <div className={styles.iconItem}><img src="/img/icons/chat.png" alt="Chat" className={styles.actionIcon} /></div>
            <div className={styles.iconItem}>
              <img src="/img/icons/cart.png" alt="Cart" className={styles.actionIcon} />
              <div style={{ position: 'absolute', top: 0, right: 0, background: '#008585', color: 'white', fontSize: '10px', borderRadius: '10px', padding: '2px 6px', fontWeight: 'bold' }}>15</div>
            </div>
            <Link href="/upload" className={styles.uploadButton}>+ Upload Barang</Link>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Favorit</h1>
          <div className={styles.localSearchWrapper}>
            <div className={styles.localSearchBar}>
              <img src="/img/icons/search.png" alt="Search" width={20} height={20} style={{ opacity: 0.5 }} />
              <input 
                type="text" 
                placeholder="Cari barang" 
                className={styles.localSearchInput}
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Filters with Dropdowns */}
        <section className={styles.filterSection}>
           <div 
            className={`${styles.filterChip} ${availabilityFilter === 'Semua' && categoryFilter === 'Semua' ? styles.filterChipActive : styles.filterChipInactive}`}
            onClick={() => { setAvailabilityFilter('Semua'); setCategoryFilter('Semua'); setOpenDropdown(null); }}
           >
             Semua
           </div>
           
           {/* Availability Dropdown */}
           <div className={styles.filterGroup}>
             <div 
              className={`${styles.filterChip} ${availabilityFilter !== 'Semua' ? styles.filterChipActive : styles.filterChipInactive}`}
              onClick={() => toggleDropdown('availability')}
             >
               {availabilityFilter === 'Semua' ? 'Ketersediaan' : availabilityFilter} 
               <img src="/img/icons/arrow-down.png" alt="" className={styles.filterIcon} style={{ opacity: 0.5, transform: openDropdown === 'availability' ? 'rotate(180deg)' : 'none' }} />
             </div>
             {openDropdown === 'availability' && (
               <div className={styles.dropdownMenu}>
                 <div className={`${styles.dropdownItem} ${availabilityFilter === 'Semua' ? styles.dropdownItemActive : ''}`} onClick={() => { setAvailabilityFilter('Semua'); setOpenDropdown(null); }}>Semua</div>
                 <div className={`${styles.dropdownItem} ${availabilityFilter === 'Tersedia' ? styles.dropdownItemActive : ''}`} onClick={() => { setAvailabilityFilter('Tersedia'); setOpenDropdown(null); }}>Tersedia</div>
                 <div className={`${styles.dropdownItem} ${availabilityFilter === 'Tidak Tersedia' ? styles.dropdownItemActive : ''}`} onClick={() => { setAvailabilityFilter('Tidak Tersedia'); setOpenDropdown(null); }}>Tidak Tersedia</div>
               </div>
             )}
           </div>

           {/* Category Dropdown */}
           <div className={styles.filterGroup}>
             <div 
              className={`${styles.filterChip} ${categoryFilter !== 'Semua' ? styles.filterChipActive : styles.filterChipInactive}`}
              onClick={() => toggleDropdown('category')}
             >
               {categoryFilter === 'Semua' ? 'Kategori' : categoryFilter}
               <img src="/img/icons/arrow-down.png" alt="" className={styles.filterIcon} style={{ opacity: 0.5, transform: openDropdown === 'category' ? 'rotate(180deg)' : 'none' }} />
             </div>
             {openDropdown === 'category' && (
               <div className={styles.dropdownMenu}>
                 <div className={`${styles.dropdownItem} ${categoryFilter === 'Semua' ? styles.dropdownItemActive : ''}`} onClick={() => { setCategoryFilter('Semua'); setOpenDropdown(null); }}>Semua Kategori</div>
                 {CATEGORIES.map(cat => (
                   <div 
                    key={cat} 
                    className={`${styles.dropdownItem} ${categoryFilter === cat ? styles.dropdownItemActive : ''}`} 
                    onClick={() => { setCategoryFilter(cat); setOpenDropdown(null); }}
                   >
                     {cat}
                   </div>
                 ))}
               </div>
             )}
           </div>
        </section>

        <div className={styles.statusRow}>
          <div className={styles.itemCount}><span>{filteredFavorites.length}</span> barang</div>
          <button className={styles.editButton}>Ubah</button>
        </div>

        <section className={styles.productGrid}>
          {filteredFavorites.map((item) => (
            <Link href={`/product/${item.id}`} key={item.id} className={styles.productCard}>
              <div className={styles.imageContainer}>
                <img src={item.img} alt={item.title} className={styles.productImage} />
                {!item.available && (
                  <div className={styles.outOfStockOverlay}>
                    <div className={styles.outOfStockCircle}><span className={styles.outOfStockText}>Habis</span></div>
                  </div>
                )}
              </div>
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
        </section>
      </main>
    </div>
  );
}
