import React from 'react';

export const WaitlistSection = () => {
  return (
    <section id="waitlist" className="w-full py-24 md:py-32 flex flex-col items-center relative z-20 pb-48">
      <div className="max-w-2xl mx-auto w-full px-6 flex flex-col items-center text-center">
        <h2 className="text-[28px] lg:text-[48px] font-bold tracking-tight mb-4 text-[#27170c]">
          Ready to capture your moments?
        </h2>
        <p className="text-[#27170c]/70 text-lg md:text-xl mb-12">
          Join the waitlist to get early access to Nimo when we launch.
        </p>

        <div className="w-full max-w-lg bg-white/60 border border-black/5 rounded-[32px] p-6 md:p-8 backdrop-blur-xl shadow-md overflow-hidden flex items-center justify-center min-h-[350px]">
          <iframe
            src="https://tally.so/embed/44qqB5?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
            loading="lazy"
            width="100%"
            height="350"
            style={{ border: 'none', margin: 0, padding: 0 }}
            title="Join Waitlist"
          />
        </div>
      </div>
    </section>
  );
};
