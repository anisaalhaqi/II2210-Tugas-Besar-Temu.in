'use client';

import { useState } from 'react';
import styles from './upload.module.css';
import Link from 'next/link';

type Step = 'category' | 'detail';

export default function UploadPage() {
  const [step, setStep] = useState<Step>('category');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [originality, setOriginality] = useState<'original' | 'non-original'>('original');
  const [showLocDropdown, setShowLocDropdown] = useState(false);
  const [selectedLoc, setSelectedLoc] = useState('ITB Jatinangor');

  const locations = ['ITB Ganesha', 'ITB Jatinangor', 'ITB Cirebon'];

  const categories = [
    { name: 'Alat Hitung', icon: '🧮' },
    { name: 'Alat Lab', icon: '🔬' },
    { name: 'Buku', icon: '📚' },
    { name: 'Alat Tulis', icon: '✏️' },
    { name: 'Elektronika', icon: '🔌' },
    { name: 'Alat Studio', icon: '🎨' },
    { name: 'Penyimpanan', icon: '📦' },
    { name: 'Lainnya', icon: '⋯' },
  ];

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setStep('detail');
  };

  const handleBack = () => {
    if (step === 'detail') {
      setStep('category');
    } else {
      window.history.back();
    }
  };

  return (
    <div className={styles.container}>
      {/* Simplified Teal Header with standard navbar size */}
      <header className={styles.header}>
        <div className={styles.headerContent} style={{ justifyContent: 'flex-start' }}>
          <div className={styles.headerLeft}>
            <div className={styles.navBar}>
              <button className={styles.backButtonHeader} onClick={handleBack} title="Back">
                <img src="/img/icons/back-left.png" alt="Back" width={20} height={20} className={styles.backIcon} />
              </button>
              <h1 className={styles.pageTitleHeader}>{step === 'category' ? 'Pilih Kategori' : 'Detail Barang'}</h1>
            </div>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {step === 'category' ? (
          <section className={styles.categorySection}>
            {categories.map((cat, idx) => (
              <div key={idx} className={styles.categoryItem} onClick={() => handleCategorySelect(cat.name)}>
                <div className={styles.categoryIconBox}>{cat.icon}</div>
                <span className={styles.categoryLabel}>{cat.name}</span>
              </div>
            ))}
          </section>
        ) : (
          <div className={styles.formContainer}>
            <div className={styles.leftColumn}>
              <section className={styles.photoSection}>
                <h3 className={styles.label}>Foto Barang</h3>
                <div className={styles.photoGrid}>
                  <img src="https://placehold.co/120x120" alt="Item" className={styles.photoImage} />
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={styles.photoPlaceholder}>
                      <img src="/img/icons/plus.png" alt="Add" className={styles.photoIcon} />
                    </div>
                  ))}
                </div>
                <p className={styles.photoHint}>Ketuk untuk tambah foto (Maks. 4 foto)</p>
              </section>

              <div className={styles.formGroup}>
                <label className={styles.label}>Nama Barang</label>
                <input type="text" placeholder="Contoh: Jas Lab Kimia Ukuran M" className={styles.input} />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Lama Pemakaian</label>
                <div className={styles.inputWrapper}>
                  <input type="text" placeholder="Masukkan lama pemakaian" className={styles.input} />
                  <img src="/img/icons/calendar.png" className={styles.inputIcon} alt="Calendar" />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Harga</label>
                <div className={styles.inputWrapper}>
                  <input type="text" placeholder="Masukkan harga" className={styles.input} style={{ paddingLeft: '45px' }} />
                  <span style={{ position: 'absolute', left: '20px', color: '#292929', fontWeight: '600' }}>Rp</span>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Pilih Originalitas</label>
                <div className={styles.radioGroup}>
                  <div className={`${styles.radioOption} ${originality === 'original' ? styles.radioOptionActive : ''}`} onClick={() => setOriginality('original')}>
                    <div className={styles.radioCircle}></div>
                    <span>Original</span>
                  </div>
                  <div className={`${styles.radioOption} ${originality === 'non-original' ? styles.radioOptionActive : ''}`} onClick={() => setOriginality('non-original')}>
                    <div className={styles.radioCircle}></div>
                    <span>Non-original</span>
                  </div>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Deskripsi</label>
                <textarea placeholder="Ceritakan kondisi barangmu lebih detail..." className={`${styles.input} ${styles.textarea}`}></textarea>
              </div>

              <section>
                <h3 className={styles.sectionTitle}>Metode Pengambilan</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Jasa Pengiriman</label>
                    <div className={styles.inputWrapper}>
                      <input type="text" placeholder="Pilih tanggal pengiriman" className={styles.input} />
                      <img src="/img/icons/calendar.png" className={styles.inputIcon} alt="Calendar" />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Ketemuan (COD)</label>
                    <div className={styles.inputWrapper}>
                      <input type="text" placeholder="Masukkan lokasi ketemuan" className={styles.input} />
                      <img src="/img/icons/location.png" alt="Location" className={styles.inputIcon} />
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <aside className={styles.rightColumn}>
              <div className={styles.aiAnalysisCard}>
                <div className={styles.aiHeader}>
                  <div className={styles.aiTitle}>
                    <img src="/img/icons/graph.png" alt="AI Analysis" className={styles.aiIcon} />
                    <span>Analisis AI Temu.in</span>
                  </div>
                  <img src="/img/icons/arrow-down.png" alt="Expand" width={24} height={24} style={{ opacity: 0.5 }} />
                </div>
                <div className={styles.aiContent}>
                  <p style={{ marginBottom: '12px' }}>Berdasarkan foto yang kamu unggah, berikut analisis kami:</p>
                  <span className={styles.aiBold}>Warna</span>: Putih...<br/>
                  ✅ Bentuk masih simetris.<br/>
                  ⚠️ Barang terlihat kusut.<br/><br/>
                  <span className={styles.aiBold}>Rekomendasi Harga:</span><br/>
                  • Kondisi Baik: <span className={styles.aiBold}>Rp65k – Rp85k</span>
                </div>
              </div>
              <button className={styles.submitButton}>Mulai Jual Sekarang</button>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
