'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Share2, 
  Download, 
  Info,
  ArrowLeft
} from 'lucide-react';
import styles from './payment.module.css';
import { supabase } from '@/lib/supabase';

export default function QrisPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [timeLeft, setTimeLeft] = useState(86399); // 23 hours 59 minutes 59 seconds
  const [deadlineStr, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);

  const amount = searchParams.get('amount') || '0';
  const orderIds = searchParams.get('orderIds')?.split(',') || [];

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://temu.in/pay/simulated/${orderIds[0] || 'demo'}`;

  useEffect(() => {
    // Generate real-time deadline (now + 24 hours)
    const now = new Date();
    const deadline = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    setDeadline(deadline.toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) + ' (GMT +7)');

    if (timeLeft <= 0) {
      // Auto-cancel if time runs out
      if (orderIds.length > 0) {
        supabase.from('orders').update({ status: 'cancelled', cancel_reason: 'Batas waktu pembayaran habis' }).in('id', orderIds);
      }
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return {
      h1: Math.floor(hrs / 10),
      h2: hrs % 10,
      m1: Math.floor(mins / 10),
      m2: mins % 10,
      s1: Math.floor(secs / 10),
      s2: secs % 10
    };
  };

  const time = formatTime(timeLeft);

  const handleDownload = async () => {
    try {
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `QRIS-Temuin-${orderIds[0] || 'order'}.png`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Gagal mendownload QR Code.');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'QRIS Temu.in',
          text: `Silakan selesaikan pembayaran Rp${amount} untuk pesanan Temu.in Anda.`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled or failed');
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link pembayaran disalin ke clipboard!');
    }
  };

  const handleFinishPayment = async () => {
    if (orderIds.length === 0) {
      router.push('/activity?tab=Diproses');
      return;
    }

    try {
      setLoading(true);
      // Update order status to 'processing' (Diproses) as requested
      const { data, error } = await supabase
        .from('orders')
        .update({ status: 'processing' })
        .in('id', orderIds)
        .select();

      if (error) {
        console.error('SUPABASE UPDATE ERROR:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      console.log('Update success:', data);
      alert('Pembayaran Berhasil! Pesanan Anda kini sedang diproses.');
      router.push('/activity?tab=Diproses');
    } catch (err: any) {
      console.error('Caught error:', err);
      alert(`Gagal memperbarui status pesanan: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.topRow}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              onClick={() => router.back()} 
              className={styles.backButton}
              title="Kembali"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className={styles.pageTitle}>Pembayaran QRIS</h1>
          </div>
        </div>

        <div className={styles.desktopGrid}>
          {/* Left Column: QR Code */}
          <div className={styles.leftCol}>
            <section className={styles.qrSection}>
              <div className={styles.merchantInfo}>
                <h2 className={styles.merchantName}>PT Temuin Indonesia</h2>
                <p className={styles.nmid}>NMID: ID1234567891234A01</p>
              </div>
              
              <div className={styles.qrContainer}>
                <img src={qrImageUrl} alt="QRIS Code" className={styles.qrImage} />
              </div>
              
              <div className={styles.actionGroup}>
                <button className={styles.btnSecondary} onClick={handleShare}>
                  <Share2 size={18} />
                  Share
                </button>
                <button className={styles.btnPrimarySmall} onClick={handleDownload}>
                  <Download size={18} />
                  Download
                </button>
              </div>
            </section>
          </div>

          {/* Right Column: Timer & Summary */}
          <div className={styles.rightCol}>
            <section className={styles.timerCard}>
              <div className={styles.timerHeader}>
                <Info size={20} color="#008585" />
                <h3>Batas Waktu Pembayaran</h3>
              </div>
              <div className={styles.timerDisplay}>
                <div className={styles.timeBox}>{time.h1}</div>
                <div className={styles.timeBox}>{time.h2}</div>
                <span className={styles.timerSeparator}>:</span>
                <div className={styles.timeBox}>{time.m1}</div>
                <div className={styles.timeBox}>{time.m2}</div>
                <span className={styles.timerSeparator}>:</span>
                <div className={styles.timeBox}>{time.s1}</div>
                <div className={styles.timeBox}>{time.s2}</div>
              </div>
              <p className={styles.deadline}>{deadlineStr || 'Memuat...'}</p>
              <p className={styles.timerHint}>Mohon selesaikan pembayaran sebelum waktu habis agar pesanan tidak otomatis dibatalkan.</p>
            </section>

            <section className={styles.summaryCard}>
              <div className={styles.paymentType}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_QRIS.svg" alt="QRIS" style={{ height: '24px' }} />
                <span>QRIS</span>
              </div>
              <div className={styles.divider} />
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Total Pembayaran</span>
                <span className={styles.totalValue}>Rp{amount}</span>
              </div>
              <button 
                className={styles.btnPrimaryFull}
                onClick={handleFinishPayment}
                disabled={loading}
              >
                {loading ? 'Memproses...' : 'Saya Sudah Bayar'}
              </button>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
