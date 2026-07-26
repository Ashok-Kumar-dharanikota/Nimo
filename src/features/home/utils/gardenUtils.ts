import { createMMKV } from 'react-native-mmkv';

const gardenStorage = createMMKV({ id: 'nimo-garden-store' });

// ─── Growth Stages ───────────────────────────────────────────────
// Based on number of moments in a single day
export type GrowthStage = 'empty' | 'seed' | 'sprout' | 'sapling' | 'bloom' | 'tree';

export const getGrowthStage = (momentCount: number): GrowthStage => {
  if (momentCount === 0) return 'empty';
  if (momentCount === 1) return 'seed';
  if (momentCount === 2) return 'sprout';
  if (momentCount === 3) return 'sapling';
  if (momentCount >= 4 && momentCount < 6) return 'bloom';
  return 'tree'; // 6+
};

// ─── Emotion → Plant Visuals ─────────────────────────────────────
// No emojis — uses sprout.png + colored petal/leaf Views
export type PlantType = 'sunflower' | 'tulip' | 'rose' | 'daisy' | 'lavender' | 'fern';

export interface PlantVisual {
  type: PlantType;
  petalColor: string;  // Color of the petal shapes around the sprout
  bgColor: string;     // Soft glow background behind bloomed plants
  stemColor: string;   // Color for leaf shapes
  label: string;
}

const PLANT_MAP: Record<string, PlantVisual> = {
  happy: {
    type: 'sunflower',
    petalColor: '#F9A825',
    bgColor: 'rgba(249, 168, 37, 0.15)',
    stemColor: '#7CB342',
    label: 'Sunflower',
  },
  inspired: {
    type: 'tulip',
    petalColor: '#E040FB',
    bgColor: 'rgba(224, 64, 251, 0.12)',
    stemColor: '#66BB6A',
    label: 'Tulip',
  },
  loved: {
    type: 'rose',
    petalColor: '#E91E63',
    bgColor: 'rgba(233, 30, 99, 0.12)',
    stemColor: '#558B2F',
    label: 'Rose',
  },
  bright: {
    type: 'daisy',
    petalColor: '#FFB300',
    bgColor: 'rgba(255, 179, 0, 0.15)',
    stemColor: '#7CB342',
    label: 'Daisy',
  },
  calm: {
    type: 'lavender',
    petalColor: '#7E57C2',
    bgColor: 'rgba(126, 87, 194, 0.12)',
    stemColor: '#81C784',
    label: 'Lavender',
  },
};

const DEFAULT_PLANT: PlantVisual = {
  type: 'fern',
  petalColor: '#66BB6A',
  bgColor: 'rgba(102, 187, 106, 0.12)',
  stemColor: '#558B2F',
  label: 'Fern',
};

export const getPlantVisual = (emotion: string | null): PlantVisual => {
  if (!emotion) return DEFAULT_PLANT;
  return PLANT_MAP[emotion.toLowerCase()] ?? DEFAULT_PLANT;
};

// ─── Garden Themes ───────────────────────────────────────────────
export type GardenThemeId = 'sprout' | 'cherry' | 'sunflower';

export interface GardenTheme {
  id: GardenThemeId;
  name: string;
  description: string;
  isPremium: boolean;
  // Colors
  bgColor: string;
  emptyDotColor: string;
  emptyDotBorder: string;
  todayRingColor: string;
  fabColor: string;
  // Theme can tint petal colors
  petalTint?: string;
}

export const GARDEN_THEMES: GardenTheme[] = [
  {
    id: 'sprout',
    name: 'Little Sprout',
    description: 'The beginning of your journey.',
    isPremium: false,
    bgColor: '#fbf9f4',
    emptyDotColor: '#fbf9f4',
    emptyDotBorder: '#e4e2dd',
    todayRingColor: '#7CB342',
    fabColor: '#7CB342',
  },
  {
    id: 'cherry',
    name: 'Cherry Blossoms',
    description: 'Springtime in full bloom.',
    isPremium: true,
    bgColor: '#fff5f8',
    emptyDotColor: '#fff5f8',
    emptyDotBorder: '#f5d5de',
    todayRingColor: '#F06292',
    fabColor: '#F06292',
    petalTint: '#F48FB1',
  },
  {
    id: 'sunflower',
    name: 'Golden Sunflowers',
    description: 'Bright and full of energy.',
    isPremium: true,
    bgColor: '#fffcf0',
    emptyDotColor: '#fffcf0',
    emptyDotBorder: '#f0e6c0',
    todayRingColor: '#FFA000',
    fabColor: '#FFA000',
    petalTint: '#FFD54F',
  },
];

export const getTheme = (id: GardenThemeId): GardenTheme => {
  return GARDEN_THEMES.find((t) => t.id === id) ?? GARDEN_THEMES[0];
};

// ─── Theme Persistence ───────────────────────────────────────────
const THEME_KEY = 'garden_theme';

export const getSavedTheme = (): GardenThemeId => {
  return (gardenStorage.getString(THEME_KEY) as GardenThemeId) ?? 'sprout';
};

export const saveTheme = (themeId: GardenThemeId) => {
  gardenStorage.set(THEME_KEY, themeId);
};

// ─── Garden Stats ────────────────────────────────────────────────
export interface GardenStats {
  totalPlants: number;
  currentStreak: number;
  longestStreak: number;
  bloomCount: number; // days with 4+ moments
  uniqueEmotions: number;
}

export const calculateGardenStats = (
  days: Array<{ moments: Array<{ emotion: string | null }>; isToday: boolean; date: Date }>
): GardenStats => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let totalPlants = 0;
  let bloomCount = 0;
  const emotionSet = new Set<string>();

  // For streaks, we only care about days up to today
  const pastDays = days.filter((d) => {
    const dayDate = new Date(d.date);
    dayDate.setHours(0, 0, 0, 0);
    return dayDate <= today;
  });

  // Calculate streaks (consecutive days with at least 1 moment)
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  for (let i = pastDays.length - 1; i >= 0; i--) {
    const day = pastDays[i];
    if (day.moments.length > 0) {
      tempStreak++;
      if (i === pastDays.length - 1 || i === pastDays.length - 2) {
        currentStreak = tempStreak;
      }
    } else {
      if (i >= pastDays.length - 2) {
        currentStreak = tempStreak;
      }
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 0;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  for (const day of days) {
    if (day.moments.length > 0) {
      totalPlants++;
      if (day.moments.length >= 4) bloomCount++;
      for (const m of day.moments) {
        if (m.emotion) emotionSet.add(m.emotion);
      }
    }
  }

  return {
    totalPlants,
    currentStreak,
    longestStreak,
    bloomCount,
    uniqueEmotions: emotionSet.size,
  };
};
