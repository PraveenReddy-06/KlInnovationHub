import { memo } from 'react';
import Navbar from "../../Components/Navbar";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../Api/axiosInstance";
import CountUp from "react-countup";
import {FolderKanban,GraduationCap,Handshake,Heart} from "lucide-react";
import Solution from './LandingPageSections/Solution';
import PlatformShowcase from './LandingPageSections/PlatformShowcase';

const LandingPage = () => {
  const [stats, setStats] = useState({
    projects: 0,
    students: 0,
    collaborations: 0,
    likes: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axiosInstance.get("/dashboard/stats");
      setStats(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const cards = [
    { icon: FolderKanban, value: stats.projects, label: "Projects Created" },
    { icon: GraduationCap, value: stats.students, label: "Students Joined" },
    { icon: Handshake, value: stats.collaborations, label: "Collaborations Made" },
    { icon: Heart, value: stats.likes, label: "Total Likes" },
  ];

  return (
    <div>
      <Navbar />
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-primary">        
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('/KlProfile.png')", backgroundSize: "cover", backgroundPosition: "center top" }} />        
        <div className="absolute -bottom-10 -right-16 w-105 h-105 opacity-[0.04] blur-[2px]" style={{ backgroundImage: "url('/LogoWhite.png')", backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center" }} />               
         <div className="flex flex-col items-center relative z-10 max-w-3xl mx-auto px-8 py-16 text-center">
          <img src="/LogoWhite.png" alt="" className="w-60 h-40 object-contain opacity-90" />
          <h2 className="text-light-blue font-semibold tracking-[0.4em] uppercase text-sm md:text-base mb-4">
            KL INNOVATION HUB
          </h2>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.08] tracking-tight text-cream mb-6">
            Ideas Need People. People Need This.
          </h1>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {["Projects", "Leaderboards", "Collaboration", "Showcase"].map(t => (
              <span key={t} className="text-[11px] font-medium bg-MydarkGreen text-white rounded-full px-3 py-1 tracking-wide">{t}</span>
            ))}
          </div>
          <p className="max-w-xl mx-auto text-base md:text-lg text-white font-light leading-relaxed mb-10">
            Discover projects, find teammates, showcase innovations, and become part of KL University's growing innovation ecosystem.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/exploreProjects" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-tan border border-amber-700 text-bloodstone text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5" >
              Explore Projects
            </Link>
            <Link to="/signup" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-tan border border-amber-700 text-bloodstone text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5" >
              Join Innovation Hub
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-primary to-transparent pointer-events-none" />
      </section>

      <section className="w-full bg-violet-500">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => {const Icon = card.icon;
            return (
              <div key={card.label} className="group text-white border border-black text-center backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#7DA0CA] hover:shadow-[0_0_30px_rgba(125,160,202,0.15)]">
                <div className="flex justify-center">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center">
                    <Icon size={28} strokeWidth={2} />
                  </div>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold">
                  {card.value.toLocaleString()}
                </h3>
                <p className="mt-2 text-sm md:text-base pb-4">
                  {card.label}
                </p>
              </div>);
          })}
      </div>
    </section>
    <section className="relative py-28 px-6 md:px-16 bg-primary overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-accent/10 blur-[180px] rounded-full"></div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-sky uppercase tracking-widest text-sm font-semibold">
              The Reality
            </span>
            <h2 className="mt-4 text-4xl md:text-6xl font-bold text-white">
              Why Innovation Stops
              <span className="block text-sky">Before It Starts</span>
            </h2>
            <p className="mt-6 text-gray-400 max-w-2xl mx-auto">
              Every year, hundreds of student ideas disappear before becoming real projects—not because they lack potential, but because they lack support.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 rounded-full bg-gradient-to-br from-accent/20 to-primary border border-accent/30 flex items-center justify-center shadow-[0_0_80px_rgba(84,131,179,0.2)]">
                  <div className="text-8xl">👨‍💻</div>
                </div>
                <div className="absolute -top-4 right-0 bg-[#052659] border border-accent/30 px-5 py-3 rounded-2xl text-white shadow-lg">
                  💡 Great Idea
                </div>
                <div className="absolute bottom-6 -left-6 bg-[#052659] border border-red-500/30 px-5 py-3 rounded-2xl text-red-400 shadow-lg">
                  But what next?
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-red-500 via-red-400 to-accent"></div>
              <div className="space-y-12">
                {["No Project Ideas", "No Team", "No Visibility", "No Motivation", "Projects Die"].map((item, index) => (
                  <div key={index} className="relative flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500 flex items-center justify-center z-10">
                      ❌
                    </div>
                    <div className="bg-[#052659]/60 backdrop-blur-md border border-accent/20 px-6 py-4 rounded-2xl w-full">
                      <h3 className="text-white text-lg font-semibold">{item}</h3>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col items-center mt-16">
                <div className="text-5xl text-sky animate-bounce">↓</div>
                <div className="mt-6 px-10 py-5 rounded-2xl bg-gradient-to-r from-accent to-[#7DA0CA] text-primary font-bold text-xl shadow-[0_0_40px_rgba(125,160,202,0.4)]">
                  Innovation Hub
                </div>
                <p className="mt-4 text-[#C1E8FF] text-center max-w-md">
                  One platform that helps students discover ideas, find teammates, showcase projects, gain recognition, and keep building.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Solution />
      <PlatformShowcase/>
    </div>
  );
};

export default memo(LandingPage);