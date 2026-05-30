'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{ 
      padding: '100px', 
      textAlign: 'center',
      fontFamily: 'sans-serif' 
    }}>
      <h2 style={{ color: '#008585' }}>Ups, terjadi kesalahan!</h2>
      <p style={{ color: '#767676', marginBottom: '24px' }}>{error.message}</p>
      <button
        onClick={() => reset()}
        style={{
          padding: '12px 24px',
          backgroundColor: '#008585',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        Coba Lagi
      </button>
    </div>
  );
}
