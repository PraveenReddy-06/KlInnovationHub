import { memo } from 'react';
import Navbar from "../../Components/Navbar";
import { useEffect, useState } from "react";
import axiosInstance from "../../Api/axiosInstance";
import CountUp from "react-countup";
import {FolderKanban,GraduationCap,Handshake,Heart} from "lucide-react";
import Solution from './LandingPageSections/Solution';
import PlatformShowcase from './LandingPageSections/PlatformShowcase';
import VisionSection from './LandingPageSections/VisionSection';
import CallToAction from './LandingPageSections/CallToAction';
import Section123 from './LandingPageSections/Section123';
import Footer from '../../Components/Footer';

const LandingPage = () => {
  return (
    <div>
      <h1 className="sr-only">
        KLU Innovation Hub – KL University Student Project Platform
      </h1>
      <Navbar />
      <Section123/>
      <Solution />
      <PlatformShowcase/>
      <VisionSection/>
      <CallToAction/>
      <Footer/>
    </div>
  );
};

export default memo(LandingPage);