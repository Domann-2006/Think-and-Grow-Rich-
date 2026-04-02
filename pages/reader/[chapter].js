import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import Navbar from '../../components/Navbar';
import SettingsModal from '../../components/SettingsModal';
import { CHAPTERS } from '../../lib/bookData';
import { chapters as bookChapters, getChapterBySlug } from '../../data/book';
import { useTheme } from '../../lib/ThemeContext';
import {
  getReaderPrefs, saveReaderPrefs,
  getProgress, saveProgress, markChapterRead,
  toggleBookmark, isBookmarked,
  addHighlight, getHighlights, removeHighlight,
  saveNote, getNotes, deleteNote,
} from '../../utils/storage';
import { parseChapterContent } from '../../utils/parser';

export default function ReaderPage({ chapterSlug, chapterContent }) {
  const router = useRouter();
  const { toggleTheme } = useTheme();
  const contentRef = useRef(null);
  const saveTimerRef = useRef(null);

  // Chapter metadata
  const chapterIndex = CHAPTERS.findIndex(c => c.slug === chapterSlug);
  const chapter = CHAPTERS[chapterIndex];
  const prevChapter = CHAPTERS[chapterIndex - 1] || null;
  const nextChapter = CHAPTERS[chapterIndex + 1] || null;

  // Reader state
  const [readPercent, setReadPercent] = useState(0);
  const [prefs, setPrefs] = useState({ fontSize: 18, lineHeight: 1.95 });
  const [bookmarked, setBookmarked] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [highlightMode, setHighlightMode] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [highlightsOpen, setHighlightsOpen] = useState(false);
  const [highlights, setHighlights] = useState([]);
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState('');
  const [selectionInfo, setSelectionInfo] = useState(null); // { text, x, y }
  const [showHighlightTooltip, setShowHighlightTooltip] = useState(false);

  // Parsed paragraphs
  const paragraphs = chapterContent ? parseChapterContent(chapterContent) : [];

  // Init from localStorage
  useEffect(() => {
    if (!chapterSlug) return;
    const p = getReaderPrefs();
    setPrefs(p);
    setBookmarked(isBookmarked(chapterSlug));
    setHighlights(getHighlights(chapterSlug));
    setNotes(getNotes(chapterSlug));
  }, [chapterSlug]);

  // Restore scroll position
  useEffect(() => {
    if (!chapterSlug) return;
    const saved = getProgress();
    if (saved?.chapterId === chapterSlug && saved.scrollY) {
      window.scrollTo(0, saved.scrollY);
    } else {
      window.scrollTo(0, 0);
    }
  }, [chapterSlug]);

  // Track reading progress on scroll
  const handleScroll = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const total = el.offsetHeight;
    const scrolled = Math.max(0, -rect.top + 114); // offset for fixed bars
    const pct = Math.min(100, Math.max(0, (scrolled / total) * 100));
    setReadPercent(pct);

    // Debounced save
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveProgress(chapterSlug, window.scrollY, pct);
      if (pct > 90) markChapterRead(chapterSlug);
    }, 800);
  }, [chapterSlug]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Text selection for highlighting
  useEffect(() => {
    const handleMouseUp = () => {
      if (!highlightMode) return;
      const sel = window.getSelection();
      const text = sel?.toString().trim();
      if (!text || text.length < 5) { setShowHighlightTooltip(false); return; }
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelectionInfo({ text, x: rect.left + rect.width / 2, y: rect.top - 10 + window.scrollY });
      setShowHighlightTooltip(true);
    };
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [highlightMode]);

  // Close tooltip on click outside
  useEffect(() => {
    const handler = () => setShowHighlightTooltip(false);
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function handleBookmark() {
    const next = toggleBookmark(chapterSlug);
    setBookmarked(next);
  }

  function handleHighlight() {
    if (!selectionInfo) return;
    addHighlight(chapterSlug, selectionInfo.text);
    setHighlights(getHighlights(chapterSlug));
    setShowHighlightTooltip(false);
    window.getSelection()?.removeAllRanges();
  }

  function handleDeleteHighlight(id) {
    removeHighlight(chapterSlug, id);
    setHighlights(getHighlights(chapterSlug));
  }

  function handleSaveNote() {
    if (!noteText.trim()) return;
    saveNote(chapterSlug, noteText.trim());
    setNotes(getNotes(chapterSlug));
    setNoteText('');
  }

  function handleDeleteNote(id) {
    deleteNote(chapterSlug, id);
    setNotes(getNotes(chapterSlug));
  }

  function updatePrefs(next) {
    setPrefs(next);
    saveReaderPrefs(next);
  }

  if (!chapter) return <div style={{ padding: '6rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Chapter not found.</div>;

  return (
    <>
      <Head>
        <title>{chapter.title} — Think &amp; Grow Rich</title>
      </Head>
      <Navbar />

      {/* ── READER TOP BAR ── */}
      <div style={{
        position: 'fixed', top: 64, left: 0, right: 0, height: 48,
        background: 'var(--bg-overlay)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--divider)',
        display: 'flex', alignItems: 'center',
        padding: '0 1.5rem', gap: '1rem', zIndex: 90,
      }}>
        <Link href="/chapters" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--gold)', cursor: 'pointer', whiteSpace: 'nowrap' }}>← Chapters</span>
        </Link>
        <span style={{ flex: 1, fontSize: '0.72rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <strong style={{ color: 'var(--text-secondary)', fontFamily: 'Playfair Display, serif' }}>
            {chapter.num === 0 ? 'Preface' : `Chapter ${chapter.num}`}
          </strong>
          {' · '}
          {chapter.title}
        </span>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', fontFeatureSettings: '"tnum"' }}>
          {Math.round(readPercent)}%
        </span>
        <div className="theme-toggle" onClick={toggleTheme} title="Toggle theme" />
      </div>

      {/* ── READING PROGRESS BAR ── */}
      <div className="reading-progress-track" style={{ top: 112 }}>
        <div className="reading-progress-bar" style={{ width: `${readPercent}%` }} />
      </div>

      {/* ── FLOATING SIDE CONTROLS ── */}
      <div style={{
        position: 'fixed', right: '1.5rem', top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex', flexDirection: 'column', gap: '0.5rem', zIndex: 89,
      }}>
        <CtrlBtn
          label="Bookmark"
          active={bookmarked}
          onClick={handleBookmark}
          icon={bookmarked ? '🔖' : '🔖'}
          title={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
        />
        <CtrlBtn
          label="Highlight"
          active={highlightMode}
          onClick={() => { setHighlightMode(h => !h); setHighlightsOpen(false); setNotesOpen(false); setSettingsOpen(false); }}
          icon="✏"
          title="Highlight mode"
        />
        <CtrlBtn
          label="Highlights"
          active={highlightsOpen}
          onClick={() => { setHighlightsOpen(h => !h); setNotesOpen(false); setSettingsOpen(false); }}
          icon="◐"
          title="View highlights"
        />
        <CtrlBtn
          label="Notes"
          active={notesOpen}
          onClick={() => { setNotesOpen(n => !n); setHighlightsOpen(false); setSettingsOpen(false); }}
          icon="📝"
          title="Notes"
        />
        <CtrlBtn
          label="Settings"
          active={settingsOpen}
          onClick={() => { setSettingsOpen(s => !s); setNotesOpen(false); setHighlightsOpen(false); }}
          icon="⚙"
          title="Reading settings"
        />
        <CtrlBtn
          label="TOC"
          active={false}
          onClick={() => router.push('/chapters')}
          icon="☰"
          title="Table of contents"
        />
      </div>

      {/* ── SETTINGS PANEL ── */}
      <SettingsModal
        visible={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        fontSize={prefs.fontSize}
        lineHeight={prefs.lineHeight}
        onFontSize={v => updatePrefs({ ...prefs, fontSize: v })}
        onLineHeight={v => updatePrefs({ ...prefs, lineHeight: v })}
      />

      {/* ── NOTES PANEL ── */}
      {notesOpen && (
        <SidePanel title="Notes" onClose={() => setNotesOpen(false)}>
          <textarea
            className="note-textarea"
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
            placeholder="Write a note about this chapter..."
            rows={4}
          />
          <button
            onClick={handleSaveNote}
            style={{
              marginTop: '0.5rem', background: 'var(--gold)', color: '#0D0E13',
              border: 'none', padding: '0.4rem 1rem', borderRadius: 6,
              fontSize: '0.68rem', fontWeight: 700, cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
            Save Note
          </button>
          {notes.length > 0 && (
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                Saved Notes
              </div>
              {notes.map(n => (
                <div key={n.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 6, padding: '0.6rem 0.75rem', position: 'relative' }}>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-primary)', lineHeight: 1.6, margin: 0, paddingRight: '1.2rem' }}>{n.text}</p>
                  <button
                    onClick={() => handleDeleteNote(n.id)}
                    style={{ position: 'absolute', top: '0.4rem', right: '0.4rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
          {notes.length === 0 && <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.75rem', fontStyle: 'italic' }}>No notes yet.</p>}
        </SidePanel>
      )}

      {/* ── HIGHLIGHTS PANEL ── */}
      {highlightsOpen && (
        <SidePanel title="Highlights" onClose={() => setHighlightsOpen(false)}>
          {highlights.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {highlights.map(h => (
                <div key={h.id} style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid var(--border)', borderLeft: '3px solid var(--gold)', borderRadius: '0 6px 6px 0', padding: '0.6rem 0.75rem', position: 'relative' }}>
                  <p style={{ fontSize: '0.8rem', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', color: 'var(--text-primary)', lineHeight: 1.6, margin: 0, paddingRight: '1.2rem' }}>"{h.text}"</p>
                  <button
                    onClick={() => handleDeleteHighlight(h.id)}
                    style={{ position: 'absolute', top: '0.4rem', right: '0.4rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                    ✕
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              Enable highlight mode (✏) then select text to highlight.
            </p>
          )}
        </SidePanel>
      )}

      {/* ── HIGHLIGHT TOOLTIP ── */}
      {showHighlightTooltip && selectionInfo && (
        <div
          onMouseDown={e => e.stopPropagation()}
          style={{
            position: 'absolute',
            left: selectionInfo.x - 55,
            top: selectionInfo.y - 44,
            zIndex: 200,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '0.4rem 0.75rem',
            boxShadow: 'var(--shadow-elevated)',
            animation: 'fadeIn 0.15s ease',
          }}
        >
          <button
            onClick={handleHighlight}
            style={{
              background: 'var(--gold)', color: '#0D0E13', border: 'none',
              padding: '0.3rem 0.9rem', borderRadius: 5,
              fontSize: '0.68rem', fontWeight: 700, cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.08em',
            }}
          >
            ✦ Highlight
          </button>
        </div>
      )}

      {/* ── READER CONTENT ── */}
      <div style={{ paddingTop: 64 + 48 + 2 }}>
        <div
          ref={contentRef}
          style={{
            maxWidth: 700, margin: '0 auto',
            padding: '3rem 2rem 6rem',
          }}
        >
          {/* Chapter header */}
          <div style={{ textAlign: 'center', marginBottom: '3.5rem', paddingBottom: '2.5rem', borderBottom: '1px solid var(--divider)' }}>
            <div style={{ fontSize: '0.62rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 700, marginBottom: '1rem', fontFamily: 'DM Sans, sans-serif' }}>
              {chapter.num === 0 ? '◆ Preface ◆' : `◆ Chapter ${chapter.num === 0 ? '' : chapter.num} ◆`}
            </div>
            <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: '0.75rem' }}>
              {chapter.title}
            </h1>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              {chapter.subtitle}
            </p>
            {chapter.step && (
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', marginTop: '0.6rem', fontWeight: 600 }}>
                {chapter.step}
              </p>
            )}
          </div>

          {/* Ornament */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', margin: '2.5rem 0', color: 'var(--gold)', opacity: 0.45 }}>
            <span style={{ flex: 1, height: 1, background: 'currentColor', maxWidth: 60 }} />
            <span style={{ fontSize: '0.58rem', letterSpacing: '0.5em' }}>✦ ✦ ✦</span>
            <span style={{ flex: 1, height: 1, background: 'currentColor', maxWidth: 60 }} />
          </div>

          {/* Body text */}
          <div
            className="reader-body"
            style={{
              fontSize: prefs.fontSize,
              lineHeight: prefs.lineHeight,
              cursor: highlightMode ? 'text' : 'auto',
            }}
          >
            {paragraphs.map((p, i) => (
              <Paragraph key={i} para={p} isFirst={i === 0} />
            ))}
          </div>

          {/* Chapter navigation */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '2rem 0', marginTop: '3rem',
            borderTop: '1px solid var(--divider)', gap: '1rem',
          }}>
            {prevChapter ? (
              <NavBtn chapter={prevChapter} direction="prev" />
            ) : <div />}
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textAlign: 'center', letterSpacing: '0.1em' }}>
              {chapterIndex + 1} / {CHAPTERS.length}
            </div>
            {nextChapter ? (
              <NavBtn chapter={nextChapter} direction="next" />
            ) : <div />}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Sub-components ──

function Paragraph({ para, isFirst }) {
  const router = useRouter();

  if (para.type === 'chapter-header') return null; // already in header

  if (para.type === 'heading') {
    return (
      <h2 style={{
        fontFamily: 'Playfair Display, Georgia, serif',
        fontSize: '1.2rem', fontWeight: 700,
        color: 'var(--text-primary)', marginTop: '2.5rem', marginBottom: '1rem',
        letterSpacing: '0.03em',
      }}>
        {para.text}
      </h2>
    );
  }

  if (para.type === 'subheading') {
    return (
      <h3 style={{
        fontFamily: 'Playfair Display, Georgia, serif',
        fontSize: '1.05rem', fontWeight: 600,
        color: 'var(--text-secondary)', marginTop: '2rem', marginBottom: '0.75rem',
        fontStyle: 'italic',
      }}>
        {para.text}
      </h3>
    );
  }

  if (para.type === 'quote') {
    return (
      <blockquote>
        {para.text}
      </blockquote>
    );
  }

  if (para.type === 'attribution') {
    return (
      <p style={{
        fontFamily: 'DM Sans, sans-serif',
        fontSize: '0.78rem', fontWeight: 600,
        letterSpacing: '0.12em', textTransform: 'uppercase',
        color: 'var(--text-muted)', textAlign: 'right',
        marginBottom: '1.5em', textIndent: 0,
      }}>
        — {para.text}
      </p>
    );
  }

  // Normal paragraph
  return (
    <p className={isFirst ? 'drop-cap' : ''}>
      {para.text}
    </p>
  );
}

function CtrlBtn({ icon, active, onClick, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 40, height: 40,
        background: active ? 'var(--gold)' : 'var(--bg-card)',
        border: '1px solid ' + (active ? 'var(--gold)' : 'var(--border-subtle)'),
        borderRadius: 8,
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.85rem',
        color: active ? '#0D0E13' : 'var(--text-secondary)',
        transition: 'all 0.22s ease',
        boxShadow: 'var(--shadow-card)',
      }}
      onMouseEnter={e => {
        if (!active) {
          e.currentTarget.style.background = 'var(--bg-elevated)';
          e.currentTarget.style.color = 'var(--gold)';
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          e.currentTarget.style.background = 'var(--bg-card)';
          e.currentTarget.style.color = 'var(--text-secondary)';
        }
      }}
    >
      {icon}
    </button>
  );
}

function SidePanel({ title, onClose, children }) {
  return (
    <div style={{
      position: 'fixed', right: '5rem', top: '50%',
      transform: 'translateY(-50%)',
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: '1.25rem',
      width: 260, maxHeight: '70vh',
      overflowY: 'auto',
      boxShadow: 'var(--shadow-elevated)',
      zIndex: 88,
      animation: 'fadeIn 0.18s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>{title}</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.75rem', padding: '0.1rem 0.3rem' }}>✕</button>
      </div>
      {children}
    </div>
  );
}

function NavBtn({ chapter, direction }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(`/reader/${chapter.slug}`)}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.75rem 1.25rem',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 8, cursor: 'pointer',
        transition: 'all 0.22s ease',
        maxWidth: 200,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.color = 'var(--gold)';
        e.currentTarget.style.background = 'var(--gold-subtle)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
        e.currentTarget.style.color = '';
        e.currentTarget.style.background = 'var(--bg-card)';
      }}
    >
      {direction === 'prev' && <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>←</span>}
      <div style={{ textAlign: direction === 'prev' ? 'left' : 'right', flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>
          {direction === 'prev' ? 'Previous' : 'Next'}
        </div>
        <div style={{
          fontFamily: 'Playfair Display, serif', fontSize: '0.82rem', fontWeight: 600,
          color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {chapter.title}
        </div>
      </div>
      {direction === 'next' && <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>→</span>}
    </button>
  );
}

// ── Static generation ──

export async function getStaticPaths() {
  return {
    paths: bookChapters.map(c => ({ params: { chapter: c.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const chapter = getChapterBySlug(params.chapter);
  return {
    props: {
      chapterSlug: params.chapter,
      chapterContent: chapter?.content || '',
    },
  };
}
