import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar/Sidebar";
import ContentWrapper from "@/components/Layout/ContentWrapper";
import styles from "./layout.module.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
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
    <html lang="en" className={plusJakartaSans.variable}>
      <body>
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
