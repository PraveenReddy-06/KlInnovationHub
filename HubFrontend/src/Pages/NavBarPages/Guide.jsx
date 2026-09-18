import Navbar from "../../Components/Navbar";
import { useEffect, useState } from "react";
import PublicPlatformStats from "../../Components/PublicPlatformStats";
import axios from "axios";
import projectReviewFlow from '/ProjectReviewFlow.png';

export default function Guide() {

  const [topReviewers, setTopReviewers] = useState([]);
  const [reviewersLoading, setReviewersLoading] = useState(true);

  useEffect(() => {
      const fetchTopReviewers = async () => {
          try {
              const response = await axios.get(`${import.meta.env.VITE_API_URL}/reviewer/review/top-three`);
              setTopReviewers(response.data);
          } catch (error) {
              console.error("Failed to fetch top reviewers:", error);
          } finally {
              setReviewersLoading(false);
          }
      };
      fetchTopReviewers();
  }, []);


  const mistakes = [
    "Building random YouTube clone projects",
    "Using only the main branch",
    "No GitHub README",
    "No deployment",
    "Copy-pasting code without understanding",
    "Starting too late before reviews"
  ];

  const roadmap = [
    "Find a Real Problem",
    "Research Existing Solutions",
    "Define Features",
    "Select Tech Stack",
    "Design UI & Database",
    "Develop in Milestones",
    "Test Thoroughly",
    "Deploy & Document"
  ];


  return (
    <div className="min-h-screen bg-primary">
      <Navbar />

      <PublicPlatformStats />
      <section className="p-15 bg-cream">
        <div className="mb-5">
            <h2 className="text-2xl font-bold text-gray-800">
                Top Faculty Reviewers
            </h2>

            <p className="mt-1 text-sm text-slate-600">
                Faculty members who have reviewed the most student projects.
            </p>
        </div>
        <div className="overflow-hidden rounded-2xl border border-bloodstone bg-white shadow-sm">
          {reviewersLoading ? (
              <div className="px-6 py-8 text-center text-sm text-slate-500">
                  Loading reviewer statistics...
              </div>
          ) : topReviewers.length === 0 ? (
              <div className="px-6 py-8 text-center text-sm text-slate-500">
                  No reviewer activity available yet.
              </div>
          ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-bloodstone bg-slate-50">
                <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Rank
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Faculty Reviewer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Department
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Designation
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Projects Reviewed
                    </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topReviewers.map((reviewer, index) => (
                    <tr  key={`${reviewer[0]}-${index}`}  className="transition-colors font-semibold hover:bg-slate-50">
                        <td className="px-6 py-4">
                            <span className="font-bold text-slate-700">
                              {index + 1}
                            </span>
                        </td>
                        <td className="px-6 py-4">
                            <span className=" font-bold text-slate-900">
                                {reviewer[0]}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-900">
                            {reviewer[1] || "—"}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-900">
                          {reviewer[2] || "—"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-semibold text-slate-900">
                              {reviewer[3]}
                          </span>
                        </td>
                    </tr>
                ))}
              </tbody>
              </table>
            </div>
            )}
        </div>
      </section>

      <section className="relative py-16 md:py-24 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">

          <h1 className="mt-8 text-4xl md:text-5xl lg:text-7xl font-bold text-vanilla-custard leading-tight">
            Build Projects
            <span className="block text-sky">
              That Actually Matter
            </span>
          </h1>

          <p className="mt-8 text-base md:text-lg text-misty-sage max-w-3xl mx-auto leading-relaxed">
            A roadmap for CSE, CSIT, ECE and AIDS students to choose the right
            projects, collaborate effectively, use GitHub professionally,
            deploy applications and build a portfolio that stands out.
          </p>
        </div>
      </section>

      <section className="mt-5">
        <div className="mb-8 text-center">
          <span className="inline-flex rounded-full border border-slate-200 bg-tan px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-bloodstone">
            Platform Workflows
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            From Ideas to Impact
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Understand how projects move through faculty review and how students collaborate to turn ideas into completed projects.
          </p>
        </div>

        <div className="grid grid-cols-1 px-10 gap-8 lg:grid-cols-2">
          
          <div className="group overflow-hidden rounded-3xl border border-gray-300 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.3)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_25px_70px_-30px_rgba(15,23,42,0.4)]">
            <div className="border-b px-6 py-5">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="text-lg font-bold text-tan">Collaboration Workflow</h3>
                  <p className="text-xs text-slate-300">From idea to completed project</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center p-4 sm:p-6">
              <img
                src="/ProjectReviewFlow.png"
                alt="KL Innovation Hub collaboration workflow"
                className="h-auto w-full max-w-140 rounded-2xl object-contain"
              />
            </div>
          </div>

          <div className="group overflow-hidden rounded-3xl border border-slate-200 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.3)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_25px_70px_-30px_rgba(15,23,42,0.4)]">
            <div className="border-b px-6 py-5">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="text-lg font-bold text-tan">Project Review Workflow</h3>
                  <p className="text-xs text-slate-300">From submission to visibility</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center p-4 sm:p-6">
              <img
                src="/CollaborationFlow.png"
                alt="KL Innovation Hub project review workflow"
                className="h-auto w-full max-w-140 rounded-2xl object-contain"
              />
            </div>
          </div>
        </div>
      </section>


      {/* COMMON MISTAKES */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-vanilla-custard mb-12">
          Mistakes Most Students Make
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mistakes.map((item, index) => (
            <div
              key={index}
              className="bg-bloodstone/10 border border-bloodstone/30 rounded-3xl p-6"
            >
              <h3 className="text-red-300 font-semibold mb-3">
                Mistake #{index + 1}
              </h3>

              <p className="text-cream">
                {item}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* DOMAINS */}
      <section className="max-w-7xl mx-auto px-6 py-20">

        <h2 className="text-3xl md:text-3xl font-bold text-vanilla-custard mb-12">
          Choose Your Domain
        </h2>

        <div className="grid lg:grid-cols-3 gap-8">

          <div className="bg-secondary border border-accent/20 p-8">
            <h3 className="text-3xl font-bold text-sky mb-6">
              CSE
            </h3>

            <ul className="space-y-3 text-cream">
              <li>• Full Stack Development</li>
              <li>• Cloud Computing</li>
              <li>• DevOps</li>
              <li>• Cyber Security</li>
              <li>• AI / ML</li>
            </ul>
          </div>

          <div className="bg-secondary border border-accent/20  p-8">
            <h3 className="text-3xl font-bold text-sky mb-6">
              CSIT
            </h3>

            <ul className="space-y-3 text-cream">
              <li>• Data Analytics</li>
              <li>• Information Systems</li>
              <li>• Business Intelligence</li>
              <li>• AI Applications</li>
              <li>• Data Visualization</li>
            </ul>
          </div>

          <div className="bg-secondary border border-accent/20  p-8">
            <h3 className="text-3xl font-bold text-sky mb-6">
              ECE
            </h3>

            <ul className="space-y-3 text-cream">
              <li>• IoT Systems</li>
              <li>• Embedded Systems</li>
              <li>• Robotics</li>
              <li>• Edge AI</li>
              <li>• Smart Devices</li>
            </ul>
          </div>

        </div>
      </section>

      {/* PROJECT ROADMAP */}
      <section className="max-w-7xl mx-auto px-6 py-20">

        <h2 className="text-3xl md:text-4xl font-bold text-vanilla-custard mb-12">
          Project Development Roadmap
        </h2>

        <div className="space-y-8">

          {roadmap.map((step, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-center text-center sm:text-left bg-secondary border border-accent/20 rounded-3xl p-6"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-accent flex items-center justify-center text-white font-bold">
                {index + 1}
              </div>

              <h3 className="text-xl text-cream font-semibold">
                {step}
              </h3>
            </div>
          ))}

        </div>
      </section>

      {/* GITHUB GUIDE */}
      <section className="max-w-7xl mx-auto px-6 py-20">

        <h2 className="text-3xl md:text-4xl font-bold text-vanilla-custard mb-12">
          GitHub Like a Professional
        </h2>

        <div className="grid lg:grid-cols-2 gap-8">

          <div className="bg-dashboard  border border-accent/20 p-8">
            <h3 className="text-sky text-2xl font-bold mb-4">
              Bad Commits
            </h3>

            <div className="space-y-3 text-red-300 font-mono">
              <p>git commit -m "update"</p>
              <p>git commit -m "changes"</p>
              <p>git commit -m "final"</p>
            </div>
          </div>

          <div className="bg-dashboard rounded-3xl border border-accent/20 p-8">
            <h3 className="text-sky text-2xl font-bold mb-4">
              Good Commits
            </h3>

            <div className="space-y-3 text-green-300 font-mono">
              <p>git commit -m "Add JWT authentication"</p>
              <p>git commit -m "Implement notification API"</p>
              <p>git commit -m "Fix project search bug"</p>
            </div>
          </div>

        </div>

        <div className="mt-10 bg-secondary border border-accent/20 p-8">
          <h3 className="text-2xl text-sky font-bold mb-4">
            Recommended Branching
          </h3>

          <pre className="text-light-blue overflow-x-auto text-sm">
{`main
│
develop
├── feature/login
├── feature/search
├── feature/notifications
└── feature/profile`}
          </pre>
        </div>

      </section>

      {/* DEPLOYMENT */}
      <section className="max-w-7xl mx-auto px-6 py-20">

        <h2 className="text-3xl md:text-4xl font-bold text-vanilla-custard mb-12">
          Deployment Checklist
        </h2>

        <div className="grid lg:grid-cols-4 gap-6">

          <div className="bg-secondary  p-6 border border-accent/20">
            <h3 className="text-sky text-xl font-bold mb-4">
              Frontend
            </h3>

            <p className="text-cream">Vercel</p>
            <p className="text-cream">Netlify</p>
            <p className="text-cream">AWS S3</p>
          </div>

          <div className="bg-secondary  p-6 border border-accent/20">
            <h3 className="text-sky text-xl font-bold mb-4">
              Backend
            </h3>

            <p className="text-cream">Spring Boot</p>
            <p className="text-cream">Elastic Beanstalk</p>
            <p className="text-cream">Docker</p>
          </div>

          <div className="bg-secondary p-6 border border-accent/20">
            <h3 className="text-sky text-xl font-bold mb-4">
              Database
            </h3>

            <p className="text-cream">AWS RDS</p>
            <p className="text-cream">MySQL</p>
          </div>

          <div className="bg-secondary  p-6 border border-accent/20">
            <h3 className="text-sky text-xl font-bold mb-4">
              Storage
            </h3>

            <p className="text-cream">AWS S3</p>
          </div>

        </div>

      </section>

      {/* RESUME */}
      <section className="max-w-7xl mx-auto px-6 py-20">

        <h2 className="text-3xl md:text-4xl font-bold text-vanilla-custard mb-12">
          Resume & Portfolio Tips
        </h2>

        <div className="grid lg:grid-cols-2 gap-8">

          <div className="bg-bloodstone/10 border border-bloodstone/30 rounded-3xl p-8">
            <h3 className="text-red-300 text-2xl font-bold mb-4">
              Weak Description
            </h3>

            <p className="text-cream">
              Built a website using Java and React.
            </p>
          </div>

          <div className="bg-accent/10 border border-accent/30 rounded-3xl p-8">
            <h3 className="text-sky text-2xl font-bold mb-4">
              Strong Description
            </h3>

            <p className="text-cream">
              Developed a full-stack student collaboration platform
              featuring authentication, notifications, project
              discovery, AWS deployment and GitHub workflow.
            </p>
          </div>

        </div>
      </section>

      {/* FINAL CHECKLIST */}
      <section className="max-w-5xl mx-auto px-6 py-24">

        <div className="bg-secondary border border-accent/20  p-6 sm:p-10">
          <h2 className="text-3xl md:text-4xl font-bold text-vanilla-custard mb-8 text-center">
            Final Submission Checklist
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-light-blue text-base sm:text-lg">
            <div>✓ Real Problem Solved</div>
            <div>✓ GitHub Repository</div>
            <div>✓ Proper README</div>
            <div>✓ Branching Strategy</div>
            <div>✓ Authentication</div>
            <div>✓ Deployment</div>
            <div>✓ Documentation</div>
            <div>✓ Resume Ready</div>

          </div>
        </div>
      </section>
    </div>
  );
}