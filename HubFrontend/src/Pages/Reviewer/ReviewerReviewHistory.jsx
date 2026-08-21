import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, XCircle, Clock3, FileText, Users, Loader2, Mail, Building2, BriefcaseBusiness } from "lucide-react";
import toast from "react-hot-toast";
import reviewerAxiosInstance from "../../Api/reviewerAxiosInstance";
import ReviewerNavbar from "./ReviewerNavbar";

const ReviewerReviewHistory = () => {
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const reviewer = JSON.parse(localStorage.getItem("reviewer") || "null");

  useEffect(() => {
    loadReviewHistory();
  }, []);

  const loadReviewHistory = async () => {
    try {
      setLoading(true);
      const response = await reviewerAxiosInstance.get("/reviewer/review/history");
      setReviews(response.data || []);
    } catch (error) {
      console.error("Error loading review history:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("reviewerToken");
        localStorage.removeItem("reviewer");
        window.location.href = "/login";
        return;
      }
      toast.error("Unable to load review history");
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = useMemo(() => {
    if (filter === "ALL") return reviews;
    return reviews.filter((review) => review.decision === filter);
  }, [reviews, filter]);

  const approvedCount = reviews.filter((review) => review.decision === "APPROVED").length;
  const rejectedCount = reviews.filter((review) => review.decision === "REJECTED").length;

  return (
    <div className="min-h-screen bg-[#021024] text-white">
      <ReviewerNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* PROFILE HEADER */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.03] overflow-hidden mb-10">
          <div className="h-32 sm:h-40 bg-linear-to-r from-[#021024] via-[#17365f] to-[#5483B3]" />
          <div className="px-5 sm:px-8 pb-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 -mt-12">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
                <div className="h-24 w-24 rounded-2xl border border-white/20 bg-[#021024] flex items-center justify-center shadow-2xl">
                  <span className="text-3xl font-bold text-[#7DA0CA]">
                    {(reviewer?.name || "R").charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-[#7DA0CA] uppercase tracking-[3px]">Reviewer Profile</p>
                  <h1 className="text-2xl sm:text-3xl font-bold mt-1">{reviewer?.name || "Reviewer"}</h1>
                  <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3 text-sm text-gray-400">
                    {reviewer?.email && (
                      <span className="flex items-center gap-2"><Mail size={15} /> {reviewer.email}</span>
                    )}
                    {reviewer?.department && (
                      <span className="flex items-center gap-2"><Building2 size={15} /> {reviewer.department}</span>
                    )}
                    {reviewer?.designation && (
                      <span className="flex items-center gap-2"><BriefcaseBusiness size={15} /> {reviewer.designation}</span>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* REVIEW ACTIVITY HEADER */}
        <div className="mb-7">
          <p className="text-sm text-[#7DA0CA]">Reviewer Activity</p>
          <h2 className="text-2xl sm:text-3xl font-bold mt-1">My Review History</h2>
          <p className="text-gray-400 mt-2">View your previous project decisions and feedback.</p>
        </div>

        {/* STATISTICS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <StatCard icon={<Clock3 size={26} />} label="Total Reviews" value={reviews.length} />
          <StatCard icon={<CheckCircle2 size={26} />} label="Approved" value={approvedCount} />
          <StatCard icon={<XCircle size={26} />} label="Rejected" value={rejectedCount} />
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-3 mb-8">
          <FilterButton active={filter === "ALL"} onClick={() => setFilter("ALL")}>All Reviews</FilterButton>
          <FilterButton active={filter === "APPROVED"} onClick={() => setFilter("APPROVED")}>Approved</FilterButton>
          <FilterButton active={filter === "REJECTED"} onClick={() => setFilter("REJECTED")}>Rejected</FilterButton>
        </div>

        {/* REVIEW HISTORY */}
        {loading ? (
          <LoadingState />
        ) : filteredReviews.length === 0 ? (
          <EmptyState filter={filter} />
        ) : (
          <div className="space-y-5">
            {filteredReviews.map((review) => (
              <ReviewCard key={review.reviewId} review={review} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
    <div className="text-[#7DA0CA]">{icon}</div>
    <p className="text-gray-400 mt-5">{label}</p>
    <p className="text-4xl font-bold mt-2">{value}</p>
  </div>
);

const FilterButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg transition ${active ? "bg-white text-black" : "border border-white/10 text-gray-300 hover:bg-white/10"}`}
  >
    {children}
  </button>
);

const ReviewCard = ({ review }) => {
  const isGroup = review.type === "GROUP";
  const isApproved = review.decision === "APPROVED";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
        <div className="flex gap-4">
          <div className="rounded-xl bg-[#5483B3]/20 p-3 text-[#7DA0CA] shrink-0 h-fit">
            {isGroup ? <Users size={24} /> : <FileText size={24} />}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs text-[#7DA0CA] uppercase tracking-wider">
                {isGroup ? "Group Project" : "Solo Project"}
              </p>
              <span className={`rounded-full px-3 py-1 text-xs ${isApproved ? "border border-green-400/30 bg-green-400/10 text-green-300" : "border border-red-400/30 bg-red-400/10 text-red-300"}`}>
                {isApproved ? "Approved" : "Rejected"}
              </span>
            </div>
            <h3 className="text-xl font-semibold mt-2">{review.projectName || "Untitled Project"}</h3>
          </div>
        </div>

        <div className="text-sm text-gray-500 lg:text-right">
          <p>Reviewed At</p>
          <p className="text-gray-300 mt-1">{formatDate(review.reviewedAt)}</p>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-white/10 bg-black/10 p-4">
        <p className="text-xs uppercase tracking-wider text-gray-500">Feedback</p>
        <p className="mt-2 text-sm text-gray-300 leading-6 whitespace-pre-wrap">
          {review.feedback?.trim() ? review.feedback : "No feedback was provided."}
        </p>
      </div>
    </div>
  );
};

const LoadingState = () => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 flex items-center justify-center text-gray-400">
    <div className="flex items-center gap-3">
      <Loader2 size={20} className="animate-spin" /> Loading review history...
    </div>
  </div>
);

const EmptyState = ({ filter }) => {
  const message = filter === "APPROVED"
    ? "You have not approved any projects yet."
    : filter === "REJECTED"
      ? "You have not rejected any projects yet."
      : "You have not reviewed any projects yet.";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">
      <Clock3 size={42} className="mx-auto text-gray-500 mb-4" />
      <h3 className="font-semibold">No review history</h3>
      <p className="text-sm text-gray-500 mt-2">{message}</p>
    </div>
  );
};

const formatDate = (value) => {
  if (!value) return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
};

export default ReviewerReviewHistory;