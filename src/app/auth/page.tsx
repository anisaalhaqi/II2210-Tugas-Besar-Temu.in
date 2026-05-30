'use client';

import { useState } from 'react';
import styles from './auth.module.css';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isReset, setIsReset] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth success and redirect to dashboard
    router.push('/');
  };

  const renderForm = () => {
    if (isReset) {
      return (
        <>
          <h2>Reset Password</h2>
          <p style={{ textAlign: 'center', color: '#767676', marginBottom: '16px', fontSize: '14px', lineHeight: '1.5' }}>
            Masukkan email kemahasiswaanmu. Kami akan mengirimkan tautan untuk mengatur ulang password.
          </p>
          <form className={styles.form} onSubmit={(e) => { e.preventDefault(); alert('Link reset password telah dikirim ke emailmu!'); setIsReset(false); }}>
            <div className={styles.inputGroup}>
              <label>Email</label>
              <input type="email" placeholder="contoh@mahasiswa.itb.ac.id" required />
            </div>
            <button type="submit" className={styles.submitBtn}>
              Kirim Link Reset
            </button>
          </form>
          <div className={styles.switchMode} style={{ marginTop: '24px' }}>
            Ingat passwordmu?{' '}
            <span onClick={() => setIsReset(false)} className={styles.switchLink}>
              Masuk
            </span>
          </div>
        </>
      );
    }

    return (
      <>
        <h2>{isLogin ? 'Selamat Datang!' : 'Daftar Akun'}</h2>

        <form className={styles.form} onSubmit={handleAuth}>
          {!isLogin && (
            <div className={styles.inputGroup}>
              <label>Nama Lengkap</label>
              <input type="text" placeholder="Masukkan namamu" required />
            </div>
          )}
          <div className={styles.inputGroup}>
            <label>Email</label>
            <input 
              type="email" 
              placeholder="contoh@gmail.com" 
              pattern="^[a-zA-Z0-9._%+-]+@gmail\.com$"
              title="Gunakan email dengan domain @gmail.com"
              required 
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Password</label>
            <input type="password" placeholder="Masukkan password" required />
          </div>
          
          {isLogin && (
            <div className={styles.forgotPassword}>
              <span onClick={() => setIsReset(true)}>Lupa Password?</span>
            </div>
          )}

          <button type="submit" className={styles.submitBtn}>
            {isLogin ? 'Masuk' : 'Daftar'}
          </button>
        </form>

        <div className={styles.switchMode}>
          {isLogin ? 'Belum punya akun? ' : 'Sudah punya akun? '}
          <span onClick={() => setIsLogin(!isLogin)} className={styles.switchLink}>
            {isLogin ? 'Daftar Sekarang' : 'Masuk'}
          </span>
        </div>

        <p className={styles.terms}>
          Dengan {isLogin ? 'masuk' : 'mendaftar'}, kamu menyetujui Ketentuan Layanan dan Kebijakan Privasi Temu.in
        </p>
      </>
    );

  };

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <div className={styles.bgCircle1}></div>
        <div className={styles.bgCircle2}></div>
        <div className={styles.branding}>
          <h1>Temu.in</h1>
          <p>Sirkulasi barang akademik jadi lebih mudah dan tepercaya di lingkungan kampus ITB.</p>
        </div>
      </div>
      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>
          {renderForm()}
        </div>
      </div>
    </div>
  );
}
