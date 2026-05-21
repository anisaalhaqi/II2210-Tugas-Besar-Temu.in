'use client';

import { useState } from 'react';
import styles from './Header.module.css';

export default function Header() {
  const [showLocDropdown, setShowLocDropdown] = useState(false);
  const [selectedLoc, setSelectedLoc] = useState('ITB Jatinangor');
  const locations = ['ITB Ganesha', 'ITB Jatinangor', 'ITB Cirebon'];

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
            <img src="/img/icons/search.png" alt="" className={styles.searchIcon} />
            <input 
              name="q"
              type="text" 
              placeholder="Cari barang kuliahmu..." 
              className={styles.searchInput} 
            />
          </form>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.locationPicker} onClick={() => setShowLocDropdown(!showLocDropdown)}>
            <img src="/img/icons/location.png" alt="" className={styles.locIcon} />
            <span className={styles.locText}>{selectedLoc}</span>
            <img 
              src="/img/icons/arrow-down.png" 
              alt="" 
              className={styles.dropdownIcon}
              style={{ transform: showLocDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
            />
            
            {showLocDropdown && (
              <div className={styles.locationDropdown}>
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

          <div className={styles.userProfile}>
            <img src="https://placehold.co/100x100" alt="User" className={styles.avatar} />
          </div>
        </div>
      </div>
    </header>
  );
}
