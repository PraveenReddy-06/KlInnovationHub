import { Link } from "react-router-dom";
import {
  FaLinkedin,
  FaInstagram,
  FaEnvelope,
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

export default function Footer() {
  const isReviewer = !!localStorage.getItem("reviewerToken");
  const reviewerRestricted = (e) => {
    if (isReviewer) {
      e.preventDefault();
      toast.error("This feature is available only for students.");
    }
  };

  return (
    <footer className="mt-12 md:mt-20 border-t border-white/10 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 md:pt-12">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
              <img
                src="/LogoWhite.png"
                alt="KL Innovation Hub"
                className="h-10 sm:h-12 w-auto"
              />
              <h2 className="text-base sm:text-lg font-bold text-vanilla-custard">
                KL Innovation Hub
              </h2>
            </div>
          </div>

          {/* Platform */}
          <div className="text-center sm:text-left">
            <h3 className=" text-white mb-4">
              Platform
            </h3>

            <div className="flex flex-col gap-2 text-sky">
              <Link to="/dashboard" className="hover:text-accent transition">
                Dashboard
              </Link>

              <Link
                to="/exploreProjects"
                className="hover:text-accent transition"
              >
                Explore Projects
              </Link>

              <Link
                to="/submitProject" onClick={reviewerRestricted}
                className="hover:text-accent transition"
              >
                Submit Project
              </Link>

              <Link
                to="/leaderBoard"
                className="hover:text-accent transition"
              >
                Leaderboard
              </Link>
            </div>
          </div>

          {/* Community */}
          <div className="text-center sm:text-left">
            <h3 className="font-semibold text-white mb-4">
              Community
            </h3>

            <div className="flex flex-col gap-2 text-sky">
              <Link to="/formATeam" onClick={reviewerRestricted} className="hover:text-accent transition">
                Form a Team
              </Link>

              <Link
                to="/teamApplications" onClick={reviewerRestricted}
                className="hover:text-accent transition"
              >
                Team Applications
              </Link>

              <Link to="/solution" className="hover:text-accent transition">
                Solutions
              </Link>

              <Link to={isReviewer ? "/reviewerDashboard" : "/profile"}>
                  Profile
              </Link>
            </div>
          </div>

          <div className="text-center sm:text-left">
            <h3 className="font-semibold text-white mb-4">
              Connect
            </h3>
            <div className="flex justify-center sm:justify-start gap-5 text-xl sm:text-2xl text-sky">
              <a
                  href="https://www.linkedin.com/in/kl-innovation-hub-343322419/"
                  target="_blank" rel="noopener noreferrer"
                  className="hover:text-accent transition duration-300 hover:scale-110" aria-label="LinkedIn"
                >
                  <FaLinkedin />
                </a>
                <a
                  href="https://www.instagram.com/kl_innovationhub/"
                  target="_blank" rel="noopener noreferrer"
                  className="hover:text-accent transition duration-300 hover:scale-110" aria-label="Instagram"
                >
                  <FaInstagram />
                </a>
                <a
                  href="mailto:kl-innovationhub@outlook.com"
                  className="hover:text-accent transition duration-300 hover:scale-110"
                  aria-label="Email"
                >
                  <FaEnvelope />
                </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-2 mt-10 border-t border-white/10 py-4 text-center text-xs sm:text-sm text-sky">
          <div>
            © 2026 KL Innovation Hub. All rights reserved
          </div>
          <div>
            Built for KL University Students.
          </div>
        </div>
        
      </div>
    </footer>
  );
}