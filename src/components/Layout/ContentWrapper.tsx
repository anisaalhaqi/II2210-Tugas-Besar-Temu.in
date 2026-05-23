'use client';

import { usePathname } from 'next/navigation';
import Header from "@/components/Header/Header";
import styles from "@/app/layout.module.css";

export default function ContentWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <div className={styles.contentWrapper}>
      {isHome && <Header />}
      <main className={`${styles.mainContent} ${!isHome ? styles.noPadding : ''}`}>
        {children}
      </main>
    </div>
  );
}
