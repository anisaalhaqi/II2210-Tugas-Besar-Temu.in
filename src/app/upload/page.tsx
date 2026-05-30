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
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import MapPicker from '@/components/Map/MapPicker';
import MapDisplay from '@/components/Map/MapDisplay';

type Step = 'category' | 'detail';

const campusCoords: Record<string, [number, number]> = {
  'ITB Ganesha': [-6.8909, 107.6104],
  'ITB Jatinangor': [-6.9281, 107.7705],
  'ITB Cirebon': [-6.6455, 108.4071],
};

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [step, setStep] = useState<Step>('category');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [originality, setOriginality] = useState<'original' | 'non-original'>('original');
  const [isAiExpanded, setIsAiExpanded] = useState(false);
  
  // Image Upload State
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [showPhotoWarning, setShowPhotoPhotoWarning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  const [usageStartMonth, setUsageStartMonth] = useState('Januari');
  const [usageStartYear, setUsageStartYear] = useState('2024');
  const [usageEndMonth, setUsageEndMonth] = useState('Juli');
  const [usageEndYear, setUsageEndYear] = useState('2025');
  const [codLocation, setCodLocation] = useState('ITB Ganesha');
  const [selectedCoords, setSelectedCoords] = useState<[number, number]>(campusCoords['ITB Ganesha']);
  const [showMapModal, setShowMapModal] = useState(false);
  const [isLocationMarked, setIsLocationMarked] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [rangeStart, setRangeStart] = useState<Date | null>(new Date());
  const [rangeEnd, setRangeEnd] = useState<Date | null>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d;
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isDateDisabled = (day: number) => {
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return checkDate < today;
  };

  const JAE_HWAN_ID = '00000000-0000-0000-0000-000000000001';

  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const years = ['2021', '2022', '2023', '2024', '2025', '2026', '2027'];
  const campusLocations = ['ITB Ganesha', 'ITB Jatinangor', 'ITB Cirebon'];

  const formattedRange = useMemo(() => {
    if (!rangeStart) return 'Pilih Tanggal';
    
    const formatDate = (date: Date) => {
      return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    };

    if (!rangeEnd) return formatDate(rangeStart);
    
    // If same month and year
    if (rangeStart.getMonth() === rangeEnd.getMonth() && rangeStart.getFullYear() === rangeEnd.getFullYear()) {
      return `${rangeStart.getDate()} - ${rangeEnd.getDate()} ${months[rangeStart.getMonth()]} ${rangeStart.getFullYear()}`;
    }
    
    // Different months
    return `${rangeStart.getDate()} ${months[rangeStart.getMonth()]} - ${rangeEnd.getDate()} ${months[rangeEnd.getMonth()]} ${rangeEnd.getFullYear()}`;
  }, [rangeStart, rangeEnd, months]);

  const handleDayClick = (day: number) => {
    if (isDateDisabled(day)) return;

    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(clickedDate);
      setRangeEnd(null);
    } else if (clickedDate > rangeStart) {
      setRangeEnd(clickedDate);
    } else {
      setRangeStart(clickedDate);
      setRangeEnd(null);
    }
  };

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    setCurrentDate(newDate);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setStep('detail');
  };

  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const handleCodLocationChange = (loc: string) => {
    setCodLocation(loc);
    if (campusCoords[loc]) {
      setSelectedCoords(campusCoords[loc]);
      setIsLocationMarked(false); // Reset status saat ganti kampus
      setLocationError(null);
    }
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    const campusCenter = campusCoords[codLocation];
    const distance = getDistance(lat, lng, campusCenter[0], campusCenter[1]);
    
    if (distance > 0.4) { // Optimal 0.4km (400 meters)
      setLocationError(`Lokasi terlalu jauh dari area ${codLocation}. Silakan pilih titik di dalam area kampus.`);
    } else {
      setLocationError(null);
    }
    setSelectedCoords([lat, lng]);
  };

  const confirmLocation = () => {
    if (locationError) return;
    setIsLocationMarked(true);
    setShowMapModal(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const remainingSlots = 4 - imageFiles.length;
      if (files.length > remainingSlots) {
        setShowPhotoPhotoWarning(true);
        setTimeout(() => setShowPhotoPhotoWarning(false), 5000);
      }
      
      const newFiles = Array.from(files).slice(0, remainingSlots);
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      
      setImageFiles([...imageFiles, ...newFiles]);
      setImagePreviews([...imagePreviews, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // 1. Upload Images to Supabase Storage
      const uploadedImageUrls: string[] = [];
      
      for (const file of imageFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${JAE_HWAN_ID}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);
        
        uploadedImageUrls.push(publicUrl);
      }

      // 2. Insert into Database
      const usage_period = `${usageStartMonth} ${usageStartYear} - ${usageEndMonth} ${usageEndYear}`;
      const numericPrice = parseInt(price.replace(/[^0-9]/g, '')) || 0;

      const { error } = await supabase
        .from('products')
        .insert([{
          seller_id: JAE_HWAN_ID,
          title: title,
          price: numericPrice,
          location: codLocation,
          description: description,
          category: selectedCategory,
          originality: originality,
          usage_period: usage_period,
          delivery_dates: formattedRange, // New column
          images: uploadedImageUrls.length > 0 ? uploadedImageUrls : ['https://placehold.co/600x600'],
          ai_analysis: {
            color: "Putih",
            condition: "Baik",
            recommendation: "Rp65k - Rp85k"
          }
        }]);

      if (error) throw error;
      
      router.push('/'); // Success redirect
    } catch (err) {
      console.error('Error uploading product:', err);
      alert('Gagal mengunggah barang. Pastikan bucket "product-images" sudah dibuat di Supabase.');
    } finally {
      setIsSubmitting(false);
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

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => step === 'detail' ? setStep('category') : router.back()} className={styles.backButton}>
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
                  {imagePreviews.map((src, idx) => (
                    <div key={idx} className={styles.photoImageWrapper}>
                      <img src={src} alt="Upload" className={styles.photoImage} />
                      <button onClick={() => removeImage(idx)} style={{ position: 'absolute', top: -8, right: -8, background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {imagePreviews.length < 4 && (
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
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Contoh: Jas Lab Kimia Ukuran M" className={styles.input} />
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
                  <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Masukkan harga" className={styles.input} style={{ paddingLeft: '45px' }} />
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
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ceritakan kondisi barangmu lebih detail..." className={`${styles.input} ${styles.textarea}`}></textarea>
              </div>

              <section>
                <h3 className={styles.sectionTitle}>Metode Pengambilan</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Tentukan rentang tanggal pengiriman yang Anda bersedia</label>
                    <div className={styles.inputWrapper} style={{ cursor: 'pointer' }} onClick={() => setShowCalendar(true)}>
                      <div className={styles.input}>{formattedRange}</div>
                      <Calendar size={20} className={styles.inputIcon} color="#008585" />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Lokasi Ketemuan (COD)</label>
                    <CustomDropdown id="cod" value={codLocation} options={campusLocations} onSelect={handleCodLocationChange} />
                    
                    {!isLocationMarked ? (
                      <button 
                        type="button"
                        className={styles.mapMarkerBtn} 
                        onClick={() => setShowMapModal(true)}
                      >
                        <MapPin size={18} />
                        Tandai Titik Akurat di Peta
                      </button>
                    ) : (
                      <div className={styles.mapPreviewContainer}>
                        <div className={styles.mapPreviewHeader}>
                          <div className={styles.mapPreviewTitle}>
                            <MapPin size={16} color="#008585" />
                            <span>Titik Lokasi Ditandai</span>
                          </div>
                          <button 
                            type="button" 
                            className={styles.changeLocationBtn}
                            onClick={() => setShowMapModal(true)}
                          >
                            Ubah Lokasi
                          </button>
                        </div>
                        <div className={styles.mapPreviewBody}>
                          <MapDisplay 
                            center={selectedCoords} 
                            markerPosition={selectedCoords} 
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>
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
                   {isAiExpanded && (
                     <div className={styles.aiFullContent}>
                        <p>⚠️ Barang mungkin sedikit kusut karena penyimpanan.</p>
                        <p>📊 <strong>Kualitas Material:</strong> High Grade (Sangat Awet)</p>
                        <br/>
                        <span className={styles.aiBold}>Rekomendasi Harga:</span><br/>
                        • Kondisi Baik: <span className={styles.aiBold}>Rp65k – Rp85k</span>
                     </div>
                   )}
                </div>
              </div>
              <button 
                className={`${styles.submitButton} ${isSubmitting ? styles.btnDisabled : ''}`}
                onClick={handleFormSubmit}
                disabled={isSubmitting || !title || !price || !selectedCategory}
              >
                {isSubmitting ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Mengunggah...</span>
                  </div>
                ) : 'Mulai Jual Sekarang'}
              </button>
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
              {Array.from({length: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()}, (_, i) => i + 1).map(day => {
                const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                
                const isStart = rangeStart && checkDate.getTime() === rangeStart.getTime();
                const isEnd = rangeEnd && checkDate.getTime() === rangeEnd.getTime();
                const isInRange = rangeStart && rangeEnd && checkDate > rangeStart && checkDate < rangeEnd;
                const isDisabled = isDateDisabled(day);

                return (
                  <div 
                    key={day} 
                    className={`${styles.dayCell} ${isStart || isEnd ? styles.dayActive : ''} ${isInRange ? styles.dayInRange : ''} ${isDisabled ? styles.dayDisabled : ''}`}
                    onClick={() => handleDayClick(day)}
                  >{day}</div>
                );
              })}
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.modalBtn} style={{ border: '1px solid #d1d5db', background: 'white', color: '#767676' }} onClick={() => setShowCalendar(false)}>Batal</button>
              <button className={styles.modalBtn} style={{ border: 'none', background: '#008585', color: 'white' }} onClick={() => setShowCalendar(false)}>Terapkan</button>
            </div>
          </div>
        </div>
      )}

      {showMapModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.mapModal}>
            <div className={styles.modalHeader}>
               <h3 className={styles.modalTitle}>Tandai Titik COD</h3>
               <button className={styles.navBtn} onClick={() => setShowMapModal(false)}><X size={24} /></button>
            </div>
            <div style={{ height: '300px', marginBottom: '12px' }}>
              <MapPicker 
                center={selectedCoords} 
                markerPosition={selectedCoords}
                onLocationSelect={handleLocationSelect}
              />
            </div>
            
            {locationError && (
              <div style={{ color: '#ef4444', fontSize: '13px', marginBottom: '16px', display: 'flex', gap: '6px', alignItems: 'flex-start', background: '#fef2f2', padding: '10px', borderRadius: '8px', border: '1px solid #fca5a5' }}>
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{locationError}</span>
              </div>
            )}

            <div className={styles.modalFooter}>
              <button className={styles.modalBtn} style={{ border: '1px solid #d1d5db', background: 'white', color: '#767676' }} onClick={() => setShowMapModal(false)}>Batal</button>
              <button 
                className={styles.modalBtn} 
                style={{ 
                  border: 'none', 
                  background: locationError ? '#d1d5db' : '#008585', 
                  color: 'white',
                  cursor: locationError ? 'not-allowed' : 'pointer'
                }} 
                onClick={confirmLocation}
                disabled={!!locationError}
              >
                Gunakan Lokasi Ini
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
