import styles from './page.module.css';

export default function ProductDetail() {
  // Static data matching the user's provided HTML
  const product = {
    title: 'Jas Laboratorium Fisika TPB',
    price: 'Rp32.000',
    likes: 12,
    postedTime: '5 hari lalu',
    sellerName: 'Jae Hwan',
    usagePeriod: 'Pemakaian Sept 2024-Juli 2025',
    originality: 'Tidak original',
    category: 'Alat Laboratorium',
    description: 'Jas ini cuma dipakai satu semester pas praktikum Kimia Dasar dan Fisika Dasar. Udah dicuci bersih dan disetrika rapi, tinggal pakai. Alasan jual: Udah lulus matkulnya dan mau ngosongin lemari kosan.',
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
      content: 'Catnya nyampe dengan selamat 🎨✨ Seller juga gercep, ramah, dan enak diajak chat. Kondisi buku masih oke, sesuai ekspektasi. Pokoknya belanja di sini rasanya kayak nemu harta karun kecil. Makasih ya kak, semoga toko kakak makin laris manis 🫶😂'
    }
  };

  const recommended = [
    { title: 'Buku Chempro Edisi 2025 masih bersih', price: 'Rp50.000', location: 'Cirebon', img: 'https://placehold.co/300x200' },
    { title: 'Jas Laboratorium Fisika TPB', price: 'Rp75.000', location: 'Ganesha', img: 'https://placehold.co/300x200' },
    { title: 'Phiwiki FISIKA DASAR II Soal dan Pembahasan', price: 'Rp50.000', location: 'Cirebon', img: 'https://placehold.co/300x200' },
    { title: 'ESP32 Bekas Micro USB', price: 'Rp50.000', location: 'Cirebon', img: 'https://placehold.co/300x200' },
  ];

  return (
    <div className={styles.container}>
      {/* Reusing the Fixed Header from Main Page */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <img src="/img/logo.png" alt="Temu.in Logo" className={styles.logo} />
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
              <div className={styles.iconItem}>
                <img src="/img/icons/notification.png" alt="Notification" className={styles.actionIcon} />
              </div>
              <div className={styles.iconItem}>
                <img src="/img/icons/chat.png" alt="Chat" className={styles.actionIcon} />
              </div>
              <div className={styles.iconItem}>
                <img src="/img/icons/cart.png" alt="Cart" className={styles.actionIcon} />
              </div>
              <button className={styles.uploadButton}>
                + Upload Barang
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {/* Breadcrumb / Back Navigation */}
        <div className={styles.navigationRow}>
          <button className={styles.backButton}>
             <img src="/img/icons/back-left.png" alt="" className={styles.navIconSmall} />
             Kembali
          </button>
        </div>

        {/* Product Layout: Two Columns on Desktop */}
        <div className={styles.productLayout}>
          
          {/* Left Column: Images */}
          <div className={styles.imageGallery}>
            <div className={styles.mainImageWrapper}>
              <img src="https://placehold.co/600x600" alt={product.title} className={styles.mainImage} />
            </div>
            {/* Thumbnail List */}
            <div className={styles.thumbnailList}>
              <img src="https://placehold.co/100x100" className={styles.thumbnail} alt="thumb" />
              <img src="https://placehold.co/100x100" className={styles.thumbnail} alt="thumb" />
            </div>
          </div>

          {/* Right Column: Product Info & Actions */}
          <div className={styles.productInfo}>
            <div className={styles.titleRow}>
              <h1 className={styles.productTitle}>{product.title}</h1>
              <div className={styles.likes}>
                <img src="/img/icons/favorite.png" alt="Likes" className={styles.likeIcon} />
                <span>{product.likes}</span>
              </div>
            </div>
            <p className={styles.productPrice}>{product.price}</p>

            {/* Specs List with Icons */}
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

            {/* Condition Summary Box (Blue Box) */}
            <div className={styles.conditionBox}>
              <div className={styles.conditionHeader}>
                <h3>Ringkasan Kondisi Barang</h3>
                <img src="/img/icons/graph.png" alt="Sparkle" className={styles.sparkleIcon} />
              </div>
              <div className={styles.conditionDetails}>
                <p><strong>Warna:</strong> Putih (terlihat masih cukup cerah, tetapi ada sedikit bayangan lipatan atau kerutan karena penyimpanan)</p>
                <p><strong>Material:</strong> Terlihat seperti kain katun tebal atau campuran poliester (standard jas lab)</p>
                <p><strong>Label:</strong> Terdapat label merek "Dua Saudara" dengan ukuran "S". Merek ini cukup dikenal di Indonesia untuk seragam medis/laboratorium karena kualitasnya yang standar instansi</p>
                <p>✅ Bentuk masih simetris, kancing lengkap, dan kerah tidak terlihat menguning secara signifikan</p>
                <p>⚠️ Barang terlihat sangat kusut, perlu disetrika ulang agar daya tarik visualnya meningkat. Tidak terlihat adanya noda tinta atau lubang (berdasarkan foto jarak jauh ini)</p>
              </div>
            </div>

            {/* Description Text */}
            <div className={styles.description}>
              <p>{product.description}</p>
            </div>

            {/* Delivery Methods with Available Icons */}
            <div className={styles.deliverySection}>
              <h3>Metode Pengambilan</h3>
              <ul className={styles.deliveryList}>
                <li>
                  <img src="/img/icons/delivery.png" alt="" className={styles.deliveryIconImg} />
                  <span>Jasa Pengiriman (29 Maret - 5 April 2026)</span>
                </li>
                <li>
                  <img src="/img/icons/location.png" alt="" className={styles.deliveryIconImg} />
                  <span>Ketemuan (Kampus Ganesha)</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons - Owner View (Ubah Status Only) */}
            <div className={styles.actionButtons}>
              <button className={styles.btnStatusFull}>Ubah Status Barang</button>
            </div>
          </div>
        </div>

        {/* Below Fold Content: Seller, Reviews, Recommendations */}
        <div className={styles.secondaryContent}>
          {/* Seller Profile */}
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

          {/* Reviews */}
          <section className={styles.reviewsSection}>
            <h2 className={styles.sectionTitle}>Ulasan</h2>
            <div className={styles.reviewCard}>
              <div className={styles.reviewHeader}>
                <div className={styles.reviewerInfo}>
                  <img src="https://placehold.co/40x40" alt="Reviewer" className={styles.reviewerAvatar} />
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
              <a href="#" className={styles.readAllLink}>Baca Semua</a>
            </div>
          </section>

          {/* Related Products */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Pilihan produk lain untuk kamu</h2>
            <div className={styles.productGrid}>
              {recommended.map((item, idx) => (
                <div key={idx} className={styles.productCard}>
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
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
