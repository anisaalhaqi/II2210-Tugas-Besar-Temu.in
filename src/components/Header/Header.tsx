'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, MapPin, ChevronDown } from 'lucide-react';
import styles from './Header.module.css';
import { supabase } from '@/lib/supabase';

export default function Header() {
  const [showLocDropdown, setShowLocDropdown] = useState(false);
  const [selectedLoc, setSelectedLoc] = useState('Semua Kampus');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  
  const locations = ['Semua Kampus', 'ITB Ganesha', 'ITB Jatinangor', 'ITB Cirebon'];

  useEffect(() => {
    setMounted(true);
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('users')
        .select('full_name, avatar_url')
        .eq('id', user.id)
        .single();
      if (data) setUserProfile(data);
    }
    fetchUser();
  }, []);

  const handleLocSelect = (loc: string) => {
    setSelectedLoc(loc);
    setShowLocDropdown(false);
    
    // Dispatch a custom event to notify other components (like the homepage)
    const event = new CustomEvent('campusLocationChange', { detail: loc });
    window.dispatchEvent(event);
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.searchSection}>
          <form 
            className={styles.searchBar}
            onSubmit={(e) => {
              e.preventDefault();
              const q = (e.currentTarget.elements.namedItem('q') as HTMLInputElement).value;
              if (q) window.location.href = `/search?q=${encodeURIComponent(q)}`;
            }}
          >
            <Search size={20} className={styles.searchIcon} color="#767676" />
            <input 
              name="q"
              type="text" 
              placeholder="Cari barang kuliahmu..." 
              className={styles.searchInput} 
            />
          </form>
        </div>

        <div className={styles.rightSection}>
          <Link href="/cart" className={styles.cartButton} aria-label="Keranjang">
            <ShoppingCart size={24} />
          </Link>

          <div className={styles.locationPicker} onClick={() => setShowLocDropdown(!showLocDropdown)}>
            <MapPin size={20} className={styles.locIcon} />
            <span className={styles.locText}>{selectedLoc}</span>
            <ChevronDown 
              size={18}
              className={styles.dropdownIcon}
              style={{ transform: showLocDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
            />
            
            {showLocDropdown && (
              <div className={styles.locationDropdown}>
                {locations.map((loc) => (
                  <div 
                    key={loc} 
                    className={`${styles.locDropdownItem} ${selectedLoc === loc ? styles.locDropdownItemActive : ''}`}
                    onClick={() => handleLocSelect(loc)}
                  >
                    {loc}
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link href="/profile" className={styles.userProfile}>
            {mounted && (
              <div className={styles.userInfo} style={{ textAlign: 'right', marginRight: '12px' }}>
                <span className={styles.userNameHeader} style={{ fontWeight: '600', color: '#292929', display: 'block' }}>{userProfile?.full_name?.split(' ')[0] || 'Anisa'}</span>
                <span style={{ fontSize: '11px', color: '#767676' }}>Mahasiswa</span>
              </div>
            )}
            <img src={userProfile?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=anisa'} alt="User" className={styles.avatar} />
          </Link>
        </div>
      </div>
    </header>
  );
}
