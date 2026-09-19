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
                className="h-auto w-160 rounded-2xl object-contain"
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
                src="/CollaborationWorkFlow.png"
                alt="KL Innovation Hub project review workflow"
                className="h-auto w-165 rounded-2xl object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="max-w-3xl mb-12">
          <p className="text-sky uppercase tracking-[0.2em] text-sm font-semibold mb-3">
            Think Beyond The Code
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-vanilla-custard mb-4">
            What Makes a Student Project Stand Out?
          </h2>
          <p className="text-light-blue text-lg">
            A strong project is not only about the technologies used.It is about the problem, the execution, the people behind it, and the value it creates.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Real Problem",
              text: "The project addresses a problem that people actually experience."
            },
            {
              title: "Clear Purpose",
              text: "Anyone viewing the project can quickly understand what it does and why it exists."
            },
            {
              title: "Strong Execution",
              text: "The implementation demonstrates meaningful technical decisions rather than just a collection of technologies."
            },
            {
              title: "Visible Impact",
              text: "The project has users, measurable outcomes, useful demonstrations, or potential for further development."
            }
          ].map((item, index) => (
            <div key={item.title} className="bg-secondary border border-accent/20 rounded-3xl p-7">
              <div className="text-sky text-sm font-bold mb-5">
                0{index + 1}
              </div>
              <h3 className="text-2xl font-bold text-cream mb-3">
                {item.title}
              </h3>
              <p className="text-light-blue leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-secondary border border-accent/20 rounded-3xl p-8 md:p-12">
          <div className="max-w-3xl mb-12">
            <p className="text-sky uppercase tracking-[0.2em] text-sm font-semibold mb-3">The Project Lifecycle</p>
            <h2 className="text-3xl md:text-4xl font-bold text-vanilla-custard mb-4"> A Project Is a Journey, Not a Submission</h2>
            <p className="text-light-blue text-lg"> The visible project is only the final result. Behind everyproject are decisions, experiments, failures, improvementsand people working together.</p>
          </div>
          <div className="grid md:grid-cols-5 gap-4">
            {[
              ["01", "Idea", "Identify something worth solving."],
              ["02", "Prototype", "Build the first working version."],
              ["03", "Feedback", "Learn what needs to improve."],
              ["04", "Iteration", "Refine the product through multiple versions."],
              ["05", "Impact", "Put the project in front of real users."]
            ].map(([number, title, text], index) => (
              <div key={number} className="relative">
                <div className="bg-dashboard border border-accent/20 rounded-2xl p-6 h-full">
                  <div className="text-sky font-bold text-sm mb-5">
                    {number}
                  </div>
                  <h3 className="text-xl font-bold text-cream mb-2">
                    {title}
                  </h3>
                  <p className="text-light-blue text-sm leading-relaxed">
                    {text}
                  </p>
                </div>
                {index < 4 && (<div className="hidden md:block absolute top-1/2 -right-3 text-accent text-xl z-10">→</div>)}
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-sky uppercase tracking-[0.2em] text-sm font-semibold mb-3">Project Health</p>
            <h2 className="text-3xl md:text-4xl font-bold text-vanilla-custard mb-5">Is Your Project Actually Moving Forward?</h2>
            <p className="text-light-blue text-lg leading-relaxed">A project can have hundreds of lines of code and still make very little progress. Look at the signals that matter.</p>
          </div>
          <div className="space-y-4">
            {[
              {
                label: "Clear Progress",
                text: "The project regularly moves from one meaningful milestone to another."
              },
              {
                label: "Active Collaboration",
                text: "Team members are contributing instead of one person doing everything."
              },
              {
                label: "Useful Feedback",
                text: "The team listens to users, peers or faculty and improves the project."
              },
              {
                label: "Working Product",
                text: "The project can demonstrate what it promises to do."
              },
              {
                label: "Continuous Improvement",
                text: "The project keeps evolving instead of stopping after the first version."
              }
            ].map((item) => (
              <div key={item.label} className="bg-secondary border border-accent/20 rounded-2xl p-6">
                <div className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-sky mt-2 shrink-0"></div>
                  <div>
                    <h3 className="text-lg font-semibold text-cream mb-1"> {item.label}</h3>
                    <p className="text-light-blue text-sm leading-relaxed">{item.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="max-w-3xl mb-12">
          <p className="text-sky uppercase tracking-[0.2em] text-sm font-semibold mb-3">
            Beyond The Prototype
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-vanilla-custard mb-4">
            Build It. Then Find Out If People Need It.
          </h2>
          <p className="text-light-blue text-lg">
            The most interesting stage of a project begins after the first
            working version. Real users reveal problems that code alone cannot.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-secondary border border-accent/20 rounded-3xl p-8">
            <div className="text-sky text-3xl mb-5">01</div>
            <h3 className="text-2xl font-bold text-cream mb-3">Put It in Front of People</h3>
            <p className="text-light-blue leading-relaxed">A live project gives students the opportunity to discover how real users interact with their idea.</p>
          </div>
          <div className="bg-secondary border border-accent/20 rounded-3xl p-8">
            <div className="text-sky text-3xl mb-5">02</div>
            <h3 className="text-2xl font-bold text-cream mb-3">Listen to Feedback</h3>
            <p className="text-light-blue leading-relaxed"> Questions, discussions and feedback can reveal missingfeatures, usability problems and new possibilities.</p>
          </div>
          <div className="bg-secondary border border-accent/20 rounded-3xl p-8">
            <div className="text-sky text-3xl mb-5">03</div>
            <h3 className="text-2xl font-bold text-cream mb-3"> Keep Improving</h3>
            <p className="text-light-blue leading-relaxed">The first version does not have to be the final version. Real projects can continue evolving with new ideas and users.</p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sky uppercase tracking-[0.2em] text-sm font-semibold mb-3"> Learn From Campus</p>
            <h2 className="text-3xl md:text-4xl font-bold text-vanilla-custard mb-5">Your Next Idea Might Already Be Around You</h2>
            <p className="text-light-blue text-lg leading-relaxed">
              Innovation becomes stronger when students can see what others
              are building. Explore projects outside your own branch,
              understand different approaches, and discover possibilities
              you may not have considered.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              ["CSE", "Software & AI"],
              ["CSIT", "Data & Systems"],
              ["ECE", "Hardware & IoT"],
              ["AIDS", "Data & Intelligence"]
            ].map(([branch, area]) => (
              <div key={branch} className="bg-secondary border border-accent/20 rounded-3xl p-7">
                <h3 className="text-2xl font-bold text-sky mb-2">{branch}</h3>
                <p className="text-light-blue">{area}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-dashboard border border-accent/20 rounded-3xl p-8 md:p-12">
          <div className="max-w-3xl mb-12">
            <p className="text-sky uppercase tracking-[0.2em] text-sm font-semibold mb-3">
              Think Bigger
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-vanilla-custard mb-4">
              A Student Project Can Become More Than a College Assignment
            </h2>
            <p className="text-light-blue text-lg">A project can start as an academic idea and continue growing through collaboration, feedback, users and new contributors.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                title: "Assignment",
                text: "A problem to solve."
              },
              {
                title: "Project",
                text: "A working solution."
              },
              {
                title: "Product",
                text: "Something people can use."
              },
              {
                title: "Community",
                text: "Something others can contribute to."
              }
            ].map((item, index) => (
              <div key={item.title} className="relative">
                <div className="border border-accent/20 rounded-2xl p-6 bg-secondary h-full">
                  <div className="text-sky text-sm font-bold mb-4"> 0{index + 1}</div>
                  <h3 className="text-xl font-bold text-cream mb-2"> {item.title}</h3>
                  <p className="text-light-blue text-sm">{item.text}</p>
                </div>
                {index < 3 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 text-accent text-xl">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center">
          <p className="text-sky uppercase tracking-[0.2em] text-sm font-semibold mb-4">
            Before You Submit
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-vanilla-custard mb-8">
            Ask Yourself These Five Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-left">
            {[ "What real problem does my project solve?","Who would actually use it?", "What makes my solution different?", "What did I learn while building it?","What could this project become next?"].map((question, index) => (
              <div key={question} className="bg-secondary border border-accent/20 rounded-2xl p-6 flex gap-4 items-center">
                <span className="text-sky font-bold">
                  {index + 1}
                </span>
                <span className="text-cream">
                  {question}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

<section className="width-full flex items-center justify-center bg-cyan-400 mx-auto px-6 py-24">
  <div className="max-w-5xl  overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 shadow-lg shadow-black/20">
    <div className="grid gap-12 px-8 py-12 md:px-14 md:py-16 lg:grid-cols-5 lg:items-center">
      <div className="lg:col-span-3">
        <h2 className="text-3xl font-semibold leading-tight tracking-tight text-slate-100 md:text-5xl"> Found a Bug?<br />  Want to Collaborate? </h2>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-400 md:text-lg">
          KL Innovation Hub is built to grow with the students who use it. If you find something that can be improved, raise an issue, share your idea, or contribute to the project.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <a href="https://github.com/PraveenReddy-06/KlInnovationHub/issues" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-cyan-400 px-6 py-3.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900">
            <svg viewBox="0 0 20 20"fill="none" stroke="currentColor"strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
              <path d="M8 6a2 2 0 014 0v1H8V6zM6 9h8v3a4 4 0 01-8 0V9zM3 9h3M14 9h3M3 15l3-2M17 15l-3-2M4 5l3 2M16 5l-3 2" />
            </svg>
            Report an Issue
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <a href="https://github.com/PraveenReddy-06/KlInnovationHub" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-slate-600 px-6 py-3.5 text-sm font-semibold text-slate-100 transition-colors hover:border-slate-500 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900">
            <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            View on GitHub
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="rounded-2xl border border-slate-700/70 bg-slate-950/50 p-2">
          <h3 className="px-3 pb-2 pt-3 text-sm font-semibold text-slate-300"> Ways to contribute</h3>
          <ul className="space-y-1">
            <li>
              <a href="https://github.com/PraveenReddy-06/KlInnovationHub/issues/new"target="_blank"  rel="noopener noreferrer"
                className="flex items-start gap-4 rounded-xl px-3 py-3.5 transition-colors hover:bg-slate-800/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-300 ring-1 ring-inset ring-cyan-400/20">
                  <svg viewBox="0 0 20 20" fill="none"stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                    <path d="M8 6a2 2 0 014 0v1H8V6zM6 9h8v3a4 4 0 01-8 0V9zM3 9h3M14 9h3M3 15l3-2M17 15l-3-2M4 5l3 2M16 5l-3 2" />
                  </svg>
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-slate-100">
                    Report a bug
                    <span className="sr-only"> (opens in a new tab)</span>
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-slate-400">
                    Something broken or confusing? Open an issue and tell us what you saw.
                  </span>
                </span>
              </a>
            </li>
            <li>
              <a href="https://github.com/PraveenReddy-06/KlInnovationHub/issues/new"target="_blank" rel="noopener noreferrer"
                className="flex items-start gap-4 rounded-xl px-3 py-3.5 transition-colors hover:bg-slate-800/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-300 ring-1 ring-inset ring-cyan-400/20">
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                    <path d="M7 14h6M8 17h4M10 3a5 5 0 00-3 9c.6.5 1 1.2 1 2h4c0-.8.4-1.5 1-2a5 5 0 00-3-9z" />
                  </svg>
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-slate-100">
                    Share an idea
                    <span className="sr-only"> (opens in a new tab)</span>
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-slate-400">
                    Suggest a feature or improvement for students and faculty.
                  </span>
                </span>
              </a>
            </li>

            <li>
              <a href="https://github.com/PraveenReddy-06/KlInnovationHub"target="_blank" rel="noopener noreferrer"
                className="flex items-start gap-4 rounded-xl px-3 py-3.5 transition-colors hover:bg-slate-800/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-300 ring-1 ring-inset ring-cyan-400/20">
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor"strokeWidth="1.6"strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                    <path d="M7 6l-4 4 4 4M13 6l4 4-4 4" />
                  </svg>
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-slate-100">
                    Contribute code
                    <span className="sr-only"> (opens in a new tab)</span>
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-slate-400">
                    Fork the repository and send a pull request.
                  </span>
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div className="flex flex-col gap-5 border-t border-slate-800 bg-slate-950/30 px-8 py-6 sm:flex-row sm:items-center sm:justify-between md:px-14">
      <div className="flex items-center gap-4">
        <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-cyan-300 ring-1 ring-slate-700" >
          PM
        </span>
        <div>
          <p className="text-xs text-slate-400">Built with dedication by</p>
          <a href="https://www.linkedin.com/in/praveen-maramreddy-000b11374/" target="_blank" rel="noopener noreferrer"
            className="rounded text-base font-semibold text-slate-100 transition-colors hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">
            Praveen Maramreddy
          </a>
        </div>
      </div>

      <p className="text-sm text-slate-400">
        Want to connect?{" "}
        <a href="https://www.linkedin.com/in/praveen-maramreddy-000b11374/" target="_blank"rel="noopener noreferrer"
          className="rounded font-medium text-cyan-300 underline decoration-cyan-400/40 underline-offset-4 transition-colors hover:decoration-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">
          Let&apos;s connect on LinkedIn
        </a>
      </p>
    </div>
  </div>
</section>

    </div>
  );
}