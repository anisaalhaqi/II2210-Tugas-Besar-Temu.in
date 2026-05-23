'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import styles from './chat-detail.module.css';
import { 
  ArrowLeft, 
  Send, 
  Plus, 
  MapPin, 
  Star, 
  CheckCircle2, 
  MoreVertical,
  X
} from 'lucide-react';

interface ChatMessage {
  id: number;
  type: 'text' | 'offer-me' | 'offer-them' | 'image';
  content?: string;
  sender: 'me' | 'them';
  title?: string;
  label?: string;
  price?: string;
  images?: string[];
  status?: 'pending' | 'accepted' | 'rejected';
}

export default function ChatDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [pendingImages, setPendingImages] = useState<string[]>([]);
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFull, setIsFull] = useState(false);

  // Counter Modal State
  const [showCounterModal, setShowCounterModal] = useState(false);
  const [counterPrice, setCounterPrice] = useState('31.000');
  const [modalMode, setModalTab] = useState<'counter' | 'reject'>('counter');

  const chatData = {
    user: 'Jessica',
    avatar: 'https://placehold.co/75x75',
    lastActive: '10 jam yang lalu',
    location: 'Ganesha',
    rating: '5.0',
    totalRatings: 5,
    product: {
      title: 'Jas Laboratorium TPB',
      price: 'Rp32.000',
      img: 'https://placehold.co/125x125'
    }
  };

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { id: 1, type: 'text', content: 'Halo kak, jas labnya masih ada?', sender: 'me' },
    { id: 2, type: 'text', content: 'Masih ada kak, minat?', sender: 'them' },
    { id: 3, type: 'offer-me', title: 'Jas Laboratorium TPB', label: 'Tawaranmu', price: 'Rp30.000', sender: 'me', status: 'pending' },
    { id: 4, type: 'text', content: 'Wah, boleh naik dikit gak kak? 31rb deh bungkus.', sender: 'them' },
    { id: 5, type: 'offer-them', title: 'Jas Laboratorium TPB', label: 'Tawaran Penjual', price: 'Rp31.000', sender: 'them', status: 'pending' },
  ]);

  const handleSend = () => {
    if (!message && pendingImages.length === 0) return;
    const newMessages: ChatMessage[] = [];
    if (pendingImages.length > 0) {
      newMessages.push({ id: Date.now(), type: 'image', sender: 'me', images: [...pendingImages] });
      setPendingImages([]);
    }
    if (message.trim()) {
      newMessages.push({ id: Date.now() + 1, type: 'text', content: message, sender: 'me' });
      setMessage('');
    }
    setChatHistory([...chatHistory, ...newMessages]);
  };

  const updateOfferStatus = (msgId: number, newStatus: 'accepted' | 'rejected') => {
    setChatHistory(chatHistory.map(msg => 
      msg.id === msgId ? { ...msg, status: newStatus } : msg
    ));
  };

  const handleApplyCounter = () => {
    const newOffer: ChatMessage = {
      id: Date.now(),
      type: 'offer-me',
      title: 'Jas Laboratorium TPB',
      label: 'Tawaranmu',
      price: `Rp${counterPrice}`,
      sender: 'me',
      status: 'pending'
    };
    setChatHistory([...chatHistory, newOffer]);
    setShowCounterModal(false);
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatHistory]);

  useEffect(() => {
    const checkOverflow = () => {
      if (chatBodyRef.current) {
        const hasOverflow = chatBodyRef.current.scrollHeight > chatBodyRef.current.clientHeight;
        setIsFull(hasOverflow);
      }
    };
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [chatHistory]);

  return (
    <div className={styles.container}>
      <header className={styles.chatHeader}>
        <div className={styles.headerLeft}>
          <button className={styles.backBtn} onClick={() => router.back()}><ArrowLeft size={24} /></button>
          <img src={chatData.avatar} alt="" className={styles.opponentAvatar} />
          <div className={styles.opponentInfo}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className={styles.opponentName}>{chatData.user}</span>
              <CheckCircle2 size={16} className={styles.verifiedBadge} fill="#2563EB" color="white" />
            </div>
            <span className={styles.lastSeen}>{chatData.lastActive}</span>
          </div>
        </div>
        <button className={styles.backBtn}><MoreVertical size={20} /></button>
      </header>

      <div className={styles.chatBody} ref={chatBodyRef}>
        <div className={styles.timeDivider}>1 hari yang lalu</div>

        {chatHistory.map((msg) => (
          <div key={msg.id} className={`${styles.messageRow} ${msg.sender === 'me' ? styles.senderRow : styles.recipientRow}`}>
            {msg.type.startsWith('offer') ? (
              <div className={styles.offerCard}>
                <div className={styles.offerProduct}>
                  <img src={chatData.product.img} alt="" className={styles.productThumb} />
                  <div className={styles.offerDetails}>
                    <p className={styles.productNameSmall}>{msg.title}</p>
                    <h4 className={styles.offerLabel}>{msg.label}</h4>
                    <p className={styles.offerPrice}>{msg.price}</p>
                  </div>
                </div>
                {msg.sender === 'them' && msg.status === 'pending' && (
                  <div className={styles.offerActions}>
                    <button className={`${styles.btnOffer} ${styles.btnTerima}`} onClick={() => updateOfferStatus(msg.id, 'accepted')}>
                      Terima
                    </button>
                    <div className={styles.offerActionsRow}>
                      <button className={`${styles.btnOffer} ${styles.btnTolak}`} onClick={() => updateOfferStatus(msg.id, 'rejected')}>
                        Tolak
                      </button>
                      <button className={`${styles.btnOffer} ${styles.btnTawar}`} onClick={() => setShowCounterModal(true)}>
                        Tawar Balik
                      </button>
                    </div>
                  </div>
                )}
                {msg.status === 'accepted' && (
                  <div className={`${styles.statusBadge} ${styles.statusAccepted}`}>Tawaran diterima</div>
                )}
                {msg.status === 'rejected' && (
                  <div className={`${styles.statusBadge} ${styles.statusRejected}`}>Tawaran ditolak</div>
                )}
              </div>
            ) : msg.type === 'image' ? (
              <div className={styles.imageBubble}>
                {msg.images?.map((src, i) => <img key={i} src={src} alt="Sent" className={styles.sentImage} />)}
              </div>
            ) : (
              <div className={`${styles.bubble} ${msg.sender === 'me' ? styles.senderBubble : styles.recipientBubble}`}>
                {msg.content}
              </div>
            )}
          </div>
        ))}

        {!isFull && (
          <div className={styles.bottomOpponentCard}>
            <img src={chatData.avatar} alt="" className={styles.cardAvatar} />
            <div className={styles.cardContent}>
              <div className={styles.cardNameRow}>
                <span className={styles.opponentName}>{chatData.user}</span>
                <CheckCircle2 size={18} className={styles.verifiedBadge} fill="#2563EB" color="white" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#434343', marginBottom: '4px' }}>
                <MapPin size={14} /><span style={{ fontSize: '14px' }}>{chatData.location}</span>
              </div>
              <div className={styles.cardStats}>
                <div className={styles.ratingRow}>
                  <span>{chatData.rating}</span>
                  <div className={styles.stars}>{[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}</div>
                </div>
                <span>/5 ratings</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.inputSection}>
        {pendingImages.length > 0 && (
          <div className={styles.previewsContainer}>
            {pendingImages.map((src, idx) => (
              <div key={idx} className={styles.previewWrapper}>
                <img src={src} className={styles.previewImg} alt="Preview" />
                <button className={styles.removeImgBtn} onClick={() => setPendingImages(pendingImages.filter((_, i) => i !== idx))}><X size={12} /></button>
              </div>
            ))}
          </div>
        )}
        <div className={styles.quickReplies}>
          {['Mau beli dong', 'Kondisi bagus?', 'Punya berapa?'].map(txt => (
            <button key={txt} className={styles.replyChip} onClick={() => { setMessage(txt); handleSend(); }}>{txt}</button>
          ))}
        </div>
        <footer className={styles.chatFooter}>
          <input type="file" ref={fileInputRef} style={{ display: 'none' }} multiple accept="image/*" onChange={(e) => {
            const files = e.target.files;
            if (files) setPendingImages([...pendingImages, ...Array.from(files).map(f => URL.createObjectURL(f))]);
          }} />
          <button className={styles.attachBtn} onClick={() => fileInputRef.current?.click()}><Plus size={24} /></button>
          <div className={styles.inputWrapper}>
            <input type="text" placeholder="Ketik pesanmu..." className={styles.messageInput} value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} />
          </div>
          <button className={styles.sendBtn} disabled={!message && pendingImages.length === 0} onClick={handleSend}><Send size={20} /></button>
        </footer>
      </div>

      {showCounterModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.counterModal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Tawar Balik</h3>
              <button className={styles.navBtn} onClick={() => setShowCounterModal(false)}><X size={24} /></button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.priceChips}>
                {['31.000', '29.000', '26.000', '24.000'].map(p => (
                  <button 
                    key={p} 
                    className={`${styles.priceChip} ${counterPrice === p ? styles.priceChipActive : ''}`} 
                    onClick={() => setCounterPrice(p)}
                  >
                    Rp{p}
                  </button>
                ))}
              </div>
              
              <div className={styles.priceInputArea}>
                <span className={styles.rpLabel}>Rp</span>
                <input 
                  type="text" 
                  className={styles.largeInput} 
                  value={counterPrice} 
                  onChange={(e) => setCounterPrice(e.target.value)} 
                  autoFocus
                />
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={`${styles.modalBtn} ${styles.btnBatal}`} onClick={() => setShowCounterModal(false)}>
                Batal
              </button>
              <button className={`${styles.modalBtn} ${styles.btnAjukan}`} onClick={handleApplyCounter}>
                Ajukan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
