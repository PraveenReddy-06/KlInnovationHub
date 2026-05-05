import { memo, useEffect,useState } from 'react';
import Navbar from "../../Components/Navbar";
import background from "../../Images/dashboardBg.png";
import Card from '../../Components/Card';
import axios from "axios";
import TopProjectCard from '../../Components/TopProjectCard';

const Dashboard = () => {
  const[projects,setProjects] = useState([])
  const[topProjects,setTopProjects] = useState([])

  useEffect(() => {
    const projectCard = async () => {
      const res = await axios.get("http://localhost:8080/project/latest");
      setProjects(res.data);
    }
    const TopProject = async () => {
      const res = await axios.get("http://localhost:8080/likes/top");
      setTopProjects(res.data);
    }

    projectCard();
    TopProject();
  },[])


  return (
    <div>
      <Navbar/>

      <div className ="flex px-10 py-5 gap-5 items-center bg-blue-100 border-b border-amber-950">
        <div className ="w-1/2 flex flex-col gap-3">
          <h1 className =" text-3xl font-bold">Give life to Your Projects Here </h1>
          <p className="font-serif">Showcase your innovative solutions and gain upvote from your peers</p>
          <div>Serach Bar Here</div>
        </div>
        <div className="w-1/2 flex justify-center items-center">
          <img src={background} className="h-40 w-100" alt=""/>
        </div>
      </div>

      <div className="py-3 px-10">
        <div className="text-xl pb-2">Latest Project Submissions</div>
        <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory px-5 no-scrollbar">
          {projects.map((project) => (
            <div key={project.projectId} className="min-w-[33.33%] snap-start">
              <Card project={project} />
            </div>
          ))}
        </div>
        <div className="text-right">
          Swipe for MORE
        </div>
      </div>

      <div className="py-3 px-10">
        <div className="text-xl pb-2 ">Top Projects</div>
        <div className="flex flex-col gap-5 overflow-y-auto no-scrollbar h-100">
          {topProjects.map((project) => (
            <div key={project.projectId}>
              <TopProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>


    </div>
  );
};

export default memo(Dashboard);