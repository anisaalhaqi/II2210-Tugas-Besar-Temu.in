'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  Star, 
  Edit3, 
  Share2, 
  Search, 
  ChevronDown, 
  Heart,
  TrendingUp,
  MoreHorizontal,
  MoreVertical,
  Loader2,
  Inbox,
  X,
  BadgeCheck,
  Check,
  ListChecks
} from 'lucide-react';
import styles from './profile.module.css';
import { supabase } from '@/lib/supabase';

interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
  campus_location: string;
  rating_avg: number;
  rating_count: number;
  created_at: string;
  bio: string;
  phone?: string;
  email?: string;
  is_verified?: boolean;
}

interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];
  status: string;
  categories: {
    name: string;
  };
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [inventory, setInventory] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Edit Profile States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: '',
    phone: '',
    email: '',
    campus_location: '',
    bio: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Bulk Edit States
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isBulkEditMode, setIsBulkEditMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isBulkStatusModalOpen, setIsBulkStatusModalOpen] = useState(false);
  const [bulkStatusValue, setBulkStatusValue] = useState<string>('available');

  // Filter States
  const [localQuery, setLocalQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<'Semua' | 'Tersedia' | 'Tidak Tersedia'>('Semua');
  const [categoryFilter, setCategoryFilter] = useState<string>('Semua');
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [openDropdown, setOpenDropdown] = useState<'availability' | 'category' | null>(null);

  useEffect(() => {
    async function fetchProfileData() {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          window.location.href = '/auth';
          return;
        }
        
        // 1. Fetch Profile
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        
        const loadedProfile = profileData as any;
        setProfile(loadedProfile);
        
        // Pre-fill form
        setEditForm({
          full_name: loadedProfile.full_name || '',
          phone: loadedProfile.phone || '', // Might not exist in DB yet, but preparing it
          email: user.email || '',
          campus_location: loadedProfile.campus_location || '',
          bio: loadedProfile.bio || ''
        });

        // 2. Fetch Products with Category
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select(`
            id, title, price, images, status,
            categories:category_id (name)
          `)
          .eq('seller_id', user.id);

        if (productsError) throw productsError;
        setInventory(productsData as any || []);

        // 3. Fetch All Categories for filter
        const { data: catData } = await supabase
          .from('categories')
          .select('name')
          .order('name');
        if (catData) setAllCategories(catData.map(c => c.name));

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfileData();
  }, []);

  const handleShareProfile = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Profil ${profile?.full_name} di Temu.in`,
          url: url
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert('Tautan profil disalin ke clipboard!');
    }
  };

  const handleSaveProfile = async () => {
    try {
      if (!profile) return;
      const { error } = await supabase
        .from('users')
        .update({
          full_name: editForm.full_name,
          campus_location: editForm.campus_location,
          bio: editForm.bio,
          // phone: editForm.phone // Assuming phone column exists or will exist
        })
        .eq('id', profile.id);

      if (error) throw error;

      setProfile({
        ...profile,
        full_name: editForm.full_name,
        campus_location: editForm.campus_location,
        bio: editForm.bio,
        phone: editForm.phone,
      });

      setIsEditModalOpen(false);
      alert('Profil berhasil diperbarui!');
    } catch (err) {
      console.error(err);
      alert('Gagal memperbarui profil.');
    }
  };

  const handleKtmUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleKtmFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      alert('KTM berhasil diunggah! Menunggu verifikasi dari admin (Simulasi).');
    }
  };

  const handleSsoClick = () => {
    alert('Fitur SSO ITB sedang dikembangkan.');
  };

  const toggleSelection = (itemId: string) => {
    setSelectedItems(prev => prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]);
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;
    if (!confirm(`Apakah Anda yakin ingin menghapus ${selectedItems.length} barang terpilih? (Peringatan: Pesanan yang terkait juga akan dihapus)`)) return;

    try {
      setLoading(true);

      // Delete associated orders first to bypass the ON DELETE RESTRICT constraint
      await supabase.from('orders').delete().in('product_id', selectedItems);

      // Now delete the products
      const { error } = await supabase.from('products').delete().in('id', selectedItems);
      
      if (error) throw error;
      
      setInventory(prev => prev.filter(i => !selectedItems.includes(i.id)));
      setSelectedItems([]);
      setIsBulkEditMode(false);
      alert('Barang berhasil dihapus.');
    } catch (err: any) {
      console.error('Error deleting products:', err);
      alert(err.message || 'Gagal menghapus barang.');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkStatusChange = async () => {
    if (selectedItems.length === 0) return;
    
    try {
      setLoading(true);
      const { error } = await supabase
        .from('products')
        .update({ status: bulkStatusValue })
        .in('id', selectedItems);

      if (error) throw error;

      setInventory(prev => prev.map(i => selectedItems.includes(i.id) ? { ...i, status: bulkStatusValue } : i));
      setSelectedItems([]);
      setIsBulkStatusModalOpen(false);
      setIsBulkEditMode(false);
      alert('Status barang berhasil diubah.');
    } catch (err) {
      alert('Gagal mengubah status barang.');
    } finally {
      setLoading(false);
    }
  };

  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      const matchesQuery = item.title.toLowerCase().includes(localQuery.toLowerCase());
      
      let matchesAvailability = true;
      if (availabilityFilter === 'Tersedia') {
        matchesAvailability = item.status === 'available';
      } else if (availabilityFilter === 'Tidak Tersedia') {
        matchesAvailability = item.status !== 'available';
      }
      
      let matchesCategory = true;
      if (categoryFilter !== 'Semua') {
        matchesCategory = item.categories?.name === categoryFilter;
      }
      
      return matchesQuery && matchesAvailability && matchesCategory;
    });
  }, [localQuery, availabilityFilter, categoryFilter, inventory]);

  const toggleDropdown = (type: 'availability' | 'category') => {
    setOpenDropdown(openDropdown === type ? null : type);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getJoinDuration = (dateStr: string) => {
    if (!dateStr) return '-';
    const start = new Date(dateStr);
    const now = new Date();
    
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} hari`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} bulan`;
    return `${Math.floor(diffDays / 365)} tahun`;
  };

  if (loading) {
    return (
      <div className={styles.container} style={{ justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loader2 className="animate-spin" size={48} color="#008585" />
        <p style={{ marginTop: '16px', color: '#767676', fontWeight: '600' }}>Memuat profil...</p>
      </div>
    );
  }

  if (!profile) return <div className={styles.container}>Profil tidak ditemukan.</div>;

  return (
    <div className={styles.container}>
      <div className={styles.banner}></div>

      <main className={styles.content}>
        <section className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <div className={styles.mainInfo}>
              <img src={profile.avatar_url || 'https://placehold.co/100x100?text=User'} alt={profile.full_name} className={styles.avatar} />
              <div className={styles.nameSection}>
                <h1>{profile.full_name}</h1>
                <div className={styles.locationInfo}>
                  <MapPin size={16} />
                  <span>{profile.campus_location}</span>
                </div>
              </div>
            </div>

            <div className={styles.statsSection}>
              <Link href={`/reviews/${profile.id}`} className={styles.statItem} style={{ textDecoration: 'none', cursor: 'pointer' }}>
                <div className={styles.statValue}>
                  <span>{profile.rating_avg?.toFixed(1) || '0.0'}</span>
                  <Star size={16} fill="#008585" color="#008585" />
                </div>
                <span className={styles.statLabel}>{profile.rating_count || 0} reviews</span>
              </Link>
              <div className={styles.divider}></div>
              <div className={styles.statItem}>
                <div className={styles.statValue}>{getJoinDuration(profile.created_at)}</div>
                <span className={styles.statLabel}>di Temu.in</span>
              </div>
            </div>

            <div className={styles.actionRow}>
              <button className={styles.editBtn} onClick={() => setIsEditModalOpen(true)}>
                <Edit3 size={18} />
                Edit profil
              </button>
              <button className={styles.iconBtn} aria-label="Share" onClick={handleShareProfile}>
                <Share2 size={18} />
              </button>
              <div className={styles.moreDropdownWrapper}>
                <button className={styles.iconBtn} aria-label="More" onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}>
                  <MoreVertical size={18} />
                </button>
                {isMoreMenuOpen && (
                  <div className={styles.moreMenuDropdown}>
                    <div 
                      className={styles.moreMenuItem} 
                      onClick={() => { 
                        setIsBulkEditMode(true); 
                        setIsMoreMenuOpen(false); 
                        setSelectedItems([]);
                      }}
                    >
                      Edit Barang Massal
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.bioSection}>
            <p className={styles.bioText}>
              {profile.bio || 'Belum ada bio.'}
            </p>
          </div>
        </section>

        <section className={styles.insightsCard}>
          <div className={styles.insightIconBox}>
            <TrendingUp size={24} />
          </div>
          <div className={styles.insightText}>
            <h3 className={styles.insightTitle}>Tidak ada kunjungan profil hari ini</h3>
            <p className={styles.insightSub}>Tambahkan item untuk menarik pengunjung</p>
          </div>
          <MoreHorizontal size={20} color="#767676" />
        </section>

        <section className={styles.inventorySection}>
          <div className={styles.inventoryHeader}>
            <h2 className={styles.inventoryTitle}>{filteredInventory.length} barang</h2>
            <div className={styles.searchFilterRow}>
              <div className={styles.searchBox}>
                <Search size={18} color="#A5A5A5" />
                <input 
                  type="text" 
                  placeholder="Cari barang" 
                  className={styles.searchInput} 
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                />
              </div>
              <div className={styles.filterGroup}>
                <div 
                  className={`${styles.filterChip} ${availabilityFilter === 'Semua' && categoryFilter === 'Semua' ? styles.filterChipActive : styles.filterChipInactive}`}
                  onClick={() => { setAvailabilityFilter('Semua'); setCategoryFilter('Semua'); setOpenDropdown(null); }}
                >
                  Semua
                </div>

                <div className={styles.filterWrapper}>
                  <div 
                    className={`${styles.filterChip} ${availabilityFilter !== 'Semua' ? styles.filterChipActive : styles.filterChipInactive}`}
                    onClick={() => toggleDropdown('availability')}
                  >
                    {availabilityFilter === 'Semua' ? 'Ketersediaan' : availabilityFilter}
                    <ChevronDown size={16} style={{ transform: openDropdown === 'availability' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </div>
                  {openDropdown === 'availability' && (
                    <div className={styles.dropdownMenu}>
                      <div className={`${styles.dropdownItem} ${availabilityFilter === 'Semua' ? styles.dropdownItemActive : ''}`} onClick={() => { setAvailabilityFilter('Semua'); setOpenDropdown(null); }}>Semua</div>
                      <div className={`${styles.dropdownItem} ${availabilityFilter === 'Tersedia' ? styles.dropdownItemActive : ''}`} onClick={() => { setAvailabilityFilter('Tersedia'); setOpenDropdown(null); }}>Tersedia</div>
                      <div className={`${styles.dropdownItem} ${availabilityFilter === 'Tidak Tersedia' ? styles.dropdownItemActive : ''}`} onClick={() => { setAvailabilityFilter('Tidak Tersedia'); setOpenDropdown(null); }}>Tidak Tersedia</div>
                    </div>
                  )}
                </div>

                <div className={styles.filterWrapper}>
                  <div 
                    className={`${styles.filterChip} ${categoryFilter !== 'Semua' ? styles.filterChipActive : styles.filterChipInactive}`}
                    onClick={() => toggleDropdown('category')}
                  >
                    {categoryFilter === 'Semua' ? 'Kategori' : categoryFilter}
                    <ChevronDown size={16} style={{ transform: openDropdown === 'category' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </div>
                  {openDropdown === 'category' && (
                    <div className={styles.dropdownMenu}>
                      <div className={`${styles.dropdownItem} ${categoryFilter === 'Semua' ? styles.dropdownItemActive : ''}`} onClick={() => { setCategoryFilter('Semua'); setOpenDropdown(null); }}>Semua Kategori</div>
                      {allCategories.map(cat => (
                        <div key={cat} className={`${styles.dropdownItem} ${categoryFilter === cat ? styles.dropdownItemActive : ''}`} onClick={() => { setCategoryFilter(cat); setOpenDropdown(null); }}>{cat}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.productGrid}>
            {filteredInventory.length > 0 ? (
              filteredInventory.map((item) => {
                const isSelected = selectedItems.includes(item.id);
                
                const cardContent = (
                  <>
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>
                      <img src={item.images[0] || 'https://placehold.co/300x300'} alt={item.title} className={styles.productImg} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {item.status !== 'available' && (
                        <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
                          {item.status.toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className={styles.productInfo}>
                      <div className={styles.productTitleRow}>
                        <h3 className={styles.productTitle}>{item.title}</h3>
                        <Heart size={20} className={styles.favIcon} />
                      </div>
                      <div className={styles.productPriceRow}>
                        <span className={styles.productPrice}>{formatPrice(item.price)}</span>
                        <MoreVertical size={18} className={styles.moreBtn} />
                      </div>
                    </div>

                    {isBulkEditMode && (
                      <div className={`${styles.checkboxOverlay} ${isSelected ? styles.checkboxOverlayChecked : ''}`}>
                        {isSelected && <Check size={16} color="white" strokeWidth={3} />}
                      </div>
                    )}
                  </>
                );

                if (isBulkEditMode) {
                  return (
                    <div 
                      key={item.id} 
                      className={`${styles.productCardSelectable} ${isSelected ? styles.productCardSelected : ''}`}
                      onClick={() => toggleSelection(item.id)}
                    >
                      {cardContent}
                    </div>
                  );
                }

                return (
                  <Link href={`/product/${item.id}`} key={item.id} className={styles.productCard}>
                    {cardContent}
                  </Link>
                );
              })
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIconBox}>
                  <Inbox size={64} strokeWidth={1} color="#A5A5A5" />
                </div>
                <h3 className={styles.emptyTitle}>Tidak ada barang ditemukan</h3>
                <p className={styles.emptySub}>Coba ubah kata kunci atau filter untuk menemukan barang Anda.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Bulk Action Bar */}
      {isBulkEditMode && (
        <div className={styles.bulkActionBar}>
          <span className={styles.bulkActionInfo}>{selectedItems.length} barang terpilih</span>
          <button 
            className={styles.bulkActionPrimaryBtn} 
            disabled={selectedItems.length === 0}
            style={{ opacity: selectedItems.length === 0 ? 0.5 : 1 }}
            onClick={() => setIsBulkStatusModalOpen(true)}
          >
            Ubah Status
          </button>
          <button 
            className={styles.bulkActionDangerBtn}
            disabled={selectedItems.length === 0}
            style={{ opacity: selectedItems.length === 0 ? 0.5 : 1 }}
            onClick={handleBulkDelete}
          >
            Hapus
          </button>
          <div style={{ width: '1px', height: '24px', background: '#E6E6E6', margin: '0 8px' }}></div>
          <button 
            className={styles.bulkActionBtn}
            onClick={() => { setIsBulkEditMode(false); setSelectedItems([]); }}
          >
            Selesai
          </button>
        </div>
      )}

      {/* Bulk Status Modal */}
      {isBulkStatusModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{ width: '400px' }}>
            <div className={styles.modalHeader}>
              <button className={styles.closeBtn} onClick={() => setIsBulkStatusModalOpen(false)}>
                <X size={24} color="#292929" />
              </button>
              <h2 className={styles.modalTitle} style={{ fontSize: '20px' }}>Ubah Status {selectedItems.length} Barang</h2>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.reportOptions}>
                {[
                  { label: 'Tersedia (Available)', value: 'available' },
                  { label: 'Dipesan (Reserved)', value: 'reserved' },
                  { label: 'Terjual (Sold)', value: 'sold' }
                ].map((statusOption) => (
                  <div key={statusOption.value} className={styles.radioItem} onClick={() => setBulkStatusValue(statusOption.value)}>
                    <input 
                      type="radio" 
                      name="bulkStatus" 
                      checked={bulkStatusValue === statusOption.value}
                      onChange={() => setBulkStatusValue(statusOption.value)}
                    />
                    <span className={styles.radioLabel}>{statusOption.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.saveBtn} onClick={handleBulkStatusChange}>Terapkan Status</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <button className={styles.closeBtn} onClick={() => setIsEditModalOpen(false)}>
                <X size={24} color="#292929" />
              </button>
              <h2 className={styles.modalTitle}>Edit Profil</h2>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.avatarEditSection}>
                <img 
                  src={profile.avatar_url || 'https://placehold.co/106x106'} 
                  alt="Profile" 
                  className={styles.avatarEdit} 
                  onClick={() => document.getElementById('avatarUpload')?.click()}
                  style={{ cursor: 'pointer' }}
                />
                <span 
                  className={styles.changePhotoText}
                  onClick={() => document.getElementById('avatarUpload')?.click()}
                >
                  Ubah foto profil
                </span>
                <input 
                  type="file" 
                  id="avatarUpload" 
                  accept="image/*" 
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = async () => {
                        const base64String = reader.result as string;
                        
                        // Update local state immediately for preview
                        setProfile(prev => prev ? { ...prev, avatar_url: base64String } : null);
                        
                        // We also need to update the database
                        try {
                          const { data: { user } } = await supabase.auth.getUser();
                          if (user) {
                             const { error } = await supabase
                              .from('users')
                              .update({ avatar_url: base64String })
                              .eq('id', user.id);
                             if (error) throw error;
                          }
                        } catch (err) {
                          console.error("Failed to upload avatar", err);
                          alert("Gagal menyimpan foto profil baru.");
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Nama</label>
                <input 
                  type="text" 
                  className={styles.inputField} 
                  value={editForm.full_name} 
                  onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                  placeholder="Masukkan nama"
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Nomor Telepon</label>
                <input 
                  type="tel" 
                  className={styles.inputField} 
                  value={editForm.phone} 
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                  placeholder="Masukkan nomor telepon"
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Email</label>
                <input 
                  type="email" 
                  className={styles.inputField} 
                  value={editForm.email} 
                  disabled // typically email is linked to auth and hard to change directly here
                  style={{ backgroundColor: '#F0F0F0', cursor: 'not-allowed' }}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Multikampus</label>
                <div className={styles.radioGroupRow}>
                  {['ITB Ganesha', 'ITB Jatinangor', 'ITB Cirebon'].map((campus) => (
                    <label key={campus} className={styles.radioLabelOption}>
                      <input 
                        type="radio" 
                        name="campus_location" 
                        value={campus}
                        checked={editForm.campus_location === campus}
                        onChange={(e) => setEditForm({...editForm, campus_location: e.target.value})}
                        className={styles.radioInput}
                      />
                      <span>{campus}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Bio</label>
                <textarea 
                  className={styles.textAreaField} 
                  value={editForm.bio} 
                  onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                  placeholder="Masukkan biomu"
                />
              </div>

              {/* Verification Section */}
              <div className={styles.verificationSection}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span className={styles.verificationTitle}>Verifikasi Mahasiswa</span>
                    <span className={styles.verificationDesc}>Dapatkan badge pengguna terpercaya</span>
                  </div>
                  {profile.is_verified ? (
                    <span className={styles.trustBadge}>
                      <BadgeCheck size={14} /> Terverifikasi
                    </span>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        ref={fileInputRef} 
                        style={{ display: 'none' }} 
                        onChange={handleKtmFileChange}
                      />
                      <button className={styles.uploadKtmBtn} onClick={handleKtmUploadClick}>
                        Unggah KTM
                      </button>
                      <button className={styles.ssoBtn} onClick={handleSsoClick}>
                        SSO ITB
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.saveBtn} onClick={handleSaveProfile}>Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
