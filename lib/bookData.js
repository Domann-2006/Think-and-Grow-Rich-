// Chapter metadata
export const CHAPTERS = [
  {
    id: 'preface',
    num: 0,
    slug: 'preface',
    title: "Publisher's Preface & Author's Preface",
    subtitle: 'Introduction to the Philosophy',
    step: null,
    readTime: 12,
  },
  {
    id: '1',
    num: 1,
    slug: '1',
    title: 'Introduction',
    subtitle: 'Thoughts Are Things',
    step: null,
    readTime: 18,
  },
  {
    id: '2',
    num: 2,
    slug: '2',
    title: 'Desire',
    subtitle: 'The Starting Point of All Achievement',
    step: 'The First Step toward Riches',
    readTime: 22,
  },
  {
    id: '3',
    num: 3,
    slug: '3',
    title: 'Faith',
    subtitle: 'Visualization of, and Belief in Attainment of Desire',
    step: 'The Second Step toward Riches',
    readTime: 20,
  },
  {
    id: '4',
    num: 4,
    slug: '4',
    title: 'Auto-Suggestion',
    subtitle: 'The Medium for Influencing the Subconscious Mind',
    step: 'The Third Step toward Riches',
    readTime: 10,
  },
  {
    id: '5',
    num: 5,
    slug: '5',
    title: 'Specialized Knowledge',
    subtitle: 'Personal Experiences or Observations',
    step: 'The Fourth Step toward Riches',
    readTime: 24,
  },
  {
    id: '6',
    num: 6,
    slug: '6',
    title: 'Imagination',
    subtitle: 'The Workshop of the Mind',
    step: 'The Fifth Step toward Riches',
    readTime: 20,
  },
  {
    id: '7',
    num: 7,
    slug: '7',
    title: 'Organized Planning',
    subtitle: 'The Crystallization of Desire into Action',
    step: 'The Sixth Step toward Riches',
    readTime: 48,
  },
  {
    id: '8',
    num: 8,
    slug: '8',
    title: 'Decision',
    subtitle: 'The Mastery of Procrastination',
    step: 'The Seventh Step toward Riches',
    readTime: 18,
  },
  {
    id: '9',
    num: 9,
    slug: '9',
    title: 'Persistence',
    subtitle: 'The Sustained Effort Necessary to Induce Faith',
    step: 'The Eighth Step toward Riches',
    readTime: 25,
  },
  {
    id: '10',
    num: 10,
    slug: '10',
    title: 'Power of the Master Mind',
    subtitle: 'The Driving Force',
    step: 'The Ninth Step toward Riches',
    readTime: 11,
  },
  {
    id: '11',
    num: 11,
    slug: '11',
    title: 'The Mystery of Sex Transmutation',
    subtitle: 'The Tenth Step toward Riches',
    step: 'The Tenth Step toward Riches',
    readTime: 32,
  },
  {
    id: '12',
    num: 12,
    slug: '12',
    title: 'The Subconscious Mind',
    subtitle: 'The Connecting Link',
    step: 'The Eleventh Step toward Riches',
    readTime: 11,
  },
  {
    id: '13',
    num: 13,
    slug: '13',
    title: 'The Brain',
    subtitle: 'A Broadcasting and Receiving Station for Thought',
    step: 'The Twelfth Step toward Riches',
    readTime: 10,
  },
  {
    id: '14',
    num: 14,
    slug: '14',
    title: 'The Sixth Sense',
    subtitle: 'The Door to the Temple of Wisdom',
    step: 'The Thirteenth Step toward Riches',
    readTime: 16,
  },
  {
    id: '15',
    num: 15,
    slug: '15',
    title: 'How to Outwit the Six Ghosts of Fear',
    subtitle: 'Take Inventory of Yourself',
    step: null,
    readTime: 44,
  },
];

export const DAILY_QUOTES = [
  {
    text: "Whatever the mind of man can conceive and believe, it can achieve.",
    chapter: "Ch. 1",
  },
  {
    text: "The starting point of all achievement is desire. Keep this constantly in mind. Weak desires bring weak results.",
    chapter: "Ch. 2 — Desire",
  },
  {
    text: "Faith is the head chemist of the mind. When faith is blended with the vibration of thought, the subconscious mind instantly picks up the vibration.",
    chapter: "Ch. 3 — Faith",
  },
  {
    text: "Knowledge will not attract money, unless it is organized, and intelligently directed through practical plans of action.",
    chapter: "Ch. 5 — Specialized Knowledge",
  },
  {
    text: "There are no limitations to the mind except those we acknowledge.",
    chapter: "Ch. 6 — Imagination",
  },
  {
    text: "Procrastination, the opposite of decision, is a common enemy which practically every man must conquer.",
    chapter: "Ch. 8 — Decision",
  },
  {
    text: "Persistence is to the character of man as carbon is to steel.",
    chapter: "Ch. 9 — Persistence",
  },
  {
    text: "No man has a chance to enjoy permanent success until he begins to look in a mirror for the real cause of all his mistakes.",
    chapter: "Ch. 15",
  },
];

export function getTodaysQuote() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
  );
  return DAILY_QUOTES[dayOfYear % DAILY_QUOTES.length];
}
