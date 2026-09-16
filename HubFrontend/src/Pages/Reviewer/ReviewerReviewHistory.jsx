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
    <div className="min-h-screen bg-primary text-primary">
      <ReviewerNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">

    <div
      className="relative h-52 sm:h-64 lg:h-72 rounded-2xl lg:rounded-[35px] overflow-hidden shadow-2xl bg-cover bg-center"
      style={{ backgroundImage: "url('/KlProfile.png')" }}
    >
      <div className="absolute inset-0 bg-black/20" />

      <div className="absolute bottom-6 left-6 sm:left-8 lg:left-10 text-white">
        <p className="uppercase tracking-[4px] text-xs sm:text-sm opacity-80">
          KL Innovation Hub
        </p>
      </div>
    </div>

    <div className="relative -mt-16 sm:-mt-20 z-20">
      <div className="backdrop-blur-2xl bg-white/10 rounded-2xl lg:rounded-[30px] p-5 sm:p-7 lg:p-8 shadow-[0_20px_80px_rgba(0,0,0,.35)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className=" text-white">
            <p className="text-xs sm:text-sm uppercase tracking-[4px] text-slate-300">
              Faculty Reviewer
            </p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-2">
              {reviewer?.name || "Reviewer"}
            </h1>
            <div className="mb-5 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-5 mt-3 text-sm text-slate-300">
              {reviewer?.email && (
                <span className="flex items-center gap-2">
                  <Mail size={15} />
                  {reviewer.email}
                </span>
              )}

              {reviewer?.department && (
                <span className="flex items-center gap-2">
                  <Building2 size={15} />
                  {reviewer.department}
                </span>
              )}

              {reviewer?.designation && (
                <span className="flex items-center gap-2">
                  <BriefcaseBusiness size={15} />
                  {reviewer.designation}
                </span>
              )}

            </div>
              {reviewer?.choice1 && (
                <span className="bg-cyan-500/20 text-cyan-300 px-4 py-2 rounded-full">
                  {reviewer.choice1}
                </span>
              )}

              {reviewer?.choice2 && (
                <span className="bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full">
                  {reviewer.choice2}
                </span>
              )}

              {reviewer?.choice3 && (
                <span className="bg-white/10 text-white px-4 py-2 rounded-full">
                  {reviewer.choice3}
                </span>
              )}
          </div>
        </div>
      </div>
    </div>

        {/* REVIEW ACTIVITY HEADER */}
        <div className="mt-10 sm:mb-7 text-gray-300">
          <p className="text-md text-gray-200">Reviewer Activity</p>
          <h2 className="text-xl sm:text-3xl font-bold mt-1">My Review History</h2>
          <p className="text-sm sm:text-base text-gray-500 mt-2">View your previous project decisions and feedback.</p>
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
  <div className="rounded-2xl border border-gray-800 bg-cyan-400 p-4 sm:p-6">
    <div className="text-gray-500">{icon}</div>
    <p className="text-black mt-3 sm:mt-5">{label}</p>
    <p className="text-2xl sm:text-4xl text-black font-bold mt-1 sm:mt-2">{value}</p>
  </div>
);

const FilterButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base cursor-pointer rounded-lg transition ${active ? "bg-blue-400 text-black border border-black" : "bg-accent border border-black text-black hover:cream"}`}
  >
    {children}
  </button>
);

const ReviewCard = ({ review }) => {
  const isGroup = review.type === "GROUP";
  const isApproved = review.decision === "APPROVED";

  return (
    <div className="rounded-2xl border border-white bg-cream p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 sm:gap-5">
        <div className="flex gap-3 sm:gap-4 min-w-0">
          <div className="rounded-xl bg-accent p-2.5 sm:p-3 text-gray-800 shrink-0 h-fit">
            {isGroup ? <Users size={22} /> : <FileText size={22} />}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[11px] sm:text-xs text-gray-800 uppercase tracking-wider">
                {isGroup ? "Group Project" : "Solo Project"}
              </p>
              <span className={`rounded-full px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs ${isApproved ? "border border-black bg-green-400 text-black" : "border border-red-400 bg-red-500 text-white"}`}>
                {isApproved ? "Approved" : "Rejected"}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl text-black font-semibold mt-2 wrap-break-word">
              {review.projectName || "Untitled Project"}
            </h3>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-gray-800 lg:text-right pl-0 lg:pl-4">
          <p>Reviewed At</p>
          <p className="text-gray-800 mt-1">{formatDate(review.reviewedAt)}</p>
        </div>
      </div>

      <div className="mt-4 sm:mt-5 rounded-xl border border-white/10 bg-black/10 p-3 sm:p-4">
        <p className="text-xs uppercase tracking-wider text-gray-700">Feedback</p>
        <p className="mt-2 text-sm text-black leading-6 whitespace-pre-wrap wrap-break-word">
          {review.feedback?.trim() ? review.feedback : "No feedback was provided."}
        </p>
      </div>
    </div>
  );
};

const LoadingState = () => (
  <div className="rounded-2xl border border-white/10 bg-cream p-6 sm:p-10 flex items-center justify-center text-gray-900">
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
    <div className="rounded-2xl border border-white/10 bg-white/3 p-8 sm:p-12 text-center">
      <Clock3 size={42} className="mx-auto text-gray-900 mb-4" />
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