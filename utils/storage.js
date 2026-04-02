const KEYS = {
  PROGRESS: 'tagr_progress',
  BOOKMARKS: 'tagr_bookmarks',
  HIGHLIGHTS: 'tagr_highlights',
  NOTES: 'tagr_notes',
  THEME: 'tagr_theme',
  FONT_SIZE: 'tagr_font_size',
  LINE_HEIGHT: 'tagr_line_height',
};

// Safe localStorage wrapper
function getStorage() {
  if (typeof window === 'undefined') return null;
  return window.localStorage;
}

// ---- Progress ----
// { chapterId: string, scrollY: number, percent: number, updatedAt: string }
export function getProgress() {
  const s = getStorage();
  if (!s) return null;
  try { return JSON.parse(s.getItem(KEYS.PROGRESS)) || null; } catch { return null; }
}

export function saveProgress(chapterId, scrollY, percent) {
  const s = getStorage();
  if (!s) return;
  s.setItem(KEYS.PROGRESS, JSON.stringify({
    chapterId,
    scrollY,
    percent: Math.round(percent),
    updatedAt: new Date().toISOString(),
  }));
}

// ---- Chapter completion set ----
// stored as array of chapterIds
export function getReadChapters() {
  const s = getStorage();
  if (!s) return [];
  try { return JSON.parse(s.getItem('tagr_read_chapters')) || []; } catch { return []; }
}

export function markChapterRead(chapterId) {
  const s = getStorage();
  if (!s) return;
  const current = getReadChapters();
  if (!current.includes(chapterId)) {
    s.setItem('tagr_read_chapters', JSON.stringify([...current, chapterId]));
  }
}

// ---- Bookmarks ----
// array of chapterIds
export function getBookmarks() {
  const s = getStorage();
  if (!s) return [];
  try { return JSON.parse(s.getItem(KEYS.BOOKMARKS)) || []; } catch { return []; }
}

export function toggleBookmark(chapterId) {
  const s = getStorage();
  if (!s) return false;
  const current = getBookmarks();
  const isBookmarked = current.includes(chapterId);
  const updated = isBookmarked
    ? current.filter(id => id !== chapterId)
    : [...current, chapterId];
  s.setItem(KEYS.BOOKMARKS, JSON.stringify(updated));
  return !isBookmarked;
}

export function isBookmarked(chapterId) {
  return getBookmarks().includes(chapterId);
}

// ---- Highlights ----
// { chapterId: [ { id, text, color, createdAt } ] }
export function getHighlights(chapterId) {
  const s = getStorage();
  if (!s) return [];
  try {
    const all = JSON.parse(s.getItem(KEYS.HIGHLIGHTS)) || {};
    return all[chapterId] || [];
  } catch { return []; }
}

export function addHighlight(chapterId, text) {
  const s = getStorage();
  if (!s) return;
  try {
    const all = JSON.parse(s.getItem(KEYS.HIGHLIGHTS)) || {};
    const chapter = all[chapterId] || [];
    chapter.push({ id: Date.now(), text, color: 'gold', createdAt: new Date().toISOString() });
    all[chapterId] = chapter;
    s.setItem(KEYS.HIGHLIGHTS, JSON.stringify(all));
  } catch {}
}

export function removeHighlight(chapterId, id) {
  const s = getStorage();
  if (!s) return;
  try {
    const all = JSON.parse(s.getItem(KEYS.HIGHLIGHTS)) || {};
    all[chapterId] = (all[chapterId] || []).filter(h => h.id !== id);
    s.setItem(KEYS.HIGHLIGHTS, JSON.stringify(all));
  } catch {}
}

// ---- Notes ----
// { chapterId: [ { id, text, createdAt } ] }
export function getNotes(chapterId) {
  const s = getStorage();
  if (!s) return [];
  try {
    const all = JSON.parse(s.getItem(KEYS.NOTES)) || {};
    return all[chapterId] || [];
  } catch { return []; }
}

export function saveNote(chapterId, text) {
  const s = getStorage();
  if (!s) return;
  try {
    const all = JSON.parse(s.getItem(KEYS.NOTES)) || {};
    const chapter = all[chapterId] || [];
    chapter.push({ id: Date.now(), text, createdAt: new Date().toISOString() });
    all[chapterId] = chapter;
    s.setItem(KEYS.NOTES, JSON.stringify(all));
  } catch {}
}

export function deleteNote(chapterId, id) {
  const s = getStorage();
  if (!s) return;
  try {
    const all = JSON.parse(s.getItem(KEYS.NOTES)) || {};
    all[chapterId] = (all[chapterId] || []).filter(n => n.id !== id);
    s.setItem(KEYS.NOTES, JSON.stringify(all));
  } catch {}
}

// ---- Theme ----
export function getTheme() {
  const s = getStorage();
  if (!s) return 'dark';
  return s.getItem(KEYS.THEME) || 'dark';
}

export function saveTheme(theme) {
  const s = getStorage();
  if (!s) return;
  s.setItem(KEYS.THEME, theme);
}

// ---- Reader preferences ----
export function getReaderPrefs() {
  const s = getStorage();
  if (!s) return { fontSize: 18, lineHeight: 1.95 };
  try {
    return JSON.parse(s.getItem('tagr_reader_prefs')) || { fontSize: 18, lineHeight: 1.95 };
  } catch { return { fontSize: 18, lineHeight: 1.95 }; }
}

export function saveReaderPrefs(prefs) {
  const s = getStorage();
  if (!s) return;
  s.setItem('tagr_reader_prefs', JSON.stringify(prefs));
}
