'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, 
  MapPin, 
  Store, 
  MessageSquare, 
  Truck, 
  Wallet, 
  X,
  MapPinned,
  Loader2
} from 'lucide-react';
import styles from './order.module.css';
import { supabase } from '@/lib/supabase';

interface OrderItem {
  id: string;
  product: {
    id: string;
    title: string;
    price: number;
    images: string[];
    users: {
      full_name: string;
      id: string;
    }
  }
}

export default function OrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [deliveryOption, setDeliveryOption] = useState('ketemuan');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [note, setNote] = useState('');
  
  // Location States
  const [showLocModal, setShowLocModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('ITB Ganesha');
  const [customAddress, setCustomAddress] = useState('');
  const [tempLoc, setTempLoc] = useState('ITB Ganesha');
  const [tempCustom, setTempCustom] = useState('');

  const campusOptions = ['ITB Ganesha', 'ITB Jatinangor', 'ITB Cirebon'];

  useEffect(() => {
    async function fetchOrderData() {
      try {
        setLoading(true);
        const itemIds = searchParams.get('items')?.split(',') || [];
        
        if (itemIds.length === 0) {
          router.push('/cart');
          return;
        }

        const { data, error } = await supabase
          .from('cart_items')
          .select(`
            id,
            product:product_id (
              id, title, price, images,
              users:seller_id (id, full_name)
            )
          `)
          .in('id', itemIds);

        if (error) throw error;
        setItems(data as any || []);
      } catch (err) {
        console.error('Error fetching order items:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrderData();
  }, [searchParams]);

  const subtotal = items.reduce((sum, item) => sum + (item.product?.price || 0), 0);
  const platformFee = 1000;
  const total = subtotal + platformFee;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleSaveLocation = () => {
    setSelectedLocation(tempLoc);
    if (tempLoc === 'Lainnya') {
      setCustomAddress(tempCustom);
    }
    setShowLocModal(false);
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
        return;
      }

      // SIMULATION: If QRIS, show a payment prompt first
      if (paymentMethod === 'qris') {
        const confirmPayment = window.confirm('Anda memilih QRIS. Silakan selesaikan pembayaran simulasi ini untuk melanjutkan pesanan.');
        if (!confirmPayment) {
          setLoading(false);
          return;
        }
      }

      // Create orders for each item
      for (const item of items) {
        // 1. Conversation check/create
        let convId: string;
        const { data: existingConv } = await supabase
          .from('conversations')
          .select('id')
          .eq('product_id', item.product.id)
          .eq('buyer_id', user.id)
          .maybeSingle();
        
        if (existingConv) {
          convId = existingConv.id;
        } else {
          const { data: newConv, error: convError } = await supabase
            .from('conversations')
            .insert([{
              product_id: item.product.id,
              buyer_id: user.id,
              seller_id: item.product.users.id
            }])
            .select()
            .single();
          if (convError) throw convError;
          convId = newConv.id;
        }

        // 2. Create Order
        const { error: orderError } = await supabase
          .from('orders')
          .insert([{
            conversation_id: convId,
            product_id: item.product.id,
            buyer_id: user.id,
            seller_id: item.product.users.id,
            final_price: item.product.price,
            deal_method: deliveryOption === 'ketemuan' ? 'meet-up' : 'jasa ojol',
            meetup_location: deliveryOption === 'ketemuan' ? selectedLocation : null,
            notes: note,
            status: 'waiting_confirmation' // Both QRIS (paid) and COD start here for seller confirmation
          }]);

        if (orderError) throw orderError;

        // 3. Notification to Seller
        await supabase.from('notifications').insert([{
          user_id: item.product.users.id,
          type: 'offer_received',
          title: 'Pesanan Baru Masuk!',
          body: `${user.user_metadata?.full_name || 'Seseorang'} telah memesan "${item.product.title}". Silakan cek dan konfirmasi.`,
          related_id: convId,
          related_type: 'conversation'
        }]);

        // 4. Remove from cart
        await supabase.from('cart_items').delete().eq('id', item.id);
      }

      alert(paymentMethod === 'qris' ? 'Pembayaran Berhasil! Pesanan Anda sedang diteruskan ke penjual.' : 'Pesanan berhasil dibuat! Silakan tunggu konfirmasi dari penjual.');
      router.push('/aktivitas?tab=Menunggu Konfirmasi');
    } catch (err) {
      console.error('Error placing order:', err);
      alert('Terjadi kesalahan saat membuat pesanan.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Loader2 className="animate-spin" size={48} color="#008585" />
      </div>
    );
  }

  // Group items by seller for display
  const groupedItems = items.reduce((acc, item) => {
    const sellerName = item.product.users.full_name;
    const sellerId = item.product.users.id;
    if (!acc[sellerId]) acc[sellerId] = { name: sellerName, items: [] };
    acc[sellerId].items.push(item);
    return acc;
  }, {} as Record<string, { name: string, items: OrderItem[] }>);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <header className={styles.pageHeader}>
          <button onClick={() => router.back()} className={styles.backBtn}>
            <ArrowLeft size={20} />
          </button>
          <h1 className={styles.pageTitle}>Order</h1>
        </header>

        <div className={styles.orderLayout}>
          <div className={styles.leftColumn}>
            
            {/* Shipping Location */}
            <section className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>
                <MapPin size={20} color="#008585" />
                Lokasi Pengiriman
              </h2>
              <div className={styles.locationContent}>
                <div>
                  <p className={styles.locLabel}>Alamat Saat Ini</p>
                  <p className={styles.locValue}>
                    {selectedLocation === 'Lainnya' ? customAddress || 'Alamat Belum Diisi' : selectedLocation}
                  </p>
                </div>
                <button className={styles.outlineBtn} onClick={() => {
                  setTempLoc(selectedLocation);
                  setTempCustom(customAddress);
                  setShowLocModal(true);
                }}>
                  Ubah Lokasi
                </button>
              </div>
            </section>

            {/* Order Items */}
            <section className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>
                <Store size={20} color="#008585" />
                Daftar Pesanan
              </h2>
              {Object.entries(groupedItems).map(([sellerId, group]) => (
                <div key={sellerId} style={{ marginBottom: '20px' }}>
                  <div className={styles.sellerInfo}>Pesanan dari Toko {group.name}</div>
                  {group.items.map(item => (
                    <div key={item.id} className={styles.productItem}>
                      <img src={item.product.images[0] || 'https://placehold.co/90x90'} alt={item.product.title} className={styles.productImg} />
                      <div className={styles.productDetails}>
                        <h3 className={styles.productName}>{item.product.title}</h3>
                        <div className={styles.productPriceQty}>
                          <span className={styles.price}>{formatPrice(item.product.price)}</span>
                          <span className={styles.qty}>x1</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </section>

            {/* Message to Seller */}
            <section className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>
                <MessageSquare size={20} color="#008585" />
                Pesan untuk Penjual
              </h2>
              <input 
                type="text" 
                placeholder="Tinggalkan pesan (opsional)..." 
                className={styles.messageInput}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </section>

            {/* Delivery Options */}
            <section className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>
                <Truck size={20} color="#008585" />
                Opsi Pengiriman
              </h2>
              <div className={styles.optionList}>
                <div 
                  className={`${styles.optionCard} ${deliveryOption === 'ketemuan' ? styles.optionCardActive : ''}`}
                  onClick={() => setDeliveryOption('ketemuan')}
                >
                  <div className={styles.radioCircle}>
                    {deliveryOption === 'ketemuan' && <div className={styles.radioInner} />}
                  </div>
                  <div className={styles.optionInfo}>
                    <h4>Ketemuan (COD)</h4>
                    <p>Atur waktu dan lokasi ketemuan di area kampus setelah pesanan dikonfirmasi.</p>
                  </div>
                </div>

                <div 
                  className={`${styles.optionCard} ${deliveryOption === 'kurir' ? styles.optionCardActive : ''}`}
                  onClick={() => setDeliveryOption('kurir')}
                >
                  <div className={styles.radioCircle}>
                    {deliveryOption === 'kurir' && <div className={styles.radioInner} />}
                  </div>
                  <div className={styles.optionInfo}>
                    <h4>Jasa Pengiriman</h4>
                    <p>Penjual akan mengirimkan barang melalui kurir pilihan setelah pembayaran terverifikasi.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Methods */}
            <section className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>
                <Wallet size={20} color="#008585" />
                Metode Pembayaran
              </h2>
              <div className={styles.optionList}>
                <div 
                  className={`${styles.optionCard} ${paymentMethod === 'cod' ? styles.optionCardActive : ''}`}
                  onClick={() => setPaymentMethod('cod')}
                >
                  <div className={styles.radioCircle}>
                    {paymentMethod === 'cod' && <div className={styles.radioInner} />}
                  </div>
                  <div className={styles.optionInfo}>
                    <h4>Cash on Delivery</h4>
                    <p>Bayar langsung saat ketemuan. Siapin uang pas, ya!</p>
                  </div>
                </div>

                <div 
                  className={`${styles.optionCard} ${paymentMethod === 'qris' ? styles.optionCardActive : ''}`}
                  onClick={() => setPaymentMethod('qris')}
                >
                  <div className={styles.radioCircle}>
                    {paymentMethod === 'qris' && <div className={styles.radioInner} />}
                  </div>
                  <div className={styles.optionInfo}>
                    <h4>QRIS</h4>
                    <p>Bayar instan menggunakan saldo e-wallet atau m-banking Anda.</p>
                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* Right Column: Summary */}
          <aside className={styles.summaryCard}>
            <h2 className={styles.sectionTitle}>Rangkuman Pesanan</h2>
            
            <div className={styles.summaryRow}>
              <span>Subtotal Harga ({items.length} barang)</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Biaya Platform</span>
              <span>{formatPrice(platformFee)}</span>
            </div>
            
            <div className={styles.summaryDivider} />
            
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Total Pembayaran</span>
              <span className={styles.totalValue}>{formatPrice(total)}</span>
            </div>

            <button className={styles.placeOrderBtn} onClick={handlePlaceOrder} disabled={loading}>
              {loading ? 'Memproses...' : 'Buat Pesanan Sekarang'}
            </button>
          </aside>
        </div>
      </main>

      {/* Location Modal */}
      {showLocModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Pilih Lokasi Pengiriman</h3>
              <button className={styles.closeBtn} onClick={() => setShowLocModal(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className={styles.locationOptions}>
              {campusOptions.map(loc => (
                <div 
                  key={loc} 
                  className={`${styles.locOption} ${tempLoc === loc ? styles.locOptionActive : ''}`}
                  onClick={() => setTempLoc(loc)}
                >
                  <MapPin size={20} />
                  {loc}
                </div>
              ))}
              <div 
                className={`${styles.locOption} ${tempLoc === 'Lainnya' ? styles.locOptionActive : ''}`}
                onClick={() => setTempLoc('Lainnya')}
              >
                <MapPinned size={20} />
                Masukkan Alamat Sendiri
              </div>

              {tempLoc === 'Lainnya' && (
                <textarea 
                  className={styles.customLocInput}
                  placeholder="Masukkan alamat lengkap Anda di sini..."
                  value={tempCustom}
                  onChange={(e) => setTempCustom(e.target.value)}
                  rows={3}
                />
              )}
            </div>

            <button className={styles.saveBtn} onClick={handleSaveLocation}>
              Simpan Lokasi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
