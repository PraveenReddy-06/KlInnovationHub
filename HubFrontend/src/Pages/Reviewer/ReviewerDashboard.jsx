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
    <div className="min-h-screen bg-[#021024] text-white">
      
      <ReviewerNavbar/>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold">Faculty Review Center</h2>
          <p className="text-gray-400 mt-2">
            Review submitted student projects before they become visible on the platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <div onClick={() => navigate("/reviewer/projects")} className="cursor-pointer rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:bg-white/[0.06]">
            <ClipboardCheck className="text-[#7DA0CA]" size={28} />
            <p className="text-gray-400 mt-5">Pending Review</p>
            <p className="text-4xl font-bold mt-2">{pendingCount}</p>
            <p className="text-sm text-gray-500 mt-2">Projects waiting for your decision</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <FileText className="text-[#7DA0CA]" size={28} />
            <p className="text-gray-400 mt-5">Solo Projects</p>
            <p className="text-4xl font-bold mt-2">{projects.length}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <Users className="text-[#7DA0CA]" size={28} />
            <p className="text-gray-400 mt-5">Group Projects</p>
            <p className="text-4xl font-bold mt-2">{groupProjects.length}</p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-xl font-semibold">Pending Submissions</h2>
            <p className="text-sm text-gray-400 mt-1">Projects that need your review</p>
          </div>

          <button onClick={() => navigate("/reviewer/projects")} className="flex items-center gap-2 text-[#7DA0CA] hover:text-white">
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
                type="Solo Project"
                onClick={() => navigate(`/reviewer/project/${project.projectId}`)}
              />
            ))}

            {groupProjects.slice(0, 3).map((project) => (
              <ProjectRow
                key={`group-${project.groupProjectId}`}
                title={project.project_name}
                type="Group Project"
                onClick={() => navigate(`/reviewer/group-project/${project.groupProjectId}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const ProjectRow = ({ title, type, onClick }) => (
  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4">
    <div>
      <p className="font-medium">{title || "Untitled Project"}</p>
      <p className="text-sm text-gray-500 mt-1">{type}</p>
    </div>
    <button onClick={onClick} className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/10 text-sm">
      Review
    </button>
  </div>
);

export default ReviewerDashboard;