'use client';

import { useState, useEffect } from 'react';
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
import { supabase } from '@/lib/supabase';

const navItems = [
  { name: 'Beranda', href: '/', icon: Home },
  { name: 'Aktivitas', href: '/aktivitas', icon: Clock },
  { name: 'Favorit', href: '/favorites', icon: Heart },
  { name: 'Chat', href: '/chat', icon: MessageCircle },
  { name: 'Notifikasi', href: '/notifications', icon: Bell },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  
  const ANISA_ID = '7b27154b-884e-4a05-a89f-0654d0fed203';

  useEffect(() => {
    setMounted(true);
    async function fetchUser() {
      const { data } = await supabase
        .from('users')
        .select('full_name, avatar_url, campus_location')
        .eq('id', ANISA_ID)
        .single();
      if (data) setUserProfile(data);
    }
    fetchUser();
  }, []);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <Link href="/">
          <img src="/img/logo-teal.png" alt="Temu.in Logo" className={styles.logo} />
        </Link>
      </div>

      <div className={styles.scrollableWrapper}>
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
      </div>

      <div className={styles.bottomSection}>
        <div className={styles.uploadSection}>
          <Link href="/upload" className={styles.uploadButton}>
            <PlusCircle size={20} />
            Upload Barang
          </Link>
        </div>

        <Link href="/profile" className={styles.profileSection}>
          <div className={styles.userInfo}>
            <img src={userProfile?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=anisa'} alt="User" className={styles.userAvatar} />
            {mounted && (
              <div className={styles.userDetails}>
                <span className={styles.userName}>{userProfile?.full_name || 'Anisa Alhaqi'}</span>
                <span className={styles.userRole}>{userProfile?.campus_location || 'ITB Ganesha'}</span>
              </div>
            )}
          </div>
          <div className={styles.profileActions}>
            <button className={`${styles.actionBtn} ${styles.logoutBtn}`} aria-label="Logout">
              <LogOut size={22} />
            </button>
          </div>
        </Link>
      </div>
    </aside>
  );
}
