import { memo, useEffect, useMemo, useState } from "react";
import axiosInstance from "../../Api/axiosInstance";
import Navbar from "../../Components/Navbar";
import { Search, Heart, Users, User, ExternalLink, MessageCircle } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardFooter from "../../Components/DashboardFooter";
import ReviewerNavbar from "../Reviewer/ReviewerNavbar";
import ProjectDiscussion from "../../Components/ProjectDiscussion/ProjectDiscussion";

const ExploreProjects = () => {
  const [projects, setProjects] = useState([]);
  const [groupProjects, setGroupProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDiscussionProject, setSelectedDiscussionProject] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedChoice, setSelectedChoice] = useState("");
  const allProjects = [...projects, ...groupProjects];
  const studentId = JSON.parse(localStorage.getItem("studentId"));
  const isReviewer = !!localStorage.getItem("reviewerToken");
  const navigate = useNavigate();

  const requireLogin = () => {
    if (!localStorage.getItem("token") && !localStorage.getItem("reviewerToken")) {
      toast.error("Please login to continue");
      navigate("/login");
      return false;
    }
    return true;
  };

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const [projectRes, groupProjectRes] = await Promise.all([axiosInstance.get("/project/all"), axiosInstance.get("/groupProject/all")]);
      setProjects(projectRes.data.map((item) => ({ ...item, type: "INDIVIDUAL", isLiked: item.likes?.some((like) => Number(like.likedStudentId) === Number(studentId)) || false })));
      setGroupProjects(groupProjectRes.data.map((item) => ({ ...item, type: "GROUP", isLiked: item.likes?.some((like) => Number(like.likedStudentId) === Number(studentId)) || false })));
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = useMemo(() => {
    const query = search.toLowerCase().trim();
    return allProjects.filter((project) => {
      const isGroup = project.type === "GROUP";
      const ownerName = isGroup ? project.teamLead?.student_name : project.student?.student_name;
      const ownerId = isGroup ? project.teamLead?.studentId : project.student?.studentId;
      const title = (isGroup ? project.project_name : project.projectName)?.toLowerCase();
      const branch = isGroup ? project.teamLead?.branch : project.student?.branch;
      const year = isGroup ? project.teamLead?.year : project.student?.year;
      const teamMembers = project.studentList?.map((s) => `${s.student_name.toLowerCase()} ${s.studentId}`).join(" ") || "";
      const matchesSearch = title?.includes(query) || ownerName?.toLowerCase().includes(query) || String(ownerId || "").includes(query) || teamMembers.includes(query) || project.tech1?.toLowerCase().includes(query) || project.tech2?.toLowerCase().includes(query) || project.tech3?.toLowerCase().includes(query);
      return matchesSearch && (selectedBranch ? branch === selectedBranch : true) && (selectedYear ? year === parseInt(selectedYear) : true) && (selectedType === "ALL" ? true : selectedType === project.type) && (selectedChoice ? project.choice === selectedChoice : true);
    });
  }, [allProjects, search, selectedBranch, selectedYear, selectedType, selectedChoice]);

  const handleLike = async (project) => {
    if (localStorage.getItem("reviewerToken")) {
      toast("Reviewers cannot like projects.");
      return;
    }
    if (!requireLogin()) return;
    try {
      if (project.type === "INDIVIDUAL") {
        const res = await axiosInstance.post(`/likes/toggleLike/${project.projectId}`);
        setProjects((prev) => prev.map((p) => p.projectId === project.projectId ? { ...p, isLiked: res.data.liked, likeCount: res.data.likeCount } : p));
      } else {
        const res = await axiosInstance.post(`/grouplikes/toggleLike/${project.groupProjectId}`);
        setGroupProjects((prev) => prev.map((p) => p.groupProjectId === project.groupProjectId ? { ...p, isLiked: res.data.liked, likeCount: res.data.likeCount } : p));
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleExternalClick = (e) => {
    if (!requireLogin()) e.preventDefault();
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      {isReviewer ? <ReviewerNavbar /> : <Navbar />}
      <div className="mb-6 bg-oxford-blue px-4 py-5 text-gray-700 shadow-md sm:px-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-100 sm:text-2xl">Exploring All Innovations</h1>
            <p className="mt-1 text-gray-300">{filteredProjects.length} results found</p>
          </div>
          <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto lg:gap-4">
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="min-w-27.5 flex-1 rounded-xl border bg-gray-50 px-2 py-1.5 text-sm outline-none lg:flex-none"><option value="ALL">All Projects</option><option value="INDIVIDUAL">Individual</option><option value="GROUP">Group</option></select>
            <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)} className="min-w-27.5 flex-1 rounded-xl border bg-gray-50 px-2 py-1.5 text-sm outline-none lg:flex-none"><option value="">All Departments</option><option value="CSE">CSE</option><option value="CSIT">CSIT</option><option value="ECE">ECE</option></select>
            <select value={selectedChoice} onChange={(e) => setSelectedChoice(e.target.value)} className="min-w-27.5 flex-1 rounded-xl border bg-gray-50 px-2 py-1.5 text-sm outline-none lg:flex-none"><option value="">All Categories</option><option value="AI/ML">AI/ML</option><option value="Data Science">Data Science</option><option value="Web Development">Web Development</option><option value="Mobile App Development">Mobile App Development</option><option value="Cloud Computing">Cloud Computing</option><option value="Cybersecurity">Cybersecurity</option><option value="Internet of Things (IoT)">Internet of Things (IoT)</option><option value="Robotics">Robotics</option><option value="Embedded Systems">Embedded Systems</option><option value="Blockchain">Blockchain</option><option value="Computer Vision">Computer Vision</option><option value="Natural Language Processing (NLP)">Natural Language Processing (NLP)</option><option value="DevOps">DevOps</option><option value="AR/VR">AR/VR</option><option value="Other">Other</option></select>
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="min-w-27.5 flex-1 rounded-xl border bg-gray-50 px-2 py-1.5 text-sm outline-none lg:flex-none"><option value="">All Years</option><option value="2021">2021</option><option value="2022">2022</option><option value="2023">2023</option><option value="2024">2024</option><option value="2025">2025</option><option value="2026">2026</option><option value="2027">2027</option></select>
            <div className="flex w-full items-center rounded-xl border bg-gray-50 px-3 py-2 lg:w-90"><span className="ml-2 text-primary">🔍</span><input type="text" placeholder="Search projects, tech, student, id..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-transparent px-2 outline-none" /></div>
          </div>
        </div>
      </div>

      <div className="flex-1">
        {loading ? <div className="py-20 text-center text-lg">Loading Projects...</div> : (
          <div className="px-4 sm:px-6 lg:px-10">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {filteredProjects.map((project) => {
                const isGroup = project.type === "GROUP";
                const title = isGroup ? project.project_name : project.projectName;
                const ownerName = isGroup ? project.teamLead?.student_name : project.student?.student_name;
                const ownerId = isGroup ? project.teamLead?.studentId : project.student?.studentId;
                const branch = isGroup ? project.teamLead?.branch : project.student?.branch;
                const year = isGroup ? project.teamLead?.year : project.student?.year;
                return (
                  <div key={`${project.type}-${project.projectId || project.groupProjectId}`} className="overflow-hidden rounded-xl border border-amber-800 bg-cream shadow transition hover:bg-tan/50 hover:shadow-lg">
                    <div className="p-4">
                      <div className="mb-3 flex cursor-pointer items-center gap-4 rounded-lg bg-blend-luminosity transition hover:bg-amber-100" onClick={() => navigate(`/profile/${isGroup ? project.teamLead?.studentId : project.student?.studentId}`)}>
                        <img src={isGroup ? (project.teamLead?.avatarUrl || `/avatars/Avatar${(project.teamLead?.studentId % 40) + 1}.webp`) : (project.student?.avatarUrl || `/avatars/Avatar${(project.student?.studentId % 40) + 1}.webp`)} className="h-16 w-16 shrink-0 rounded-full border-2 border-gray-200 object-cover" />
                        <div><h3 className="text-lg font-bold leading-tight text-gray-900 sm:text-xl">{title}</h3><p className="font-medium text-gray-800">{ownerName}</p></div>
                      </div>
                      {isGroup && project.studentList?.length > 0 && <div className="mb-3 flex flex-wrap gap-2">{project.studentList.filter((student) => student.studentId !== ownerId).map((student) => <span key={student.studentId} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">{student.student_name}</span>)}</div>}
                      <div className="flex flex-wrap gap-2"><span className="rounded bg-gray-100 px-2 py-1 text-xs">{branch}</span><span className="rounded bg-gray-100 px-2 py-1 text-xs">{year}</span><span className={`rounded px-2 py-1 text-xs text-white ${isGroup ? "bg-purple-500" : "bg-blue-500"}`}>{isGroup ? "Group" : "Individual"}</span></div>
                      <div className="rounded-full py-1 text-xs">{project.tech1 && <span className="rounded px-2 py-1 text-xs text-blue-700">{project.tech1}</span>}{project.tech2 && <span className="rounded px-2 py-1 text-xs text-blue-700">{project.tech2}</span>}{project.tech3 && <span className="rounded px-2 py-1 text-xs text-blue-700">{project.tech3}</span>}</div>
                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-600">{project.description}</p>
                      <div className="mt-5 flex items-center justify-between">
                        <button onClick={() => handleLike(project)} className="flex items-center gap-1 text-sm"><Heart size={18} fill={project.isLiked ? "red" : "transparent"} className={project.isLiked ? "text-red-500" : "text-gray-400"} />{project.likeCount || 0} Likes</button>
                        <button type="button" onClick={() => setSelectedDiscussionProject(project)} className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600" aria-label="Open project discussion"><MessageCircle size={17} />{project.discussionCount || 0}</button>
                        {isGroup ? <div className="flex items-center gap-1 text-sm text-gray-600"><Users size={16} />Team</div> : <div className="flex items-center gap-1 text-sm text-gray-600"><User size={16} />Solo</div>}
                      </div>
                      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                        {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" onClick={handleExternalClick} className="flex-1 rounded bg-accent px-5 py-2 text-center text-sm text-white hover:bg-blue-700">View Project</a>}
                        <a href={project.githubUrl} target="_blank" rel="noreferrer" onClick={handleExternalClick} className="flex w-full items-center justify-center rounded border px-3 py-2 hover:bg-gray-100 sm:w-14"><FaGithub size={20} /></a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {filteredProjects.length === 0 && <div className="mt-10 rounded-lg bg-white p-10 text-center">No Projects Found</div>}
          </div>
        )}
      </div>
      <DashboardFooter />

      <ProjectDiscussion project={selectedDiscussionProject} isOpen={!!selectedDiscussionProject} onClose={() => setSelectedDiscussionProject(null)} />
    </div>
  );
};

export default memo(ExploreProjects);
