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
  X,
  Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import MapPicker from '@/components/Map/MapPicker';
import MapDisplay from '@/components/Map/MapDisplay';

interface ChatMessage {
  id: string; // Changed from number to string (UUID)
  message_type: 'text' | 'offer' | 'image' | 'location';
  content: string;
  sender_id: string;
  metadata?: any;
  created_at: string;
}

export default function ChatDetailPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params?.id;
  const [message, setMessage] = useState('');
  const [pendingImages, setPendingImages] = useState<string[]>([]);
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFull, setIsFull] = useState(false);

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [opponent, setOpponent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Modals & Menus
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const [selectedLocation, setSelectedLocation] = useState<[number, number]>([-6.8915, 107.6107]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!conversationId) return;

    async function fetchChatDetails(uid: string) {
      try {
        setLoading(true);
        
        // 1. Fetch conversation to find the opponent
        const { data: convData, error: convError } = await supabase
          .from('conversations')
          .select(`
            buyer_id,
            seller_id,
            buyer:users!conversations_buyer_id_fkey (*),
            seller:users!conversations_seller_id_fkey (*)
          `)
          .eq('id', conversationId)
          .single();

        if (convError) throw convError;
        const opponentData = convData.buyer_id === uid ? convData.seller : convData.buyer;
        setOpponent(opponentData);

        // 2. Fetch messages
        const { data: msgData, error: msgError } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });

        if (msgError) throw msgError;
        setChatHistory(msgData as any || []);

      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    }

    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
        return;
      }
      setUserId(user.id);
      fetchChatDetails(user.id);
    }

    init();

    // Real-time subscription for messages
    // Note: We subscribe to the whole table and filter in code for better reliability with UUIDs
    const channel = supabase
      .channel(`chat_messages_${conversationId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages'
      }, (payload) => {
        const newMessage = payload.new as ChatMessage;
        if (newMessage.conversation_id === conversationId) {
          setChatHistory(prev => {
            if (prev.some(m => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  const handleSend = async (type: 'text' | 'image' | 'location' = 'text', contentStr?: string, meta?: any) => {
    const finalContent = contentStr || message;
    if ((!finalContent.trim() && type === 'text') || !userId) return;

    try {
      setIsSending(true); 
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          conversation_id: conversationId,
          sender_id: userId,
          message_type: type,
          content: finalContent,
          metadata: meta || {}
        }])
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        setChatHistory(prev => {
          if (prev.some(m => m.id === data.id)) return prev;
          return [...prev, data as ChatMessage];
        });
      }

      if (type === 'text') setMessage('');
      setIsAttachmentMenuOpen(false);
    } catch (err) {
      console.error('Send error:', err);
      alert('Gagal mengirim pesan. Silakan coba lagi.');
    } finally {
      setIsSending(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Mohon pilih file gambar.');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        handleSend('image', '[Gambar]', { url: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const shareLocation = async () => {
    await handleSend('location', '[Lokasi]', {
      lat: selectedLocation[0],
      lng: selectedLocation[1]
    });
    setShowLocationModal(false);
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      // Use requestAnimationFrame for smoother scroll after state update
      requestAnimationFrame(() => {
        if (chatBodyRef.current) {
          chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
      });
    }
  }, [chatHistory]);

  if (loading) {
    return (
      <div className={styles.container} style={{ fontFamily: 'var(--font-plus-jakarta-sans)', justifyContent: 'center', alignItems: 'center' }}>
        <Loader2 className="animate-spin" size={32} color="#008585" />
        <p style={{ marginTop: '12px', color: '#767676' }}>Memuat pesan...</p>
      </div>
    );
  }

  return (
    <div className={styles.container} style={{ fontFamily: 'var(--font-plus-jakarta-sans)' }}>
      <header className={styles.chatHeader}>
        <div className={styles.headerLeft}>
          <button className={styles.backBtn} onClick={() => router.back()} title="Kembali"><ArrowLeft size={20} /></button>
          <img src={opponent?.avatar_url || 'https://placehold.co/75x75?text=User'} alt="" className={styles.opponentAvatar} />
          <div className={styles.opponentInfo}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className={styles.opponentName}>{opponent?.full_name}</span>
              <CheckCircle2 size={16} fill="#2563EB" color="white" />
            </div>
            <span className={styles.lastSeen}>Aktif sekarang</span>
          </div>
        </div>
        <button className={styles.backBtn} title="Lainnya"><MoreVertical size={20} /></button>
      </header>

      <div className={styles.chatBody} ref={chatBodyRef}>
        {chatHistory.map((msg) => (
          <div key={msg.id} className={`${styles.messageRow} ${msg.sender_id === userId ? styles.senderRow : styles.recipientRow}`}>
            {msg.message_type === 'offer' ? (
              <div className={styles.offerCard}>
                <div className={styles.offerDetails}>
                  <p className={styles.offerLabel}>{msg.metadata?.product_title || 'Tawaran Harga'}</p>
                  <h4 className={styles.offerPrice}>{msg.offer_price ? `Rp${msg.offer_price.toLocaleString('id-ID')}` : msg.content}</h4>
                </div>
              </div>
            ) : msg.message_type === 'location' ? (
              <div className={`${styles.bubble} ${msg.sender_id === userId ? styles.senderBubble : styles.recipientBubble}`} style={{ width: '280px', height: '220px', padding: '8px' }}>
                <MapDisplay 
                  center={[msg.metadata.lat, msg.metadata.lng]} 
                  markerPosition={[msg.metadata.lat, msg.metadata.lng]} 
                />
              </div>
            ) : msg.message_type === 'image' ? (
               <div className={`${styles.bubble} ${msg.sender_id === userId ? styles.senderBubble : styles.recipientBubble}`} style={{ padding: '8px' }}>
                  <img src={msg.metadata?.url} alt="Sent" style={{ maxWidth: '240px', borderRadius: '12px', display: 'block' }} />
               </div>
            ) : (
              <div className={`${styles.bubble} ${msg.sender_id === userId ? styles.senderBubble : styles.recipientBubble}`}>
                {msg.content}
              </div>
            )}
          </div>
        ))}
      </div>

      <footer className={styles.chatFooter}>
        <div className={styles.attachmentMenuWrapper}>
          <button 
            className={styles.attachBtn} 
            onClick={() => setIsAttachmentMenuOpen(!isAttachmentMenuOpen)} 
            title="Lampiran"
          >
            <Plus size={24} style={{ transform: isAttachmentMenuOpen ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>
          
          {isAttachmentMenuOpen && (
            <div className={styles.moreMenuDropdown}>
              <div className={styles.moreMenuItem} onClick={() => {
                setShowLocationModal(true);
                setIsAttachmentMenuOpen(false);
              }}>
                <MapPin size={18} color="#008585" /> Kirim Lokasi
              </div>
              <div className={styles.moreMenuItem} onClick={() => fileInputRef.current?.click()}>
                <Plus size={18} color="#008585" /> Kirim Gambar
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
          )}
        </div>

        <div className={styles.inputWrapper}>
          <input 
            type="text" 
            placeholder="Ketik pesanmu..." 
            className={styles.messageInput}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isSending && handleSend()}
            disabled={isSending}
          />
        </div>
        <button 
          className={styles.sendBtn} 
          onClick={() => handleSend()}
          disabled={isSending}
        >
          {isSending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
        </button>
      </footer>

      {showLocationModal && (
        <div className={styles.modalOverlay} onClick={() => setShowLocationModal(false)}>
          <div className={styles.counterModal} style={{ maxWidth: '600px', width: '90%' }} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Pilih Titik Temu</h3>
              <button className={styles.navBtn} onClick={() => setShowLocationModal(false)}><X size={24} /></button>
            </div>
            <div style={{ height: '350px', marginBottom: '24px' }}>
              <MapPicker 
                center={selectedLocation} 
                markerPosition={selectedLocation}
                onLocationSelect={(lat, lng) => setSelectedLocation([lat, lng])}
              />
            </div>
            <div className={styles.modalFooter}>
              <button className={`${styles.modalBtn} ${styles.btnBatal}`} onClick={() => setShowLocationModal(false)}>Batal</button>
              <button className={`${styles.modalBtn} ${styles.btnAjukan}`} onClick={shareLocation}>Kirim Lokasi</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

