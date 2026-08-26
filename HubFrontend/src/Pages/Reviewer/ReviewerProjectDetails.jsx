import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, XCircle, GitBranch, ExternalLink, Loader2, FileText } from "lucide-react";
import toast from "react-hot-toast";
import reviewerAxiosInstance from "../../Api/reviewerAxiosInstance";

const ReviewerProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const response = await reviewerAxiosInstance.get("/reviewer/projects/pending");
      const foundProject = response.data?.find((item) => String(item.projectId) === String(projectId));

      if (!foundProject) {
        toast.error("Project is no longer pending");
        navigate("/reviewer/projects");
        return;
      }
      setProject(foundProject);
    } catch (error) {
      console.error("Error loading project:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("reviewerToken");
        localStorage.removeItem("reviewer");
        navigate("/reviewer/login");
        return;
      }
      toast.error("Unable to load project");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!window.confirm("Are you sure you want to approve this project?")) return;

    try {
      setActionLoading(true);
      const response = await reviewerAxiosInstance.post(`/reviewer/review/project/${projectId}/approve`, {
        feedback: feedback.trim(),
      });
      toast.success(response.data || "Project approved successfully");
      navigate("/reviewer/projects");
    } catch (error) {
      console.error("Approval error:", error);
      toast.error(error.response?.data || "Unable to approve project");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!feedback.trim()) {
      toast.error("Feedback is required when rejecting a project");
      return;
    }
    if (feedback.trim().length > 1000) {
      toast.error("Feedback cannot exceed 1000 characters");
      return;
    }
    if (!window.confirm("Are you sure you want to reject this project?")) return;

    try {
      setActionLoading(true);
      const response = await reviewerAxiosInstance.post(`/reviewer/review/project/${projectId}/reject`, {
        feedback: feedback.trim(),
      });
      toast.success(response.data || "Project rejected successfully");
      navigate("/reviewer/projects");
    } catch (error) {
      console.error("Rejection error:", error);
      toast.error(error.response?.data || "Unable to reject project");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary text-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-400">
          <Loader2 className="animate-spin" size={20} /> Loading project...
        </div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="min-h-screen bg-primary text-white">
      <header className="border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-5">
          <button onClick={() => navigate("/reviewerDashboard")} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white">
            <ArrowLeft size={17} /> Back to Projects
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Heading */}
        <div className="mb-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-accent/20 p-3 text-sky">
              <FileText size={25} />
            </div>
            <div>
              <p className="text-sm text-sky">Solo Project</p>
              <h1 className="text-3xl font-bold">{project.projectName || "Untitled Project"}</h1>
            </div>
          </div>
          <div className="mt-4 font-bold flex flex-row gap-5 ">
            <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-md text-amber-300">
              Pending Review
            </span>
            <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-md text-amber-300">
              {project.choice}
            </span>
          </div>
        </div>

        <div className="mb-5 font-semibold text-xl">
          <span>
            Submitted By {project.student.student_name}
          </span>
        </div>

        {/* Description */}
        <section className="rounded-2xl border border-white/10 bg-white/3 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Project Description</h2>
          <p className="text-gray-300 leading-7 whitespace-pre-wrap">{project.description || "No description provided."}</p>
        </section>

        {/* Project information */}
        <section className="rounded-2xl border border-white/10 bg-white/3 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-5">Project Information</h2>
          <div className="text-md grid grid-cols-1 md:grid-cols-2 gap-5">
            
            <InfoItem label="Branch" value={project.student?.branch} />
            <InfoItem label="Year" value={project.student?.year} />
            <div>
              <p className=" uppercase tracking-wider text-gray-300">  Technologies</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {[project.tech1, project.tech2, project.tech3].filter(Boolean).map((tech, index) => (
                    <span  key={index}  className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-md text-green-400">
                      {tech}
                    </span>
                  ))}
              </div>
            </div>
            <InfoItem label="Status" value={project.status} />
          </div>
        </section>

        {/* Links */}
        <section className="rounded-2xl border border-white/10 bg-white/3 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-5">Project Links</h2>
          <div className="flex flex-wrap gap-4">
            {project.githubUrl && (
              <div>
                <span>For More details view .README file.</span>
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center bg-gray-500 text-black gap-2 rounded-lg border border-gray-400 px-4 py-2.5 mt-2 text-sm hover:bg-white/10">
                  <GitBranch size={18} /> GitHub <ExternalLink size={14} />
                </a>
              </div>

            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-sm hover:bg-white/10">
                <ExternalLink size={18} /> Live Project
              </a>
            )}
          </div>
        </section>

        {/* Rejection feedback */}
        {showRejectBox && (
          <section className="rounded-2xl border border-red-400/20 bg-red-400/3 p-6 mb-6">
            <h2 className="text-lg font-semibold">Rejection Feedback</h2>
            <p className="text-sm text-gray-400 mt-1 mb-4">
              Explain what the student should improve. This feedback will also be sent by email.
            </p>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              maxLength={1000}
              rows={6}
              placeholder="Explain why this project is being rejected..."
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none resize-none focus:border-red-400/50"
            />
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-500">Feedback is required</span>
              <span className="text-xs text-gray-500">{feedback.length}/1000</span>
            </div>
          </section>
        )}

        {/* Actions */}
        <section className="rounded-2xl border border-white/10 bg-white/3 p-6">
          <h2 className="text-lg font-semibold mb-2">Review Decision</h2>
          <p className="text-sm text-gray-400 mb-6">
            This decision will determine whether the project becomes visible on KL Innovation Hub.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              disabled={actionLoading}
              onClick={handleApprove}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-3 font-medium text-black hover:bg-green-400 disabled:opacity-50"
            >
              {actionLoading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
              Approve Project
            </button>

            {!showRejectBox ? (
              <button
                disabled={actionLoading}
                onClick={() => setShowRejectBox(true)}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-red-400/30 bg-red-400/10 px-5 py-3 font-medium text-red-300 hover:bg-red-400/20 disabled:opacity-50"
              >
                <XCircle size={18} /> Reject Project
              </button>
            ) : (
              <button
                disabled={actionLoading}
                onClick={handleReject}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-3 font-medium text-white hover:bg-red-400 disabled:opacity-50"
              >
                {actionLoading ? <Loader2 size={18} className="animate-spin" /> : <XCircle size={18} />}
                Confirm Rejection
              </button>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

const InfoItem = ({ label, value }) => {
  return (
    <div>
      <p className=" uppercase tracking-wider text-gray-500">{label}</p>
      <p className="mt-1 text-sm text-gray-200">{value || "Not provided"}</p>
    </div>
  );
};

export default ReviewerProjectDetails;