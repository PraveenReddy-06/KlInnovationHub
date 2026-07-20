import { memo, useEffect,useState } from 'react';
import Navbar from "../../Components/Navbar";
import background from "../../Images/dashboardBg.png";
import Card from '../../Components/Card';
import axiosInstance from "../../Api/axiosInstance"
import TopProjectCard from '../../Components/TopProjectCard';
import toast, { Toaster } from "react-hot-toast";

const Dashboard = () => {
  const[projects,setProjects] = useState([])
  const[groupProjects,setGroupProjects] = useState([])
  const[topProjects,setTopProjects] = useState([])
  const[topGroupProjects,setTopGroupProjects] = useState([])
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const projectCard = async () => {
      try{
        const[projectsRes,groupProjectsRes] = await Promise.all([axiosInstance.get("/project/latest")
        ,axiosInstance.get("/groupProject/latest"),]);
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
        } catch (error) {
            setError("Failed to load projects");
        }
    }

    const TopProject = async () => {
      try{  
        const[topProjectsRes,topGroupProjectsRes] = await Promise.all([axiosInstance.get("/likes/top")
              ,axiosInstance.get("/grouplikes/top")])
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
        setTopProjects(formattedTopProjects);
        setTopGroupProjects(formattedTopGroupProjects);
      } catch (error) {
            setError("Failed to load projects");
      }
    }
    projectCard();
    TopProject();
  },[])

  const filterFn = (p) => {
    const query = search.toLowerCase();

    return (
      p.title?.toLowerCase().includes(query) ||
      p.ownerName?.toLowerCase().includes(query) ||
      String(p.ownerId).includes(search) ||
      p.tech1?.toLowerCase().includes(query) ||
      p.tech2?.toLowerCase().includes(query) ||
      p.tech3?.toLowerCase().includes(query)
    );
  };

  const filteredProjects = [...projects,...groupProjects].filter(filterFn);
  const filteredTopProjects = topProjects.filter(filterFn);
  /*<div className="flex-1 h-px bg-gray-300"></div> for line*/

  return (
    <div className="min-h-screen overflow-y-auto no-scrollbar" style={{background:"linear-gradient(135deg, #FFF9EB 0%, #F8F0E5 50%, #D2B48C 100%)",}}>
      <Navbar/>

      <div className ="flex pl-20 gap-5 items-center text-tan bg-dashboard border-b border-b-amber-700">
        <div className ="w-1/2 flex flex-col gap-3">
          <h1 className =" text-3xl font-bold text-gray-200">Give Life to Your Projects!</h1>
          <p className="text-lg opacity-90">Share your innovative solutions with the hub and inspire the community.</p>
          <div className="w-full max-w-md">
            <div className="flex items-center rounded-xl px-4 py-3 shadow-sm focus-within:ring-2 bg-white "  style={{border: "1px solid #D2B48C",}}>
              <input type="text" placeholder="Search projects, tech, student, id..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full outline-none text-black text-sm"/>
              <span className="text-primary ml-2">🔍</span>
            </div>
        </div>
        </div>
        <div className="w-1/2 flex justify-center items-center">
          <img src={background} className="h-60 w-max"/>
        </div>
      </div>

<button
  onClick={() => toast.error("Something went wrong. Please try again.")}
>
  Test Toast
</button>
      <div className="py-3 px-10 overflow-hidden">
        <h2 className="text-2xl font-bold text-primary">Latest Projects</h2>
        <div className="relative overflow-hidden py-2">
          <div className="flex gap-5 w-max animate-scroll">
            {[...filteredProjects, ...filteredProjects].map((project, index) => (
              <div key={`${project.type}-${project.projectKey}-${index}`} className="w-95 h-47 flex-shrink-0">
                <Card project={project} />
              </div>
            ))}
          </div>
        </div>
      </div>
      {error && (
        <div className="mx-6 mt-4 p-3 bg-red-100 text-bloodstone rounded-lg">
          {error}
        </div>
      )}
      <div className="pb-3 px-10">
        <div className="flex items-center gap-3 pb-2">
          <div className="text-2xl font-bold  text-primary whitespace-nowrap">Top Projects</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <div className="font-medium text-secondary mb-3 flex items-center justify-center">Solo Projects</div>
            <div className="flex flex-col gap-4">
              {topProjects.filter(filterFn).map((project) => (
                <div key={`${project.type}-${project.projectKey}`}>
                  <TopProjectCard project={project} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="font-medium text-secondary mb-3 flex items-center justify-center">Group Projects</div>
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