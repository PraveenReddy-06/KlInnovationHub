import { memo } from 'react';
import Login from '../Pages/SignUpLogin/Login';
import SignUp from '../Pages/SignUpLogin/SignUp';
import LandingPage from '../Pages/Main/LandingPage'

const Navbar = () => {
  return (
    <div className="flex justify-between items-center py-4 px-10 bg-blue-600 text-amber-50">

      <a href="/LandingPage">Logo</a>
      <ul className="flex items-center gap-8">
        <li><a href="">Explore Projects</a></li>
        <li><a href="">LeaderBoard</a></li>
        <li><a href="">Form A Team</a></li>
        <li><a href="">Submit Project</a></li>
        <li><a href="">Guide</a></li>
      </ul>
      <div className="flex px-5 items-center">
          <a href="/Login">Login/</a>
          <a href="/Signup">SignIn</a>
        </div>
    </div>
  );
};

export default memo(Navbar);