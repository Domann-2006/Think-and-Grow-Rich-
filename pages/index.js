import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ChapterCard from '../components/ChapterCard';
import ProgressBar from '../components/ProgressBar';
import { CHAPTERS, getTodaysQuote } from '../lib/bookData';
import { chapters as bookChapters } from '../data/book';
import { getProgress, getReadChapters } from '../utils/storage';
import { getChapterExcerpt } from '../utils/parser';

export default function Home({ bookContent }) {
  const router = useRouter();
  const [progress, setProgress] = useState(null);
  const [readChapters, setReadChapters] = useState([]);
  const quote = getTodaysQuote();

  useEffect(() => {
    setProgress(getProgress());
    setReadChapters(getReadChapters());
  }, []);

  const currentChapter = progress
    ? CHAPTERS.find(c => c.slug === progress.chapterId)
    : null;

  // Featured chapters for homepage grid
  const featured = CHAPTERS.filter(c => c.num >= 1 && c.num <= 6);

  return (
    <>
      <Head>
        <title>Think &amp; Grow Rich — Premium Reading Experience</title>
        <meta name="description" content="Read Think and Grow Rich by Napoleon Hill — the timeless classic on personal achievement and wealth creation." />
      </Head>

      <Navbar />

      <main style={{ paddingTop: 64 }}>
        {/* ── HERO ── */}
        <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', padding: '4rem 2rem' }}>
          <div className="hero-bg" style={{ position: 'absolute', inset: 0 }} />
          <div className="hero-grid" style={{ position: 'absolute', inset: 0 }} />

          <div style={{ position: 'relative', maxWidth: 900, margin: '0 auto', textAlign: 'center', width: '100%' }}>
            {/* Eyebrow */}
            <div className="anim-1" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
              fontFamily: 'DM Sans, sans-serif', fontSize: '0.68rem', fontWeight: 600,
              letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)',
              marginBottom: '2rem', padding: '0.4rem 1rem',
              border: '1px solid var(--border)', borderRadius: '100px',
              background: 'var(--gold-subtle)',
            }}>
              <span>—</span> The Timeless Classic <span>—</span>
            </div>

            {/* Title */}
            <h1 className="anim-2" style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: 'clamp(3rem, 8vw, 6.5rem)',
              fontWeight: 900, lineHeight: 1.0,
              letterSpacing: '-0.02em', color: 'var(--text-primary)',
              marginBottom: '0.5rem',
            }}>
              Think<br />and Grow<br />
              <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Rich</em>
            </h1>

            {/* Author */}
            <p className="anim-3" style={{
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              fontSize: '1.05rem', fontWeight: 300,
              letterSpacing: '0.3em', textTransform: 'uppercase',
              color: 'var(--text-secondary)', marginBottom: '2rem',
            }}>
              Napoleon Hill · 1937
            </p>

            {/* Description */}
            <p className="anim-4" style={{
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              fontSize: '1.2rem', lineHeight: 1.8,
              color: 'var(--text-secondary)', maxWidth: 560,
              margin: '0 auto 3rem', fontStyle: 'italic',
            }}>
              Distilled from the wisdom of 500 of the most successful people of the 20th century — a philosophy that has transformed millions of lives.
            </p>

            {/* CTAs */}
            <div className="anim-5" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/reader/1" style={{ textDecoration: 'none' }}>
                <button className="btn-primary-hero">
                  ▶ &nbsp;Start Reading
                </button>
              </Link>
              <Link href="/chapters" style={{ textDecoration: 'none' }}>
                <button className="btn-secondary-hero">Browse Chapters</button>
              </Link>
            </div>

            {/* Stats */}
            <div className="anim-6" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '3rem', marginTop: '4rem', paddingTop: '3rem',
              borderTop: '1px solid var(--divider)', flexWrap: 'wrap',
            }}>
              {[
                { value: '16', label: 'Chapters' },
                { value: '4.2h', label: 'Read time' },
                { value: '100M+', label: 'Copies sold' },
                { value: '87yrs', label: 'Of wisdom' },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', fontWeight: 700, color: 'var(--gold)', display: 'block' }}>{s.value}</span>
                  <span style={{ fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'block' }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTINUE READING ── */}
        {currentChapter && (
          <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem 4rem' }}>
            <SectionHeader title="Continue Reading" linkLabel="All chapters →" linkHref="/chapters" />
            <div
              className="continue-card"
              onClick={() => router.push(`/reader/${currentChapter.slug}`)}
              style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}
            >
              {/* Book spine */}
              <div className="book-cover" style={{
                width: 70, height: 100, borderRadius: 4, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Playfair Display, serif', fontSize: '0.48rem',
                color: 'var(--gold)', textAlign: 'center', padding: '0.5rem',
                lineHeight: 1.4,
              }}>
                Think<br />&amp;<br />Grow<br />Rich
              </div>

              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.4rem', fontWeight: 600 }}>
                  Currently Reading · Chapter {currentChapter.num}
                </div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  {currentChapter.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  {progress.percent}% complete
                </div>
                <ProgressBar percent={progress.percent} />
              </div>

              <button
                style={{
                  background: 'var(--gold)', color: '#0D0E13', border: 'none',
                  padding: '0.55rem 1.4rem', borderRadius: 6,
                  fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em',
                  textTransform: 'uppercase', cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                Resume →
              </button>
            </div>
          </section>
        )}

        {/* ── FEATURED CHAPTERS GRID ── */}
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: `${currentChapter ? '0' : '4rem'} 2rem 4rem` }}>
          <SectionHeader title="Featured Chapters" linkLabel="View all →" linkHref="/chapters" />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}>
            {featured.map(chapter => (
              <ChapterCard
                key={chapter.id}
                chapter={chapter}
                excerpt={bookContent?.[chapter.id] ? getChapterExcerpt(bookContent[chapter.id]) : chapter.subtitle}
                isRead={readChapters.includes(chapter.slug)}
                isReading={progress?.chapterId === chapter.slug}
              />
            ))}
          </div>
        </section>

        {/* ── DAILY QUOTE ── */}
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem 6rem' }}>
          <div className="quote-section" style={{ padding: '4rem 3rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600, marginBottom: '1.5rem' }}>
              ◆ &nbsp; Daily Wisdom
            </div>
            <p style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: 'clamp(1.1rem, 2.5vw, 1.7rem)',
              fontWeight: 400, fontStyle: 'italic', lineHeight: 1.75,
              color: 'var(--text-primary)', maxWidth: 700, margin: '0 auto 1.5rem',
            }}>
              "{quote.text}"
            </p>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              — <span style={{ color: 'var(--gold)' }}>Napoleon Hill</span> · {quote.chapter}
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        .btn-primary-hero {
          background: var(--gold); color: #0D0E13;
          padding: 0.9rem 2.5rem; border: none; border-radius: 6px;
          font-family: 'DM Sans', sans-serif; font-size: 0.85rem;
          font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
          cursor: pointer; transition: all 0.25s ease;
          display: inline-flex; align-items: center; gap: 0.4rem;
        }
        .btn-primary-hero:hover {
          background: var(--gold-light); transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(201,168,76,0.35);
        }
        .btn-secondary-hero {
          background: transparent; color: var(--text-primary);
          padding: 0.9rem 2.5rem; border: 1px solid var(--border); border-radius: 6px;
          font-family: 'DM Sans', sans-serif; font-size: 0.85rem;
          font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;
          cursor: pointer; transition: all 0.25s ease;
        }
        .btn-secondary-hero:hover {
          border-color: var(--gold); color: var(--gold); background: var(--gold-subtle);
        }
      `}</style>
    </>
  );
}

function SectionHeader({ title, linkLabel, linkHref }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '2rem', gap: '1rem' }}>
      <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)' }}>
        {title}
      </h2>
      <Link href={linkHref} style={{
        fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase',
        color: 'var(--gold)', textDecoration: 'none', cursor: 'pointer',
        whiteSpace: 'nowrap',
      }}>
        {linkLabel}
      </Link>
    </div>
  );
}

export async function getStaticProps() {
  // Build a slug→content map from data/book.js for excerpt generation
  const bookContent = Object.fromEntries(
    bookChapters.map(c => [c.slug, c.content])
  );
  return { props: { bookContent } };
}
