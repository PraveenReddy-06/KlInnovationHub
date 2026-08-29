import { useEffect, useRef, useState } from "react";
import { Heart, MoreVertical, Pencil, Trash2, Flag } from "lucide-react";
import toast from "react-hot-toast";
import {
  deleteReply,
  reportReply,
  toggleReplyLike,
  updateReply,
} from "../../Api/discussionApi";

const roleLabel = (role) =>
  role === "ROLE_REVIEWER" ? "FACULTY" : "STUDENT";

const DiscussionReply = ({ reply, onUpdated, onDeleted }) => {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(reply.content);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [liked, setLiked] = useState(reply.likedByCurrentUser);
  const [likeCount, setLikeCount] = useState(reply.likeCount);

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

  const saveEdit = async () => {
    if (!content.trim()) return;
    try {
      setSubmitting(true);
      const response = await updateReply(reply.replyId, content.trim());
      onUpdated(response.data);
      setEditing(false);
    } catch {
      toast.error("Unable to update reply.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this reply?")) return;
    try {
      await deleteReply(reply.replyId);
      onDeleted(reply.replyId);
    } catch {
      toast.error("Unable to delete reply.");
    }
  };

  const handleLike = async () => {
    if (!localStorage.getItem("token") && !localStorage.getItem("reviewerToken")) {
      toast.error("Please login to like replies.");
      return;
    }
    try {
      const response = await toggleReplyLike(reply.replyId);
      setLikeCount(response.data);
      setLiked((value) => !value);
    } catch {
      toast.error("Unable to update like.");
    }
  };

  const handleReport = async () => {
    const reason = window.prompt("Why are you reporting this reply?");
    if (!reason?.trim()) return;
    try {
      await reportReply(reply.replyId, reason.trim());
      toast.success("Reply reported.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to report reply.");
    }
  };

  return (
    <div className="ml-8 mt-3 border-l border-slate-200 pl-4">
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-800">{reply.authorName}</span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
              {roleLabel(reply.authorRole)}
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
              <button onClick={() => setEditing(false)} className="text-xs text-slate-500">
                Cancel
              </button>
            </div>
          ) : (
            <p className="mt-1 whitespace-pre-wrap wrap-break-word text-sm text-slate-700">{reply.content}</p>
          )}

          <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
            <button onClick={handleLike} className="flex items-center gap-1">
              <Heart size={14} fill={liked ? "currentColor" : "none"} className={liked ? "text-red-500" : ""} />
              {likeCount}
            </button>
            <span>{new Date(reply.createdAt).toLocaleString()}</span>
            <button onClick={handleReport}>Report</button>
          </div>
        </div>

        <div  ref={menuRef} className="relative">
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
              {reply.editableByCurrentUser && (
                <button onClick={() => { setEditing(true); setMenuOpen(false); }} className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs hover:bg-slate-100">
                  <Pencil size={13} /> Edit
                </button>
              )}
              {reply.editableByCurrentUser && (
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
    </div>
  );
};

export default DiscussionReply;
