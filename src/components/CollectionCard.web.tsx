import React from 'react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

interface Moment {
  image: string;
  caption: string;
}

interface Collection {
  title: string;
  desc: string;
  moments: Moment[];
}

export const CollectionCard = ({ collection }: { collection: Collection }) => {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % collection.moments.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [collection.moments.length]);

  const currentMoment = collection.moments[index];

  return (
    <div className="min-w-[85vw] md:min-w-[600px] aspect-[4/3] md:aspect-video rounded-[32px] snap-center relative overflow-hidden group shadow-2xl border border-black/5">
      {/* Background Image Carousel */}
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={currentMoment.image}
          alt={collection.title}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 z-20">
        <h3 className="text-2xl lg:text-5xl font-bold text-white mb-2">{collection.title}</h3>
        <p className="text-sm md:text-base text-white/70 mb-4">{collection.desc}</p>

        {/* Caption */}
        <div className="h-12 md:h-16 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-lg md:text-xl font-medium text-white italic"
            >
              "{currentMoment.caption}"
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Dots Indicator for internal moments */}
      <div className="absolute top-6 right-8 flex gap-1.5 z-20">
        {collection.moments.map((_, dotIdx) => (
          <div
            key={dotIdx}
            className={cn(
              "h-1 rounded-full transition-all duration-300",
              index === dotIdx ? "w-6 bg-white" : "w-1.5 bg-white/40"
            )}
          />
        ))}
      </div>
    </div>
  );
};
