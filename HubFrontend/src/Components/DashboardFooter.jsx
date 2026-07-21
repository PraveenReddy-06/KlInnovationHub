import { Link } from "react-router-dom";
import {
  FaLinkedin,
  FaInstagram,
  FaEnvelope,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-primary">
      <div className="max-w-7xl mx-auto px-6 pt-12">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/LogoWhite.png"
                alt="KL Innovation Hub"
                className="h-12 w-auto"
              />
              <h2 className="text-lg font-bold text-vanilla-custard">
                KL Innovation Hub
              </h2>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-semibold text-accent mb-4">
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
                to="/submitProject"
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
          <div>
            <h3 className="font-semibold text-accent mb-4">
              Community
            </h3>

            <div className="flex flex-col gap-2 text-sky">
              <Link to="/formATeam" className="hover:text-accent transition">
                Form a Team
              </Link>

              <Link
                to="/teamApplications"
                className="hover:text-accent transition"
              >
                Team Applications
              </Link>

              <Link to="/solution" className="hover:text-accent transition">
                Solutions
              </Link>

              <Link to="/profile" className="hover:text-accent transition">
                Profile
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-accent mb-4">
              Connect
            </h3>
            <div className="flex gap-5 text-2xl text-sky">
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

        <div className="flex flex-row justify-between mt-10 border-t border-white/10 py-2 text-center text-sm text-sky">
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