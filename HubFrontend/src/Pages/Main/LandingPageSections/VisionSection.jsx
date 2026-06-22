import { memo,useEffect } from 'react';
import AOS from "aos";
import "aos/dist/aos.css";

const VisionSection = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
      easing: "ease-out-cubic",
    });
  }, []);

  const NetworkNode = ({ title, className, aos, delay }) => (
    <div
      data-aos={aos}
      data-aos-delay={delay}
      className={`${className} px-8 py-4 rounded-2xlborder border-white bg-bloodstone backdrop-blur-xl text-white`}>
      {title}
    </div>
  );

  return (
    <div>
      <section className="relative py-32 bg-tan overflow-hidden text-white">

  <div className="relative z-10 max-w-7xl mx-auto px-6">

    <div className="text-center mb-20"   data-aos="fade-up">
      <span   data-aos="fade-up" data-aos-delay="100" className="text-black uppercase tracking-widest text-sm font-semibold">
        Our Vision
      </span>
      <h2   data-aos="fade-up" data-aos-delay="200" className="mt-4 text-4xl md:text-6xl font-bold text-black">
        Building A Culture
        <span className="block text-black">
          Of Innovation
        </span>
      </h2>
      <p  data-aos="fade-up" data-aos-delay="300" className="mt-8 max-w-4xl mx-auto text-lg text-bloodstone leading-relaxed">
        Innovation Hub is more than a project platform. It is a university-wide
        ecosystem designed to connect students, encourage collaboration, and
        inspire innovation across disciplines.
      </p>
    </div>

    <div className="relative flex items-center justify-center min-h-[600px]">
      <div   data-aos="zoom-in" data-aos-delay="400" className="absolute z-20 w-48 h-48 rounded-full bg-amber-600 flex items-center justify-center shadow-[0_0_60px_rgba(125,160,202,0.4)]">
        <div className="text-center">
          <h3 className="text-[#021024] font-bold text-2xl">
            Innovation
          </h3>
          <p className="text-[#021024]/80 text-sm">
            Hub
          </p>
        </div>
      </div>

      <NetworkNode title="Students" aos="fade-down" delay="500" className="absolute top-0 left-1/2 -translate-x-1/2" />
      <NetworkNode title="Faculty" aos="fade-up" delay="600" className="absolute bottom-0 left-1/2 -translate-x-1/2" />
      <NetworkNode title="Projects" aos="fade-right" delay="700" className="absolute left-0 top-1/2 -translate-y-1/2" />
      <NetworkNode title="Teams" aos="fade-left" delay="800" className="absolute right-0 top-1/2 -translate-y-1/2" />
      <NetworkNode title="Research" aos="fade-right" delay="900" className="absolute top-20 left-32" />
      <NetworkNode title="Innovation" aos="fade-left" delay="1000" className="absolute top-20 right-32" />

      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 600">
        <line x1="500" y1="300" x2="500" y2="80" stroke="#5D0D18" strokeWidth="2" opacity="0.4"/>
        <line x1="500" y1="300" x2="500" y2="520" stroke="#5D0D18" strokeWidth="2" opacity="0.4"/>
        <line x1="500" y1="300" x2="180" y2="300" stroke="#5D0D18" strokeWidth="2" opacity="0.4"/>
        <line x1="500" y1="300" x2="820" y2="300" stroke="#5D0D18" strokeWidth="2" opacity="0.4"/>
        <line x1="500" y1="300" x2="280" y2="150" stroke="#5D0D18" strokeWidth="2" opacity="0.4"/>
        <line x1="500" y1="300" x2="720" y2="150" stroke="#5D0D18" strokeWidth="2" opacity="0.4"/>
      </svg>

    </div>

  </div>
</section>
    </div>
  );
};

export default memo(VisionSection);