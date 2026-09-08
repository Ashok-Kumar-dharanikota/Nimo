import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export { SCREEN_WIDTH, SCREEN_HEIGHT };

export const ONBOARDING_STORAGE_KEYS = {
  HAS_SEEN_ONBOARDING: 'hasSeenOnboarding',
} as const;

export interface FeatureSlideData {
  id: string;
  iconEmoji: string;
  iconBg: string;
  title: string;
  titleHighlight: string | null;
  description: string;
  characterSource: any;
}

export const FEATURE_SLIDES: FeatureSlideData[] = [
  {
    id: 'protect',
    iconEmoji: '🛡️',
    iconBg: '#e8f4ef',
    title: 'Nimos protect\nyour memories',
    titleHighlight: null,
    description: 'We keep your precious moments safe, private and secure.',
    characterSource: require('@/assets/images/nimo/nimo_protect.jpg'),
  },
  {
    id: 'capture',
    iconEmoji: '🖼️',
    iconBg: '#e8f0f8',
    title: 'Capture anything,\nremember everything',
    titleHighlight: null,
    description: 'Photos, videos, notes, voice or places – Nimo remembers it all.',
    characterSource: require('@/assets/images/nimo/nimo_capture.jpg'),
  },
  {
    id: 'relive',
    iconEmoji: '💜',
    iconBg: '#f0eaf8',
    title: 'Relive. Reflect.\nGrow.',
    titleHighlight: null,
    description: 'Nimo helps you look back, understand and grow with your memories.',
    characterSource: require('@/assets/images/nimo/nimo_relive.jpg'),
  },
  {
    id: 'notifications',
    iconEmoji: '🔔',
    iconBg: '#fff4e6',
    title: 'Stay on track',
    titleHighlight: null,
    description: 'Enable notifications to remember to record your moments and daily tasks.',
    characterSource: require('@/assets/images/nimo/nimo_welcome.jpg'),
  },
];

// Total slides: welcome (0) + 4 features (1-4) + get-started (5)
export const TOTAL_SLIDES = 6;
