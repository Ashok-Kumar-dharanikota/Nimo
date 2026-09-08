import { Smile, Sparkles, Heart, Sun, Coffee } from 'lucide-react-native';

export interface MomentDetailData {
  id: number;
  content: string;
  createdAt: string;
  journalTitle: string | null;
  emotion: string | null;
  title: string | null;
  mediaUri: string | null;
  mediaType: 'photo' | 'video' | null;
}

export const MOMENT_EMOTION_MAP: Record<
  string,
  { Icon: any; color: string; bg: string; label: string }
> = {
  happy: { Icon: Smile, color: '#566434', bg: '#eef1e4', label: 'Happy' },
  inspired: { Icon: Sparkles, color: '#b5651d', bg: '#f7ede2', label: 'Inspired' },
  loved: { Icon: Heart, color: '#a3506a', bg: '#f2e7ea', label: 'Loved' },
  bright: { Icon: Sun, color: '#d97706', bg: '#fef3c7', label: 'Bright' },
  calm: { Icon: Coffee, color: '#4f5c42', bg: '#eae3d6', label: 'Calm' },
};
