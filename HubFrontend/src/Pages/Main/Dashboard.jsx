import { memo, useEffect,useState } from 'react';
import Navbar from "../../Components/Navbar";
import background from "../../Images/dashboardBg.png";
import Card from '../../Components/Card';
import axios from "axios";
import TopProjectCard from '../../Components/TopProjectCard';

const Dashboard = () => {
  const[projects,setProjects] = useState([])
  const[groupProjects,setGroupProjects] = useState([])
  const[topProjects,setTopProjects] = useState([])
  const[topGroupProjects,setTopGroupProjects] = useState([])
  const [search, setSearch] = useState("");

  useEffect(() => {
    const projectCard = async () => {
      const[projectsRes,groupProjectsRes] = await Promise.all([axios.get("http://localhost:8080/project/latest")
      ,axios.get("http://localhost:8080/groupProject/latest"),]);
      
      const formattedProjects = projectsRes.data.map((item) => {
        return {...item,type: "INDIVIDUAL",title: item.projectName,
          ownerName: item.student?.student_name,
          ownerId: item.student?.studentId,
          branch: item.student?.branch,
          year: item.student?.year,
          projectKey: item.projectId};
        });
      const formattedGroupProjects = groupProjectsRes.data.map((item) => {
        return {...item,type: "GROUP",
          title: item.project_name,
          ownerName: item.teamLead?.student_name,
          ownerId: item.teamLead?.studentId,
          branch: item.teamLead?.branch,
          year: item.teamLead?.year,
          projectKey: item.groupProjectId};
        });

      setProjects(formattedProjects);
      setGroupProjects(formattedGroupProjects);
      console.log("this is latest projects")
      console.log(formattedProjects);
      console.log("this is latest group projects")
      console.log(formattedGroupProjects);
    }

    const TopProject = async () => {
      const[topProjectsRes,topGroupProjectsRes] = await Promise.all([axios.get("http://localhost:8080/likes/top")
        ,axios.get("http://localhost:8080/grouplikes/top")
      ])
      const formattedTopProjects = topProjectsRes.data.map((item) => {
        return {...item,type: "INDIVIDUAL",title: item.projectName,
          ownerName: item.student?.student_name,
          ownerId: item.student?.studentId,
          branch: item.student?.branch,
          year: item.student?.year,
          projectKey: item.projectId};
        });
      const formattedTopGroupProjects = topGroupProjectsRes.data.map((item) => {
        return {...item,type: "GROUP",
          title: item.project_name,
          ownerName: item.teamLead?.student_name,
          ownerId: item.teamLead?.studentId,
          branch: item.teamLead?.branch,
          year: item.teamLead?.year,
          projectKey: item.groupProjectId};
        });
      console.log("this is top projects")
      console.log(formattedTopProjects,formattedTopGroupProjects)        
      setTopProjects(formattedTopProjects);
      setTopGroupProjects(formattedTopGroupProjects);
    }
    projectCard();
    TopProject();
  },[])

  const filterFn = (p) => {
    const teamMembers =p.studentList?.map((s) => s.student_name).join(" ") || "";
    return (
      p.title?.toLowerCase().includes(search.toLowerCase()) 
    ||p.ownerName?.toLowerCase().includes(search.toLowerCase()) 
    ||teamMembers?.toLowerCase().includes(search.toLowerCase()) 
    ||p.tech1?.toLowerCase().includes(search.toLowerCase()) 
    ||p.tech2?.toLowerCase().includes(search.toLowerCase()) 
    ||p.tech3?.toLowerCase().includes(search.toLowerCase()));
  };

  const filteredProjects = [...projects,...groupProjects].filter(filterFn);
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

      <div className="py-6 px-10 overflow-hidden">
        <div className="flex items-center gap-3 pb-5">
          <div className="text-2xl font-bold text-gray-800">
            Latest Projects
          </div>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>
        <div className="relative overflow-hidden py-2">
          <div className="flex gap-5 w-max animate-scroll">
            {[...filteredProjects, ...filteredProjects].map((project, index) => (
              <div key={`${project.type}-${project.projectKey}-${index}`} className="w-95 h-40 flex-shrink-0">
                <Card project={project} />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="pb-3 px-10">
        <div className="flex items-center gap-3 pb-2">
          <div className="text-xl whitespace-nowrap">Top Projects</div>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="text-lg font-semibold pb-3">Solo Projects</div>
            <div className="flex flex-col gap-5">
              {topProjects.filter(filterFn).map((project) => (
                <div key={`${project.type}-${project.projectKey}`}>
                  <TopProjectCard project={project} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-lg font-semibold pb-3">Group Projects</div>
            <div className="flex flex-col gap-5">
              {topGroupProjects.filter(filterFn).map((project) => (
                <div key={`${project.type}-${project.projectKey}`}>
                  <TopProjectCard project={project} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default memo(Dashboard);