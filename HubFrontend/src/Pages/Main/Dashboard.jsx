import { memo, useEffect,useState } from 'react';
import Navbar from "../../Components/Navbar";
import background from "../../Images/dashboardBg.png";
import Card from '../../Components/Card';
import axios from "axios";
import TopProjectCard from '../../Components/TopProjectCard';

const Dashboard = () => {
  const[projects,setProjects] = useState([])
  const[topProjects,setTopProjects] = useState([])
  const [search, setSearch] = useState("");

  useEffect(() => {
    const projectCard = async () => {
      const res = await axios.get("http://localhost:8080/project/latest");
      setProjects(res.data);
      console.log(res.data);
    }
    const TopProject = async () => {
      const res = await axios.get("http://localhost:8080/likes/top");
      setTopProjects(res.data);
      console.log(res.data)
    }

    projectCard();
    TopProject();
  },[])

  const filterFn = (p) => {
    return (
      p.projectName?.toLowerCase().includes(search.toLowerCase()) ||
      p.student?.student_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.tech1?.toLowerCase().includes(search.toLowerCase()) ||
      p.tech2?.toLowerCase().includes(search.toLowerCase())
    );
  };
  const filteredProjects = projects.filter(filterFn);
  const filteredTopProjects = topProjects.filter(filterFn);


  return (
    <div className="h-full">
      <Navbar/>

      <div className ="flex px-10 py-5 gap-5 items-center bg-blue-100 text-black">
        <div className ="w-1/2 flex flex-col gap-3">
          <h1 className =" text-3xl font-bold">Give Life to Your Projects!</h1>
          <p className="font-serif">Share your innovative solutions with the hub and inspire the community.</p>
          <div className="w-full max-w-md">
            <div className="flex items-center bg-white border border-gray-300 rounded-xl px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-400">
              <input type="text" placeholder="Search projects, tech, student..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full outline-none text-sm"/>
              <span className="text-gray-400 mr-2">🔍</span>
            </div>
        </div>
        </div>
        <div className="w-1/2 flex justify-center items-center">
          <img src={background} className="h-35 w-100" alt=""/>
        </div>
      </div>

      <div className="py-3 px-10">
        <div className="text-xl pb-2">Latest Projects</div>
        <div className="flex gap-5 overflow-x-auto snap-x snap-proximity px-5 no-scrollbar">
          {filteredProjects.map((project) => (
            <div key={project.projectId} className="min-w-[33.33%] snap-start">
              <Card project={project} />
            </div>
          ))}
        </div>
        <div className="text-right"> Swipe for MORE </div>
      </div>
      
      <div className="pb-3 px-10">
        <div className="flex items-center gap-3 pb-2">
          <div className="text-xl whitespace-nowrap">Top Projects</div>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <div className="flex flex-col gap-5">
          {filteredTopProjects.map((project) => (
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