import {memo,useEffect,useMemo,useState} from "react";
import axiosInstance from "../../Api/axiosInstance"
import Navbar from "../../Components/Navbar";
import {Search,Heart,Users,User,ExternalLink,MessageCircle} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import DashboardFooter from "../../Components/DashboardFooter";
import ReviewerNavbar from "../Reviewer/ReviewerNavbar";
import ProjectDiscussion from "../../Components/ProjectDiscussion/ProjectDiscussion";
import { getDiscussionCounts } from "../../Api/discussionApi";
import { FaGithub, FaHeart } from "react-icons/fa";
import { Globe} from "lucide-react";
import ExploreProjectsCard from "../../Components/ExploreProjectsCard";

const ExploreProjects = () => {

  const [projects,setProjects] = useState([]);
  const [groupProjects,setGroupProjects] = useState([]);
  const [loading,setLoading] = useState(true);

  const [search,setSearch] = useState("");
  const [selectedBranch,setSelectedBranch] = useState("");
  const [selectedYear,setSelectedYear] = useState("");
  const [selectedType,setSelectedType] = useState("ALL");
  const allProjects = [...projects,...groupProjects];
  const [selectedChoice, setSelectedChoice] = useState("");
  
  const [selectedDiscussionProject, setSelectedDiscussionProject] = useState(null);
  const student = JSON.parse(localStorage.getItem("student") || "null");
  const reviewer = JSON.parse(localStorage.getItem("reviewer") || "null");
  const studentId = JSON.parse(localStorage.getItem("studentId"));
  const interestedDomain = student?.interestedDomain || "";
  const isReviewer = !!localStorage.getItem("reviewerToken");

  const reviewerChoices = [
    reviewer?.choice1,
    reviewer?.choice2,
    reviewer?.choice3
  ].filter((choice) => choice && choice.trim());
  const navigate = useNavigate();

  const requireLogin = () => {
    const studentToken = localStorage.getItem("token");
    const reviewerToken = localStorage.getItem("reviewerToken");
    if (!studentToken && !reviewerToken) {
      toast.error("Please login to continue");
      navigate("/login");
      return false;
    }
    return true;
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const [projectRes,groupProjectRes] = await Promise.all([axiosInstance.get("/project/all"),axiosInstance.get("/groupProject/all"),]);
      const formattedProjects = projectRes.data.map((item) => {  
        const isLiked = item.likes?.some((like) =>  Number(like.likedStudentId) === Number(studentId));
        return {...item,  type: "INDIVIDUAL", isLiked: isLiked || false,};
      });
      const formattedGroupProjects = groupProjectRes.data.map((item) => {
        const isLiked = item.likes?.some((like) => Number(like.likedStudentId) === Number(studentId));
        return { ...item,type: "GROUP",isLiked: isLiked || false,};
      });
      const projectIds = formattedProjects.map((project) => project.projectId);
      const groupProjectIds = formattedGroupProjects.map((project) => project.groupProjectId);
      const discussionCountRes = await getDiscussionCounts(projectIds,groupProjectIds);
      const counts = discussionCountRes.data;
      const projectsWithCounts = formattedProjects.map((project) => ({...project, discussionCount:counts[`INDIVIDUAL:${project.projectId}`] || 0,}));
      const groupProjectsWithCounts = formattedGroupProjects.map((project) => ({...project,discussionCount:counts[`GROUP:${project.groupProjectId}`] || 0,}));
      setProjects(projectsWithCounts);
      setGroupProjects(groupProjectsWithCounts);
    }catch (err) {toast.error("Something went wrong. Please try again.");} 
    finally {setLoading(false);}
  };

  const recommendedProjects = useMemo(() => {
    if (isReviewer) {
      return allProjects.filter((project) =>
        reviewerChoices.includes(project.choice)
      );
    }

    if (interestedDomain) {
      return allProjects.filter(
        (project) => project.choice === interestedDomain
      );
    }

    return [];
  }, [
    allProjects,
    isReviewer,
    interestedDomain,
    reviewer?.choice1,
    reviewer?.choice2,
    reviewer?.choice3
  ]);

  const filteredProjects = useMemo(() => {
    const query = search.toLowerCase().trim();
    return allProjects.filter((project) => {
      const isGroup = project.type === "GROUP";
      const ownerName = isGroup? project.teamLead?.student_name: project.student?.student_name;
      const ownerId = isGroup? project.teamLead?.studentId: project.student?.studentId;
      const title = isGroup? project.project_name?.toLowerCase(): project.projectName?.toLowerCase();
      const branch = isGroup? project.teamLead?.branch: project.student?.branch;
      const year = isGroup? project.teamLead?.year: project.student?.year;
      const matchesChoice = selectedChoice? project.choice === selectedChoice: true;
      const teamMembers =project.studentList?.map((s) => `${s.student_name.toLowerCase()} ${s.studentId}`).join(" ") || "";
     const matchesSearch =title?.includes(query) ||ownerName?.toLowerCase().includes(query) ||String(ownerId || "").includes(query) ||teamMembers.includes(query) ||teamMembers.includes(query) 
            ||project.tech1?.toLowerCase().includes(query) || project.tech2?.toLowerCase().includes(query) || project.tech3?.toLowerCase().includes(query);      
      const matchesBranch = selectedBranch? branch === selectedBranch: true;
      const matchesYear = selectedYear? year === parseInt(selectedYear): true;
      const matchesType =selectedType === "ALL"  ? true  : selectedType === project.type;
      return (matchesSearch &&matchesBranch &&matchesYear &&matchesType && matchesChoice);
    });
  }, [allProjects,search,selectedBranch,selectedYear,selectedType,selectedChoice]);

  const handleLike = async (project) => {
    if (localStorage.getItem("reviewerToken")) {
      toast("Reviewers cannot like projects.");
      return;
    }
    if (!requireLogin()) return;

    try {
      if(project.type === "INDIVIDUAL") {
        const res = await axiosInstance.post(`/likes/toggleLike/${project.projectId}`);
        const {liked,likeCount} = res.data;
        setProjects((prev) =>  prev.map((p) =>
            p.projectId === project.projectId? {...p, isLiked: liked, likeCount: likeCount,} : p)
        );
      } else {
        const res = await axiosInstance.post(`/grouplikes/toggleLike/${project.groupProjectId}`);
        const {liked,likeCount} = res.data;
        setGroupProjects((prev) => prev.map((p) =>
            p.groupProjectId === project.groupProjectId ? {...p,isLiked : liked,  likeCount: likeCount,}: p)
        );
      }
    } catch(err) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleLiveUrlClick = (e) => {
    if (!requireLogin()) {
      e.preventDefault();
      return;
    }
  };

  const handleGithubClick = (e) => {
    if (!requireLogin()) {
      e.preventDefault();
      return;
    }
  };

  return (

    <div className="min-h-screen bg-white flex flex-col">
    {isReviewer ? <ReviewerNavbar /> : <Navbar />}
    <div className="bg-oxford-blue text-gray-700 shadow-md px-4 sm:px-5 py-5 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-100">  Exploring All Innovations</h1>
          <p className="text-gray-300 mt-1">  {filteredProjects.length} results found  </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:gap-4 w-full lg:w-auto">
          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="flex-1 min-w-27.5 lg:flex-none border rounded-xl px-2 py-3 text-sm bg-gray-50 outline-none">
            <option value="ALL">All Projects</option>
            <option value="INDIVIDUAL">Individual</option>
            <option value="GROUP">Group</option>
          </select>

          <select  value={selectedBranch}  onChange={(e) => setSelectedBranch(e.target.value)}  className="flex-1 min-w-27.5 lg:flex-none border rounded-xl px-2 py-3 text-sm bg-gray-50 outline-none">
            <option value="">All Departments</option>
            <option value="CSE">CSE</option>
            <option value="CSIT">CSIT</option>
            <option value="ECE">ECE</option>
            <option value="AIDS">AIDS</option>
          </select>
          
          <select value={selectedChoice}  onChange={(e) => setSelectedChoice(e.target.value)}
            className="flex-1 min-w-27.5 lg:flex-none border rounded-xl px-2 py-3 text-sm bg-gray-50 outline-none">
            <option value="">All Categories</option>
            <option value="AI/ML">AI/ML</option>
            <option value="Data Science">Data Science</option>
            <option value="Web Development">Web Development</option>
            <option value="Mobile App Development">Mobile App Development</option>
            <option value="Cloud Computing">Cloud Computing</option>
            <option value="Cybersecurity">Cybersecurity</option>
            <option value="Internet of Things (IoT)">Internet of Things (IoT)</option>
            <option value="Robotics">Robotics</option>
            <option value="Embedded Systems">Embedded Systems</option>
            <option value="Blockchain">Blockchain</option>
            <option value="Computer Vision">Computer Vision</option>
            <option value="Natural Language Processing (NLP)">  Natural Language Processing (NLP)</option>
            <option value="DevOps">DevOps</option>
            <option value="AR/VR">AR/VR</option>
            <option value="Other">Other</option>
          </select>          

          <select value={selectedYear}  onChange={(e) => setSelectedYear(e.target.value)}
            className="flex-1 min-w-27.5 lg:flex-none border rounded-xl px-2 py-3 text-sm bg-gray-50 outline-none">
            <option value="">All Years</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
          </select>
       
          <div className="col-span-3 lg:col-span-1 flex items-center border rounded-xl px-3 py-3 bg-gray-50 w-full lg:w-90">
            <span className="text-primary ml-2">🔍</span>
            <input  type="text"  placeholder="Search projects, tech, student, id..."  value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent outline-none px-2"/>
          </div>
        </div>
      </div>
    </div>

    <div className="flex-1">
    {((isReviewer && reviewerChoices.length > 0) || (!isReviewer && interestedDomain)) && !loading && (
      <section className="px-4 sm:px-6 lg:px-10 mb-8">
        <div className="rounded-2xl bg-blue-100 border border-amber-800 shadow-sm p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-5">
            <div>
              <p className="text-sm font-semibold text-accent uppercase tracking-wider">For You</p>
              <h2 className="text-2xl font-bold text-gray-900">
                {isReviewer
                  ? "Approved Projects in Your Review Domains"
                  : `Projects in ${interestedDomain}`}
              </h2>
              <p className="text-gray-500 mt-1">
                {isReviewer
                  ? "Approved projects matching your selected review categories."
                  : "Approved projects matching your selected domain."}
              </p>
            </div>
            <span className="text-sm text-gray-500">{recommendedProjects.length} projects</span>
          </div>

          {recommendedProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
              {recommendedProjects.map((project) => (
                <ExploreProjectsCard
                  key={`interest-${project.type}-${project.projectId || project.groupProjectId}`}
                  project={project}
                  navigate={navigate}
                  handleLike={handleLike}
                  handleLiveUrlClick={handleLiveUrlClick}
                  handleGithubClick={handleGithubClick}
                  setSelectedDiscussionProject={setSelectedDiscussionProject}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl bg-gray-50 border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
              {isReviewer
                ? "No approved projects are available in your selected review domains yet."
                : "No approved projects are available in your selected domain yet."}
            </div>
          )}
        </div>
      </section>
    )}
    <div className="flex justify-between items-center mb-5">
    {loading ? (
      <div className="text-center py-20 text-lg">Loading Projects...</div>
    ) : (
    <>
            <div>
    <h2 className="text-2xl font-bold text-gray-900 px-10 mb-5">Project Inventory</h2>
    <div className="px-4 sm:px-6 lg:px-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
        {filteredProjects.map((project) => (
          <ExploreProjectsCard
            key={`${project.type}-${project.projectId || project.groupProjectId}`}
            project={project}
            navigate={navigate}
            handleLike={handleLike}
            handleLiveUrlClick={handleLiveUrlClick}
            handleGithubClick={handleGithubClick}
            setSelectedDiscussionProject={setSelectedDiscussionProject}
          />
        ))}
      </div>
    </div>
    {selectedDiscussionProject && (
      <ProjectDiscussion project={selectedDiscussionProject} isOpen={true}
        onClose={() => setSelectedDiscussionProject(null)}
      />
    )}
    {filteredProjects.length === 0 && (<div className="bg-white rounded-lg p-10 text-center mt-10">No Projects Found</div>)}
    </>)}
    </div>
   </div>
   <DashboardFooter/>
  </div>
  );
};
export default memo(ExploreProjects);