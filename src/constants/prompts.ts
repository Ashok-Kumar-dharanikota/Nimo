export interface JournalPrompt {
  id: string;
  category: 'evening' | 'morning' | 'gratitude' | 'clarity' | 'presence' | 'growth';
  prompt: string;
  tag: string;
}

export const JOURNAL_PROMPTS: JournalPrompt[] = [
  {
    id: 'p1',
    category: 'presence',
    prompt: 'What was a small, quiet detail from today that made you pause?',
    tag: 'Presence',
  },
  {
    id: 'p2',
    category: 'gratitude',
    prompt: 'Who or what brought an unexpected sense of comfort to your day?',
    tag: 'Gratitude',
  },
  {
    id: 'p3',
    category: 'evening',
    prompt: 'What was the most honest feeling you experienced today?',
    tag: 'Reflection',
  },
  {
    id: 'p4',
    category: 'clarity',
    prompt: 'What is something you are holding onto that you can gently set down tonight?',
    tag: 'Letting Go',
  },
  {
    id: 'p5',
    category: 'growth',
    prompt: 'What did you handle with more patience or grace today than you used to?',
    tag: 'Growth',
  },
  {
    id: 'p6',
    category: 'gratitude',
    prompt: 'Describe a taste, scent, or sound today that made you feel grateful.',
    tag: 'Senses',
  },
  {
    id: 'p7',
    category: 'morning',
    prompt: 'What kind of energy do you wish to invite into your space today?',
    tag: 'Intention',
  },
  {
    id: 'p8',
    category: 'presence',
    prompt: 'Where did your mind wander the most today, and what is it trying to tell you?',
    tag: 'Awareness',
  },
  {
    id: 'p9',
    category: 'evening',
    prompt: 'If today was a chapter in a book, what would its title be?',
    tag: 'Story',
  },
  {
    id: 'p10',
    category: 'clarity',
    prompt: 'What is one truth you needed to hear today?',
    tag: 'Truth',
  },
  {
    id: 'p11',
    category: 'gratitude',
    prompt: 'What is something simple in your life right now that you take for granted?',
    tag: 'Gratitude',
  },
  {
    id: 'p12',
    category: 'presence',
    prompt: 'Take a slow, deep breath. What feeling is sitting right beneath the surface?',
    tag: 'Mindfulness',
  },
  {
    id: 'p13',
    category: 'growth',
    prompt: 'What challenged you today, and how did you navigate through it?',
    tag: 'Resilience',
  },
  {
    id: 'p14',
    category: 'evening',
    prompt: 'What is one kind gesture or thought you gave to yourself or another today?',
    tag: 'Kindness',
  },
];

export const getRandomPrompt = (excludeId?: string): JournalPrompt => {
  const filtered = excludeId
    ? JOURNAL_PROMPTS.filter((p) => p.id !== excludeId)
    : JOURNAL_PROMPTS;
  const index = Math.floor(Math.random() * filtered.length);
  return filtered[index];
};
