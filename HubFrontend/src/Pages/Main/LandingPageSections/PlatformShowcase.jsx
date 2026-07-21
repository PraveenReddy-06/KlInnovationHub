import { memo } from 'react';
import AOS from "aos";
import "aos/dist/aos.css";

const PlatformShowcase = () => {
  return (
    <div>
        <section className="relative py-32 bg-primary overflow-hidden">
        <div data-aos="fade-up" data-aos-delay="0" className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center mb-24">
                <span className="text-sky uppercase tracking-widest text-sm font-semibold">
                    Platform Features
                </span>
                <h2 className="mt-4 text-4xl md:text-6xl font-bold text-white">
                    Explore The
                    <span className="block text-sky">Ecosystem</span>
                </h2>
                <p className="mt-6 text-cyan-400 max-w-3xl mx-auto">
                    Every feature is designed to help students innovate, collaborate, compete, and grow.
                </p>
            </div>

            <div data-aos="fade-up" data-aos-delay="150" className="grid lg:grid-cols-2 gap-16 items-center mb-32">
                <div data-aos="fade-right" className="relative group">
                    <img src="/PlatformShow33.png" alt="Collab Hub" className="border border-accent/20 shadow-2xl transition-all duration-500 group-hover:scale-110" />
                </div>
                <div data-aos="fade-left">
                    <span className="text-sky font-semibold">COLLAB HUB</span>
                    <h3 className="text-4xl font-bold text-white mt-4 mb-6">Find Teammates And Build Stronger Projects</h3>
                    <p className="text-gray-400 tracking-wide text-lg leading-relaxed">
                    Build your own team and recruit members for your project, or apply to join existing teams looking for contributors. Manage incoming applications with ease by accepting or rejecting requests and connect with students who share your vision.
                    </p>
                </div>
            </div>


            <div data-aos="fade-up" data-aos-delay="300" className="grid lg:grid-cols-2 gap-16 items-center mb-32">
                <div data-aos="fade-right">
                    <span className="text-sky font-semibold">LEADERBOARD</span>
                    <h3 className="text-4xl font-bold text-white mt-4 mb-6">Compete With Innovators Across The University</h3>
                    <p className="text-gray-400 tracking-wide text-lg leading-relaxed">
                    Earn recognition through project engagement, likes, and contributions while climbing the university rankings.
                    </p>
                </div>
                <div data-aos="fade-left" className="relative group">
                    <img src="/PlatformShow2.png" alt="Leaderboard" className="h-70 w-max border border-accent/20 shadow-2xl transition-all duration-500 group-hover:scale-110" />
                 </div>
            </div>


            <div data-aos="fade-up" data-aos-delay="450"className="grid lg:grid-cols-2 gap-16 items-center mb-32">
                <div data-aos="fade-right" className="relative group">
                    <img src="/PlatformShow11.png" alt="Explore Projects" className="h-60 w-max border border-accent/20 shadow-2xl transition-all duration-500 group-hover:scale-110" />
                </div>
                <div data-aos="fade-left">
                    <span className="text-sky font-semibold">EXPLORE PROJECTS</span>
                    <h3 className="text-4xl font-bold text-white mt-4 mb-6">Discover What Students Are Building</h3>
                    <p className="text-gray-400 tracking-wide text-lg leading-relaxed">
                        Browse innovative projects from every department and discover what students are building across campus. Search projects by branch such as CSE, CSIT, ECE, year groups like Y21, Y22, Y23, Y24, student ID, or project name to quickly find ideas that match your interests.                    </p>
                </div>
            </div>


            <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
                <div data-aos="fade-right" className="order-2 lg:order-1">
                    <span className="text-sky font-semibold">LATEST PROJECTS</span>
                    <h3 className="text-4xl font-bold text-white mt-4 mb-6">Stay Updated With New Innovations</h3>
                    <p className="text-gray-400 tracking-wide text-lg leading-relaxed">
                        Stay updated with the newest innovations on campus while exploring the most popular projects. Top projects are highlighted based on community likes, helping you discover trending ideas, emerging technologies, and impactful student work.
                    </p>
                </div>
                <div data-aos="fade-left" className="relative group order-1 lg:order-2">
                    <img src="/PlatformShow4.png" alt="Latest Projects" className="h-65 w-max border border-accent/20 shadow-2xl transition-all duration-500 group-hover:scale-110" />
                 </div>
            </div>

            <div data-aos="fade-up" data-aos-delay="450"className="grid lg:grid-cols-2 gap-16 items-center mb-15">
                <div data-aos="fade-right" className="relative group">
                    <img src="/PlatformShow7.png" alt="Notifcation" className="h-60 w-max border border-accent/20 shadow-2xl transition-all duration-500 group-hover:scale-110" />
                </div>
                <div data-aos="fade-left">
                    <span className="text-sky font-semibold">Follow And Notifications</span>
                    <h3 className="text-4xl font-bold text-white mt-4 mb-6">Stay Connected with Campus Innovation</h3>
                    <p className="text-gray-400 tracking-wide text-lg leading-relaxed">
                        Follow fellow innovators, view their profiles, and stay updated on
                        their latest projects and achievements. Receive personalized updates
                        in <span className="text-sky">For You</span>, including new followers,
                        project interactions, and collaboration requests. Explore
                        <span className="text-sky"> Campus Buzz</span> to discover newly
                        showcased projects, team recruitment posts, and trending activities
                        happening across the university innovation community.
                    </p>
                </div>
            </div>
        </div>
        </section>
    </div>
  );
};

export default memo(PlatformShowcase);