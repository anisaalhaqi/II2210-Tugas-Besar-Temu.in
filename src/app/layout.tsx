import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar/Sidebar";
import ContentWrapper from "@/components/Layout/ContentWrapper";
import styles from "./layout.module.css";

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta-sans',
});

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
      <body className={`${plusJakartaSans.className} ${plusJakartaSans.variable}`}>
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
