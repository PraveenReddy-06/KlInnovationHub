import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Api/axiosInstance";

const Login = () => {
  const navigate = useNavigate();

  const [loginType, setLoginType] = useState("student");
  const [login, setLogin] = useState({mail: "",  password: ""});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setLogin({...login,[e.target.name]: e.target.value
    });
    setError("");
  };

  const handleTypeChange = (type) => {
    setLoginType(type);
    setLogin({ mail: "",password: ""});
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (loginType === "student") {
        const res = await axiosInstance.post("/mail/login",login);
        if (res.data.message === "Welcome To DashBoard") {
          localStorage.setItem("studentId",res.data.studentId);
          localStorage.setItem("student", JSON.stringify(res.data.student));
          localStorage.setItem( "token",res.data.token);
          if (window.gtag) {
            window.gtag("event", "login", {
              method: "email"
            });
          }
          navigate("/dashboard");
        } else {
          setError(
            res.data.message || "Login failed"
          );
        }
      }

      else {
        const response = await axiosInstance.post("/reviewer/login",  login);
        if (response.data?.token) {
          localStorage.setItem("reviewerToken", response.data.token);
          localStorage.setItem("reviewerId", response.data.reviewerId);
          localStorage.setItem( "reviewer",JSON.stringify(response.data));
          navigate("/reviewerDashboard");
        } else {
          setError(
            response.data?.message || "Login failed"
          );
        }
      }
    } catch (errorResponse) {
      setError(errorResponse.response?.data?.message ||"Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const isStudent = loginType === "student";

  return (
    <div className="min-h-screen relative overflow-hidden">
      <img src={"/LoginBg.png"} alt=""
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="relative z-10 flex min-h-screen items-center justify-start px-6 lg:px-16">
        <div className="w-full max-w-md ml-0 lg:ml-40 bg-primary/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="flex p-1 rounded-xl bg-black/30 border border-white/10 mb-8">
            <button type="button" onClick={() => handleTypeChange("student")}
              className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ${
                isStudent
                  ? "bg-tan text-primary shadow-md"
                  : "text-tan/60 hover:text-tan"
              }`}
            >
              Student
            </button>

            <button type="button" onClick={() => handleTypeChange("teacher")}
              className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ${
                !isStudent
                  ? "bg-tan text-primary shadow-md"
                  : "text-tan/60 hover:text-tan"
              }`}
            >
              Teacher
            </button>
          </div>

          <p className="text-accent text-xs uppercase tracking-[0.2em] font-semibold">  KL Innovation Hub</p>
          <h1 className="text-3xl sm:text-4xl text-tan font-bold mt-2">  Welcome Back</h1>
          <p className="text-sm sm:text-base text-amber-50/80 mt-2 mb-8">
            {isStudent  ? "Sign in to continue your innovation journey."  : "Guide Innovation. Shape the Future."}
          </p>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input type="email" name="mail" value={login.mail} onChange={handleChange}
              placeholder={isStudent ? "Enter KL University Email" : "Enter University Email"}
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 outline-none focus:border-tan transition"
            />

            <input type="password" name="password" value={login.password} onChange={handleChange}
              placeholder="Enter Password"
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 outline-none focus:border-tan transition"
            />

            <div className="text-right">
              <button type="button"
                onClick={() => navigate(isStudent ? "/forgotPassword" : "/reviewer/forgot-password")}
                className="text-cream text-sm hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-red-300 text-sm">
                {error}
              </div>
            )}
            <button type="submit" disabled={loading || !login.mail || !login.password}
              className="w-full bg-tan text-primary font-bold py-3 rounded-xl transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading? "Logging in...": isStudent? "Login": "Login"}
            </button>
          </form>

          <div className="flex justify-center items-center gap-2 mt-6">
            <span className="text-vanilla-custard">
              {isStudent ? "First Time?" : "Not a reviewer yet?"}
            </span>
            <button type="button" onClick={() => navigate(isStudent ? "/signup/student" : "/signup/teacher")}
              className="text-tan font-semibold hover:underline"
            >
              {isStudent ? "Sign Up" : "Register here"}
            </button>
          </div>
          <div className="mt-6 pt-5 border-t border-white/20 text-center">
            <button type="button" onClick={() => handleTypeChange(isStudent ? "teacher" : "student")}
              className="text-accent text-sm font-semibold hover:text-tan transition"
            >
              {isStudent  ? "Are you Faculty? Login here"  : "Are you a Student? Login here"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Login);