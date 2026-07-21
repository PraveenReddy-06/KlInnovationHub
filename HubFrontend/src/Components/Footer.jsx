import { FaLinkedin, FaInstagram, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-primary">
      <div className="max-w-7xl mx-auto px-6 py-6">

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          <div className="flex items-center gap-3">
            <img
              src="/LogoWhite.png"
              alt="KL Innovation Hub"
              className="h-10 w-auto"
            />
            <span className="text-lg font-semibold text-vanilla-custard">
              KL Innovation Hub
            </span>
          </div>

          <div className="flex items-center gap-6 text-xl text-sky">
            <a href="https://www.linkedin.com/in/kl-innovation-hub-343322419/" className="hover:text-accent transition">
              <FaLinkedin />
            </a>

            <a href="https://www.instagram.com/kl_innovationhub/" className="hover:text-accent transition">
              <FaInstagram />
            </a>

            <a href="mailto:kl-innovationhub@outlook.com" className="hover:text-accent transition">
              <FaEnvelope />
            </a>
          </div>


          <div className="text-center md:text-right text-sm text-sky">
            <p>© 2026 KL Innovation Hub. All rights reserved.</p>
            <p>Built for KL University Students.</p>
          </div>

        </div>

      </div>
    </footer>
  );
}