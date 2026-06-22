import { memo } from 'react';

const Solution = () => {
  return (
<section className="relative py-28 px-6 md:px-16 bg-[#052659] overflow-hidden">
  
  {/* Background Glow */}
  <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-accent/10 blur-[180px] rounded-full"></div>

  <div className="relative z-10 max-w-7xl mx-auto">

    {/* Heading */}
    <div className="text-center mb-20">
      <span className="text-sky uppercase tracking-[0.25em] text-sm font-semibold">
        The Solution
      </span>

      <h2 className="mt-4 text-4xl md:text-6xl font-bold text-white">
        Innovation Hub
        <span className="block text-sky">
          Solves All Of This
        </span>
      </h2>

      <p className="mt-6 text-gray-300 max-w-3xl mx-auto text-lg">
        Everything students need to transform ideas into impactful projects,
        collaborate with peers, and gain recognition—all in one platform.
      </p>
    </div>

    {/* Cards Grid */}
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

      {[
        {
          icon: "🎯",
          title: "Explore Projects",
          desc: "Discover innovative projects built by students across different domains."
        },
        {
          icon: "🤝",
          title: "Recruit Members",
          desc: "Find talented teammates and build stronger project teams."
        },
        {
          icon: "🚀",
          title: "Join Teams",
          desc: "Collaborate on exciting ideas and gain hands-on experience."
        },
        {
          icon: "🏆",
          title: "Gain Recognition",
          desc: "Earn likes, visibility, rankings, and recognition for your work."
        },
        {
          icon: "📁",
          title: "Build Portfolio",
          desc: "Create a professional project portfolio that showcases your skills."
        },
        {
          icon: "💡",
          title: "Showcase Innovation",
          desc: "Present your ideas, prototypes, and achievements to the community."
        }
      ].map((card, index) => (
        <div
          key={index}
          className="group relative p-[1px] rounded-3xl overflow-hidden"
        >
          {/* Glow Border */}
          <div className="absolute inset-0 bg-gradient-to-r from-accent via-[#7DA0CA] to-accent opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>

          {/* Card */}
          <div className="relative h-full rounded-3xl bg-primary/95 backdrop-blur-xl border border-white/10 p-8 transition-all duration-500 group-hover:-translate-y-3 group-hover:shadow-[0_0_40px_rgba(125,160,202,0.25)]">

            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-3xl mb-6 transition-all duration-500 group-hover:scale-110">
              {card.icon}
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-white mb-4">
              {card.title}
            </h3>

            {/* Description */}
            <p className="text-gray-400 leading-relaxed">
              {card.desc}
            </p>

            {/* Hover Arrow */}
            <div className="mt-6 text-sky opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-0 group-hover:translate-x-2">
              →
            </div>

          </div>
        </div>
      ))}
    </div>

  </div>
</section>
  );
};

export default memo(Solution);