import { useEffect, useState } from "react";
import { BarChart3, CheckCircle2, Clock3, FolderKanban, Heart, Loader2, Users, XCircle } from "lucide-react";
import { getPublicAnalytics } from "../Api/publicAnalyticsApi";

export default function PublicPlatformStats() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getPublicAnalytics()
      .then(setAnalytics)
      .catch((err) => {
        console.error("Failed to load public analytics:", err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="border-b border-accent/20 bg-secondary/40">
        <div className="max-w-7xl mx-auto px-6 py-12 flex justify-center items-center text-cream">
          <Loader2 size={20} className="animate-spin mr-3" />
          Loading platform statistics...
        </div>
      </section>
    );
  }

  if (error || !analytics) {
    return (
      <section className="border-b border-accent/20 bg-secondary/40">
        <div className="max-w-7xl mx-auto px-6 py-10 text-center text-misty-sage">
          Platform statistics are temporarily unavailable.
        </div>
      </section>
    );
  }

  const cards = [
    ["Students", analytics.totalStudents, Users],
    ["Projects", analytics.totalProjects, FolderKanban],
    ["Approved Projects", analytics.approvedProjects, CheckCircle2],
    ["Reviewers", analytics.activeReviewers, Users],
    ["Project Likes", analytics.totalProjectLikes, Heart],
  ];

  return (
    <section className="border-b border-accent/20 bg-secondary/40">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex items-center gap-3">
          <BarChart3 className="text-sky" size={25} />
          <p className="text-sm uppercase tracking-[0.2em] text-sky font-semibold">
            Platform Overview
          </p>
        </div>

        <h2 className="mt-3 text-3xl md:text-4xl font-bold text-vanilla-custard">
          KL Innovation Hub by the Numbers
        </h2>
        <p className="mt-3 text-misty-sage max-w-3xl">
          A public snapshot of the student innovation community, projects,
          faculty review workflow and project engagement.
        </p>

        <div className="mt-8 grid grid-cols-2 lg:grid-cols-5 gap-4">
          {cards.map(([label, value, Icon]) => (
            <div key={label} className="rounded-2xl border border-accent/20 bg-secondary p-5">
              <div className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center">
                <Icon size={20} />
              </div>
              <p className="mt-4 text-sm text-misty-sage">{label}</p>
              <p className="mt-1 text-3xl font-black text-vanilla-custard">
                {Number(value).toLocaleString("en-IN")}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <div className="rounded-3xl border border-accent/20 bg-secondary p-6">
            <h3 className="text-xl font-bold text-vanilla-custard">Project Type</h3>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-accent/20 bg-primary/50 p-5">
                <p className="text-sm text-misty-sage">Solo Projects</p>
                <p className="mt-2 text-3xl font-black text-cream">
                  {Number(analytics.soloProjects).toLocaleString("en-IN")}
                </p>
              </div>
              <div className="rounded-2xl border border-accent/20 bg-primary/50 p-5">
                <p className="text-sm text-misty-sage">Group Projects</p>
                <p className="mt-2 text-3xl font-black text-cream">
                  {Number(analytics.groupProjects).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-accent/20 bg-secondary p-6">
          <h3 className="text-xl font-bold text-vanilla-custard">Approved Projects by Domain</h3>
          {Object.keys(analytics.projectsByDomain || {}).length === 0 ? (
            <p className="mt-4 text-sm text-misty-sage">Domain statistics will appear as approved projects are added.</p>
          ) : (
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {Object.entries(analytics.projectsByDomain).map(([domain, count]) => (
                <div key={domain} className="rounded-2xl border border-accent/20 bg-primary/50 p-4">
                  <p className="text-sm text-cream">{domain}</p>
                  <p className="mt-2 text-2xl font-black text-sky">{Number(count).toLocaleString("en-IN")}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
