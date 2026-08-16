import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import axiosInstance from "../../Api/axiosInstance";

const ReviewerLogin = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState({ mail: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setLogin(previous => ({ ...previous, [event.target.name]: event.target.value }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axiosInstance.post("/reviewer/login", login);
      if (response.data?.token) {
        localStorage.setItem("reviewerToken", response.data.token);
        localStorage.setItem("reviewerId", response.data.reviewerId);
        localStorage.setItem("reviewer", JSON.stringify(response.data));
        navigate("/reviewer/dashboard");
      } else {
        setError(response.data?.message || "Login failed");
      }
    } catch (errorResponse) {
      setError(errorResponse.response?.data?.message || "Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-7 sm:p-9 shadow-2xl">
        <button onClick={() => navigate("/login")} className="inline-flex items-center gap-2 text-tan/80 hover:text-tan mb-8">
          <ArrowLeft size={18} /> Student Login
        </button>
        <p className="text-tan/70 text-sm uppercase tracking-widest">KL Innovation Hub</p>
        <h1 className="text-3xl sm:text-4xl font-black text-tan mt-2">Reviewer Login</h1>
        <p className="text-tan/70 mt-3">Use this login only after your reviewer application has been approved.</p>

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <input type="email" name="mail" value={login.mail} onChange={handleChange} placeholder="University Email" className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-tan placeholder-gray-400 outline-none" />
          <input type="password" name="password" value={login.password} onChange={handleChange} placeholder="Password" className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-tan placeholder-gray-400 outline-none" />
          {error && <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-3 text-red-200 text-sm">{error}</div>}
          <button type="submit" disabled={loading || !login.mail || !login.password} className="w-full bg-tan text-primary font-bold py-3 rounded-xl disabled:opacity-50">
            {loading ? "Signing in..." : "Reviewer Login"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-tan/70">Not a reviewer yet? </span>
          <button onClick={() => navigate("/signup/teacher")} className="text-tan font-semibold hover:underline">Apply here</button>
        </div>
      </div>
    </div>
  );
};

export default memo(ReviewerLogin);
