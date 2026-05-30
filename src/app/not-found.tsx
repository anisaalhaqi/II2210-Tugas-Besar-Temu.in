import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ padding: '100px', textAlign: 'center' }}>
      <h2>Halaman tidak ditemukan!</h2>
      <p>Maaf, halaman yang kamu cari tidak ada.</p>
      <Link href="/" style={{ color: '#008585', textDecoration: 'underline' }}>
        Kembali ke Beranda
      </Link>
    </div>
  );
}
