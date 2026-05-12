import {memo,useEffect,useMemo,useState} from "react";
import axios from "axios";
import Navbar from "../../Components/Navbar";
import {Search,Heart,Users,User,ExternalLink} from "lucide-react";

const ExploreProjects = () => {

  const [projects,setProjects] = useState([]);
  const [groupProjects,setGroupProjects] = useState([]);
  const [loading,setLoading] = useState(true);

  const [search,setSearch] = useState("");
  const [selectedBranch,setSelectedBranch] = useState("");
  const [selectedYear,setSelectedYear] = useState("");
  const [selectedType,setSelectedType] = useState("ALL");

  const studentId = JSON.parse(localStorage.getItem("studentId"));

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const [projectRes,groupProjectRes] = await Promise.all([axios.get("http://localhost:8080/project/all"),
        axios.get("http://localhost:8080/groupProject/all"),]);

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
      console.log(formattedProjects);
      console.log(formattedGroupProjects);
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
        const res = await axios.post(`http://localhost:8080/likes/toggleLike/${studentId}/${project.projectId}`);
        const {liked,likeCount} = res.data;
        setProjects((prev) =>  prev.map((p) =>
            p.projectId === project.projectId? {...p, isLiked: liked, likeCount: likeCount,} : p)
        );
      } else {
        const res = await axios.post(`http://localhost:8080/grouplikes/toggleLike/${studentId}/${project.groupProjectId}`);
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
    <div className="flex gap-5 p-5">
      <div className="w-[280px] bg-white rounded-lg shadow p-4 h-fit sticky top-24">
        <h2 className="text-xl font-semibold mb-4">Refine Search</h2>
        
        <div className="mb-5">
          <label className="text-sm font-medium">Search Projects</label>
          <div className="flex items-center border rounded mt-2 px-2">
            <Search size={18} className="text-gray-500"/>
            <input type="text" placeholder="Search by title..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full p-2 outline-none" />
          </div>
        </div>

        <div className="mb-5">
          <label className="text-sm font-medium">Project Type</label>
          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="w-full border rounded p-2 mt-2">
            <option value="ALL">All Projects</option>
            <option value="INDIVIDUAL">Individual Projects</option>
            <option value="GROUP">Group Projects</option>
          </select>
        </div>

        <div className="mb-5">
          <label className="text-sm font-medium">Department</label>
          <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)} className="w-full border rounded p-2 mt-2">
            <option value="">All Departments</option>
            <option value="CSE">CSE</option>
            <option value="CSIT">CSIT</option>
            <option value="ECE">ECE</option>
          </select>

        </div>

        <div>
          <label className="text-sm font-medium">Year</label>
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="w-full border rounded p-2 mt-2">
            <option value="">All Years</option>
            <option value="2021">2021</option>              
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>              
          </select>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h1 className="text-3xl font-bold">Exploring All Innovations</h1>
            <p className="text-gray-600 mt-1">{filteredProjects.length} results found</p>
          </div>
        </div>
        {loading ? (
          <div className="text-center py-20 text-lg">Loading Projects...</div>
        ) : (
        <>
          <div className="grid grid-cols-4 gap-5">
            {filteredProjects.map((project) => {
              const isGroup = project.type === "GROUP";

              const title = isGroup ? project.project_name : project.projectName;
              const ownerName = isGroup ? project.teamLead?.student_name : project.student?.student_name;
              const ownerId = isGroup ? project.teamLead?.studentId : project.student?.studentId;
              const branch = isGroup ? project.teamLead?.branch : project.student?.branch;
              const year = isGroup ? project.teamLead?.year : project.student?.year;
              const likes = project.likeCount || 0;
              return (
                <div key={`${project.type}-${project.projectId || project.groupProjectId}`} className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg">{ownerName?.charAt(0)}</div>
                      {isGroup ? (
                        <div>
                          <h2 className="font-semibold text-lg line-clamp-1">{ownerName}</h2>
                          <p className="text-xs ">Lead ID {ownerId}</p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {project.studentList?.map((student) => (
                              <span key={student.studentId} className="text-xs">
                                {student.student_name} . {student.studentId}
                              </span>
                            ))}
                          </div>
                        </div>                       
                      ):(
                        <div>
                          <h2 className="font-semibold text-lg line-clamp-1">{ownerName}</h2>
                          <p className="text-xs text-gray-500">ID {ownerId}</p>
                        </div>
                      )}
                    </div>
                    <h3 className="mt-4 font-semibold text-[15px] line-clamp-2 min-h-[48px]">{title}</h3>
                    <div className="flex flex-wrap gap-2 mt-3">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">{branch}</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">{year}</span>
                      <span className={`text-xs px-2 py-1 rounded text-white ${isGroup ? "bg-purple-500" : "bg-blue-500"}`}>
                        {isGroup ? "Group" : "Individual"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">

                      {project.tech1 && (<span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{project.tech1}</span>)}
                      {project.tech2 && (<span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{project.tech2}</span>)}
                      {project.tech3 && (<span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{project.tech3}</span>)}

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
                      <a href={project.liveUrl} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm">View Project</a>
                      <a href={project.githubUrl} target="_blank" rel="noreferrer" className="border px-3 rounded flex items-center justify-center hover:bg-gray-100"><ExternalLink size={18}/></a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredProjects.length === 0 && (
            <div className="bg-white rounded-lg p-10 text-center mt-10">No Projects Found</div>
          )}
        </>
        )}
      </div>
      </div>
    </div>
  );
};
export default memo(ExploreProjects);