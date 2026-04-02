import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from '../lib/ThemeContext';

export default function Navbar() {
  const { toggleTheme } = useTheme();
  const router = useRouter();

  const isActive = (path) => router.pathname === path || router.pathname.startsWith(path + '/');

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 no-underline" style={{ textDecoration: 'none' }}>
        <span style={{
          fontFamily: 'Playfair Display, Georgia, serif',
          fontSize: '1.05rem',
          fontWeight: 700,
          color: 'var(--gold)',
          letterSpacing: '0.02em',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
        }}>
          <span style={{ fontSize: '0.6rem', opacity: 0.8 }}>◆</span>
          Think &amp; Grow Rich
        </span>
      </Link>

      {/* Nav links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        <NavLink href="/" label="Home" active={router.pathname === '/'} />
        <NavLink href="/chapters" label="Chapters" active={isActive('/chapters')} />
        <div className="theme-toggle" onClick={toggleTheme} title="Toggle theme" />
        <Link href="/reader/1" style={{ textDecoration: 'none' }}>
          <button style={{
            background: 'var(--gold)',
            color: '#0D0E13',
            padding: '0.45rem 1.1rem',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            transition: 'all 0.25s ease',
            marginLeft: '0.25rem',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--gold-light)';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(201,168,76,0.3)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'var(--gold)';
            e.currentTarget.style.transform = '';
            e.currentTarget.style.boxShadow = '';
          }}>
            Start Reading
          </button>
        </Link>
      </div>
    </nav>
  );
}

function NavLink({ href, label, active }) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.45rem 0.75rem',
        borderRadius: '6px',
        fontFamily: 'DM Sans, sans-serif',
        fontSize: '0.75rem',
        fontWeight: 500,
        letterSpacing: '0.07em',
        textTransform: 'uppercase',
        color: active ? 'var(--gold)' : 'var(--text-secondary)',
        background: active ? 'var(--gold-subtle)' : 'transparent',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
      }}>
        {label}
      </span>
    </Link>
  );
}
