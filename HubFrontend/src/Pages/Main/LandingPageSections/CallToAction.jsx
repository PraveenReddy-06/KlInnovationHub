import { memo } from 'react';
import { useNavigate } from "react-router-dom";

const CallToAction = () => {
   const navigate = useNavigate();
  return (
    <div>
      <section className="relative py-32 bg-dashboard overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-150 h-150 bg-accent/15 rounded-full blur-[180px]" />
        </div>

        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-accent/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-accent/40 to-transparent"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">

          <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            Ready To Build
            <span className="block text-sky">Something Meaningful?</span>
          </h2>

          <p className="mt-8 text-lg md:text-xl text-light-blue/80 max-w-3xl mx-auto leading-relaxed">
            Join students who are transforming ideas into impactful projects, collaborating with talented peers, and driving innovation across campus.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 mt-12">
            <button onClick={() => navigate("/signup")} className="px-8 py-4 border border-accent/40 bg-secondary/60 backdrop-blur-xl text-white font-semibold transition-all duration-500 hover:border-sky hover:bg-secondary hover:scale-105">
              Create Profile
            </button >
          </div>
        </div>
      </section>
    </div>
  );
};

export default memo(CallToAction);