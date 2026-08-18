import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, XCircle, GitBranch, ExternalLink, Loader2, Users } from "lucide-react";
import toast from "react-hot-toast";
import reviewerAxiosInstance from "../../Api/reviewerAxiosInstance";

const ReviewerGroupProjectDetails = () => {
  const { groupProjectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadProject();
  }, [groupProjectId]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const response = await reviewerAxiosInstance.get("/reviewer/groupProjects/pending");
      const foundProject = response.data?.find((item) => String(item.groupProjectId) === String(groupProjectId));

      if (!foundProject) {
        toast.error("Group project is no longer pending");
        navigate("/reviewer/projects");
        return;
      }
      setProject(foundProject);
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("reviewerToken");
        localStorage.removeItem("reviewer");
        navigate("/reviewer/login");
        return;
      }
      toast.error("Unable to load group project");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!window.confirm("Are you sure you want to approve this group project?")) return;

    try {
      setActionLoading(true);
      const response = await reviewerAxiosInstance.post(`/reviewer/review/groupProject/${groupProjectId}/approve`, {
        feedback: feedback.trim(),
      });
      toast.success(response.data || "Group project approved successfully");
      navigate("/reviewer/projects");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data || "Unable to approve group project");
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
    if (!window.confirm("Are you sure you want to reject this group project?")) return;

    try {
      setActionLoading(true);
      const response = await reviewerAxiosInstance.post(`/reviewer/review/groupProject/${groupProjectId}/reject`, {
        feedback: feedback.trim(),
      });
      toast.success(response.data || "Group project rejected successfully");
      navigate("/reviewer/projects");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data || "Unable to reject group project");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#021024] text-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-400">
          <Loader2 size={20} className="animate-spin" /> Loading group project...
        </div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="min-h-screen bg-[#021024] text-white">
      <header className="border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-5">
          <button onClick={() => navigate("/reviewer/projects")} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white">
            <ArrowLeft size={17} /> Back to Projects
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#5483B3]/20 p-3 text-[#7DA0CA]">
              <Users size={25} />
            </div>
            <div>
              <p className="text-sm text-[#7DA0CA]">Group Project</p>
              <h1 className="text-3xl font-bold">{project.project_name || project.projectName || "Untitled Group Project"}</h1>
            </div>
          </div>
          <div className="mt-4">
            <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs text-amber-300">
              Pending Review
            </span>
          </div>
        </div>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Project Description</h2>
          <p className="text-gray-300 leading-7 whitespace-pre-wrap">{project.description || "No description provided."}</p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 mb-6">
          <h2 className="text-lg font-semibold mb-5">Project Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InfoItem label="Branch" value={project.branch} />
            <InfoItem label="Year" value={project.year} />
            <InfoItem label="Technologies" value={project.technologies} />
            <InfoItem label="Team Lead" value={project.teamLeadName || project.teamLead?.name} />
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 mb-6">
          <h2 className="text-lg font-semibold mb-5">Project Links</h2>
          <div className="flex flex-wrap gap-4">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-sm hover:bg-white/10">
                <GitBranch size={18} /> GitHub <ExternalLink size={14} />
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-sm hover:bg-white/10">
                <ExternalLink size={18} /> Live Project
              </a>
            )}
          </div>
        </section>

        {showRejectBox && (
          <section className="rounded-2xl border border-red-400/20 bg-red-400/[0.03] p-6 mb-6">
            <h2 className="text-lg font-semibold">Rejection Feedback</h2>
            <p className="text-sm text-gray-400 mt-1 mb-4">This feedback will be sent to the team lead by email.</p>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              maxLength={1000}
              rows={6}
              placeholder="Explain what the team should improve..."
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none resize-none focus:border-red-400/50"
            />
            <div className="text-right text-xs text-gray-500 mt-2">{feedback.length}/1000</div>
          </section>
        )}

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-lg font-semibold mb-2">Review Decision</h2>
          <p className="text-sm text-gray-400 mb-6">This decision determines whether the group project becomes visible on KL Innovation Hub.</p>

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
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-red-400/30 bg-red-400/10 px-5 py-3 font-medium text-red-300 hover:bg-red-400/20"
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

const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-xs uppercase tracking-wider text-gray-500">{label}</p>
    <p className="mt-1 text-sm text-gray-200">{value || "Not provided"}</p>
  </div>
);

export default ReviewerGroupProjectDetails;