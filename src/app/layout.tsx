import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar/Sidebar";
import ContentWrapper from "@/components/Layout/ContentWrapper";
import styles from "./layout.module.css";

export const metadata: Metadata = {
  title: "Temu.in - Desktop",
  description: "Marketplace Mahasiswa ITB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
        <div className={styles.wrapper}>
          <Sidebar />
          <ContentWrapper>
            {children}
          </ContentWrapper>
        </div>
      </body>
    </html>
  );
}
