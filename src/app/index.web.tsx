"use client";

import { cn } from '@/lib/utils';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { Image as ImageIcon } from 'lucide-react';
import React, { useRef } from 'react';

// Imports from separated components and constants
import { ChatSection } from '../components/ChatSection.web';
import { CollectionCard } from '../components/CollectionCard.web';
import { PhoneMockup } from '../components/PhoneMockup.web';
import { TypingText } from '../components/TypingText';
import { WaitlistSection } from '../components/WaitlistSection.web';
import { allMoments, collections, phaseNarratives } from '../constants/landing-data';

export default function LandingPageWeb() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isHovered = useRef(false);

  const displayCollections = [...collections, ...collections, ...collections];

  // Auto infinite scroll for collections carousel
  React.useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const interval = setInterval(() => {
      if (isHovered.current) return;
      const card = container.children[0] as HTMLElement;
      if (!card) return;

      const cardWidth = card.offsetWidth + 24; // Card width + gap-6
      container.scrollTo({
        left: container.scrollLeft + cardWidth,
        behavior: 'smooth'
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Initial scroll to center set (Set B)
  React.useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const timeout = setTimeout(() => {
      const card = container.children[0] as HTMLElement;
      if (card) {
        const cardWidth = card.offsetWidth + 24;
        container.scrollLeft = cardWidth * collections.length;
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  const timelineRef = useRef<HTMLDivElement>(null);

  // Use framer-motion's useScroll to track progress through the timeline container
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start start", "end end"]
  });

  // Static Premium Light Theme
  const backgroundColor = "#FAF6F0";
  const textColor = "#27170c";

  // Determine current active phase of the day based on scroll progress for React state (to trigger re-renders of lists)
  const [phase, setPhase] = React.useState('morning');
  const [activeCollectionIndex, setActiveCollectionIndex] = React.useState(0);

  // Sync the inner phone scrolling with the main page scroll
  const phoneScrollY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -1400] // Scrolls the phone content up by 1400px as you go down the page
  );

  // Sequence states
  const [sequenceTriggered, setSequenceTriggered] = React.useState(false);
  const [isAddingMoment, setIsAddingMoment] = React.useState(false);
  const [typingText, setTypingText] = React.useState('');
  const [photoAdded, setPhotoAdded] = React.useState(false);
  const [momentSaved, setMomentSaved] = React.useState(false);
  const [buttonScale, setButtonScale] = React.useState(1);

  React.useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      if (latest < 0.25) setPhase('morning');
      else if (latest < 0.5) setPhase('afternoon');
      else if (latest < 0.75) setPhase('evening');
      else setPhase('night');
    });
  }, [scrollYProgress]);

  // Handle Animation Sequence
  React.useEffect(() => {
    if (phase === 'afternoon' && !sequenceTriggered) {
      setSequenceTriggered(true);

      // 1. Simulate button click
      setTimeout(() => setButtonScale(0.9), 500);
      setTimeout(() => {
        setButtonScale(1);
        setIsAddingMoment(true); // 2. Show bottom sheet
      }, 700);

      // 3. Typing animation
      const textToType = "Watched a beautiful sunset...";
      let currentText = "";
      for (let i = 0; i < textToType.length; i++) {
        setTimeout(() => {
          currentText += textToType[i];
          setTypingText(currentText);
        }, 1200 + (i * 50));
      }

      // 4. Add photo
      setTimeout(() => {
        setPhotoAdded(true);
      }, 1200 + (textToType.length * 50) + 600);

      // 5. Save and dismiss
      setTimeout(() => {
        setIsAddingMoment(false);
        setMomentSaved(true);
      }, 1200 + (textToType.length * 50) + 1600);
    }
  }, [phase, sequenceTriggered]);

  // Filter moments shown in the simulator based on current active phase
  let visibleMoments = allMoments.filter((m) => {
    if (phase === 'morning') return m.phase === 'morning';
    if (phase === 'afternoon') return m.phase === 'morning' || m.phase === 'afternoon';
    if (phase === 'evening') return m.phase !== 'night';
    return true; // Night displays all
  });

  // Inject the animated moment into the timeline if saved
  if (momentSaved) {
    const animatedMoment = {
      id: 'a-anim',
      phase: 'afternoon',
      time: '04:30 PM',
      title: 'Captured the Sunset',
      tag: 'Inspired',
      tagBg: 'bg-[#E58C74]/20 text-[#E58C74] dark:bg-[#E58C74]/10 dark:text-[#E58C74]',
      desc: 'Watched a beautiful sunset...',
      icon: <ImageIcon size={12} />,
      iconBg: 'bg-[#E58C74] text-white',
      image: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?q=80&w=400&auto=format&fit=crop',
    };
    // Insert after afternoon moments or at end
    const lastAfternoonIndex = visibleMoments.findLastIndex(m => m.phase === 'afternoon');
    if (lastAfternoonIndex !== -1) {
      visibleMoments.splice(lastAfternoonIndex + 1, 0, animatedMoment);
    } else {
      visibleMoments.push(animatedMoment);
    }
  }

  return (
    <>
      {/* Fixed Full-Screen Background that changes color */}
      <motion.div
        className="fixed inset-0 z-[-1] pointer-events-none transition-colors duration-200"
        style={{ backgroundColor }}
      />

      <motion.div
        ref={containerRef}
        style={{ color: textColor }}
        className="relative flex flex-col w-full px-6 font-jakarta min-h-[400vh]"
      >
        {/* Ambient Glassy Orbs (Mindful/Memory Aesthetic) */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden transition-opacity duration-1000">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-[#8CA898]/20 to-[#E58C74]/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -40, 0],
              y: [0, 50, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[40%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-[#9060B2]/10 to-blue-400/10 blur-[100px] mix-blend-multiply dark:mix-blend-screen"
          />
        </div>

        {/* Two Column Layout (Content & Sticky Phone) */}
        <div
          ref={timelineRef}
          className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center lg:items-start gap-0 lg:gap-16 relative z-10 pb-32 lg:pb-64 h-[400vh] lg:h-auto"
        >
          {/* Left Column: The Narrative Story of the Day */}
          <div className="hidden lg:flex w-full lg:w-1/2 flex-col relative pt-4 lg:pt-16 order-2 lg:order-1">
            {/* 1. Morning Section */}
            <section className="min-h-[25vh] lg:min-h-[calc(100vh-100px)] flex flex-col justify-center items-start gap-4 lg:gap-6 py-8 lg:py-12 relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col gap-2"
              >
                <span className="text-[11px] font-bold tracking-[0.2em] uppercase opacity-60">The Day Begins</span>
                <h2 className="text-[36px] lg:text-[64px] leading-[1.05] font-playfair font-bold tracking-tight">
                  A new day.<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E58C74] to-[#D57C64]">A blank page.</span>
                </h2>
              </motion.div>

              <TypingText
                text="Capture your moments. We'll help you remember what matters."
                className="text-[16px] lg:text-[20px] leading-[28px] lg:leading-[32px] opacity-80 w-full max-w-md font-medium mt-4"
              />
            </section>

            {/* 2. Afternoon Section */}
            <section className="min-h-[25vh] lg:min-h-screen flex flex-col justify-center items-start gap-4 lg:gap-6 py-8 lg:py-12 relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col gap-2"
              >
                <h2 className="text-[36px] lg:text-[64px] leading-[1.05] font-playfair font-bold tracking-tight">
                  Focus. Effort.<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Progress.</span>
                </h2>
              </motion.div>

              <TypingText
                text="Work, focus, challenges and progress. All part of your story."
                className="text-[16px] lg:text-[20px] leading-[28px] lg:leading-[32px] opacity-80 w-full max-w-md font-medium mt-4"
              />
            </section>

            {/* 3. Evening Section */}
            <section className="min-h-[25vh] lg:min-h-screen flex flex-col justify-center items-start gap-4 lg:gap-6 py-8 lg:py-12 relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col gap-2"
              >
                <h2 className="text-[36px] lg:text-[64px] leading-[1.05] font-playfair font-bold tracking-tight">
                  The best part<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9060B2] to-[#B26085]">of the day.</span>
                </h2>
              </motion.div>

              <TypingText
                text="You made it. Connections, memories and moments that matter."
                className="text-[16px] lg:text-[20px] leading-[28px] lg:leading-[32px] opacity-80 w-full max-w-md font-medium mt-4"
              />
            </section>

            {/* 4. Night Section */}
            <section className="min-h-[25vh] lg:min-h-screen flex flex-col justify-center items-start gap-4 lg:gap-6 py-8 lg:py-12 relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col gap-2"
              >
                <h2 className="text-[36px] lg:text-[64px] leading-[1.05] font-playfair font-bold tracking-tight">
                  Every day leaves behind something<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8CA898] to-[#99B6A6]">beautiful.</span>
                </h2>
              </motion.div>

              <TypingText
                text="Reflect. Grow. Keep going."
                className="text-[16px] lg:text-[20px] leading-[28px] lg:leading-[32px] opacity-80 w-full max-w-md font-medium mt-4"
              />
            </section>
          </div>

          {/* Right Column: Sticky Phone Mockup Frame */}
          <div className="w-full lg:w-1/2 h-screen sticky top-0 flex flex-col lg:flex-row items-center justify-center z-20 order-1 lg:order-2 overflow-hidden">
            {/* Mobile Hook Header */}
            <div className="w-full mt-8 pb-6 px-6 flex flex-col items-center text-center gap-6 lg:hidden z-30">
              {/* Brand Name & Footnote Group */}
              <div className="flex flex-col items-center gap-3">
                <img
                  src={require('../../assets/images/nimo/brand_name.png')}
                  className="h-20 w-auto object-contain"
                  alt="Nimo Brand Name"
                />
                <img
                  src={require('../../assets/images/nimo/brand_footnote.png')}
                  className="h-10 w-auto object-contain opacity-80"
                  alt="Nimo Footnote"
                />
              </div>

              {/* Tagline & Call-to-Action Group */}
              <div className="flex flex-col items-center gap-2">
                {/* <h1 className="text-2xl font-playfair font-bold text-[#27170c] leading-tight">
                  Your life, <span className="text-[#9060B2]">beautifully remembered.</span>
                </h1> */}
                <p className="text-xs opacity-75 max-w-xs">
                  Nimo automatically remembers what matters most.
                </p>
                <button
                  onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}
                  className="mt-2 bg-[#27170c] text-white px-5 py-2 rounded-full font-bold text-xs shadow-md hover:opacity-90 transition-opacity"
                >
                  Join Waitlist
                </button>
              </div>
            </div>

            {/* Mobile Glassmorphic Narrative Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={phase}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="absolute left-6 right-6 z-30 p-5 rounded-2xl bg-white/70 border border-white/20 backdrop-blur-lg shadow-lg flex flex-col gap-1 lg:hidden text-center"
              >
                <span className="text-[9px] font-bold tracking-[0.2em] uppercase opacity-60">
                  {phaseNarratives[phase].subtitle}
                </span>
                <h4 className="text-[16px] font-playfair font-bold text-[#27170c]">
                  {phaseNarratives[phase].title}
                </h4>
                <p className="text-[12px] opacity-80 leading-relaxed font-medium text-[#27170c]/90">
                  {phaseNarratives[phase].desc}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Mockup Container */}
            <div className="flex-1 w-full flex items-center justify-center relative overflow-hidden lg:overflow-visible lg:h-full">
              <PhoneMockup
                phase={phase}
                phoneScrollY={phoneScrollY}
                buttonScale={buttonScale}
                isAddingMoment={isAddingMoment}
                typingText={typingText}
                photoAdded={photoAdded}
                visibleMoments={visibleMoments}
              />
            </div>
          </div>
        </div>

        {/* Footer text matching the image */}
        <div className="absolute bottom-6 left-0 w-full flex justify-center pb-6">
          <p className="text-center font-medium opacity-80 text-lg">
            Life happens. <span className="text-[#4E5F45] font-semibold">Nimo remembers it for you</span>
          </p>
        </div>
      </motion.div>

      {/* Section 5: Collections (Horizontal Carousel) */}
      <section id="collections-section" className="w-full py-24 md:py-32 flex flex-col relative z-20">
        <div className="max-w-7xl mx-auto w-full px-6 mb-12">
          <h2 className="text-[32px] lg:text-[56px] font-bold tracking-tight mb-4 text-center text-[#27170c]">
            Your life, <br className="md:hidden" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9060B2] to-[#B26085]">beautifully curated.</span>
          </h2>
          <p className="text-center text-[#27170c]/70 text-lg md:text-xl max-w-2xl mx-auto">
            Nimo automatically organizes your moments into meaningful collections.
          </p>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="w-full relative">
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-6 md:px-[calc(50vw-300px)] pb-8 hide-scrollbar"
            onMouseEnter={() => { isHovered.current = true; }}
            onMouseLeave={() => { isHovered.current = false; }}
            onTouchStart={() => { isHovered.current = true; }}
            onTouchEnd={() => { isHovered.current = false; }}
            onScroll={(e) => {
              const target = e.currentTarget;
              const card = target.children[0] as HTMLElement;
              if (!card) return;

              const cardWidth = card.offsetWidth + 24; // card width + gap
              const N = collections.length;

              // Calculate current scroll index
              const index = Math.round(target.scrollLeft / cardWidth);

              // Update active collection index for dots
              const activeIdx = index % N;
              if (activeCollectionIndex !== activeIdx) {
                setActiveCollectionIndex(activeIdx);
              }

              // Handle wrap-around seamlessly
              if (target.scrollLeft < cardWidth * N - 10) {
                target.scrollLeft += cardWidth * N;
              } else if (target.scrollLeft >= cardWidth * N * 2 - 10) {
                target.scrollLeft -= cardWidth * N;
              }
            }}
          >
            {displayCollections.map((col, i) => (
              <CollectionCard key={i} collection={col} />
            ))}
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center items-center gap-3 mt-4">
          {collections.map((_, i) => (
            <div key={i} className={cn("h-2 rounded-full transition-all duration-300", activeCollectionIndex === i ? "w-8" : "w-2")} />
          ))}
        </div>
      </section>

      {/* Section 6: AI Chat */}
      <ChatSection />

      {/* Section 7: Waitlist / Email Capture */}
      <WaitlistSection />
    </>
  );
}

