'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from './page.module.css';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Heart, 
  Clock, 
  Hourglass, 
  ShieldCheck, 
  Tag, 
  ShoppingBag, 
  MapPin, 
  Star,
  BarChart3,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Skeleton from '@/components/Skeleton/Skeleton';
import MapDisplay from '@/components/Map/MapDisplay';

const campusCoords: Record<string, [number, number]> = {
  'ITB Ganesha': [-6.8909, 107.6104],
  'ITB Jatinangor': [-6.9281, 107.7705],
  'ITB Cirebon': [-6.6455, 108.4071],
};

interface Seller {
  full_name: string;
  avatar_url: string;
  rating: number;
  review_count: number;
}

interface Product {
  id: number;
  title: string;
  price: number;
  location: string;
  description: string;
  category: string;
  originality: string;
  usage_period: string;
  delivery_dates: string;
  images: string[];
  created_at: string;
  seller_id: string;
  profiles?: Seller; // Joined from Supabase
}

function ProductSkeleton() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.navigationRow}>
          <Skeleton width={100} height={24} />
        </div>

        <div className={styles.productLayout}>
          <div className={styles.imageGallery}>
            <div className={styles.mainImageWrapper}>
              <Skeleton width="100%" height="100%" borderRadius={0} />
            </div>
            <div className={styles.thumbnailList}>
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} width={80} height={80} borderRadius={8} />
              ))}
            </div>
          </div>

          <div className={styles.productInfo}>
            <div className={styles.titleRow}>
              <Skeleton width="80%" height={36} />
              <Skeleton width={24} height={24} borderRadius="50%" />
            </div>
            <Skeleton width="40%" height={40} style={{ marginBottom: '10px' }} />

            <div className={styles.specList}>
              {[...Array(4)].map((_, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '8px', alignItems: 'center' }}>
                  <Skeleton width={20} height={20} borderRadius="50%" />
                  <Skeleton width={80} height={16} />
                  <Skeleton width={120} height={16} />
                </div>
              ))}
            </div>

            <Skeleton width="100%" height={140} borderRadius={16} />
            <Skeleton width="100%" height={80} />
            <Skeleton width="100%" height={56} borderRadius={8} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAiExpanded, setIsAiExpanded] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (!id) return;

    async function fetchProductData() {
      try {
        setLoading(true);
        // 1. Fetch Product with Seller Profile
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            profiles:seller_id (
              full_name,
              avatar_url,
              rating,
              review_count
            )
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        setProduct(data);
        setActiveImageIndex(0);

        // 2. Fetch Recommended (same category)
        const { data: recData } = await supabase
          .from('products')
          .select('*')
          .eq('category', data.category)
          .neq('id', id)
          .limit(4);
        
        setRecommended(recData || []);

      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProductData();
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return <ProductSkeleton />;
  }

  if (!product) return <div className={styles.container} style={{ padding: '100px', textAlign: 'center' }}>Produk tidak ditemukan.</div>;

  const seller = product.profiles;

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.navigationRow}>
          <button onClick={() => router.back()} className={styles.backButton}>
             <ArrowLeft size={20} />
             Kembali
          </button>
        </div>

        <div className={styles.productLayout}>
          <div className={styles.imageGallery}>
            <div className={styles.mainImageWrapper}>
              <img 
                src={product.images[activeImageIndex] || 'https://placehold.co/600x600'} 
                alt={product.title} 
                className={styles.mainImage} 
              />
            </div>
            <div className={styles.thumbnailList}>
              {product.images.map((img, i) => (
                <img 
                  key={i} 
                  src={img} 
                  className={`${styles.thumbnail} ${activeImageIndex === i ? styles.activeThumbnail : ''}`} 
                  alt="thumb" 
                  onClick={() => setActiveImageIndex(i)}
                />
              ))}
            </div>
          </div>

          <div className={styles.productInfo}>
            <div className={styles.titleRow}>
              <h1 className={styles.productTitle}>{product.title}</h1>
              <div 
                className={styles.likes} 
                onClick={() => setIsFavorited(!isFavorited)}
                style={{ cursor: 'pointer' }}
              >
                <Heart 
                  size={24} 
                  fill={isFavorited ? "#FF4B4B" : "none"} 
                  color={isFavorited ? "#FF4B4B" : "#767676"} 
                />
              </div>
            </div>
            <p className={styles.productPrice}>{formatPrice(product.price)}</p>

            <ul className={styles.specList}>
              <li>
                <Clock size={18} className={styles.specIcon} color="#008585" />
                <span className={styles.specLabel}>Diposting oleh</span>
                <Link href="/profile" className={styles.specValueBold}>{seller?.full_name || 'Penjual'}</Link>
              </li>
              <li>
                <Hourglass size={18} className={styles.specIcon} color="#008585" />
                <span className={styles.specLabel}>Pemakaian</span>
                <span className={styles.specValue}>{product.usage_period || 'Tidak disebutkan'}</span>
              </li>
              <li>
                <ShieldCheck size={18} className={styles.specIcon} color="#008585" />
                <span className={styles.specLabel}>Status</span>
                <span className={styles.specValue}>{product.originality || 'Original'}</span>
              </li>
              <li>
                <Tag size={18} className={styles.specIcon} color="#008585" />
                <span className={styles.specLabel}>Kategori</span>
                <span className={styles.specValueBold}>{product.category}</span>
              </li>
            </ul>

            <div className={`${styles.aiAnalysisCard} ${isAiExpanded ? styles.aiExpanded : ''}`}>
              <div className={styles.aiHeader} onClick={() => setIsAiExpanded(!isAiExpanded)} style={{ cursor: 'pointer' }}>
                <div className={styles.aiTitle}>
                  <BarChart3 size={20} className={styles.aiIcon} color="#2563EB" />
                  <span>Analisis AI Temu.in</span>
                </div>
                {isAiExpanded ? <ChevronUp size={24} style={{ opacity: 0.5 }} /> : <ChevronDown size={24} style={{ opacity: 0.5 }} />}
              </div>
              <div className={styles.aiContent}>
                <div className={styles.aiBrief}>
                  <p>Berdasarkan analisis visual cerdas kami terhadap foto produk ini:</p>
                  <p>✅ Bentuk masih simetris dan jahitan terlihat kokoh.</p>
                </div>
                {isAiExpanded && (
                  <div className={styles.aiFullContent}>
                    <p>⚠️ Barang mungkin memiliki sedikit kusut karena penyimpanan.</p>
                    <p>📊 <strong>Kualitas Material:</strong> High Grade (Sangat Awet)</p>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.description}>
              <p>{product.description}</p>
            </div>

            <div className={styles.deliverySection}>
              <h3>Metode Pengambilan</h3>
              <ul className={styles.deliveryList}>
                <li>
                  <MapPin size={20} color="#008585" />
                  <span>Ketemuan (Kampus {product.location})</span>
                </li>
                {campusCoords[product.location] && (
                  <div style={{ height: '200px', width: '100%', marginTop: '8px', marginBottom: '16px' }}>
                    <MapDisplay 
                      center={campusCoords[product.location]} 
                      markerPosition={campusCoords[product.location]} 
                    />
                  </div>
                )}
                <li>
                  <ShoppingBag size={20} color="#008585" />
                  <span>Jasa Pengiriman ({product.delivery_dates || 'Sesuai kesepakatan'})</span>
                </li>
              </ul>
            </div>

            <div className={styles.actionButtons}>
              <button className={styles.btnStatusFull}>Beli Sekarang</button>
            </div>
          </div>
        </div>

        <div className={styles.secondaryContent}>
          <section className={styles.sellerProfile}>
            <img src={seller?.avatar_url || 'https://placehold.co/90x90'} alt={seller?.full_name} className={styles.sellerAvatar} />
            <div className={styles.sellerInfo}>
              <div className={styles.sellerNameRow}>
                <h3>{seller?.full_name}</h3>
                <span className={styles.verifiedBadge}>✓</span>
              </div>
              <p className={styles.activeTime}>Aktif 1 jam yang lalu</p>
              <div className={styles.ratingBox}>
                <span className={styles.ratingScore}>{seller?.rating?.toFixed(1) || '5.0'}</span>
                <span className={styles.ratingTotal}>/{seller?.review_count || 0} Penilaian</span>
              </div>
            </div>
          </section>

          {recommended.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Pilihan produk lain untuk kamu</h2>
              <div className={styles.productGrid}>
                {recommended.map((item) => (
                  <Link href={`/product/${item.id}`} key={item.id} className={styles.productCard}>
                    <img src={item.images[0] || 'https://placehold.co/300x200'} alt={item.title} className={styles.productImage} />
                    <div className={styles.productInfoMini}>
                      <h3 className={styles.productTitleMini}>{item.title}</h3>
                      <p className={styles.productPriceMini}>{formatPrice(item.price)}</p>
                      <div className={styles.productFooterMini}>
                        <div className={styles.productLocationMini}>
                          <MapPin size={14} color="#767676" />
                          <span>{item.location}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
