'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Clock, 
  Heart, 
  MessageCircle, 
  Bell, 
  PlusCircle,
  Settings,
  LogOut
} from 'lucide-react';
import styles from './Sidebar.module.css';

const navItems = [
  { name: 'Beranda', href: '/', icon: Home },
  { name: 'Aktivitas', href: '/aktivitas', icon: Clock },
  { name: 'Favorit', href: '/favorites', icon: Heart },
  { name: 'Chat', href: '/chat', icon: MessageCircle },
  { name: 'Notifikasi', href: '/notifications', icon: Bell },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <Link href="/">
          <img src="/img/logo-teal.png" alt="Temu.in Logo" className={styles.logo} />
        </Link>
      </div>

      <div className={styles.scrollableContent}>
        <nav className={styles.navLinks}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                className={`${styles.navItem} ${isActive ? styles.activeNavItem : ''}`}
              >
                <Icon size={24} className={styles.navIcon} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className={styles.bottomSection}>
        <div className={styles.uploadSection}>
          <Link href="/upload" className={styles.uploadButton}>
            <PlusCircle size={20} />
            Upload Barang
          </Link>
        </div>

        <div className={styles.profileSection}>
          <div className={styles.userInfo}>
            <img src="https://placehold.co/100x100" alt="User" className={styles.userAvatar} />
            <div className={styles.userDetails}>
              <span className={styles.userName}>Fauzan Ghaza</span>
              <span className={styles.userRole}>Mahasiswa ITB</span>
            </div>
          </div>
          <div className={styles.profileActions}>
            <button className={styles.actionBtn} aria-label="Settings">
              <Settings size={20} />
            </button>
            <button className={styles.actionBtn} aria-label="Logout">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
