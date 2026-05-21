'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

const navItems = [
  { name: 'Beranda', href: '/', icon: '/img/icons/category.png' },
  { name: 'Aktivitas', href: '/aktivitas', icon: '/img/icons/clock.png' },
  { name: 'Favorit', href: '/favorites', icon: '/img/icons/favorite.png' },
  { name: 'Chat', href: '/chat', icon: '/img/icons/chat.png' },
  { name: 'Notifikasi', href: '/notifications', icon: '/img/icons/notification.png' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <Link href="/">
          <img src="/img/logo.png" alt="Temu.in Logo" className={styles.logo} />
        </Link>
      </div>

      <nav className={styles.navLinks}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href} 
              className={`${styles.navItem} ${isActive ? styles.activeNavItem : ''}`}
            >
              <img src={item.icon} alt="" className={styles.navIcon} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className={styles.uploadSection}>
        <Link href="/upload" className={styles.uploadButton}>
          <img src="/img/icons/plus.png" alt="" className={styles.plusIcon} />
          Upload Barang
        </Link>
      </div>
    </aside>
  );
}
