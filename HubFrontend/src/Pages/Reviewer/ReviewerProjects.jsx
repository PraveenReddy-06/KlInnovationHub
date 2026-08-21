import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FileText, Users, ExternalLink } from "lucide-react";
import reviewerAxiosInstance from "../../Api/reviewerAxiosInstance";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

const ReviewerProjects = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [projects, setProjects] = useState([]);
  const [groupProjects, setGroupProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const selectedType = searchParams.get("type") || "all";

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const [projectResponse, groupResponse] = await Promise.all([
        reviewerAxiosInstance.get("/reviewer/projects/pending"),
        reviewerAxiosInstance.get("/reviewer/groupProjects/pending")
      ]);

      setProjects(projectResponse.data || []);
      setGroupProjects(groupResponse.data || []);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data || "Unable to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  const showSolo = selectedType === "all" || selectedType === "solo";
  const showGroup = selectedType === "all" || selectedType === "group";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#021024] text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#021024] text-white">

      <div className="max-w-5xl mx-auto px-6 py-5">
        <button onClick={() => navigate("/reviewerDashboard")} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white">
          <ArrowLeft size={17} /> Back to Dashboard
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <p className="text-sm text-[#7DA0CA]">Reviewer Center</p>
          <h1 className="text-3xl font-bold mt-1">Pending Projects</h1>
          <p className="text-gray-400 mt-2">
            Review projects submitted by KL Innovation Hub students.
          </p>
        </div>

        <div className="flex gap-3 mb-8">
          <button
            onClick={() => navigate("/reviewer/projects")}
            className={`px-4 py-2 rounded-lg ${selectedType === "all" ? "bg-white text-black" : "border border-white/10"}`}
          >
            All
          </button>
          <button
            onClick={() => navigate("/reviewer/projects?type=solo")}
            className={`px-4 py-2 rounded-lg ${selectedType === "solo" ? "bg-white text-black" : "border border-white/10"}`}
          >
            Solo Projects
          </button>
          <button
            onClick={() => navigate("/reviewer/projects?type=group")}
            className={`px-4 py-2 rounded-lg ${selectedType === "group" ? "bg-white text-black" : "border border-white/10"}`}
          >
            Group Projects
          </button>
        </div>

        {showSolo && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={20} className="text-[#7DA0CA]" />
              <h2 className="text-xl font-semibold">Solo Projects</h2>
            </div>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {projects.map((project) => (
                <ProjectCard
                  key={project.projectId}
                  title={project.projectName}
                  description={project.description}
                  githubUrl={project.githubUrl}
                  liveUrl={project.liveUrl}
                  type="Solo Project"
                  onReview={() => navigate(`/reviewer/project/${project.projectId}`)}
                />
              ))}
            </div>
          </section>
        )}

        {showGroup && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Users size={20} className="text-[#7DA0CA]" />
              <h2 className="text-xl font-semibold">Group Projects</h2>
            </div>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {groupProjects.map((project) => (
                <ProjectCard
                  key={project.groupProjectId}
                  title={project.project_name}
                  description={project.description}
                  githubUrl={project.githubUrl}
                  liveUrl={project.liveUrl}
                  type="Group Project"
                  onReview={() => navigate(`/reviewer/group-project/${project.groupProjectId}`)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

const ProjectCard = ({ title, description, githubUrl, liveUrl, type, onReview }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex justify-between items-start gap-4">
        <div>
          <p className="text-xs text-[#7DA0CA] uppercase tracking-wider">{type}</p>
          <h3 className="text-lg font-semibold mt-2">{title || "Untitled Project"}</h3>
        </div>
        <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs text-amber-300">
          Pending
        </span>
      </div>

      <p className="mt-4 text-sm text-gray-400 line-clamp-3">
        {description || "No description provided."}
      </p>

      <div className="flex gap-3 mt-5">
        {githubUrl && (
          <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-300 hover:text-white">
            <ExternalLink size={15} /> GitHub
          </a>
        )}
        {liveUrl && (
          <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-300 hover:text-white">
            <ExternalLink size={15} /> Live
          </a>
        )}
      </div>

      <button onClick={onReview} className="w-full mt-6 rounded-lg bg-white text-black py-2.5 font-medium hover:bg-gray-200">
        Review Project
      </button>
    </div>
  );
};

export default ReviewerProjects;