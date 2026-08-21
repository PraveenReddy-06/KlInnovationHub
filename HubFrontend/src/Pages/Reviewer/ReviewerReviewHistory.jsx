import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, XCircle, Clock3, FileText, Users, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import reviewerAxiosInstance from "../../Api/reviewerAxiosInstance";
import ReviewerNavbar from "./ReviewerNavbar";

const ReviewerReviewHistory = () => {

  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviewHistory();
  }, []);

  const loadReviewHistory = async () => {
    try {
      setLoading(true);

      const response = await reviewerAxiosInstance.get(
        "/reviewer/review/history"
      );

      setReviews(response.data || []);

    } catch (error) {

      console.error("Error loading review history:", error);

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
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

    if (filter === "ALL") {
      return reviews;
    }

    return reviews.filter(
      (review) => review.decision === filter
    );

  }, [reviews, filter]);

  const approvedCount = reviews.filter(
    (review) => review.decision === "APPROVED"
  ).length;

  const rejectedCount = reviews.filter(
    (review) => review.decision === "REJECTED"
  ).length;

  return (
    <div className="min-h-screen bg-[#021024] text-white">

      <ReviewerNavbar />

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}

        <div className="mb-8">

          <p className="text-sm text-[#7DA0CA]">
            Reviewer Center
          </p>

          <h1 className="text-3xl font-bold mt-1">
            Review History
          </h1>

          <p className="text-gray-400 mt-2">
            View the projects you have previously reviewed.
          </p>

        </div>

        {/* Statistics */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

          <StatCard
            icon={<Clock3 size={26} />}
            label="Total Reviews"
            value={reviews.length}
          />

          <StatCard
            icon={<CheckCircle2 size={26} />}
            label="Approved"
            value={approvedCount}
          />

          <StatCard
            icon={<XCircle size={26} />}
            label="Rejected"
            value={rejectedCount}
          />

        </div>

        {/* Filters */}

        <div className="flex flex-wrap gap-3 mb-8">

          <FilterButton
            active={filter === "ALL"}
            onClick={() => setFilter("ALL")}
          >
            All Reviews
          </FilterButton>

          <FilterButton
            active={filter === "APPROVED"}
            onClick={() => setFilter("APPROVED")}
          >
            Approved
          </FilterButton>

          <FilterButton
            active={filter === "REJECTED"}
            onClick={() => setFilter("REJECTED")}
          >
            Rejected
          </FilterButton>

        </div>

        {/* Content */}

        {loading ? (

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 flex items-center justify-center text-gray-400">

            <div className="flex items-center gap-3">

              <Loader2
                size={20}
                className="animate-spin"
              />

              Loading review history...

            </div>

          </div>

        ) : filteredReviews.length === 0 ? (

          <EmptyState filter={filter} />

        ) : (

          <div className="space-y-4">

            {filteredReviews.map((review) => (

              <ReviewCard
                key={review.reviewId}
                review={review}
              />

            ))}

          </div>

        )}

      </main>

    </div>
  );
};


const StatCard = ({ icon, label, value }) => {

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

      <div className="text-[#7DA0CA]">
        {icon}
      </div>

      <p className="text-gray-400 mt-5">
        {label}
      </p>

      <p className="text-4xl font-bold mt-2">
        {value}
      </p>

    </div>
  );
};


const FilterButton = ({ active, onClick, children }) => {

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg transition ${
        active
          ? "bg-white text-black"
          : "border border-white/10 text-gray-300 hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
};


const ReviewCard = ({ review }) => {

  const isGroup = review.type === "GROUP";
  const isApproved = review.decision === "APPROVED";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

        {/* Project information */}

        <div className="flex gap-4">

          <div className="rounded-xl bg-[#5483B3]/20 p-3 text-[#7DA0CA] shrink-0">

            {isGroup ? (
              <Users size={24} />
            ) : (
              <FileText size={24} />
            )}

          </div>

          <div>

            <div className="flex flex-wrap items-center gap-2">

              <p className="text-xs uppercase tracking-wider text-[#7DA0CA]">
                {isGroup ? "Group Project" : "Solo Project"}
              </p>

              <span
                className={`rounded-full px-3 py-1 text-xs ${
                  isApproved
                    ? "border border-green-400/30 bg-green-400/10 text-green-300"
                    : "border border-red-400/30 bg-red-400/10 text-red-300"
                }`}
              >
                {isApproved ? "Approved" : "Rejected"}
              </span>

            </div>

            <h2 className="text-xl font-semibold mt-2">
              {review.projectName || "Untitled Project"}
            </h2>

          </div>

        </div>

        {/* Date */}

        <div className="text-sm text-gray-500 lg:text-right">

          <p>
            Reviewed At
          </p>

          <p className="text-gray-300 mt-1">
            {formatDate(review.reviewedAt)}
          </p>

        </div>

      </div>

      {/* Feedback */}

      <div className="mt-5 rounded-xl border border-white/10 bg-black/10 p-4">

        <p className="text-xs uppercase tracking-wider text-gray-500">
          Feedback
        </p>

        <p className="mt-2 text-sm text-gray-300 leading-6 whitespace-pre-wrap">
          {review.feedback?.trim()
            ? review.feedback
            : "No feedback was provided."}
        </p>

      </div>

    </div>
  );
};


const EmptyState = ({ filter }) => {

  const message =
    filter === "APPROVED"
      ? "You have not approved any projects yet."
      : filter === "REJECTED"
        ? "You have not rejected any projects yet."
        : "You have not reviewed any projects yet.";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">

      <Clock3
        size={42}
        className="mx-auto text-gray-500 mb-4"
      />

      <h3 className="font-semibold">
        No review history
      </h3>

      <p className="text-sm text-gray-500 mt-2">
        {message}
      </p>

    </div>
  );
};


const formatDate = (value) => {

  if (!value) {
    return "Unknown";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};


export default ReviewerReviewHistory;