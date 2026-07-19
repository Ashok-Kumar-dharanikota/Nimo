import React from 'react';
import {
  Activity,
  Coffee,
  Monitor,
  Utensils,
  Image as ImageIcon,
  Phone,
  Moon
} from 'lucide-react';

export const allMoments = [
  // Morning Phase
  {
    id: 'm1',
    phase: 'morning',
    time: '07:30 AM',
    title: 'Morning Walk',
    tag: 'Calm',
    tagBg: 'bg-[#8CA898]/20 text-[#27170c] dark:bg-[#8CA898]/10 dark:text-[#8CA898]',
    desc: 'The morning mist was still clearing. Just me, the trees, and a fresh start.',
    icon: <Activity size={12} />,
    iconBg: 'bg-[#8CA898] text-white',
    video: 'https://d2j2uxe7jasn0r.cloudfront.net/watermarks/video/UsHIP34/videoblocks-brunette-lady-walks-through-the-trees-alley-she-wears-casual-white-sweater_smsehuvvq__419948708a85d93d1cec3929ec1184bd__P360.mp4',
  },
  {
    id: 'm2',
    phase: 'morning',
    time: '08:30 AM',
    title: 'Breakfast Ritual',
    tag: 'Joy',
    tagBg: 'bg-[#E58C74]/20 text-[#27170c] dark:bg-[#E58C74]/10 dark:text-[#E58C74]',
    desc: 'Pouring over my favorite brew. Sometimes the smallest routines bring the most comfort.',
    icon: <Coffee size={12} />,
    iconBg: 'bg-[#E58C74] text-white',
    video: 'https://d2j2uxe7jasn0r.cloudfront.net/watermarks/video/S509qyqLJlm5lotho2/00pg-hwez-240523-nkr-k318xl__9fd783006a81ff1bcc2ba44daa79e7ec__P360.mp4',
  },
  {
    id: 'm3',
    phase: 'morning',
    time: '10:00 AM',
    title: 'Deep Work Starts',
    tag: 'Focus',
    tagBg: 'bg-gray-200 text-gray-800 dark:bg-white/10 dark:text-white/70',
    desc: 'Setting intentions for the day. Feeling completely locked in.',
    icon: <Monitor size={12} />,
    iconBg: 'bg-gray-300 text-gray-800 dark:bg-white/10 dark:text-white/80',
  },
  // Afternoon Phase
  {
    id: 'a1',
    phase: 'afternoon',
    time: '01:00 PM',
    title: 'Lunch downtown',
    tag: 'Inspired',
    tagBg: 'bg-[#E58C74]/20 text-[#E58C74] dark:bg-[#E58C74]/10 dark:text-[#E58C74]',
    desc: 'Taking a break from the screen. The energy of the city is exactly what I needed.',
    icon: <Utensils size={12} />,
    iconBg: 'bg-[#E58C74] text-white',
    image: 'https://images.pexels.com/photos/33248811/pexels-photo-33248811.jpeg?_gl=1*1x4p5xg*_ga*MTk1OTMwMTQ0NC4xNzY3MTE3Mjkx*_ga_8JE65Q40S6*czE3ODM1Mjk1ODQkbzYkZzEkdDE3ODM1Mjk3NzEkajYwJGwwJGgw',
  },
  {
    id: 'a2',
    phase: 'afternoon',
    time: '03:15 PM',
    title: 'Team Sync',
    tag: 'Growth',
    tagBg: 'bg-[#9060B2]/20 text-[#9060B2] dark:bg-[#9060B2]/10 dark:text-[#9060B2]',
    desc: 'Breakthrough on the new feature. Love seeing ideas finally click together.',
    icon: <Monitor size={12} />,
    iconBg: 'bg-[#9060B2] text-white',
  },
  // Evening Phase
  {
    id: 'e1',
    phase: 'evening',
    time: '06:30 PM',
    title: 'Golden Hour',
    tag: 'Inspired',
    tagBg: 'bg-[#E58C74]/20 text-[#E58C74] dark:bg-[#E58C74]/10 dark:text-[#E58C74]',
    desc: 'The sky turned to fire. Had to stop and just take it all in for a minute.',
    icon: <ImageIcon size={12} />,
    iconBg: 'bg-[#E58C74] text-white',
    video: 'https://cdn.pixabay.com/video/2021/08/13/84973-587646755_tiny.mp4',
  },
  {
    id: 'e2',
    phase: 'evening',
    time: '07:30 PM',
    title: 'Calling Home',
    tag: 'Calm',
    tagBg: 'bg-[#8CA898]/20 text-[#27170c] dark:bg-[#8CA898]/10 dark:text-[#8CA898]',
    desc: 'Hearing Mom laugh over the phone. It grounds me like nothing else.',
    icon: <Phone size={12} />,
    iconBg: 'bg-[#8CA898] text-white',
  },
  // Night Phase
  {
    id: 'n1',
    phase: 'night',
    time: '09:45 PM',
    title: 'City Lights',
    tag: 'Wonder',
    tagBg: 'bg-indigo-500/20 text-indigo-400 dark:bg-indigo-500/10 dark:text-indigo-400',
    desc: 'The world gets quiet, but the city stays alive. Perfect time to reflect.',
    icon: <Moon size={12} />,
    iconBg: 'bg-indigo-500 text-white',
    video: 'https://cdn.pixabay.com/video/2016/05/12/3134-166335905_tiny.mp4',
  },
  {
    id: 'n2',
    phase: 'night',
    time: '10:30 PM',
    title: 'Journaling',
    tag: 'Calm',
    tagBg: 'bg-[#8CA898]/20 text-gray-200 dark:bg-[#8CA898]/10 dark:text-[#8CA898]',
    desc: 'Writing this inside Nimo. Grateful for the chaos, the quiet, and everything in between.',
    icon: <Activity size={12} />,
    iconBg: 'bg-[#8CA898] text-white',
  }
];

export const collections = [
  {
    title: "Summer Trip to Italy",
    desc: "14 moments from your unforgettable vacation.",
    moments: [
      {
        image: "https://images.unsplash.com/photo-1516483638261-f4088921eece?q=80&w=1200&auto=format&fit=crop",
        caption: "Savoring the warm morning sun in the hills of Positano."
      },
      {
        image: "https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?q=80&w=1200&auto=format&fit=crop",
        caption: "Golden hours over the Tyrrhenian Sea."
      },
      {
        image: "https://images.unsplash.com/photo-1531572753726-0fd026e5e23c?q=80&w=1200&auto=format&fit=crop",
        caption: "Walking through ancient paths of history in Rome."
      }
    ]
  },
  {
    title: "Weekend at Home",
    desc: "Quiet mornings, warm coffee, and family time.",
    moments: [
      {
        image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop",
        caption: "Peaceful morning light filling up the room."
      },
      {
        image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=1200&auto=format&fit=crop",
        caption: "Starting the day slow with a warm, fresh brew."
      },
      {
        image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=1200&auto=format&fit=crop",
        caption: "Afternoon journaling - sorting thoughts, finding clarity."
      }
    ]
  },
  {
    title: "College Friends",
    desc: "Reunions and late-night laughs.",
    moments: [
      {
        image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop",
        caption: "A long-overdue reunion. The years melt away instantly."
      },
      {
        image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1200&auto=format&fit=crop",
        caption: "Shared stories, hearty laughs, and endless nostalgia."
      },
      {
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
        caption: "To the old days and the new paths we walk."
      }
    ]
  }
];

export const phaseNarratives: Record<string, { subtitle: string; title: string; desc: string }> = {
  morning: {
    subtitle: "The Day Begins",
    title: "A new day. A blank page.",
    desc: "Capture your moments. We'll help you remember what matters."
  },
  afternoon: {
    subtitle: "Midday Flow",
    title: "Focus. Effort. Progress.",
    desc: "Work, focus, challenges and progress. All part of your story."
  },
  evening: {
    subtitle: "Winding Down",
    title: "The best part of the day.",
    desc: "You made it. Connections, memories and moments that matter."
  },
  night: {
    subtitle: "Reflection",
    title: "Every day leaves behind something beautiful.",
    desc: "Reflect. Grow. Keep going."
  }
};
