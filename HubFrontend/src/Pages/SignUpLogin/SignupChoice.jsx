import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, UserRound, ArrowRight } from "lucide-react";

const SignupChoice = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-tan flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-10">
          <p className="text-bloodstone font-semibold tracking-widest uppercase text-sm">KL Innovation Hub</p>
          <h1 className="text-4xl sm:text-5xl font-black text-primary mt-3">Create your account</h1>
          <p className="text-bloodstone mt-3">Choose how you want to use the Innovation Hub.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => navigate("/signup/student")}
            className="text-left bg-white rounded-3xl border border-amber-700 p-8 shadow-xl hover:-translate-y-1 transition group"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary text-tan flex items-center justify-center mb-6">
              <GraduationCap size={30} />
            </div>
            <h2 className="text-2xl font-bold text-primary">Student</h2>
            <p className="text-bloodstone mt-3 min-h-14">Create projects, form teams, showcase your work and connect with other students.</p>
            <span className="inline-flex items-center gap-2 mt-7 text-primary font-bold group-hover:gap-3 transition-all">
              Continue <ArrowRight size={18} />
            </span>
          </button>

          <button
            onClick={() => navigate("/signup/teacher")}
            className="text-left bg-primary rounded-3xl border border-primary p-8 shadow-xl hover:-translate-y-1 transition group"
          >
            <div className="w-14 h-14 rounded-2xl bg-tan text-primary flex items-center justify-center mb-6">
              <UserRound size={30} />
            </div>
            <h2 className="text-2xl font-bold text-tan">Teacher / Project Reviewer</h2>
            <p className="text-tan/80 mt-3 min-h-14">Apply to review student innovations. Your account will be activated after admin approval.</p>
            <span className="inline-flex items-center gap-2 mt-7 text-tan font-bold group-hover:gap-3 transition-all">
              Apply as Reviewer <ArrowRight size={18} />
            </span>
          </button>
        </div>

        <div className="text-center mt-8">
          <button onClick={() => navigate("/login")} className="text-bloodstone hover:underline font-semibold">
            Already have a student account? Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(SignupChoice);
