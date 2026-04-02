# Think & Grow Rich — Web App

A premium reading experience for *Think and Grow Rich* by Napoleon Hill.  
Built with Next.js · Tailwind CSS · localStorage persistence.

---

## Quick Start

```bash
# 1. Navigate into the project
cd tagr

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev

# 4. Open in browser
http://localhost:3000
```

---

## Project Structure

```
tagr/
├── components/
│   ├── ChapterCard.js       # Homepage chapter preview cards
│   ├── Navbar.js            # Sticky top navigation
│   ├── ProgressBar.js       # Reusable progress indicator
│   └── SettingsModal.js     # Font size / line height panel
│
├── lib/
│   ├── bookData.js          # Chapter metadata (titles, subtitles, read times)
│   └── ThemeContext.js      # Dark / light theme React context
│
├── pages/
│   ├── _app.js              # App wrapper (ThemeProvider)
│   ├── index.js             # Homepage (hero, continue reading, cards, quote)
│   ├── chapters.js          # Chapter list with sidebar
│   ├── 404.js               # Not found
│   └── reader/
│       └── [chapter].js     # Dynamic reader page
│
├── public/
│   └── data/
│       └── book_content.json  # Full book text extracted from PDF (582 KB)
│
├── styles/
│   └── globals.css          # Design system tokens + all component styles
│
└── utils/
    ├── parser.js            # PDF text → structured paragraphs
    └── storage.js           # localStorage: progress, bookmarks, highlights, notes
```

---

## Features

### Pages
| Page | Route |
|------|-------|
| Homepage | `/` |
| Chapter list | `/chapters` |
| Reader | `/reader/1` through `/reader/15` (also `preface`) |

### Reader Features
- **Dark / Light mode** — toggle in navbar or reader top bar, persisted to localStorage
- **Font size** — 14–28px, adjustable via ⚙ settings panel
- **Line height** — 1.4–2.8, adjustable via ⚙ settings panel
- **Reading progress** — live percentage + top progress bar
- **Auto-save position** — scroll position saved every 800ms, restored on return
- **Chapter completion** — auto-marked read at 90% scroll depth
- **Bookmarks** — 🔖 toggle per chapter, persisted
- **Highlights** — enable ✏ mode, select any text, click Highlight button
- **Notes** — 📝 panel to write and save per-chapter notes
- **Prev / Next navigation** — footer chapter links
- **Table of Contents** — ☰ button links to chapters page

### Homepage
- Hero section with animated entrance
- "Continue Reading" card (only shown when progress exists)
- Featured chapter grid (Chapters 1–6)
- Daily rotating wisdom quote from the book

### Chapters Page
- Sticky sidebar with all chapters + read/reading/unread indicators
- Overall reading progress bar
- Full chapter list with excerpts, step labels, and read times

---

## Design System

| Token | Value |
|-------|-------|
| Accent | `#C9A84C` (gold) |
| Dark BG | `#0D0E13` |
| Light BG | `#F8F5EE` |
| Display font | Playfair Display (serif) |
| Body font | Cormorant Garamond (serif) |
| UI font | DM Sans (sans-serif) |

All tokens are CSS custom properties in `styles/globals.css`.  
Dark/light classes are applied to `<html>` via `ThemeContext`.

---

## Content

All 16 chapter sections were extracted directly from the original 1937 public domain PDF using `pdfplumber`. Text is rendered exactly as extracted — no rewriting or summarization.

Chapter slugs: `preface`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `10`, `11`, `12`, `13`, `14`, `15`

---

## Build for Production

```bash
npm run build
npm start
```
