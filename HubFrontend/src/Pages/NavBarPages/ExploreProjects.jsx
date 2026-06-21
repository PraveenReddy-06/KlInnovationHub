import {memo,useEffect,useMemo,useState} from "react";
import axiosInstance from "../../Api/axiosInstance"
import Navbar from "../../Components/Navbar";
import {Search,Heart,Users,User,ExternalLink} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ExploreProjects = () => {

  const [projects,setProjects] = useState([]);
  const [groupProjects,setGroupProjects] = useState([]);
  const [loading,setLoading] = useState(true);

  const [search,setSearch] = useState("");
  const [selectedBranch,setSelectedBranch] = useState("");
  const [selectedYear,setSelectedYear] = useState("");
  const [selectedType,setSelectedType] = useState("ALL");

  const studentId = JSON.parse(localStorage.getItem("studentId"));
  const navigate = useNavigate();
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const [projectRes,groupProjectRes] = await Promise.all([axiosInstance.get("/project/all"),
        axiosInstance.get("/groupProject/all"),]);

      const formattedProjects = projectRes.data.map((item) => {  
        const isLiked = item.likes?.some((like) =>  Number(like.likedStudentId) === Number(studentId));
        return {...item,  type: "INDIVIDUAL", isLiked: isLiked || false,};
      });

      const formattedGroupProjects = groupProjectRes.data.map((item) => {
        const isLiked = item.likes?.some((like) =>  Number(like.likedStudentId) === Number(studentId));
        return { ...item,type: "GROUP",isLiked: isLiked || false,};
      });

      setProjects(formattedProjects);
      setGroupProjects(formattedGroupProjects);
    }catch (err) {console.log(err);} 
    finally {setLoading(false);}
  };

  const allProjects = [...projects,...groupProjects];
  const filteredProjects = useMemo(() => {
    return allProjects.filter((project) => {
      const isGroup = project.type === "GROUP";
      
      const title = isGroup ? project.project_name?.toLowerCase() : project.projectName?.toLowerCase();
      const branch = isGroup ? project.teamLead?.branch : project.student?.branch;
      const year = isGroup ? project.teamLead?.year : project.student?.year;
      const matchesSearch = title?.includes(search.toLowerCase());
      const matchesBranch = selectedBranch ? branch === selectedBranch : true;
      const matchesYear = selectedYear ? year === parseInt(selectedYear) : true;
      const matchesType = selectedType === "ALL" ? true : selectedType === project.type;

      return matchesSearch && matchesBranch && matchesYear && matchesType;
    });
  }, [allProjects,search,selectedBranch,selectedYear,selectedType]);

  const handleLike = async (project) => {
    try {
      if(project.type === "INDIVIDUAL") {
        const res = await axiosInstance.post(`/likes/toggleLike/${studentId}/${project.projectId}`);
        const {liked,likeCount} = res.data;
        setProjects((prev) =>  prev.map((p) =>
            p.projectId === project.projectId? {...p, isLiked: liked, likeCount: likeCount,} : p)
        );
      } else {
        const res = await axiosInstance.post(`/grouplikes/toggleLike/${studentId}/${project.groupProjectId}`);
        const {liked,likeCount} = res.data;
        setGroupProjects((prev) => prev.map((p) =>
            p.groupProjectId === project.groupProjectId ? {...p,isLiked : liked,  likeCount: likeCount,}: p)
        );
      }
    } catch(err) {
      console.log(err);
    }
  };

  return (

    <div className="min-h-screen bg-gray-100">
    <Navbar/>
    <div className="bg-oxford-blue text-gray-700 shadow-md px-5 py-5 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">  Exploring All Innovations</h1>
          <p className="text-gray-300 mt-1">  {filteredProjects.length} results found  </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="border rounded-xl px-4 py-1 bg-gray-50 outline-none">
            <option value="ALL">All Projects</option>
            <option value="INDIVIDUAL">Individual</option>
            <option value="GROUP">Group</option>
          </select>

          <select  value={selectedBranch}  onChange={(e) => setSelectedBranch(e.target.value)}  className="border rounded-xl px-4 py-1 bg-gray-50 outline-none">
            <option value="">All Departments</option>
            <option value="CSE">CSE</option>
            <option value="CSIT">CSIT</option>
            <option value="ECE">ECE</option>
          </select>

          <select value={selectedYear}  onChange={(e) => setSelectedYear(e.target.value)}
            className="border rounded-xl px-4 py-1 bg-gray-50 outline-none">
            <option value="">All Years</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
          </select>
       
          <div className="flex items-center border rounded-xl px-3 py-2 bg-gray-50 min-w-[280px]">
            <Search size={18} className="text-gray-500" />
            <input  type="text"  placeholder="Search projects..."  value={search}  onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent outline-none px-2"/>
          </div>
        </div>
      </div>
    </div>

    <div className="flex-1">
    <div className="flex justify-between items-center mb-5">
    {loading ? (
      <div className="text-center py-20 text-lg">Loading Projects...</div>
    ) : (
    <>
    <div className=" px-10 grid grid-cols-4 gap-5 ">
      {filteredProjects.map((project) => {
        const isGroup = project.type === "GROUP";

        const title = isGroup ? project.project_name : project.projectName;
        const ownerName = isGroup ? project.teamLead?.student_name : project.student?.student_name;
        const ownerId = isGroup ? project.teamLead?.studentId : project.student?.studentId;
        const branch = isGroup ? project.teamLead?.branch : project.student?.branch;
        const year = isGroup ? project.teamLead?.year : project.student?.year;
        const likes = project.likeCount || 0;
        return (
          <div key={`${project.type}-${project.projectId || project.groupProjectId}`} className="bg-cream hover:bg-tan/50 rounded-xl shadow hover:shadow-lg transition overflow-hidden border border-amber-800">
            <div className="p-4">
              <div className="flex gap-4 items-center mb-3 cursor-pointer bg-blend-luminosity hover:bg-amber-100 rounded-lg transition "
                   onClick={() =>navigate(`/profile/${isGroup? project.teamLead?.studentId: project.student?.studentId}`)}>
                  <img src={
                          isGroup
                              ? ( project.teamLead?.avatarUrl ||`/avatars/Avatar${(project.teamLead?.studentId % 40) + 1}.svg`
                              ): ( project.student?.avatarUrl || `/avatars/Avatar${(project.student?.studentId % 40) + 1}.svg`)}
                      
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-xl leading-tight text-gray-900 ">{title}</h3>
                    <p className="font-medium text-gray-800">{ownerName}</p> 
                  </div>
              </div>
              <div className="mb-3">
                {isGroup && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {project.studentList?.filter(student => student.studentId !== ownerId) .map(student => (
                                <span key={student.studentId}
                                      className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                                  {student.student_name}
                                </span>
                        ))}
                    </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2 ">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">{branch}</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">{year}</span>
                <span className={`text-xs px-2 py-1 rounded text-white ${isGroup ? "bg-purple-500" : "bg-blue-500"}`}>
                  {isGroup ? "Group" : "Individual"}
                </span>
              </div>
              <div className="text-xs py-1 rounded-full">
                {project.tech1 && (<span className="text-xs text-blue-700 px-2 py-1 rounded">{project.tech1}</span>)}
                {project.tech2 && (<span className="text-xs text-blue-700 px-2 py-1 rounded">{project.tech2}</span>)}
                {project.tech3 && (<span className="text-xs text-blue-700 px-2 py-1 rounded">{project.tech3}</span>)}
              </div>
              <p className="text-sm text-gray-600 mt-3 line-clamp-3">{project.description}</p>
              <div className="flex justify-between items-center mt-5">
                <button onClick={() => handleLike(project)} className="flex items-center gap-1 text-sm">
                <Heart size={18}  fill={project.isLiked ? "red" : "transparent"}  className={`transition ${project.isLiked? "text-red-500" : "text-gray-400"  }`}/>{likes} Likes
                </button>
                {isGroup ? (
                  <div className="flex items-center gap-1 text-sm text-gray-600"><Users size={16}/>Team</div>
                ) : (
                  <div className="flex items-center gap-1 text-sm text-gray-600"><User size={16}/>Solo</div>
                )}

              </div>
              <div className="flex gap-2 mt-4">
                <a href={project.liveUrl} className="flex-1 bg-accent hover:bg-blue-700 text-white px-5 py-2 rounded text-sm">View Project</a>
                <a href={project.githubUrl} target="_blank" rel="noreferrer" className="w-14 border px-3 rounded flex items-center justify-center hover:bg-gray-100"><FaGithub size={20} /></a>
              </div>
            </div>
          </div>
        );
      })}
    </div>

    {filteredProjects.length === 0 && (<div className="bg-white rounded-lg p-10 text-center mt-10">No Projects Found</div>)}
    </>)}
    </div>
   </div>
  </div>
  );
};
export default memo(ExploreProjects);