import { useEffect, useRef, useState } from "react";
import { Heart, MessageCircle, MoreVertical, Pencil, Trash2, Flag } from "lucide-react";
import toast from "react-hot-toast";
import {
  createReply,
  deleteDiscussion,
  getReplies,
  reportDiscussion,
  toggleDiscussionLike,
  updateDiscussion,
} from "../../Api/discussionApi";
import DiscussionReply from "./DiscussionReply";

const roleLabel = (role) =>
  role === "ROLE_REVIEWER" ? "FACULTY" : "STUDENT";

const DiscussionItem = ({ discussion, onUpdated, onDeleted }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(discussion.content);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [liked, setLiked] = useState(discussion.likedByCurrentUser);
  const [likeCount, setLikeCount] = useState(discussion.likeCount);

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (!menuRef.current?.contains(event.target)) {
      setMenuOpen(false);
    }
  };
  document.addEventListener("click", handleClickOutside);
  return () => {
    document.removeEventListener("click", handleClickOutside);
  };
}, []);

  const loadReplies = async () => {
    try {
      setLoadingReplies(true);
      const response = await getReplies(discussion.discussionId);
      setReplies(response.data.content || []);
    } catch {
      toast.error("Unable to load replies.");
    } finally {
      setLoadingReplies(false);
    }
  };

  useEffect(() => {
    if (showReplies) loadReplies();
  }, [showReplies]);

  const submitReply = async () => {
    if (!replyText.trim()) return;
    if (!localStorage.getItem("token") && !localStorage.getItem("reviewerToken")) {
      toast.error("Please login to reply.");
      return;
    }
    try {
      setSubmitting(true);
      const response = await createReply(discussion.discussionId, replyText.trim());
      setReplies((current) => [...current, response.data]);
      setReplyText("");
      setShowReplies(true);
      onUpdated({ ...discussion, replyCount: discussion.replyCount + 1 });
    } catch {
      toast.error("Unable to post reply.");
    } finally {
      setSubmitting(false);
    }
  };

  const saveEdit = async () => {
    if (!content.trim()) return;
    try {
      setSubmitting(true);
      const response = await updateDiscussion(discussion.discussionId, content.trim());
      onUpdated(response.data);
      setEditing(false);
    } catch {
      toast.error("Unable to update discussion.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this discussion and its replies?")) return;
    try {
      await deleteDiscussion(discussion.discussionId);
      onDeleted(discussion.discussionId);
    } catch {
      toast.error("Unable to delete discussion.");
    }
  };

  const handleLike = async () => {
    if (!localStorage.getItem("token") && !localStorage.getItem("reviewerToken")) {
      toast.error("Please login to like discussions.");
      return;
    }
    try {
      const response = await toggleDiscussionLike(discussion.discussionId);
      setLikeCount(response.data);
      setLiked((value) => !value);
    } catch {
      toast.error("Unable to update like.");
    }
  };

  const handleReport = async () => {
    const reason = window.prompt("Why are you reporting this discussion?");
    if (!reason?.trim()) return;
    try {
      await reportDiscussion(discussion.discussionId, reason.trim());
      toast.success("Discussion reported.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to report discussion.");
    }
  };

  const updateReplyInList = (updated) => {
    setReplies((current) => current.map((reply) => reply.replyId === updated.replyId ? updated : reply));
  };

  const removeReplyFromList = (replyId) => {
    setReplies((current) => current.filter((reply) => reply.replyId !== replyId));
    onUpdated({ ...discussion, replyCount: Math.max(0, discussion.replyCount - 1) });
  };

  return (
    <article className="border-b border-slate-200 py-4 last:border-b-0">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-slate-900">{discussion.authorName}</span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
              {roleLabel(discussion.authorRole)}
            </span>
          </div>

          {editing ? (
            <div className="mt-2 flex gap-2">
              <input
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={300}
                className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
              <button disabled={submitting} onClick={saveEdit} className="rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white">
                Save
              </button>
              <button onClick={() => setEditing(false)} className="text-xs text-slate-500">Cancel</button>
            </div>
          ) : (
            <p className="mt-1 whitespace-pre-wrap wrap-break-word text-sm leading-6 text-slate-700">{discussion.content}</p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <button onClick={handleLike} className="flex items-center gap-1">
              <Heart size={15} fill={liked ? "currentColor" : "none"} className={liked ? "text-red-500" : ""} />
              {likeCount}
            </button>
            <button onClick={() => setShowReplies((value) => !value)} className="flex items-center gap-1">
              <MessageCircle size={15} /> {discussion.replyCount} {discussion.replyCount === 1 ? "Reply" : "Replies"}
            </button>
            <span>{new Date(discussion.createdAt).toLocaleString()}</span>
            <button onClick={handleReport}>Report</button>
          </div>

          {showReplies && (
            <div className="mt-3">
              <div className="flex gap-2">
                <input
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") submitReply(); }}
                  maxLength={300}
                  placeholder="Reply..."
                  className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
                <button disabled={submitting || !replyText.trim()} onClick={submitReply} className="rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white disabled:opacity-50">
                  Reply
                </button>
              </div>

              {loadingReplies ? (
                <p className="mt-3 text-xs text-slate-500">Loading replies...</p>
              ) : replies.length > 0 ? (
                replies.map((reply) => (
                  <DiscussionReply key={reply.replyId} reply={reply} onUpdated={updateReplyInList} onDeleted={removeReplyFromList} />
                ))
              ) : (
                <p className="mt-3 text-xs text-slate-500">No replies yet.</p>
              )}
            </div>
          )}
        </div>

        <div ref={menuRef} className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((value) => !value);
            }}
            className="p-1 text-slate-400"
          >
            <MoreVertical size={16} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 z-20 mt-1 w-32 rounded-lg border bg-white p-1 shadow-lg">
              {discussion.editableByCurrentUser && (
                <button onClick={() => { setEditing(true); setMenuOpen(false); }} className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs hover:bg-slate-100">
                  <Pencil size={13} /> Edit
                </button>
              )}
              {discussion.editableByCurrentUser && (
                <button onClick={() => { setMenuOpen(false); handleDelete(); }} className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-red-600 hover:bg-red-50">
                  <Trash2 size={13} /> Delete
                </button>
              )}
              <button onClick={() => { setMenuOpen(false); handleReport(); }} className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs hover:bg-slate-100">
                <Flag size={13} /> Report
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default DiscussionItem;
