import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Analytics from "./Analytics";
import ProtectedRoute from "./Pages/SignUpLogin/ProctectedRoute";

const LandingPage = lazy(() => import("./Pages/Main/LandingPage"));
const SignupChoice = lazy(() => import("./Pages/SignUpLogin/SignupChoice"));
const SignUp = lazy(() => import("./Pages/SignUpLogin/SignUp"));
const TeacherSignup = lazy(() => import("./Pages/SignUpLogin/TeacherSignup"));
const Login = lazy(() => import("./Pages/SignUpLogin/Login"));
const ReviewerForgotPassword = lazy(() => import("./Pages/SignUpLogin/ReviewerForgotPassword"));
const Dashboard = lazy(() => import("./Pages/Main/Dashboard"));
const SubmitProject = lazy(() => import("./Pages/NavBarPages/SubmitProject"));
const Leaderboard = lazy(() => import("./Pages/NavBarPages/Leaderboard"));
const ExploreProjects = lazy(() => import("./Pages/NavBarPages/ExploreProjects"));
const Profile = lazy(() => import("./Pages/Main/Profile"));
const FormATeam = lazy(() => import("./Pages/Main/FormATeam"));
const TeamApplications = lazy(() => import("./Pages/Main/TeamApplications"));
const ForgotPassword = lazy(() => import("./Pages/SignUpLogin/ForgotPassword"));
const Guide = lazy(() => import("./Pages/NavBarPages/Guide"));

const Navbar = lazy(() => import("./Components/Navbar"));
const Card = lazy(() => import("./Components/Card"));
const TopProjectCard = lazy(() => import("./Components/TopProjectCard"));
const Footer = lazy(() => import("./Components/Footer"));
const DashboardFooter = lazy(() => import("./Components/DashboardFooter"));
const Solution = lazy(() => import("./Pages/Main/LandingPageSections/Solution"));

function App() {
  useEffect(() => {
    AOS.init({ duration: 1200, once: true, easing: "ease-out-cubic" });
  }, []);

  return (
    <BrowserRouter>
      <Analytics />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-primary text-white">Loading...</div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignupChoice />} />
          <Route path="/signup/student" element={<SignUp />} />
          <Route path="/signup/teacher" element={<TeacherSignup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reviewer/forgot-password" element={<ReviewerForgotPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/navbar" element={<Navbar />} />
          <Route path="/card" element={<Card />} />
          <Route path="/topProjectCard" element={<TopProjectCard />} />
          <Route path="/submitProject" element={<ProtectedRoute><SubmitProject /></ProtectedRoute>} />
          <Route path="/leaderBoard" element={<Leaderboard />} />
          <Route path="/exploreProjects" element={<ExploreProjects />} />
          <Route path="/profile/:studentId?" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/formATeam" element={<ProtectedRoute><FormATeam /></ProtectedRoute>} />
          <Route path="/teamApplications" element={<ProtectedRoute><TeamApplications /></ProtectedRoute>} />
          <Route path="/landingPage" element={<LandingPage />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/solution" element={<Solution />} />
          <Route path="/footer" element={<Footer />} />
          <Route path="/dashboardFooter" element={<DashboardFooter />} />
          <Route path="/guide" element={<ProtectedRoute><Guide /></ProtectedRoute>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
