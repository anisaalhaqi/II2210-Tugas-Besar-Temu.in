'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div style={{ padding: '100px', textAlign: 'center' }}>
          <h2>Terjadi kesalahan fatal!</h2>
          <p>{error.message}</p>
          <button onClick={() => reset()}>Coba Lagi</button>
        </div>
      </body>
    </html>
  );
}
