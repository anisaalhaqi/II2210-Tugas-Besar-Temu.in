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
import { supabase } from '@/lib/supabase';
import MapPicker from '@/components/Map/MapPicker';
import MapDisplay from '@/components/Map/MapDisplay';

interface ChatMessage {
  id: number;
  type: 'text' | 'offer' | 'image' | 'location';
  content?: string;
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
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<[number, number]>([-6.8915, 107.6107]);

  const JAE_HWAN_ID = '7b27154b-884e-4a05-a89f-0654d0fed203';

  useEffect(() => {
    if (!conversationId) return;

    async function fetchChatDetails() {
      try {
        setLoading(true);
        
        // 1. Fetch conversation to find the opponent
        const { data: convData, error: convError } = await supabase
          .from('conversations')
          .select(`
            buyer:users!conversations_buyer_id_fkey (*),
            seller:users!conversations_seller_id_fkey (*)
          `)
          .eq('id', conversationId)
          .single();

        if (convError) throw convError;
        const opponentData = convData.buyer?.id === JAE_HWAN_ID ? convData.seller : convData.buyer;
        setOpponent(opponentData);

        // 2. Fetch messages
        const { data: msgData, error: msgError } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });

        if (msgError) throw msgError;
        setChatHistory(msgData || []);

      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchChatDetails();

    // Subscribe to new messages
    const channel = supabase
      .channel(`chat_${conversationId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload) => {
        setChatHistory(prev => [...prev, payload.new as ChatMessage]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  const handleSend = async () => {
    if (!message.trim() && pendingImages.length === 0) return;

    try {
      // For now, simplicity: just text
      const { error } = await supabase
        .from('messages')
        .insert([{
          conversation_id: conversationId,
          sender_id: JAE_HWAN_ID,
          type: 'text',
          content: message
        }]);

      if (error) throw error;
      setMessage('');
    } catch (err) {
      console.error('Send error:', err);
    }
  };

  const shareLocation = async () => {
    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          conversation_id: conversationId,
          sender_id: JAE_HWAN_ID,
          type: 'location',
          metadata: {
            lat: selectedLocation[0],
            lng: selectedLocation[1]
          }
        }]);

      if (error) throw error;
      setShowLocationModal(false);
    } catch (err) {
      console.error('Share location error:', err);
    }
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatHistory]);

  if (loading) return <div className={styles.container}>Memuat pesan...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.chatHeader}>
        <div className={styles.headerLeft}>
          <button className={styles.backBtn} onClick={() => router.back()}><ArrowLeft size={20} /></button>
          <img src={opponent?.avatar_url || 'https://placehold.co/75x75'} alt="" className={styles.opponentAvatar} />
          <div className={styles.opponentInfo}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className={styles.opponentName}>{opponent?.full_name}</span>
              <CheckCircle2 size={16} fill="#2563EB" color="white" />
            </div>
            <span className={styles.lastSeen}>Aktif sekarang</span>
          </div>
        </div>
        <button className={styles.backBtn}><MoreVertical size={20} /></button>
      </header>

      <div className={styles.chatBody} ref={chatBodyRef}>
        {chatHistory.map((msg) => (
          <div key={msg.id} className={`${styles.messageRow} ${msg.sender_id === JAE_HWAN_ID ? styles.senderRow : styles.recipientRow}`}>
            {msg.type === 'offer' ? (
              <div className={styles.offerCard}>
                <div className={styles.offerDetails}>
                  <p className={styles.offerLabel}>{msg.metadata?.product_title}</p>
                  <h4 className={styles.offerPrice}>{msg.metadata?.price}</h4>
                </div>
              </div>
            ) : msg.type === 'location' ? (
              <div className={`${styles.bubble} ${msg.sender_id === JAE_HWAN_ID ? styles.senderBubble : styles.recipientBubble}`} style={{ width: '250px', height: '200px', padding: '8px' }}>
                <MapDisplay 
                  center={[msg.metadata.lat, msg.metadata.lng]} 
                  markerPosition={[msg.metadata.lat, msg.metadata.lng]} 
                />
              </div>
            ) : (
              <div className={`${styles.bubble} ${msg.sender_id === JAE_HWAN_ID ? styles.senderBubble : styles.recipientBubble}`}>
                {msg.content}
              </div>
            )}
          </div>
        ))}
      </div>

      <footer className={styles.chatFooter}>
        <button className={styles.attachBtn} onClick={() => setShowLocationModal(true)} title="Bagikan Lokasi">
          <MapPin size={22} />
        </button>
        <div className={styles.inputWrapper}>
          <input 
            type="text" 
            placeholder="Ketik pesanmu..." 
            className={styles.messageInput}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
        </div>
        <button className={styles.sendBtn} onClick={handleSend}><Send size={20} /></button>
      </footer>

      {showLocationModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.counterModal} style={{ maxWidth: '600px', width: '90%' }}>
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
