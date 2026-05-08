import { memo } from 'react';

const Navbar = () => {
  return (
    <div className="flex justify-between items-center py-4 px-10 bg-blue-600 text-amber-50">

      <a href="/LandingPage">Logo</a>
      <ul className="flex items-center gap-8">
        <li><a href="/dashboard">Dashboard</a></li>
        <li><a href="/exploreProjects">Explore Projects</a></li>
        <li><a href="/leaderBoard">LeaderBoard</a></li>
        <li><a href="">Form A Team</a></li>
        <li><a href="/submitProject">Submit Project</a></li>
        <li><a href="">Guide</a></li>
      </ul>
      <div className="flex px-5 items-center">
          <a href="/login">Login/</a>
          <a href="/signup">SignIn</a>
        </div>
    </div>
  );
};

export default memo(Navbar);