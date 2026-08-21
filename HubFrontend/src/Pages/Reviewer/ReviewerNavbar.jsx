import { memo, useState } from "react";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const ReviewerNavbar = () => {

    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("reviewerToken");
        localStorage.removeItem("reviewer");
        navigate("/login");
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <div className="sticky top-0 z-50 flex justify-between items-center px-4 sm:px-6 lg:px-12 h-16 lg:h-18 shadow-lg bg-primary">

            {/* Mobile Menu Button */}

            <button
                onClick={() => setMobileMenuOpen(prev => !prev)}
                className="lg:hidden text-white text-2xl"
            >
                {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>


            {/* Logo */}

            <Link
                to="/reviewerDashboard"
                className="flex items-center gap-2 shrink-0"
            >
                <img
                    src="/Logo.svg"
                    alt="logo"
                    className="h-10 sm:h-12 lg:h-14"
                />

                <div className="flex flex-col leading-none">

                    <span className="font-bold text-vanilla-custard text-sm sm:text-lg lg:text-xl">
                        KL InnovationHub
                    </span>

                    <span className="hidden sm:block text-[10px] lg:text-[11px] tracking-widest uppercase text-tan">
                        Innovate • Build • Launch
                    </span>

                </div>
            </Link>


            {/* Desktop Navigation */}

            <ul className="hidden lg:flex items-center text-xs uppercase tracking-[2px] gap-8 text-cream">

                <li>
                    <Link
                        to="/dashboard"
                        className="transition-colors duration-200 hover:text-light-blue"
                    >
                        Dashboard
                    </Link>
                </li>

                <li>
                    <Link
                        to="/exploreProjects"
                        className="transition-colors duration-200 hover:text-light-blue"
                    >
                        Explore Projects
                    </Link>
                </li>

                <li>
                    <Link
                        to="/leaderBoard"
                        className="transition-colors duration-200 hover:text-light-blue"
                    >
                        Leaderboard
                    </Link>
                </li>

            </ul>


            {/* Profile + Logout */}

            <div className="hidden lg:flex items-center gap-4">

                <button
                    onClick={() => navigate("/reviewerDashboard")}
                    className="flex items-center gap-2 text-vanilla-custard hover:text-light-blue transition-colors cursor-pointer"
                >
                    <FaUserCircle size={28} />

                    <span className="text-xs uppercase tracking-[2px]">
                        Profile
                    </span>
                </button>

                <button
                    onClick={handleLogout}
                    className="text-xs uppercase tracking-[2px] text-vanilla-custard hover:text-light-blue transition-colors"
                >
                    Logout
                </button>

            </div>


            {/* Mobile Menu */}

            {mobileMenuOpen && (

                <div className="absolute top-full left-0 w-full bg-primary lg:hidden shadow-xl border-t border-white/10">

                    <div className="flex flex-col py-4">

                        <Link
                            to="/dashboard"
                            onClick={closeMobileMenu}
                            className="px-6 py-3 text-white hover:bg-white/10"
                        >
                            Dashboard
                        </Link>

                        <Link
                            to="/exploreProjects"
                            onClick={closeMobileMenu}
                            className="px-6 py-3 text-white hover:bg-white/10"
                        >
                            Explore Projects
                        </Link>

                        <Link
                            to="/leaderBoard"
                            onClick={closeMobileMenu}
                            className="px-6 py-3 text-white hover:bg-white/10"
                        >
                            Leaderboard
                        </Link>

                        <button
                            onClick={() => {
                                closeMobileMenu();
                                navigate("/reviewerDashboard");
                            }}
                            className="px-6 py-3 text-left text-white hover:bg-white/10"
                        >
                            Profile
                        </button>

                        <button
                            onClick={() => {
                                closeMobileMenu();
                                handleLogout();
                            }}
                            className="px-6 py-3 text-left text-white hover:bg-white/10"
                        >
                            Logout
                        </button>

                    </div>

                </div>

            )}

        </div>
    );
};

export default memo(ReviewerNavbar);