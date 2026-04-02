import { useRouter } from 'next/router';

export default function ChapterCard({ chapter, excerpt, isRead, isReading }) {
  const router = useRouter();
  const displayNum = chapter.num === 0 ? 'Preface' : `Ch. ${chapter.num}`;

  return (
    <div className="chapter-card" onClick={() => router.push(`/reader/${chapter.slug}`)}>
      {/* Chapter number */}
      <div style={{
        fontFamily: 'DM Sans, sans-serif',
        fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em',
        textTransform: 'uppercase', color: 'var(--gold)',
        marginBottom: '0.75rem',
        display: 'flex', alignItems: 'center', gap: '0.5rem',
      }}>
        {displayNum}
        <span style={{ flex: 1, height: 1, background: 'var(--border)', maxWidth: 40, display: 'block' }} />
      </div>

      {/* Title */}
      <div style={{
        fontFamily: 'Playfair Display, Georgia, serif',
        fontSize: '1rem', fontWeight: 700, lineHeight: 1.4,
        color: 'var(--text-primary)', marginBottom: '0.6rem',
      }}>
        {chapter.title}
      </div>

      {/* Excerpt */}
      <div style={{
        fontFamily: 'Cormorant Garamond, Georgia, serif',
        fontSize: '0.9rem', lineHeight: 1.7,
        color: 'var(--text-secondary)', fontStyle: 'italic',
        display: '-webkit-box', WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        {excerpt || chapter.subtitle}
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginTop: '1.25rem', paddingTop: '1rem',
        borderTop: '1px solid var(--divider)',
      }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
          {chapter.readTime} min read
        </span>
        {isReading ? (
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--gold)' }}>● Reading</span>
        ) : isRead ? (
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--gold)' }}>✓ Read</span>
        ) : (
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-muted)' }}>Unread</span>
        )}
      </div>
    </div>
  );
}
