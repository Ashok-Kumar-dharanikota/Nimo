import { MessageCircle, Rocket, Smartphone, Sparkles, Zap } from 'lucide-react-native';
import React from 'react';

export const WaitlistSection = () => {
  return (
    <section id="waitlist" className="w-full py-24 md:py-32 flex flex-col items-center relative z-20 pb-48">
      <div id="beta-testing" className="max-w-2xl mx-auto w-full px-6 flex flex-col items-center text-center">
        {/* Android Beta Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E58C74]/15 border border-[#E58C74]/30 text-[#E58C74] text-xs font-bold uppercase tracking-wider mb-4">
          <Smartphone size={14} className="text-[#E58C74]" /> Android Beta Live
        </div>

        <h2 className="text-[28px] lg:text-[48px] font-bold tracking-tight mb-4 text-[#27170c]">
          Join the Nimo Beta
        </h2>
        <p className="text-[#27170c]/70 text-lg md:text-xl mb-8 max-w-xl">
          Get early access on Android via Google Play. Help us test new features, share your thoughts, and build the future of mindful memory journaling together!
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/60 border border-black/5 text-[#27170c]/80 text-xs font-medium backdrop-blur-sm">
            <Sparkles size={14} className="text-[#E58C74]" /> Early Access on Google Play
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/60 border border-black/5 text-[#27170c]/80 text-xs font-medium backdrop-blur-sm">
            <MessageCircle size={14} className="text-[#9060B2]" /> Direct Line to Founders
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/60 border border-black/5 text-[#27170c]/80 text-xs font-medium backdrop-blur-sm">
            <Zap size={14} className="text-[#8CA898]" /> Shape V1.0 Launch
          </div>
        </div>

        <div className="w-full max-w-lg bg-white/60 border border-black/5 rounded-[32px] p-6 md:p-8 backdrop-blur-xl shadow-md overflow-hidden flex items-center justify-center min-h-[350px]">
          <iframe
            src="https://tally.so/embed/44qqB5?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
            loading="lazy"
            width="100%"
            height="350"
            style={{ border: 'none', margin: 0, padding: 0 }}
            title="Join Android Beta"
          />
        </div>
      </div>
    </section>
  );
};
