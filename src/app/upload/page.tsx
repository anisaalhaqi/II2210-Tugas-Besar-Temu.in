'use client';

import { useState, useRef, useMemo } from 'react';
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
  ChevronUp,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';

type Step = 'category' | 'detail';

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [step, setStep] = useState<Step>('category');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [originality, setOriginality] = useState<'original' | 'non-original'>('original');
  const [isAiExpanded, setIsAiExpanded] = useState(false);
  
  const [images, setImages] = useState<string[]>([]);
  const [showPhotoWarning, setShowPhotoPhotoWarning] = useState(false);

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  const [usageStartMonth, setUsageStartMonth] = useState('Januari');
  const [usageStartYear, setUsageStartYear] = useState('2024');
  const [usageEndMonth, setUsageEndMonth] = useState('Juli');
  const [usageEndYear, setUsageEndYear] = useState('2025');
  const [codLocation, setCodLocation] = useState('ITB Ganesha');
  
  // Dynamic Calendar States
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1)); // April 2026
  const [rangeStart, setRangeStart] = useState<number | null>(27);
  const [rangeEnd, setRangeEnd] = useState<number | null>(30);

  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const years = ['2021', '2022', '2023', '2024', '2025', '2026'];
  const campusLocations = ['ITB Ganesha', 'ITB Jatinangor', 'ITB Cirebon'];

  const formattedRange = useMemo(() => {
    if (!rangeStart) return 'Pilih Tanggal';
    const monthName = months[currentDate.getMonth()];
    const year = currentDate.getFullYear();
    if (!rangeEnd) return `${rangeStart} ${monthName} ${year}`;
    return `${rangeStart} ${monthName} - ${rangeEnd} ${monthName} ${year}`;
  }, [rangeStart, rangeEnd, currentDate]);

  const handleDayClick = (day: number) => {
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(day);
      setRangeEnd(null);
    } else if (day > rangeStart) {
      setRangeEnd(day);
    } else {
      setRangeStart(day);
      setRangeEnd(null);
    }
  };

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + offset));
    setCurrentDate(new Date(newDate));
    setRangeStart(null);
    setRangeEnd(null);
  };

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

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setStep('detail');
  };

  const handleBack = () => {
    if (step === 'detail') setStep('category');
    else router.back();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const remainingSlots = 4 - images.length;
      if (files.length > remainingSlots) {
        setShowPhotoPhotoWarning(true);
        setTimeout(() => setShowPhotoPhotoWarning(false), 5000);
      }
      const newImages = Array.from(files).slice(0, remainingSlots).map(file => URL.createObjectURL(file));
      setImages([...images, ...newImages]);
    }
  };

  const CustomDropdown = ({ value, options, onSelect, id }: any) => (
    <div className={styles.customDropdownWrapper}>
      <div className={styles.dropdownTrigger} onClick={() => setOpenDropdown(openDropdown === id ? null : id)}>
        <span>{value}</span>
        <ChevronDown size={18} style={{ transform: openDropdown === id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </div>
      {openDropdown === id && (
        <div className={styles.dropdownMenu}>
          {options.map((opt: any) => (
            <div key={opt} className={`${styles.dropdownItem} ${value === opt ? styles.dropdownItemActive : ''}`} onClick={() => { onSelect(opt); setOpenDropdown(null); }}>
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={handleBack} className={styles.backButton}>
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
                {showPhotoWarning && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '10px', color: '#B91C1C', fontSize: '13px', marginBottom: '8px' }}>
                    <AlertCircle size={16} />
                    <span>Maksimal 4 foto. Hanya 4 foto pertama yang akan dimasukkan.</span>
                  </div>
                )}
                <div className={styles.photoGrid}>
                  {images.map((src, idx) => (
                    <div key={idx} className={styles.photoImageWrapper}>
                      <img src={src} alt="Upload" className={styles.photoImage} />
                      <button onClick={() => setImages(images.filter((_, i) => i !== idx))} style={{ position: 'absolute', top: -8, right: -8, background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {images.length < 4 && (
                    <div className={styles.photoPlaceholder} onClick={() => fileInputRef.current?.click()}>
                      <Plus size={28} color="#A5A5A5" strokeWidth={3} />
                    </div>
                  )}
                </div>
                <input type="file" ref={fileInputRef} className={styles.hiddenInput} accept="image/*" multiple onChange={handleImageUpload} />
                <p className={styles.photoHint}>Pilih banyak foto sekaligus (Maks. 4).</p>
              </section>

              <div className={styles.formGroup}>
                <label className={styles.label}>Nama Barang</label>
                <input type="text" placeholder="Contoh: Jas Lab Kimia Ukuran M" className={styles.input} />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Lama Pemakaian</label>
                <div className={styles.usagePeriodRow}>
                  <div style={{ flex: 1, display: 'flex', gap: '8px' }}>
                    <CustomDropdown id="sm" value={usageStartMonth} options={months} onSelect={setUsageStartMonth} />
                    <CustomDropdown id="sy" value={usageStartYear} options={years} onSelect={setUsageStartYear} />
                  </div>
                  <span className={styles.toSeparator}>s/d</span>
                  <div style={{ flex: 1, display: 'flex', gap: '8px' }}>
                    <CustomDropdown id="em" value={usageEndMonth} options={months} onSelect={setUsageEndMonth} />
                    <CustomDropdown id="ey" value={usageEndYear} options={years} onSelect={setUsageEndYear} />
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
                <label className={styles.label}>Tentukan rentang tanggal pengiriman yang Anda bersedia</label>
                <div className={styles.inputWrapper} style={{ cursor: 'pointer' }} onClick={() => setShowCalendar(true)}>
                  <div className={styles.input}>{formattedRange}</div>
                  <Calendar size={20} className={styles.inputIcon} color="#008585" />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Lokasi Ketemuan (COD)</label>
                <CustomDropdown id="cod" value={codLocation} options={campusLocations} onSelect={setCodLocation} />
              </div>
            </div>

            <aside className={styles.rightColumn}>
              <div className={`${styles.aiAnalysisCard} ${isAiExpanded ? styles.aiExpanded : ''}`}>
                <div className={styles.aiHeader} onClick={() => setIsAiExpanded(!isAiExpanded)} style={{ cursor: 'pointer' }}>
                  <div className={styles.aiTitle}>
                    <BarChart3 size={20} className={styles.aiIcon} color="#2563EB" />
                    <span>Analisis AI Temu.in</span>
                  </div>
                  {isAiExpanded ? <ChevronUp size={24} style={{ opacity: 0.5 }} /> : <ChevronDown size={24} style={{ opacity: 0.5 }} />}
                </div>
                <div className={styles.aiContent}>
                   <p>Berdasarkan foto yang kamu unggah, berikut analisis kami:</p>
                   <p><span className={styles.aiBold}>Warna</span>: Putih (Cukup cerah)</p>
                   <p>✅ Bentuk masih simetris dan jahitan terlihat kokoh.</p>
                   <p>🔍 Tidak ditemukan noda permanen atau sobekan pada bagian lengan dan kerah.</p>
                   {isAiExpanded && (
                     <div className={styles.aiFullContent}>
                        <p>⚠️ Barang terlihat sedikit kusut, disarankan untuk disetrika sebelum difoto ulang atau dikirim.</p>
                        <p>📊 <strong>Kualitas Material:</strong> Katun 100% (High Grade)</p>
                        <p>✨ <strong>Rekomendasi Foto:</strong> Gunakan latar belakang polos agar detail kancing lebih terlihat jelas.</p>
                        <br/>
                        <span className={styles.aiBold}>Rekomendasi Harga:</span><br/>
                        • Kondisi Baik: <span className={styles.aiBold}>Rp65k – Rp85k</span><br/>
                        • Kondisi Sangat Baik: <span className={styles.aiBold}>Rp85k – Rp100k</span>
                     </div>
                   )}
                </div>
              </div>
              <button className={styles.submitButton}>Mulai Jual Sekarang</button>
            </aside>
          </div>
        )}
      </main>

      {showCalendar && (
        <div className={styles.modalOverlay}>
          <div className={styles.calendarModal}>
            <div className={styles.modalHeader}>
               <h3 className={styles.modalTitle}>Pilih Rentang Tanggal</h3>
               <button className={styles.navBtn} onClick={() => setShowCalendar(false)}><X size={24} /></button>
            </div>
            <div className={styles.monthNav}>
              <button className={styles.navBtn} onClick={() => changeMonth(-1)}><ChevronLeft size={20} /></button>
              <span className={styles.monthLabel}>{months[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
              <button className={styles.navBtn} onClick={() => changeMonth(1)}><ChevronRight size={20} /></button>
            </div>
            <div className={styles.daysGrid}>
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => <div key={d} className={styles.weekdayLabel}>{d}</div>)}
              {Array.from({length: 30}, (_, i) => i + 1).map(day => (
                <div 
                  key={day} 
                  className={`${styles.dayCell} ${day === rangeStart || day === rangeEnd ? styles.dayActive : ''} ${rangeStart && rangeEnd && day > rangeStart && day < rangeEnd ? styles.dayInRange : ''}`}
                  onClick={() => handleDayClick(day)}
                >{day}</div>
              ))}
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setShowCalendar(false)}>Batal</button>
              <button className={styles.applyBtn} onClick={() => setShowCalendar(false)}>Terapkan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
