import { motion } from 'framer-motion';

export const ChatSection = () => {
  return (
    <section id="chat-section" className="w-full py-24 md:py-32 flex flex-col items-center relative z-20">
      <div className="max-w-3xl mx-auto w-full px-6 flex flex-col items-center">
        <h2 className="text-[32px] lg:text-[56px] font-bold tracking-tight mb-4 text-center text-[#27170c]">
          Find your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8CA898] to-[#99B6A6]">perspective.</span>
        </h2>
        <p className="text-center text-[#27170c]/70 text-lg md:text-xl max-w-2xl mx-auto mb-16">
          Your personal companion that helps you reflect, reframe, and grow from your experiences.
        </p>

        {/* Chat Interface Mockup */}
        <div className="w-full max-w-2xl bg-white/60 border border-black/5 rounded-[32px] p-6 md:p-10 backdrop-blur-xl flex flex-col gap-8 shadow-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="flex flex-col items-end w-full"
          >
            <div className="bg-white text-[#27170c] rounded-2xl rounded-tr-sm px-5 py-4 max-w-[85%] md:max-w-[75%] shadow-sm border border-black/5">
              <p className="text-sm md:text-base leading-relaxed">
                I was looking back at December... I was really struggling with burnout. It felt like everything was falling apart.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-start w-full gap-2"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8CA898] to-[#99B6A6] flex items-center justify-center mb-1 shadow-sm">
              <span className="text-white text-xs font-bold">N</span>
            </div>
            <div className="bg-gradient-to-br from-[#8CA898]/10 to-[#99B6A6]/10 text-[#27170c] rounded-2xl rounded-tl-sm px-5 py-4 max-w-[90%] md:max-w-[85%] border border-[#8CA898]/20 shadow-sm">
              <p className="text-sm md:text-base leading-relaxed">
                You were. But if you look at your timeline, you also showed incredible resilience. You started taking morning walks, prioritized rest, and by January, you successfully pushed through.
                <br /><br />
                Be proud of how you navigated that hard time. You are stronger than you realize. ❤️
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
