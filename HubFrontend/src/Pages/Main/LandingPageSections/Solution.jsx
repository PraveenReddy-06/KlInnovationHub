import { memo,useEffect } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import AOS from "aos";
import "aos/dist/aos.css";

const Solution = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
      easing: "ease-out-cubic",
    });
  }, []);

  const solutions = [
  {
    image: "/SolutionBg/1.png",
    title: "Explore Projects",
    desc: "Discover innovative projects built by students across different domains."
  },
  {
    image: "/SolutionBg/2.png",
    title: "Recruit Members",
    desc: "Find talented teammates and build stronger project teams."
  },
  {
    image: "/SolutionBg/3.png",
    title: "Join Teams",
    desc: "Collaborate on exciting ideas and gain hands-on experience."
  },
  {
    image: "/SolutionBg/4.png",
    title: "Gain Recognition",
    desc: "Earn likes, visibility, rankings, and recognition for your work."
  },
  {
    image: "/SolutionBg/5.png",
    title: "Build Portfolio",
    desc: "Create a professional project portfolio that showcases your skills."
  },
  {
    image: "/SolutionBg/6.png",
    title: "Showcase Innovation",
    desc: "Present your ideas, prototypes, and achievements to the community."
  }
];

  return (
  <section className="relative py-28 px-6 md:px-16 bg-[#052659] overflow-hidden">
  <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-accent/10 blur-[180px] rounded-full"></div>
  <div className="relative z-10 max-w-7xl mx-auto">

    <div className="text-center mb-20"data-aos="fade-up">
      <span   data-aos="fade-up" data-aos-delay="100" className="text-sky uppercase tracking-[0.25em] text-sm font-semibold">
        The Solution
      </span>
      <h2   data-aos="fade-up" data-aos-delay="200" className="mt-4 text-4xl md:text-6xl font-bold text-white">
        Innovation Hub
        <span className="block text-sky">
          Solves All Of This
        </span>
      </h2>
      <p   data-aos="fade-up" data-aos-delay="300" className="mt-6 text-gray-300 max-w-3xl mx-auto text-lg">
        Everything students need to transform ideas into impactful projects,
        collaborate with peers, and gain recognition—all in one platform.
      </p>
    </div>

      <Swiper
  modules={[Navigation]}
  navigation
  spaceBetween={30}
  slidesPerView={3}
  loop={true}
  centeredSlides={false}
  grabCursor={true}
  breakpoints={{
    320: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3.2,
    },
  }}
>
  {solutions.map((card, index) => (
    <SwiperSlide key={index}> 
      <div data-aos="fade-up" data-aos-delay={index * 150} className="group relative h-[380px] overflow-hidden rounded-3xl border border-white/10">

        <img
          src={card.image}
          alt={card.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#021024] via-[#021024]/70 to-transparent"></div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="backdrop-blur-md bg-black/20 border border-white/10 rounded-2xl p-5">

            <h3 className="text-2xl font-bold text-white mb-3">
              {card.title}
            </h3>

            <p className="text-gray-300 leading-relaxed">
              {card.desc}
            </p>

          </div>
        </div>

      </div>
    </SwiperSlide>
  ))}
</Swiper>
  </div>
  </section>
  );
};

export default memo(Solution);