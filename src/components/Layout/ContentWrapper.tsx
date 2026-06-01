'use client';

import { usePathname } from 'next/navigation';
import Header from "@/components/Header/Header";
import styles from "@/app/layout.module.css";

export default function ContentWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isAuth = pathname === '/auth';

  return (
    <div className={`${styles.contentWrapper} ${isAuth ? styles.noSidebar : ''}`}>
      {isHome && <Header />}
      <main className={`${styles.mainContent} ${!isHome ? styles.noPadding : ''}`}>
        {children}
      </main>
    </div>
  );
}
