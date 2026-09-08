import { createMMKV } from 'react-native-mmkv';

export const gardenStorage = createMMKV({ id: 'nimo-garden-store' });

// ─── Growth Stages ───────────────────────────────────────────────
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
export type PlantType = 'sunflower' | 'tulip' | 'rose' | 'daisy' | 'lavender' | 'fern';

export interface PlantVisual {
  type: PlantType;
  petalColor: string;
  bgColor: string;
  stemColor: string;
  label: string;
}

export const PLANT_MAP: Record<string, PlantVisual> = {
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
    petalColor: '#AB47BC',
    bgColor: 'rgba(171, 71, 188, 0.12)',
    stemColor: '#558B2F',
    label: 'Lavender',
  },
};

export const getPlantVisual = (emotion?: string | null): PlantVisual => {
  if (!emotion) {
    return {
      type: 'fern',
      petalColor: '#566434',
      bgColor: 'rgba(86, 100, 52, 0.12)',
      stemColor: '#566434',
      label: 'Wildflower',
    };
  }
  return (
    PLANT_MAP[emotion.toLowerCase()] ?? {
      type: 'fern',
      petalColor: '#566434',
      bgColor: 'rgba(86, 100, 52, 0.12)',
      stemColor: '#566434',
      label: 'Wildflower',
    }
  );
};

// ─── Themes ──────────────────────────────────────────────────────
export type GardenThemeId = 'sprout' | 'earth' | 'spring' | 'sunset' | 'meadow';

export interface GardenTheme {
  id: GardenThemeId;
  name: string;
  description: string;
  bgColor: string;
  treeColor: string;
  trunkColor: string;
  emptyDotBorder: string;
  emptyDotColor: string;
  todayRingColor: string;
  todayHaloColor: string;
  selectedStrokeColor: string;
  fabColor: string;
  headerTextColor: string;
}

export const GARDEN_THEMES: GardenTheme[] = [
  {
    id: 'sprout',
    name: 'Sprout',
    description: 'Nimo signature warm cream with sage green',
    bgColor: '#fbf9f4',
    emptyDotColor: '#fbf9f4',
    emptyDotBorder: '#e4e2dd',
    todayRingColor: '#7CB342',
    treeColor: '#566434',
    trunkColor: '#8c7c6c',
    todayHaloColor: '#566434',
    selectedStrokeColor: '#566434',
    fabColor: '#566434',
    headerTextColor: '#27170c',
  },
  {
    id: 'earth',
    name: 'Earth',
    description: 'Rich terracotta, stone and deep roots',
    bgColor: '#FAF6F0',
    emptyDotColor: '#FAF6F0',
    emptyDotBorder: '#D7CCC8',
    todayRingColor: '#8D6E63',
    treeColor: '#5D4037',
    trunkColor: '#8D6E63',
    todayHaloColor: '#BCAAA4',
    selectedStrokeColor: '#4E342E',
    fabColor: '#5D4037',
    headerTextColor: '#3E2723',
  },
  {
    id: 'spring',
    name: 'Spring Bloom',
    description: 'Fresh mint, blossom pinks and vibrant life',
    bgColor: '#F4F9F4',
    emptyDotColor: '#F4F9F4',
    emptyDotBorder: '#C8E6C9',
    todayRingColor: '#2E7D32',
    treeColor: '#2E7D32',
    trunkColor: '#689F38',
    todayHaloColor: '#A5D6A7',
    selectedStrokeColor: '#1B5E20',
    fabColor: '#2E7D32',
    headerTextColor: '#1B5E20',
  },
  {
    id: 'sunset',
    name: 'Golden Hour',
    description: 'Warm peach, dusky amber and evening glow',
    bgColor: '#FDF6F0',
    emptyDotColor: '#FDF6F0',
    emptyDotBorder: '#FDE68A',
    todayRingColor: '#C85A17',
    treeColor: '#C85A17',
    trunkColor: '#D97706',
    todayHaloColor: '#FBBF24',
    selectedStrokeColor: '#92400E',
    fabColor: '#C85A17',
    headerTextColor: '#78350F',
  },
  {
    id: 'meadow',
    name: 'Alpine Meadow',
    description: 'Cool slate, pine needles and misty air',
    bgColor: '#F2F6F7',
    emptyDotColor: '#F2F6F7',
    emptyDotBorder: '#CFD8DC',
    todayRingColor: '#37474F',
    treeColor: '#37474F',
    trunkColor: '#546E7A',
    todayHaloColor: '#90A4AE',
    selectedStrokeColor: '#263238',
    fabColor: '#37474F',
    headerTextColor: '#263238',
  },
];

const THEME_STORAGE_KEY = 'nimo_garden_theme';

export const getSavedTheme = (): GardenThemeId => {
  const saved = gardenStorage.getString(THEME_STORAGE_KEY);
  if (saved && GARDEN_THEMES.some((t) => t.id === saved)) {
    return saved as GardenThemeId;
  }
  return 'sprout';
};

export const saveTheme = (themeId: GardenThemeId): void => {
  gardenStorage.set(THEME_STORAGE_KEY, themeId);
};

export const getTheme = (themeId: GardenThemeId): GardenTheme => {
  return GARDEN_THEMES.find((t) => t.id === themeId) ?? GARDEN_THEMES[0];
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

  const pastDays = days.filter((d) => {
    const dayDate = new Date(d.date);
    dayDate.setHours(0, 0, 0, 0);
    return dayDate <= today;
  });

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
