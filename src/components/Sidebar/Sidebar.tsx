'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, 
  Clock, 
  Heart, 
  MessageCircle, 
  Bell, 
  PlusCircle,
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
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    async function getProfile(uid: string) {
      const { data } = await supabase
        .from('users')
        .select('full_name, avatar_url, campus_location')
        .eq('id', uid)
        .single();
      if (data) setUserProfile(data);
    }

    // 1. Initial fetch
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) getProfile(user.id);
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        if (session?.user) getProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUserProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (confirm('Apakah Anda yakin ingin keluar?')) {
      await supabase.auth.signOut();
      router.push('/auth');
    }
  };

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

        <div className={styles.profileSectionWrapper}>
          <Link href="/profile" className={styles.profileSection}>
            <div className={styles.userInfo}>
              <img 
                src={userProfile?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=anisa'} 
                alt="User" 
                className={styles.userAvatar} 
              />
              {mounted && (
                <div className={styles.userDetails}>
                  <span className={styles.userName}>{userProfile?.full_name || 'Memuat...'}</span>
                  <span className={styles.userRole}>{userProfile?.campus_location || 'ITB'}</span>
                </div>
              )}
            </div>
          </Link>
          <div className={styles.profileActions}>
            <button 
              className={`${styles.actionBtn} ${styles.logoutBtn}`} 
              aria-label="Logout"
              onClick={handleLogout}
            >
              <LogOut size={22} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
