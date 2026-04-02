import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ProgressBar from '../components/ProgressBar';
import { CHAPTERS } from '../lib/bookData';
import { chapters as bookChapters } from '../data/book';
import { getProgress, getReadChapters } from '../utils/storage';
import { getChapterExcerpt } from '../utils/parser';

export default function ChaptersPage({ bookContent }) {
  const router = useRouter();
  const [progress, setProgress] = useState(null);
  const [readChapters, setReadChapters] = useState([]);

  useEffect(() => {
    setProgress(getProgress());
    setReadChapters(getReadChapters());
  }, []);

  const totalChapters = CHAPTERS.length;
  const readCount = readChapters.length;
  const overallPercent = Math.round((readCount / totalChapters) * 100);

  function getStatus(chapter) {
    if (progress?.chapterId === chapter.slug) return 'reading';
    if (readChapters.includes(chapter.slug)) return 'read';
    return 'unread';
  }

  return (
    <>
      <Head>
        <title>Chapters — Think &amp; Grow Rich</title>
      </Head>
      <Navbar />

      <div style={{ paddingTop: 64, display: 'flex', minHeight: '100vh' }}>
        {/* ── SIDEBAR ── */}
        <aside style={{
          width: 290, flexShrink: 0,
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-subtle)',
          height: 'calc(100vh - 64px)',
          position: 'sticky', top: 64,
          overflowY: 'auto', padding: '1.5rem 0',
        }}>
          {/* Sidebar header */}
          <div style={{ padding: '0 1.5rem 1.25rem', borderBottom: '1px solid var(--divider)', marginBottom: '0.5rem' }}>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
              Think and Grow Rich
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '0.7rem' }}>
              {readCount} of {totalChapters} chapters complete
            </div>
            <ProgressBar percent={overallPercent} height={2} />
          </div>

          {/* Sidebar nav items */}
          {CHAPTERS.map(chapter => {
            const status = getStatus(chapter);
            const isActive = progress?.chapterId === chapter.slug;
            return (
              <div
                key={chapter.id}
                className={`sidebar-item${isActive ? ' active' : ''}`}
                onClick={() => router.push(`/reader/${chapter.slug}`)}
              >
                <span style={{
                  fontSize: '0.62rem', fontWeight: 700, color: 'var(--gold)',
                  letterSpacing: '0.1em', width: 28, flexShrink: 0, fontFamily: 'DM Sans, sans-serif',
                }}>
                  {chapter.num === 0 ? 'Pre' : String(chapter.num).padStart(2, '0')}
                </span>
                <span style={{
                  fontSize: '0.8rem', fontWeight: isActive ? 500 : 400,
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  lineHeight: 1.4, flex: 1,
                }}>
                  {chapter.title}
                </span>
                <div style={{
                  width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                  border: status === 'read' ? 'none' : '1.5px solid var(--border)',
                  background: status === 'read' ? 'var(--gold)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.45rem', color: '#0D0E13',
                }}>
                  {status === 'read' && '✓'}
                  {status === 'reading' && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', display: 'block' }} />}
                </div>
              </div>
            );
          })}
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main style={{ flex: 1, padding: '3rem', maxWidth: 860, overflowY: 'auto' }}>
          <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Table of Contents
          </h1>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', fontStyle: 'italic', color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
            Seventeen chapters of transformative wisdom by Napoleon Hill
          </p>

          {/* Overall progress bar */}
          {readCount > 0 && (
            <div style={{ marginBottom: '2.5rem', padding: '1.25rem 1.5rem', background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Your Progress</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--gold)', fontWeight: 600 }}>{overallPercent}%</span>
              </div>
              <ProgressBar percent={overallPercent} height={3} />
            </div>
          )}

          {/* Chapter list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {CHAPTERS.map(chapter => {
              const status = getStatus(chapter);
              const excerpt = bookContent?.[chapter.id]
                ? getChapterExcerpt(bookContent[chapter.id], 220)
                : chapter.subtitle;

              return (
                <div
                  key={chapter.id}
                  className={`chapter-list-item${status === 'reading' ? ' active-chapter' : ''}`}
                  onClick={() => router.push(`/reader/${chapter.slug}`)}
                >
                  {/* Number */}
                  <div style={{
                    fontFamily: 'Playfair Display, Georgia, serif',
                    fontSize: '1.4rem', fontWeight: 900,
                    color: 'var(--gold)', opacity: status === 'reading' ? 1 : 0.35,
                    minWidth: 48, lineHeight: 1, paddingTop: '0.2rem',
                  }}>
                    {chapter.num === 0 ? 'P' : String(chapter.num).padStart(2, '0')}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: 'Playfair Display, Georgia, serif',
                      fontSize: '1.05rem', fontWeight: 700,
                      color: 'var(--text-primary)', marginBottom: '0.35rem', lineHeight: 1.3,
                    }}>
                      {chapter.title}
                    </div>
                    {chapter.step && (
                      <div style={{ fontSize: '0.68rem', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.08em', marginBottom: '0.35rem', fontWeight: 500 }}>
                        {chapter.step}
                      </div>
                    )}
                    <div style={{
                      fontFamily: 'Cormorant Garamond, serif',
                      fontSize: '0.88rem', fontStyle: 'italic', lineHeight: 1.7,
                      color: 'var(--text-secondary)',
                      display: '-webkit-box', WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                      {excerpt}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.75rem' }}>
                      <StatusBadge status={status} />
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                        {chapter.readTime} min read
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </>
  );
}

function StatusBadge({ status }) {
  const styles = {
    reading: { background: 'var(--gold)', color: '#0D0E13' },
    read:    { background: 'var(--gold-subtle)', color: 'var(--gold)', border: '1px solid var(--border)' },
    unread:  { background: 'var(--bg-elevated)', color: 'var(--text-muted)' },
  };
  const labels = { reading: '● Reading', read: 'Read', unread: 'Unread' };
  return (
    <span style={{
      fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.1em',
      textTransform: 'uppercase', padding: '0.2rem 0.6rem', borderRadius: '100px',
      fontFamily: 'DM Sans, sans-serif',
      ...styles[status],
    }}>
      {labels[status]}
    </span>
  );
}

export async function getStaticProps() {
  const bookContent = Object.fromEntries(
    bookChapters.map(c => [c.slug, c.content])
  );
  return { props: { bookContent } };
}
