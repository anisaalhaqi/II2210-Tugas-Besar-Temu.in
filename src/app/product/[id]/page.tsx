'use client';

import { useParams, useRouter } from 'next/navigation';
import styles from './page.module.css';
import Link from 'next/link';

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  // Mock database
  const allProducts: Record<number, any> = {
    1: { title: 'Jas lab fisika bekas', price: 'Rp50.000', location: 'Ganesha', img: 'https://placehold.co/600x600' },
    2: { title: 'Penggaris besi 30cm', price: 'Rp15.000', location: 'Jatinangor', img: 'https://placehold.co/600x600' },
    3: { title: 'Jas Laboratorium TPB', price: 'Rp32.000', location: 'Cirebon', img: 'https://placehold.co/600x600' },
    4: { title: 'BMP280 Sensor Tekanan Udara Pressure Altimeter', price: 'Rp10.000', location: 'Cirebon', img: 'https://placehold.co/600x600' },
    5: { title: 'Buku Chempro Edisi 2025 masih bersih', price: 'Rp50.000', location: 'Cirebon', img: 'https://placehold.co/600x600' },
    6: { title: 'Jas Laboratorium Fisika TPB', price: 'Rp32.000', location: 'Ganesha', img: 'https://placehold.co/600x600' },
    7: { title: 'Phiwiki FISIKA DASAR II Soal dan Pembahasan', price: 'Rp50.000', location: 'Cirebon', img: 'https://placehold.co/600x600' },
    8: { title: 'ESP32 Bekas Micro USB', price: 'Rp50.000', location: 'Cirebon', img: 'https://placehold.co/600x600' },
  };

  const productData = allProducts[Number(id)] || {
    title: 'Produk Tidak Ditemukan',
    price: 'Rp0',
    location: '-',
    img: 'https://placehold.co/600x600'
  };

  const product = {
    ...productData,
    likes: 12,
    postedTime: '5 hari lalu',
    sellerName: 'Jae Hwan',
    usagePeriod: 'Pemakaian Sept 2024-Juli 2025',
    originality: 'Tidak original',
    category: 'Alat Laboratorium',
    description: 'Barang ini masih dalam kondisi prima. Alasan jual: Sudah tidak digunakan lagi dan ingin membantu sesama mahasiswa mendapatkan barang berkualitas dengan harga terjangkau.',
    deliveryMethods: [
      { type: 'Jasa Pengiriman', detail: '29 Maret - 5 April 2026', icon: '/img/icons/delivery.png' },
      { type: 'Ketemuan', detail: 'Kampus Ganesha', icon: '/img/icons/location.png' }
    ],
    seller: {
      name: 'Jae Hwan',
      lastActive: '1 jam yang lalu',
      rating: '5.0',
      totalRatings: 70
    },
    review: {
      buyer: 'zizadhrmaaa (Pembeli)',
      date: '27 April 2026',
      content: 'Barangnya mantap! Seller juga gercep, ramah, dan enak diajak chat. Kondisi masih oke, sesuai ekspektasi. Makasih ya kak! 🫶😂'
    }
  };

  const recommended = [
    { id: 1, title: 'Buku Chempro Edisi 2025 masih bersih', price: 'Rp50.000', location: 'Cirebon', img: 'https://placehold.co/300x200' },
    { id: 2, title: 'Jas Laboratorium Fisika TPB', price: 'Rp75.000', location: 'Ganesha', img: 'https://placehold.co/300x200' },
    { id: 3, title: 'Phiwiki FISIKA DASAR II Soal dan Pembahasan', price: 'Rp50.000', location: 'Cirebon', img: 'https://placehold.co/300x200' },
    { id: 4, title: 'ESP32 Bekas Micro USB', price: 'Rp50.000', location: 'Cirebon', img: 'https://placehold.co/300x200' },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <Link href="/">
              <img src="/img/logo.png" alt="Temu.in Logo" className={styles.logo} />
            </Link>
            <div className={styles.searchBar}>
              <input 
                type="text" 
                placeholder="Cari barang kuliahmu..." 
                className={styles.searchInput} 
              />
              <div className={styles.searchIconWrapper}>
                <img src="/img/icons/search.png" alt="Search" className={styles.searchIcon} />
              </div>
            </div>
          </div>

          <div className={styles.headerActions}>
            <div className={styles.iconsGroup}>
              <Link href="/notifications" className={styles.iconItem}>
                <img src="/img/icons/notification.png" alt="Notification" className={styles.actionIcon} />
              </Link>
              <div className={styles.iconItem}>
                <img src="/img/icons/chat.png" alt="Chat" className={styles.actionIcon} />
              </div>
              <div className={styles.iconItem}>
                <img src="/img/icons/cart.png" alt="Cart" className={styles.actionIcon} />
              </div>
              <Link href="/upload" className={styles.uploadButton}>
                + Upload Barang
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.navigationRow}>
          <Link href="/" className={styles.backButton}>
             <img src="/img/icons/back-left.png" alt="" className={styles.navIconSmall} />
             Kembali
          </Link>
        </div>

        <div className={styles.productLayout}>
          <div className={styles.imageGallery}>
            <div className={styles.mainImageWrapper}>
              <img src={product.img} alt={product.title} className={styles.mainImage} />
            </div>
            <div className={styles.thumbnailList}>
              <img src={product.img} className={styles.thumbnail} alt="thumb" />
              <img src="https://placehold.co/100x100" className={styles.thumbnail} alt="thumb" />
            </div>
          </div>

          <div className={styles.productInfo}>
            <div className={styles.titleRow}>
              <h1 className={styles.productTitle}>{product.title}</h1>
              <div className={styles.likes}>
                <img src="/img/icons/favorite.png" alt="Likes" className={styles.likeIcon} />
                <span>{product.likes}</span>
              </div>
            </div>
            <p className={styles.productPrice}>{product.price}</p>

            <ul className={styles.specList}>
              <li>
                <img src="/img/icons/clock.png" alt="" className={styles.specIcon} />
                <span className={styles.specLabel}>{product.postedTime} oleh</span>
                <span className={styles.specValueBold}>{product.sellerName}</span>
              </li>
              <li>
                <img src="/img/icons/hourglass.png" alt="" className={styles.specIcon} />
                <span className={styles.specLabel}>Pemakaian</span>
                <span className={styles.specValue}>{product.usagePeriod}</span>
              </li>
              <li>
                <img src="/img/icons/protect.png" alt="" className={styles.specIcon} />
                <span className={styles.specLabel}>Status</span>
                <span className={styles.specValue}>{product.originality}</span>
              </li>
              <li>
                <img src="/img/icons/category.png" alt="" className={styles.specIcon} />
                <span className={styles.specLabel}>Di Kategori</span>
                <span className={styles.specValueBold}>{product.category}</span>
              </li>
            </ul>

            <div className={styles.conditionBox}>
              <div className={styles.conditionHeader}>
                <h3>Ringkasan Kondisi Barang</h3>
                <img src="/img/icons/graph.png" alt="Analysis" className={styles.sparkleIcon} />
              </div>
              <div className={styles.conditionDetails}>
                <p><strong>Warna:</strong> {productData.title.includes('Jas') ? 'Putih' : 'Sesuai Foto'} (terlihat masih cukup cerah, tetapi ada sedikit bayangan lipatan atau kerutan karena penyimpanan)</p>
                <p><strong>Material:</strong> {productData.title.includes('Jas') ? 'Kain katun tebal' : 'Material standar berkualitas'}</p>
                <p>✅ Bentuk masih simetris, kancing lengkap (jika ada), dan tidak terlihat menguning secara signifikan</p>
                <p>⚠️ Barang terlihat sedikit kusut, disarankan setrika ulang agar daya tarik visualnya meningkat.</p>
              </div>
            </div>

            <div className={styles.description}>
              <p>{product.description}</p>
            </div>

            <div className={styles.deliverySection}>
              <h3>Metode Pengambilan</h3>
              <ul className={styles.deliveryList}>
                {product.deliveryMethods.map((m, idx) => (
                  <li key={idx}>
                    <img src={m.icon} alt="" className={styles.deliveryIconImg} />
                    <span>{m.type} ({m.detail})</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.actionButtons}>
              <button className={styles.btnStatusFull}>Beli Sekarang</button>
            </div>
          </div>
        </div>

        <div className={styles.secondaryContent}>
          <section className={styles.sellerProfile}>
            <img src="https://placehold.co/90x90" alt={product.seller.name} className={styles.sellerAvatar} />
            <div className={styles.sellerInfo}>
              <div className={styles.sellerNameRow}>
                <h3>{product.seller.name}</h3>
                <span className={styles.verifiedBadge}>✓</span>
              </div>
              <p className={styles.activeTime}>{product.seller.lastActive}</p>
              <div className={styles.ratingBox}>
                <span className={styles.ratingScore}>{product.seller.rating}</span>
                <span className={styles.ratingTotal}>/{product.seller.totalRatings} Penilaian</span>
              </div>
            </div>
          </section>

          <section className={styles.reviewsSection}>
            <h2 className={styles.sectionTitle}>Ulasan</h2>
            <div className={styles.reviewCard}>
              <div className={styles.reviewHeader}>
                <div className={styles.reviewerInfo}>
                  <img src="https://placehold.co/48x48" alt="Reviewer" className={styles.reviewerAvatar} />
                  <div>
                    <p className={styles.reviewerName}>{product.review.buyer}</p>
                    <div className={styles.stars}>⭐⭐⭐⭐⭐</div>
                  </div>
                </div>
                <div className={styles.reviewMeta}>
                  <a href="#" className={styles.reportLink}>Laporkan</a>
                  <span className={styles.reviewDate}>{product.review.date}</span>
                </div>
              </div>
              <p className={styles.reviewText}>{product.review.content}</p>
              <div className={styles.reviewPhotos}>
                 <img src="https://placehold.co/171x126" alt="Review Photo 1" />
                 <img src="https://placehold.co/171x126" alt="Review Photo 2" />
              </div>
              <div 
                className={styles.readAllLink}
                style={{ 
                  cursor: 'pointer', 
                  color: '#008585', 
                  fontWeight: '700',
                  padding: '10px',
                  backgroundColor: 'rgba(0, 133, 133, 0.05)',
                  borderRadius: '8px',
                  display: 'inline-block',
                  textAlign: 'right',
                  position: 'relative',
                  zIndex: 999
                }}
                onClick={() => router.push('/reviews')}
              >
                Baca Semua &rarr;
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Pilihan produk lain untuk kamu</h2>
            <div className={styles.productGrid}>
              {recommended.map((item) => (
                <Link href={`/product/${item.id}`} key={item.id} className={styles.productCard}>
                  <img src={item.img} alt={item.title} className={styles.productImage} />
                  <div className={styles.productInfoMini}>
                    <h3 className={styles.productTitleMini}>{item.title}</h3>
                    <p className={styles.productPriceMini}>{item.price}</p>
                    <div className={styles.productFooterMini}>
                      <div className={styles.productLocationMini}>
                        <img src="/img/icons/location.png" alt="" className={styles.locIcon} />
                        <span>{item.location}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
