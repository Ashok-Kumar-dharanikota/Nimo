import { cn } from '@/lib/utils';
import { AnimatePresence, motion, MotionValue } from 'framer-motion';
import {
  Bell,
  Flame,
  Image as ImageIcon,
  Plus
} from 'lucide-react-native';
import React from 'react';

interface MomentItem {
  id: string;
  phase: string;
  time: string;
  title: string;
  tag: string;
  tagBg: string;
  desc: string;
  icon: React.ReactNode;
  iconBg: string;
  video?: string;
  image?: string;
}

interface PhoneMockupProps {
  phase: string;
  phoneScrollY: MotionValue<number>;
  buttonScale: number;
  isAddingMoment: boolean;
  typingText: string;
  photoAdded: boolean;
  visibleMoments: MomentItem[];
}

export const PhoneMockup = ({
  phase,
  phoneScrollY,
  buttonScale,
  isAddingMoment,
  typingText,
  photoAdded,
  visibleMoments
}: PhoneMockupProps) => {
  return (
    <div className="w-[300px] lg:w-[350px] lg:h-[650px] relative flex items-center mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="scale-[0.8] xs:scale-[0.85] sm:scale-[0.95] lg:scale-[1.15] origin-center absolute inset-0 pt-20 mt-20 flex items-center justify-center group"
      >

        {/* App Screen Content (Framed with Border and Shadow) */}
        <div className="relative w-[420px] h-[620px] z-10 rounded-[48px] border-[12px] shadow-2xl overflow-hidden flex flex-col transition-all duration-1000"
          style={{
            borderColor: phase === 'night' || phase === 'evening' ? '#1E293B' : '#0F172A',
            backgroundColor: phase === 'night' || phase === 'evening' ? '#121212' : '#FBF9F4'
          }}
        >
          {/* Phone Notch/Island */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-full z-30 flex items-center justify-center pointer-events-none">
            <div className="w-2 h-2 rounded-full bg-white/10 ml-auto mr-4" />
          </div>
          {/* We place the App Simulator Body inside */}
          <div className={cn(
            "flex-1 flex flex-col relative w-full h-full text-left",
            phase === 'night' || phase === 'evening' ? 'text-white' : 'text-[#1B1C19]'
          )}>
            {/* Dynamic Wallpaper Header inside Phone (Optional, keep subtle) */}
            <div className="absolute top-0 left-0 w-full h-48 z-0">
              <AnimatePresence mode="wait">
                {phase === 'morning' && (
                  <motion.div key="m" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} className="w-full h-full bg-gradient-to-b from-[#A4B47C]/20 to-transparent" />
                )}
                {phase === 'afternoon' && (
                  <motion.div key="a" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} className="w-full h-full bg-gradient-to-b from-[#E67E22]/10 to-transparent" />
                )}
                {phase === 'evening' && (
                  <motion.div key="e" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} className="w-full h-full bg-gradient-to-b from-[#8E84AD]/20 to-transparent" />
                )}
                {phase === 'night' && (
                  <motion.div key="n" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} className="w-full h-full bg-gradient-to-b from-indigo-900/40 to-transparent" />
                )}
              </AnimatePresence>
            </div>

            {/* App Content Container */}
            <div className="z-10 flex-1 flex flex-col overflow-hidden relative">
              <motion.div style={{ y: phoneScrollY }} className="flex flex-col p-5 pt-12 pb-32">
                {/* Stitch UI: Top AppBar */}
                <div className="flex flex-col w-full mb-6 relative">
                  <div className="flex justify-between items-center w-full mb-4">
                    <span className="font-semibold text-sm opacity-90">Good morning, Alex!</span>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-[#E67E22]">
                        <Flame size={14} />
                        <span className="text-[11px] font-bold">12</span>
                      </div>
                      <div className="w-7 h-7 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center shadow-sm bg-white/50 dark:bg-black/50">
                        <Bell size={12} />
                      </div>
                    </div>
                  </div>
                  {/* Calendar Row */}
                  <div className="flex justify-between items-center w-full px-1">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                      <div key={i} className="flex flex-col items-center gap-1.5">
                        <span className="text-[8px] font-semibold opacity-50 uppercase">{day}</span>
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold",
                          i === 2 ? "bg-black text-white dark:bg-white dark:text-black shadow-md" :
                            i === 1 || i === 3 ? "bg-[#A4B47C]/20 text-[#A4B47C]" :
                              "border border-black/10 dark:border-white/10 bg-white/30 dark:bg-black/30"
                        )}>
                          {i === 2 ? '22' : (i === 1 || i === 3) ? '✓' : ''}
                        </div>
                        <span className="text-[8px] font-semibold opacity-60">{20 + i}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stitch UI: Daily Timeline */}
                <div className="flex flex-col gap-6 relative pl-5 border-l-2 border-black/5 dark:border-white/10 ml-2 mt-2">
                  <h3 className="font-bold text-[15px] mb-2 -ml-7 opacity-90">Today's Flow</h3>

                  <AnimatePresence>
                    {visibleMoments.map((m, idx) => (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="relative flex flex-col gap-1 mb-2"
                      >
                        {/* Dot / Icon */}
                        <div className={cn(
                          "absolute -left-[32px] top-0 w-6 h-6 rounded-full border-2 text-[10px] flex items-center justify-center shadow-sm",
                          m.iconBg, phase === 'night' || phase === 'evening' ? "border-[#121212]" : "border-[#FBF9F4]"
                        )}>
                          {m.icon}
                        </div>

                        <span className="text-[9px] opacity-60 font-bold mb-0.5 tracking-wider uppercase">{m.time}</span>

                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="text-[12px] font-bold opacity-90">{m.title}</h4>
                          <span className={cn("text-[7px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider", m.tagBg)}>
                            {m.tag}
                          </span>
                        </div>

                        <p className="text-[10px] opacity-70 mb-2 leading-relaxed">{m.desc}</p>

                        {m.video ? (
                          <div className="w-full h-30 rounded-xl overflow-hidden border border-black/5 dark:border-white/10 shadow-sm relative">
                            <video
                              src={m.video}
                              autoPlay
                              loop
                              muted
                              playsInline
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : m.image ? (
                          <div className="w-full h-30 rounded-xl overflow-hidden border border-black/5 dark:border-white/10 shadow-sm">
                            <img src={m.image} alt={m.title} className="w-full h-full object-cover" />
                          </div>
                        ) : null}
                      </motion.div>
                    ))}

                    {/* Add Moment Item */}
                    <motion.div
                      animate={{ scale: buttonScale }}
                      className="relative flex flex-col group cursor-pointer mt-2 pb-4 origin-left"
                    >
                      <div className={cn(
                        "absolute -left-[32px] top-0 w-6 h-6 rounded-full border-2 border-dashed flex items-center justify-center",
                        "border-black/30 dark:border-white/30 text-black/40 dark:text-white/40",
                        phase === 'night' || phase === 'evening' ? "bg-[#121212]" : "bg-[#FBF9F4]"
                      )}>
                        <Plus size={12} />
                      </div>
                      <h4 className="text-[12px] font-bold opacity-80">Add Moment</h4>
                      <p className="text-[9px] opacity-50 mt-0.5">Log a new activity</p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>

            {/* Animated Bottom Sheet Overlay */}
            <AnimatePresence>
              {isAddingMoment && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/20 dark:bg-black/60 z-20 backdrop-blur-sm rounded-[34px]"
                  />
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 20, stiffness: 200 }}
                    className="absolute bottom-0 left-0 w-full h-[65%] bg-[#FBF9F4] dark:bg-[#1A1A1A] rounded-t-3xl shadow-2xl z-30 p-5 flex flex-col overflow-hidden"
                  >
                    <div className="w-10 h-1 bg-black/10 dark:bg-white/10 rounded-full self-center mb-5" />
                    <h3 className="font-bold text-sm mb-4">New Moment</h3>

                    <div className="flex-1 bg-black/5 dark:bg-white/5 rounded-2xl p-4 flex flex-col gap-2 relative">
                      <p className="text-[11px] opacity-80 min-h-[40px] leading-relaxed">
                        {typingText}
                        <motion.span
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ repeat: Infinity, duration: 0.8 }}
                        >|</motion.span>
                      </p>

                      <AnimatePresence>
                        {photoAdded && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="w-full h-28 rounded-xl overflow-hidden shadow-sm mt-auto"
                          >
                            <img
                              src="https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?q=80&w=400&auto=format&fit=crop"
                              alt="Sunset"
                              className="w-full h-full object-cover"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="mt-4 flex justify-between items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center">
                        <ImageIcon size={16} className="opacity-50" />
                      </div>
                      <div className="flex-1 h-10 rounded-full bg-[#E67E22] text-white flex items-center justify-center font-bold text-xs shadow-md">
                        Save Moment
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Stitch UI: Bottom Nav Bar */}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
