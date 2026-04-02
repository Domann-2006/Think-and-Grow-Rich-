/**
 * Parses raw chapter text into structured paragraphs for rendering.
 * Preserves original text exactly; only structures it for display.
 */
export function parseChapterContent(rawText) {
  if (!rawText) return [];

  // Split on double newlines (paragraph breaks)
  const rawParagraphs = rawText
    .split(/\n{2,}/)
    .map(p => p.replace(/\n/g, ' ').replace(/\s{2,}/g, ' ').trim())
    .filter(p => p.length > 10);

  const paragraphs = [];

  for (let i = 0; i < rawParagraphs.length; i++) {
    const text = rawParagraphs[i];

    // Detect chapter header block (first few paragraphs with all-caps lines)
    if (i === 0 && /^CHAPTER\s+\d+/i.test(text)) {
      paragraphs.push({ type: 'chapter-header', text });
      continue;
    }

    // All-caps lines (section headings in Napoleon Hill's style)
    if (text === text.toUpperCase() && text.length < 200 && text.length > 5 && /[A-Z]{4,}/.test(text)) {
      paragraphs.push({ type: 'heading', text });
      continue;
    }

    // Lines that look like sub-headings (Title Case, short)
    if (text.length < 120 && /^[A-Z][a-z]/.test(text) && !/[.!?]$/.test(text) && !text.includes(',')) {
      paragraphs.push({ type: 'subheading', text });
      continue;
    }

    // Letter / quote blocks — lines starting with "Dear" or attributed quotes
    if (/^(Dear |MY DEAR |To |FROM )/.test(text) || (text.startsWith('"') && text.endsWith('"'))) {
      paragraphs.push({ type: 'quote', text });
      continue;
    }

    // Signature / attribution (short all-caps, name-like)
    if (text.length < 60 && /^[A-Z][A-Z.\s]+$/.test(text)) {
      paragraphs.push({ type: 'attribution', text });
      continue;
    }

    // Normal paragraph
    paragraphs.push({ type: 'paragraph', text });
  }

  return paragraphs;
}

/**
 * Returns the opening excerpt of a chapter for card previews.
 */
export function getChapterExcerpt(rawText, maxLength = 200) {
  if (!rawText) return '';
  const parsed = parseChapterContent(rawText);
  const firstParagraph = parsed.find(p => p.type === 'paragraph');
  if (!firstParagraph) return '';
  const text = firstParagraph.text;
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, '') + '...';
}

/**
 * Strips chapter header from raw text for word-count estimate.
 */
export function estimateReadTime(rawText) {
  if (!rawText) return 0;
  const wordCount = rawText.split(/\s+/).length;
  return Math.max(1, Math.round(wordCount / 200)); // ~200 wpm
}
