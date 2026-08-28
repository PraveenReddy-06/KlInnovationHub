import { useEffect, useMemo, useState } from "react";
import { X, MessageCircle, Send } from "lucide-react";
import toast from "react-hot-toast";
import {
  createDiscussion,
  getDiscussions,
} from "../../Api/discussionApi";
import DiscussionItem from "./DiscussionItem";

const ProjectDiscussion = ({ project, isOpen, onClose }) => {
  const [discussions, setDiscussions] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const projectType = project?.type === "GROUP" ? "GROUP" : "INDIVIDUAL";
  const projectId = projectType === "GROUP" ? project?.groupProjectId : project?.projectId;
  const title = project?.title || project?.projectName || project?.project_name || "Project";
  const owner = project?.ownerName || project?.student?.student_name || project?.teamLead?.student_name || "Project team";
  const description = project?.description || "";

  const isAuthenticated = useMemo(
    () => !!localStorage.getItem("token") || !!localStorage.getItem("reviewerToken"),
    []
  );

  const loadDiscussions = async (requestedPage = 0, append = false) => {
    if (!projectId) return;
    try {
      setLoading(true);
      const response = await getDiscussions(projectType, projectId, requestedPage, 10);
      setDiscussions((current) => append ? [...current, ...(response.data.content || [])] : (response.data.content || []));
      setPage(requestedPage);
      setHasMore(!response.data.last);
    } catch {
      toast.error("Unable to load discussions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setContent("");
      loadDiscussions(0, false);
    }
  }, [isOpen, projectId, projectType]);

  if (!isOpen) return null;

  const requireLogin = () => {
    if (isAuthenticated) return true;
    toast.error("Please login to start a discussion.");
    return false;
  };

  const handleSubmit = async () => {
    if (!content.trim() || !requireLogin()) return;
    try {
      setSubmitting(true);
      const response = await createDiscussion(projectType, projectId, content.trim());
      setDiscussions((current) => [response.data, ...current]);
      setContent("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to start discussion.");
    } finally {
      setSubmitting(false);
    }
  };

  const updateDiscussion = (updated) => {
    setDiscussions((current) => current.map((item) => item.discussionId === updated.discussionId ? updated : item));
  };

  const removeDiscussion = (discussionId) => {
    setDiscussions((current) => current.filter((item) => item.discussionId !== discussionId));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-stretch justify-end bg-black/40" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <aside className="flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">
        <div className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Project discussion</p>
              <h2 className="mt-1 truncate text-lg font-bold text-slate-900">{title}</h2>
              <p className="text-xs text-slate-500">{owner}</p>
            </div>
            <button onClick={onClose} className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
              <X size={20} />
            </button>
          </div>
          {description && <p className="mt-3 line-clamp-2 text-sm leading-5 text-slate-600">{description}</p>}
        </div>

        <div className="border-b border-slate-200 px-4 py-3 sm:px-6">
          <div className="flex items-end gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={2000}
              rows={2}
              placeholder="Start a discussion..."
              className="min-w-0 flex-1 resize-none bg-transparent px-2 py-1 text-sm outline-none"
            />
            <button
              disabled={submitting || !content.trim()}
              onClick={handleSubmit}
              className="rounded-lg bg-blue-600 p-2 text-white disabled:cursor-not-allowed disabled:opacity-40"
              title="Post discussion"
            >
              <Send size={17} />
            </button>
          </div>
          <div className="mt-1 text-right text-[10px] text-slate-400">{content.length}/2000</div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 py-4 text-sm font-semibold text-slate-800">
            <MessageCircle size={17} /> Discussions
            <span className="font-normal text-slate-400">{project?.discussionCount ?? discussions.length}</span>
          </div>

          {loading && discussions.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-500">Loading discussions...</p>
          ) : discussions.length === 0 ? (
            <div className="py-12 text-center">
              <MessageCircle className="mx-auto text-slate-300" size={34} />
              <p className="mt-3 text-sm font-medium text-slate-600">No discussions yet.</p>
              <p className="mt-1 text-xs text-slate-400">Start the first conversation about this project.</p>
            </div>
          ) : (
            <>
              {discussions.map((discussion) => (
                <DiscussionItem key={discussion.discussionId} discussion={discussion} onUpdated={updateDiscussion} onDeleted={removeDiscussion} />
              ))}
              {hasMore && (
                <button
                  disabled={loading}
                  onClick={() => loadDiscussions(page + 1, true)}
                  className="my-5 w-full rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Load more"}
                </button>
              )}
            </>
          )}
        </div>
      </aside>
    </div>
  );
};

export default ProjectDiscussion;
