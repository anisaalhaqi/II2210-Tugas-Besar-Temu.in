'use client';

import { useState } from 'react';
import styles from './upload.module.css';
import { 
  ArrowLeft, 
  Plus, 
  Calendar, 
  MapPin, 
  BarChart3, 
  ChevronDown,
  Calculator,
  FlaskConical,
  BookOpen,
  PencilLine,
  Zap,
  Palette,
  Package,
  Layers,
  ChevronUp
} from 'lucide-react';
import { useRouter } from 'next/navigation';

type Step = 'category' | 'detail';

export default function UploadPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('category');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [originality, setOriginality] = useState<'original' | 'non-original'>('original');
  const [isAiExpanded, setIsAiExpanded] = useState(false);
  
  const [usageStartMonth, setUsageStartMonth] = useState('Januari');
  const [usageStartYear, setUsageStartYear] = useState('2024');
  const [usageEndMonth, setUsageEndMonth] = useState('Juli');
  const [usageEndYear, setUsageEndYear] = useState('2025');
  
  const [codLocation, setCodLocation] = useState('ITB Ganesha');

  const categories = [
    { name: 'Alat Hitung', icon: Calculator },
    { name: 'Alat Lab', icon: FlaskConical },
    { name: 'Buku', icon: BookOpen },
    { name: 'Alat Tulis', icon: PencilLine },
    { name: 'Elektronika', icon: Zap },
    { name: 'Alat Studio', icon: Palette },
    { name: 'Penyimpanan', icon: Package },
    { name: 'Lainnya', icon: Layers },
  ];

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const years = ['2021', '2022', '2023', '2024', '2025', '2026'];

  const campusLocations = ['ITB Ganesha', 'ITB Jatinangor', 'ITB Cirebon'];

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
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div key={idx} className={styles.categoryItem} onClick={() => handleCategorySelect(cat.name)}>
                  <div className={styles.categoryIconBox}>
                    <Icon size={40} strokeWidth={1.5} color="#008585" />
                  </div>
                  <span className={styles.categoryLabel}>{cat.name}</span>
                </div>
              );
            })}
          </section>
        ) : (
          <div className={styles.formContainer}>
            <div className={styles.leftColumn}>
              <section className={styles.photoSection}>
                <h3 className={styles.label}>Foto Barang</h3>
                <div className={styles.photoGrid}>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={styles.photoPlaceholder}>
                      <Plus size={28} color="#A5A5A5" strokeWidth={3} />
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
                <div className={styles.usagePeriodWrapper}>
                  <div className={styles.monthYearPicker}>
                    <select value={usageStartMonth} onChange={(e) => setUsageStartMonth(e.target.value)} className={styles.selectInput}>
                      {months.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <select value={usageStartYear} onChange={(e) => setUsageStartYear(e.target.value)} className={styles.selectInput}>
                      {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <span className={styles.toSeparator}>s/d</span>
                  <div className={styles.monthYearPicker}>
                    <select value={usageEndMonth} onChange={(e) => setUsageEndMonth(e.target.value)} className={styles.selectInput}>
                      {months.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <select value={usageEndYear} onChange={(e) => setUsageEndYear(e.target.value)} className={styles.selectInput}>
                      {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
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
                      <input type="date" className={styles.input} />
                      <Calendar size={20} className={styles.inputIcon} color="#767676" />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Ketemuan (COD)</label>
                    <div className={styles.inputWrapper}>
                      <select 
                        className={styles.input} 
                        value={codLocation}
                        onChange={(e) => setCodLocation(e.target.value)}
                        style={{ appearance: 'none' }}
                      >
                        {campusLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                      </select>
                      <MapPin size={20} className={styles.inputIcon} color="#767676" />
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <aside className={styles.rightColumn}>
              <div className={`${styles.aiAnalysisCard} ${isAiExpanded ? styles.aiExpanded : ''}`}>
                <div className={styles.aiHeader} onClick={() => setIsAiExpanded(!isAiExpanded)} style={{ cursor: 'pointer' }}>
                  <div className={styles.aiTitle}>
                    <BarChart3 size={20} className={styles.aiIcon} color="#008585" />
                    <span>Analisis AI Temu.in</span>
                  </div>
                  {isAiExpanded ? <ChevronUp size={24} style={{ opacity: 0.5 }} /> : <ChevronDown size={24} style={{ opacity: 0.5 }} />}
                </div>
                <div className={styles.aiContent}>
                  <div className={styles.aiBrief}>
                    <p>Berdasarkan foto yang kamu unggah, berikut analisis kami:</p>
                    <p><span className={styles.aiBold}>Warna</span>: Putih (Cukup cerah)</p>
                  </div>
                  <div className={styles.aiFullContent}>
                    <p>✅ Bentuk masih simetris dan jahitan terlihat kokoh.</p>
                    <p>⚠️ Barang terlihat sedikit kusut, disarankan untuk disetrika sebelum difoto ulang atau dikirim.</p>
                    <p>🔍 Tidak ditemukan noda permanen atau sobekan pada bagian lengan dan kerah.</p>
                    <br/>
                    <span className={styles.aiBold}>Rekomendasi Harga:</span><br/>
                    • Kondisi Baik: <span className={styles.aiBold}>Rp65k – Rp85k</span><br/>
                    • Kondisi Sangat Baik: <span className={styles.aiBold}>Rp85k – Rp100k</span>
                  </div>
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
