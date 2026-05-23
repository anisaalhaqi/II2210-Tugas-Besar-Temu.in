'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  MapPin, 
  Store, 
  MessageSquare, 
  Truck, 
  Wallet, 
  X,
  MapPinned
} from 'lucide-react';
import styles from './order.module.css';

export default function OrderPage() {
  const router = useRouter();
  const [deliveryOption, setDeliveryOption] = useState('ketemuan');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  
  // Location States
  const [showLocModal, setShowLocModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('ITB Ganesha');
  const [customAddress, setCustomAddress] = useState('');
  const [tempLoc, setTempLoc] = useState('ITB Ganesha');
  const [tempCustom, setTempCustom] = useState('');

  const campusOptions = ['ITB Ganesha', 'ITB Jatinangor', 'ITB Cirebon'];

  const orderItems = [
    {
      id: 1,
      seller: 'Jae Hwan',
      title: 'Jas Laboratorium TPB',
      price: 31000,
      qty: 1,
      img: 'https://placehold.co/90x90'
    }
  ];

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
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
              <div className={styles.sellerInfo}>Pesanan dari Toko Jae Hwan</div>
              {orderItems.map(item => (
                <div key={item.id} className={styles.productItem}>
                  <img src={item.img} alt={item.title} className={styles.productImg} />
                  <div className={styles.productDetails}>
                    <h3 className={styles.productName}>{item.title}</h3>
                    <div className={styles.productPriceQty}>
                      <span className={styles.price}>{formatPrice(item.price)}</span>
                      <span className={styles.qty}>x{item.qty}</span>
                    </div>
                  </div>
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
              <span>Subtotal Harga ({orderItems.length} barang)</span>
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

            <button className={styles.placeOrderBtn}>
              Buat Pesanan Sekarang
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
