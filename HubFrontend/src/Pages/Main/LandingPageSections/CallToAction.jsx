import { memo } from 'react';

const CallToAction = () => {
  return (
    <div>
      <section className="relative py-32 bg-[#011b3c] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[600px] h-[600px] bg-[#5483B3]/15 rounded-full blur-[180px]" />
        </div>

        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#5483B3]/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#5483B3]/40 to-transparent"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-2 rounded-full border border-[#5483B3]/30 bg-[#052659]/50 text-[#7DA0CA] text-sm font-medium mb-8">
            Start Your Journey Today
          </span>

          <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            Ready To Build
            <span className="block text-[#7DA0CA]">Something Meaningful?</span>
          </h2>

          <p className="mt-8 text-lg md:text-xl text-[#C1E8FF]/80 max-w-3xl mx-auto leading-relaxed">
            Join students who are transforming ideas into impactful projects, collaborating with talented peers, and driving innovation across campus.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 mt-12">
            <button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#5483B3] to-[#7DA0CA] text-[#021024] font-bold transition-all duration-500 hover:scale-105 hover:shadow-[0_0_35px_rgba(125,160,202,0.4)]">
              Explore Projects
            </button>

            <button className="px-8 py-4 rounded-2xl border border-[#5483B3]/40 bg-[#052659]/60 backdrop-blur-xl text-white font-semibold transition-all duration-500 hover:border-[#7DA0CA] hover:bg-[#052659] hover:scale-105">
              Create Profile
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default memo(CallToAction);