import Navbar from "../../Components/Navbar";

export default function Guide() {
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

      {/* HERO */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">

          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-accent/30 bg-secondary/40">
            <span className="text-sky font-medium">
              KL Innovation Hub Student Guide
            </span>
          </div>

          <h1 className="mt-8 text-5xl lg:text-7xl font-bold text-vanilla-custard leading-tight">
            Build Projects
            <span className="block text-sky">
              That Actually Matter
            </span>
          </h1>

          <p className="mt-8 text-lg text-misty-sage max-w-3xl mx-auto leading-relaxed">
            A roadmap for CSE, CSIT and ECE students to choose the right
            projects, collaborate effectively, use GitHub professionally,
            deploy applications and build a portfolio that stands out.
          </p>
        </div>
      </section>

      {/* COMMON MISTAKES */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-vanilla-custard mb-12">
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

        <h2 className="text-4xl font-bold text-vanilla-custard mb-12">
          Choose Your Domain
        </h2>

        <div className="grid lg:grid-cols-3 gap-8">

          <div className="bg-secondary border border-accent/20 rounded-3xl p-8">
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

          <div className="bg-secondary border border-accent/20 rounded-3xl p-8">
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

          <div className="bg-secondary border border-accent/20 rounded-3xl p-8">
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

        <h2 className="text-4xl font-bold text-vanilla-custard mb-12">
          Project Development Roadmap
        </h2>

        <div className="space-y-8">

          {roadmap.map((step, index) => (
            <div
              key={index}
              className="flex gap-6 items-center bg-secondary border border-accent/20 rounded-3xl p-6"
            >
              <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center text-white font-bold">
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

        <h2 className="text-4xl font-bold text-vanilla-custard mb-12">
          GitHub Like a Professional
        </h2>

        <div className="grid lg:grid-cols-2 gap-8">

          <div className="bg-dashboard rounded-3xl border border-accent/20 p-8">
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

        <div className="mt-10 bg-secondary rounded-3xl border border-accent/20 p-8">
          <h3 className="text-2xl text-sky font-bold mb-4">
            Recommended Branching
          </h3>

          <pre className="text-light-blue">
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

        <h2 className="text-4xl font-bold text-vanilla-custard mb-12">
          Deployment Checklist
        </h2>

        <div className="grid lg:grid-cols-4 gap-6">

          <div className="bg-secondary rounded-3xl p-6 border border-accent/20">
            <h3 className="text-sky text-xl font-bold mb-4">
              Frontend
            </h3>

            <p className="text-cream">Vercel</p>
            <p className="text-cream">Netlify</p>
            <p className="text-cream">AWS S3</p>
          </div>

          <div className="bg-secondary rounded-3xl p-6 border border-accent/20">
            <h3 className="text-sky text-xl font-bold mb-4">
              Backend
            </h3>

            <p className="text-cream">Spring Boot</p>
            <p className="text-cream">Elastic Beanstalk</p>
            <p className="text-cream">Docker</p>
          </div>

          <div className="bg-secondary rounded-3xl p-6 border border-accent/20">
            <h3 className="text-sky text-xl font-bold mb-4">
              Database
            </h3>

            <p className="text-cream">AWS RDS</p>
            <p className="text-cream">MySQL</p>
          </div>

          <div className="bg-secondary rounded-3xl p-6 border border-accent/20">
            <h3 className="text-sky text-xl font-bold mb-4">
              Storage
            </h3>

            <p className="text-cream">AWS S3</p>
          </div>

        </div>

      </section>

      {/* RESUME */}
      <section className="max-w-7xl mx-auto px-6 py-20">

        <h2 className="text-4xl font-bold text-vanilla-custard mb-12">
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

        <div className="bg-secondary border border-accent/20 rounded-[40px] p-10">

          <h2 className="text-4xl font-bold text-vanilla-custard mb-8 text-center">
            Final Submission Checklist
          </h2>

          <div className="grid md:grid-cols-2 gap-6 text-light-blue text-lg">

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