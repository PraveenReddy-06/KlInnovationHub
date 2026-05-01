import { memo } from 'react';
import Navbar from "../../Components/Navbar";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen w-screen">
      
      <Navbar />
        
        <div className="flex h-[75vh] w-full items-center justify-between gap-10 p-10">         
          <div className=" w-1/2">
            <h1 className="heading"> KL Innovation Hub </h1>
            <p className="mt-4 "> A platform to build, innovate, and collaborate on impactful ideas. </p>
          </div>
          <div className="w-1/2 flex items-center justify-center">
              Logo
          </div>
      </div>

      <div className="section">
        <h1 className="heading">
          Why Do We Need KL Innovation Hub?
        </h1>
        <p className="mt-4">
          It connects students, mentors, and ideas into one ecosystem, enabling innovation,
          collaboration, and real-world problem solving.
        </p>
      </div>

      <div className="section">
        <h1 className="heading">Features</h1>
        <p className="mt-4">dfew drew dgrc ewgwe rgwe rgwer gwec gwerj gwer gkwe gjk rtjgk terk cg</p>
      </div>

      <div className="section">
        <h1  className="heading">Why Do we Use This </h1>
      </div>

      <div className="section">
        <h1  className="heading">Popular Projects</h1>
      </div>

      <div className="section">
        <h1  className="heading">About Us</h1>
      </div>
    </div>
  );
};

export default memo(LandingPage);