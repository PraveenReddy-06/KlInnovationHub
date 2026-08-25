import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardCheck, FileText, Users, ArrowRight, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import reviewerAxiosInstance from "../../Api/reviewerAxiosInstance";
import ReviewerNavbar from "./ReviewerNavbar";

const ReviewerDashboard = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [groupProjects, setGroupProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingProjects();
  }, []);

  const loadPendingProjects = async () => {
    try {
      const [projectResponse, groupResponse] = await Promise.all([
        reviewerAxiosInstance.get("/reviewer/projects/pending"),
        reviewerAxiosInstance.get("/reviewer/groupProjects/pending")
      ]);

      setProjects(projectResponse.data || []);
      setGroupProjects(groupResponse.data || []);
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("reviewerToken");
        navigate("/login");
        return;
      }

      toast.error("Unable to load reviewer dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("reviewerToken");
    localStorage.removeItem("reviewer");
    navigate("/login");
  };

  const pendingCount = projects.length + groupProjects.length;

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden">
      <div  className="fixed inset-0 bg-cover bg-position-[center_30%] bg-no-repeat" style={{ backgroundImage: "url('/ReviewerDbg.png')" }}/>
      <div className="fixed inset-0 bg-primary/60 pointer-events-none" />

      <div className="relative z-10 min-h-screen">
        <ReviewerNavbar />
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold">Faculty Review Center</h2>
          <p className="text-sm sm:text-base text-gray-400 mt-2">
            Review submitted student projects before they become visible on the platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-5 mb-8 sm:mb-10">
          <div onClick={() => navigate("/reviewer/projects")} className=" rounded-2xl border border-bloodstone bg-cream p-4  sm:p-6 hover:bg-tan">
            <ClipboardCheck className="text-bloodstone" size={28} />
            <p className="text-sm sm:text-base text-gray-700 mt-3 sm:mt-5">Pending Review</p>
            <p className="text-2xl sm:text-4xl text-black font-bold mt-1 sm:mt-2">{pendingCount}</p>
            <p className="text-sm text-primary mt-2">Projects waiting for your decision</p>
          </div>

          <div className="rounded-2xl border border-bloodstone text-black bg-cream p-4  sm:p-6 hover:bg-tan">
            <FileText className="text-bloodstone" size={28} />
            <p className="text-sm sm:text-base text-gray-700 mt-3 sm:mt-5">Solo Projects</p>
            <p className="text-2xl sm:text-4xl font-bold mt-1 sm:mt-2">{projects.length}</p>
          </div>

          <div className="rounded-2xl border text-black border-white/10 bg-cream p-4  sm:p-6 hover:bg-tan">
            <Users className="text-bloodstone" size={28} />
            <p className="text-sm sm:text-base text-gray-700 mt-3 sm:mt-5">Group Projects</p>
            <p className="text-2xl sm:text-4xl font-bold mt-1 sm:mt-2">{groupProjects.length}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5">
          <div>
            <h2 className="text-2xl font-semibold">Pending Submissions</h2>
            <p className="text-md text-gray-400 mt-1">Projects that need your review</p>
          </div>

          <button onClick={() => navigate("/reviewer/projects")} className="flex items-center gap-2 cursor-pointer text-white hover:text-white self-start sm:self-auto">
            View all <ArrowRight size={17} />
          </button>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-white/10 p-10 text-center text-gray-400">
            Loading pending submissions...
          </div>
        ) : pendingCount === 0 ? (
          <div className="rounded-2xl border border-white/10 p-10 text-center">
            <ClipboardCheck size={42} className="mx-auto text-gray-500 mb-4" />
            <h3 className="font-semibold">No pending submissions</h3>
            <p className="text-sm text-gray-500 mt-2">New projects will appear here after students submit them.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.slice(0, 3).map((project) => (
              <ProjectRow
                key={`project-${project.projectId}`}
                title={project.projectName}
                type="Solo Project"  tech1={project.tech1} tech2={project.tech2} tech3={project.tech3}
                onClick={() => navigate(`/reviewer/project/${project.projectId}`)}
              />
            ))}

            {groupProjects.slice(0, 3).map((project) => (
              <ProjectRow key={`group-${project.groupProjectId}`}  title={project.project_name}
                type="Group Project"  tech1={project.tech1} tech2={project.tech2} tech3={project.tech3}
                onClick={() => navigate(`/reviewer/group-project/${project.groupProjectId}`)}
              />
            ))}
          </div>
        )}
      </main>
      </div>
    </div>
  );
};

const ProjectRow = ({ title, type, tech1, tech2, tech3, onClick }) => {
  const technologies = [tech1, tech2, tech3].filter(Boolean);
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 rounded-xl border border-white/10 bg-misty-sage px-4 sm:px-5 py-5">
      <div className="min-w-0 md:flex-1">
        <p className="font-bold text-lg sm:text-xl text-black truncate">
          {title || "Untitled Project"}
        </p>
        <p className="text-sm text-black mt-1">
          {type}
        </p>
      </div>
      <div className="flex flex-wrap justify-start md:justify-center gap-2 md:flex-1">
        {technologies.map((tech, index) => (
          <span  key={index}  className="px-3 py-2 rounded-xl bg-primary text-white text-xs font-medium">
            {tech}
          </span>
        ))}
      </div>
      <div className="w-full md:w-auto shrink-0">
        <button  onClick={onClick}  className="w-full md:w-auto px-4 py-2.5 cursor-pointer rounded-lg border border-primary bg-green-500 hover:text-white hover:bg-green-600 text-sm text-black">
          Review Now
        </button>
      </div>

    </div>
  );
};

export default ReviewerDashboard;