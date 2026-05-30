'use client';

import { useState } from 'react';
import styles from './auth.module.css';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isReset, setIsReset] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [faculty, setFaculty] = useState('');
  const [jurusan, setJurusan] = useState('');
  const [campusLocation, setCampusLocation] = useState('ITB Ganesha');

  // Error States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');

  const validatePassword = (pass: string) => {
    // Min 8 chars, at least one number or symbol
    const regex = /^(?=.*[0-9!@#$%^&*])(?=.{8,})/;
    return regex.test(pass);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setFormError('');
    
    const newErrors: Record<string, string> = {};

    // 1. Validation
    if (!email) newErrors.email = 'Email harus diisi';
    if (!password) newErrors.password = 'Password harus diisi';
    
    if (!isLogin) {
      if (!fullName) newErrors.fullName = 'Nama lengkap harus diisi';
      if (!username) newErrors.username = 'Username harus diisi';
      if (!faculty) newErrors.faculty = 'Fakultas harus diisi';
      if (!jurusan) newErrors.jurusan = 'Jurusan harus diisi';
      if (password && !validatePassword(password)) {
        newErrors.password = 'Min. 8 karakter & angka/simbol';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // --- LOGIN LOGIC ---
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.toLowerCase().includes('invalid login credentials')) {
            setFormError('Email atau password salah');
          } else {
            setFormError(error.message);
          }
        } else {
          router.push('/');
        }
      } else {
        // --- SIGN UP LOGIC ---
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              username: username,
              faculty: faculty,
              jurusan: jurusan,
              campus_location: campusLocation
            },
          },
        });

        if (error) {
          const errMsg = error.message.toLowerCase();
          if (errMsg.includes('already registered') || errMsg.includes('already exists') || errMsg.includes('database error saving new user')) {
            setErrors({ email: 'Akun sudah terdaftar' });
          } else {
            setFormError(error.message);
          }
        } else if (data.user && (!data.user.identities || data.user.identities.length === 0)) {
          setErrors({ email: 'Akun sudah terdaftar' });
        } else {
          alert('Pendaftaran berhasil! Akun Anda telah dibuat.');
          setIsLogin(true);
        }
      }
    } catch (err: any) {
      setFormError('Terjadi kesalahan sistem. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
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
              <input type="email" placeholder="email@gmail.com" required />
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

        {formError && <div className={styles.formError}>{formError}</div>}

        <form className={styles.form} onSubmit={handleAuth} noValidate>
          {!isLogin && (
            <>
              <div className={styles.inputGroup}>
                <label>Nama Lengkap</label>
                <input 
                  type="text" 
                  placeholder="Masukkan nama lengkap" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                {errors.fullName && <span className={styles.errorText}>{errors.fullName}</span>}
              </div>
              <div className={styles.inputGroup}>
                <label>Username</label>
                <input 
                  type="text" 
                  placeholder="Masukkan username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                {errors.username && <span className={styles.errorText}>{errors.username}</span>}
              </div>
            </>
          )}

          <div className={styles.inputGroup}>
            <label>Email</label>
            <input 
              type="email" 
              placeholder="email@gmail.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>
            <input 
              type="password" 
              placeholder="Masukkan password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <span className={styles.errorText}>{errors.password}</span>}
          </div>

          {!isLogin && (
            <>
              <div className={styles.inputGroup}>
                <label>Fakultas</label>
                <input 
                  type="text" 
                  placeholder="Contoh: STEI" 
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                />
                {errors.faculty && <span className={styles.errorText}>{errors.faculty}</span>}
              </div>
              <div className={styles.inputGroup}>
                <label>Jurusan</label>
                <input 
                  type="text" 
                  placeholder="Contoh: Teknik Informatika" 
                  value={jurusan}
                  onChange={(e) => setJurusan(e.target.value)}
                />
                {errors.jurusan && <span className={styles.errorText}>{errors.jurusan}</span>}
              </div>
              <div className={styles.inputGroup} style={{ paddingBottom: '0' }}>
                <label>Lokasi Kampus</label>
                <div className={styles.radioGroup}>
                  {['ITB Ganesha', 'ITB Jatinangor', 'ITB Cirebon'].map((loc) => (
                    <label key={loc} className={styles.radioItem}>
                      <input 
                        type="radio" 
                        name="campusLocation" 
                        value={loc} 
                        checked={campusLocation === loc}
                        onChange={(e) => setCampusLocation(e.target.value)}
                      />
                      <span className={styles.radioLabel}>{loc}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
          
          {isLogin && (
            <div className={styles.forgotPassword}>
              <span onClick={() => setIsReset(true)}>Lupa Password?</span>
            </div>
          )}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Memproses...' : (isLogin ? 'Masuk' : 'Daftar')}
          </button>
        </form>

        <div className={styles.switchMode}>
          {isLogin ? 'Belum punya akun? ' : 'Sudah punya akun? '}
          <span onClick={() => {
            setIsLogin(!isLogin);
            setErrors({});
            setFormError('');
          }} className={styles.switchLink}>
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
