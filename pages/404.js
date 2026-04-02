import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 64, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '4rem 2rem' }}>
        <div>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '6rem', fontWeight: 900, color: 'var(--gold)', opacity: 0.2, lineHeight: 1, marginBottom: '1rem' }}>404</div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>Page Not Found</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: '1.1rem' }}>
            The page you seek does not exist.
          </p>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <button style={{ background: 'var(--gold)', color: '#0D0E13', border: 'none', padding: '0.75rem 2rem', borderRadius: 6, fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>
              Return Home
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
