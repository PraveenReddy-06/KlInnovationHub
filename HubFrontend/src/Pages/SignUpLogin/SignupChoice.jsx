import { memo } from "react"; 
import { useNavigate } from "react-router-dom"; 
import { GraduationCap, BookOpen, ArrowRight } from "lucide-react"; 
 
const SignupChoice = () => { 
  const navigate = useNavigate(); 
 
  return ( 
    <div className="min-h-screen relative overflow-hidden"> 
      <img  src="/SignupChoiceBg.png"  alt=""  className="absolute inset-0 w-full h-full object-cover"/> 
      <div className="absolute inset-0 bg-primary/10" /> 
      <div className="relative z-10 min-h-screen flex flex-col justify-start pt-30 px-4 sm:px-8 lg:px-16 py-10"> 
         
        <div className="w-full max-w-7xl mx-auto text-center mb-8 sm:mb-10"> 
          <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] text-primary">  KL INNOVATION HUB </p> 
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-primary">  Create your account</h1> 
          <p className="mt-2 text-primary/70 text-sm sm:text-base">  Select an account type to continue.</p> 
        </div> 
 
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-7 lg:gap-16 items-stretch"> 
          <div className="w-full min-h-0 sm:min-h-100 lg:h-100 max-w-lg mx-auto lg:mr-auto lg:ml-8 bg-vanilla-custard/45 backdrop-blur-xl border border-white/50 rounded-3xl p-6 sm:p-8 flex flex-col shadow-[0_8px_35px_rgba(2,16,36,0.18)] transition-all duration-300 hover:bg-vanilla-custard/55 hover:-translate-y-1"> 
            <div className="w-11 h-11 rounded-xl bg-primary/90 text-light-blue flex items-center justify-center border border-white/20 shrink-0"> 
              <GraduationCap size={23} /> 
            </div> 
            <p className="mt-5 sm:mt-6 text-xs font-bold uppercase tracking-[0.18em] text-accent">  For Students</p> 
            <h2 className="mt-5 text-2xl sm:text-3xl font-bold text-primary">  Create your account</h2> 
            <p className="mt-8 text-bloodstone leading-6 text-sm sm:text-base max-w-md hidden sm:block">  Get guidance, Build projects <br/> Find teammates, Join Teams <br/> Showcase your project, compete with others.</p> 
            <button  type="button"  onClick={() => navigate("/signup/student")} 
              className="mt-6  inline-flex self-start items-center  gap-2 px-5 py-4 rounded-lg bg-primary text-light-blue font-semibold text-sm hover:bg-secondary transition"> 
              Create Student Account 
              <ArrowRight size={16} /> 
            </button> 
          </div> 
 
          <div className="w-full min-h-0 sm:min-h-100 lg:h-100 max-w-lg mx-auto lg:ml-auto lg:mr-8 bg-primary/90 backdrop-blur-xl border border-white/25 rounded-3xl p-6 sm:p-8 flex flex-col shadow-[0_8px_35px_rgba(2,16,36,0.25)] transition-all duration-300 hover:bg-primary/60 hover:-translate-y-1"> 
            <div className="w-11 h-11 rounded-xl bg-tan/90 text-primary flex items-center justify-center border border-white/20 shrink-0"> 
              <BookOpen size={23} /> 
            </div> 
            <p className="mt-5 sm:mt-6 text-xs font-bold uppercase tracking-[0.18em] text-sky">For  Faculty </p> 
            <h2 className="mt-5 text-2xl sm:text-3xl font-bold text-tan"> Guide Innovative Learners</h2> 
            <p className="mt-8 text-light-blue/75 leading-6 text-sm sm:text-base max-w-md hidden sm:block">  Apply as a project reviewer <br/> Review projects <br/> Guide student teams.</p> 
            <button  type="button"  onClick={() => navigate("/signup/teacher")} 
              className="mt-6  inline-flex self-start items-center gap-2 px-5 py-4 rounded-lg bg-tan text-primary font-semibold text-sm hover:opacity-90 transition" 
            > 
              Create Reviewer Profile
              <ArrowRight size={16} /> 
            </button> 
          </div> 
        </div> 
 
        <div className="w-full text-center mt-6 sm:mt-7 pb-4"> 
          <span className="text-primary/70 text-sm"> 
            Already have an account? 
          </span> 
          <button  type="button"  onClick={() => navigate("/login")} 
            className="ml-2 text-primary font-bold hover:underline" 
          > 
            Login 
          </button> 
        </div> 
 
      </div> 
    </div> 
  ); 
}; 
 
export default memo(SignupChoice);``