'use client';

import { useState } from 'react';
import styles from './upload.module.css';
import { ArrowLeft, Plus, Calendar, MapPin, BarChart3, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Step = 'category' | 'detail';

export default function UploadPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('category');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [originality, setOriginality] = useState<'original' | 'non-original'>('original');

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
      router.back();
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            className={styles.backButton} 
            onClick={handleBack} 
            title="Back"
            style={{
              background: 'white', border: '1px solid #e5e7eb', cursor: 'pointer', padding: '10px',
              display: 'flex', alignItems: 'center', borderRadius: '12px', color: '#292929'
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className={styles.pageTitle}>{step === 'category' ? 'Pilih Kategori' : `Detail Barang (${selectedCategory})`}</h1>
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
                      <Plus size={24} color="#A5A5A5" />
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
                  <Calendar size={20} className={styles.inputIcon} color="#767676" />
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
                      <Calendar size={20} className={styles.inputIcon} color="#767676" />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Ketemuan (COD)</label>
                    <div className={styles.inputWrapper}>
                      <input type="text" placeholder="Masukkan lokasi ketemuan" className={styles.input} />
                      <MapPin size={20} className={styles.inputIcon} color="#767676" />
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <aside className={styles.rightColumn}>
              <div className={styles.aiAnalysisCard}>
                <div className={styles.aiHeader}>
                  <div className={styles.aiTitle}>
                    <BarChart3 size={20} className={styles.aiIcon} color="#008585" />
                    <span>Analisis AI Temu.in</span>
                  </div>
                  <ChevronDown size={24} style={{ opacity: 0.5 }} />
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
