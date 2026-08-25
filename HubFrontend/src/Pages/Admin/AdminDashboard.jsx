import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Users,
  Clock3,
  RefreshCw,
  Search,
  Inbox,
  Loader2,
  Mail,
  Building2,
  BriefcaseBusiness,
  CalendarDays,
  UserRound,
  MessageSquareText,
  CheckCircle2,
  XCircle,
  LogOut,
} from "lucide-react";
import toast from "react-hot-toast";
import adminAxiosInstance from "../../Api/adminAxiosInstance";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const admin = JSON.parse(localStorage.getItem("admin") || "null");

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await adminAxiosInstance.get("/admin/reviewers/requests");
      setRequests(response.data || []);
    } catch (error) {
      console.error("Failed to load reviewer requests:", error);
      toast.error(error.response?.data || "Unable to load reviewer applications");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleApprove = async (request) => {
    const applicantName = request?.user?.name || "this applicant";

    if (!window.confirm(`Approve ${applicantName} as a project reviewer?`)) {
      return;
    }

    try {
      setActionLoading(request.requestId);
      const response = await adminAxiosInstance.post(`/admin/reviewers/requests/${request.requestId}/approve`);
      toast.success(response.data || "Reviewer approved successfully");

      setRequests((previous) => previous.filter((item) => item.requestId !== request.requestId));
    } catch (error) {
      console.error("Failed to approve reviewer:", error);
      toast.error(error.response?.data || "Unable to approve reviewer");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (request) => {
    const applicantName = request?.user?.name || "this applicant";

    if (!window.confirm(`Reject ${applicantName}'s reviewer application?`)) {
      return;
    }

    try {
      setActionLoading(request.requestId);
      const response = await adminAxiosInstance.post(`/admin/reviewers/requests/${request.requestId}/reject`);
      toast.success(response.data || "Reviewer request rejected");

      setRequests((previous) => previous.filter((item) => item.requestId !== request.requestId));
    } catch (error) {
      console.error("Failed to reject reviewer:", error);
      toast.error(error.response?.data || "Unable to reject reviewer");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredRequests = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return requests;

    return requests.filter((request) => {
      const user = request?.user;
      return (
        user?.name?.toLowerCase().includes(value) ||
        user?.mail?.toLowerCase().includes(value) ||
        request?.department?.toLowerCase().includes(value) ||
        request?.designation?.toLowerCase().includes(value)
      );
    });
  }, [requests, search]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-600 text-white">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-primary/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-tan text-white flex items-center justify-center">
                <ShieldCheck size={21} />
              </div>
              <div>
                <p className="text-white font-bold leading-none">KL Innovation Hub</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-sky">Administration</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-white">{admin?.name || "Administrator"}</p>
                <p className="text-xs text-sky">Administrator</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                title="Logout"
                className="w-9 h-9 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 flex items-center justify-center transition"
              >
                <LogOut size={17} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-10">
        {/* HEADER */}
        <section className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-white font-semibold">Administration</p>
              <h1 className="mt-2 text-3xl sm:text-4xl font-black text-gray-300">Reviewer Applications</h1>
              <p className="mt-2 text-black max-w-2xl">Review and manage faculty applications for Project Reviewer access.</p>
            </div>

            <button
              type="button"
              onClick={() => loadRequests(true)}
              disabled={refreshing}
              className="text-black self-start lg:self-auto flex items-center gap-2 rounded-xl border border-black/20 bg-white/70 px-4 py-2.5 text-sm font-semibold hover:bg-white transition disabled:opacity-50"
            >
              <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </section>

        {/* STATS */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard icon={<Clock3 size={21} />} label="Pending Applications" value={requests.length} />
          <StatCard icon={<Users size={21} />} label="Showing" value={filteredRequests.length} />
          <StatCard icon={<ShieldCheck size={21} />} label="Admin Status" value="Active" />
        </section>

        {/* SEARCH */}
        <section className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Pending Requests</h2>
              <p className="text-sm text-gray-700 mt-1">Applications waiting for your review.</p>
            </div>

            <div className="relative w-full sm:w-80">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search applicants..."
                className="w-full rounded-xl border border-black/20 bg-white/70 pl-10 pr-4 py-3 text-sm text-black outline-none focus:bg-white"
              />
            </div>
          </div>
        </section>

        {/* CONTENT */}
        {loading ? (
          <LoadingState />
        ) : filteredRequests.length === 0 ? (
          <EmptyState searched={Boolean(search.trim())} />
        ) : (
          <div className="space-y-5">
            {filteredRequests.map((request) => (
              <ReviewerRequest
                key={request.requestId}
                request={request}
                loading={actionLoading === request.requestId}
                onApprove={() => handleApprove(request)}
                onReject={() => handleReject(request)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="rounded-2xl bg-primary p-5 shadow-lg border border-white/10">
    <div className="w-10 h-10 rounded-xl bg-tan text-primary flex items-center justify-center">{icon}</div>
    <p className="mt-4 text-sm text-light-blue">{label}</p>
    <p className="mt-1 text-2xl sm:text-3xl font-black text-white">{value}</p>
  </div>
);

const ReviewerRequest = ({ request, loading, onApprove, onReject }) => {
  const user = request?.user;

  const formatDate = (value) => {
    if (!value) return "Unknown";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
  };

  return (
    <article className="rounded-2xl border border-black/10 bg-cream overflow-hidden shadow-sm">
      {/* REQUEST HEADER */}
      <div className="p-5 sm:p-6 border-b border-black/10">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
          <div className="flex gap-4 min-w-0">
            <div className="w-12 h-12 shrink-0 rounded-xl bg-primary text-tan flex items-center justify-center">
              <UserRound size={22} />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-bold text-primary">{user?.name || "Unknown Applicant"}</h3>
                <span className="rounded-full bg-amber-100 border border-amber-300 px-2.5 py-1 text-xs font-semibold text-amber-800">
                  Pending
                </span>
              </div>

              <div className="mt-2 flex items-center gap-2 text-sm text-gray-700 break-all">
                <Mail size={15} />
                {user?.mail || "Email unavailable"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-600 shrink-0">
            <CalendarDays size={15} />
            {formatDate(request?.createdAt)}
          </div>
        </div>
      </div>

      {/* DETAILS */}
      <div className="p-5 sm:p-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <InfoItem icon={<Building2 size={17} />} label="Department" value={request?.department} />
          <InfoItem icon={<BriefcaseBusiness size={17} />} label="Designation" value={request?.designation} />
        </div>

        {/* REASON */}
        <div className="mt-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <MessageSquareText size={17} />
            Application Reason
          </div>
          <div className="mt-3 rounded-xl border border-black/10 bg-white/60 p-4">
            <p className="text-sm text-gray-700 leading-6 whitespace-pre-wrap">
              {request?.reason?.trim() ? request.reason : "No reason provided."}
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={onApprove}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-green-500 text-black py-3 font-semibold hover:bg-green-400 transition disabled:opacity-50"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
            Approve Reviewer
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onReject}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-red-400/40 bg-red-500/10 text-red-700 py-3 font-semibold hover:bg-red-500/20 transition disabled:opacity-50"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <XCircle size={18} />}
            Reject Application
          </button>
        </div>
      </div>
    </article>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="rounded-xl border border-black/10 bg-white/50 p-4">
    <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gray-500">
      {icon}
      {label}
    </div>
    <p className="mt-2 text-sm font-semibold text-primary">{value || "Not provided"}</p>
  </div>
);

const LoadingState = () => (
  <div className="rounded-2xl border border-black/10 bg-cream p-12 flex items-center justify-center">
    <div className="flex items-center gap-3 text-gray-700">
      <Loader2 size={20} className="animate-spin" />
      Loading reviewer applications...
    </div>
  </div>
);

const EmptyState = ({ searched }) => (
  <div className="rounded-2xl border border-black/10 bg-cream p-10 sm:p-14 text-center">
    <div className="w-14 h-14 mx-auto rounded-2xl bg-primary text-tan flex items-center justify-center">
      <Inbox size={25} />
    </div>
    <h3 className="mt-5 text-lg font-bold text-primary">
      {searched ? "No matching applications" : "No pending applications"}
    </h3>
    <p className="mt-2 text-sm text-gray-600">
      {searched ? "Try another name, email, department or designation." : "New reviewer applications will appear here."}
    </p>
  </div>
);

export default AdminDashboard;