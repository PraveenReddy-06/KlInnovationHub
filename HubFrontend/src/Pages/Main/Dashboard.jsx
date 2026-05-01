import { memo } from 'react';
import Navbar from "../../Components/Navbar";
import background from "../../Images/dashboardBg.png";
import Card from '../../Components/Card';

const Dashboard = () => {
  return (
    <div>
      <Navbar/>

      <div className ="flex p-5 gap-5 items-center bg-blue-100 border-b border-amber-950">
        <div className ="w-1/2 flex flex-col gap-3">
          <h1 className =" text-3xl font-bold">Give life to Your Projects Here </h1>
          <p className="font-serif">Showcase your innovative solutions and gain upvote from your peers</p>
          <div>Serach Bar Here</div>
        </div>
        <div className="w-1/2 flex justify-center items-center">
          <img src={background} className="h-40 w-100" alt=""/>
        </div>
      </div>

      <div className="p-3">
        <h1 className="text-xl pb-3">Top Projects This Week</h1>
        <div className="flex gap-3">
          <Card />
          <Card />
          <Card />
        </div>
      </div>


      <div>

      </div>


    </div>
  );
};

export default memo(Dashboard);