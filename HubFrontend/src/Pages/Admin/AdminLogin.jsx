import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Eye, EyeOff, LockKeyhole, Mail, ArrowLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import adminAxiosInstance from "../../Api/adminAxiosInstance";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ mail: "", password: "", authenticatorCode: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: name === "authenticatorCode" ? value.replace(/\D/g, "") : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.mail.trim() || !form.password) {
      toast.error("Please enter your email and password");
      return;
    }

    if (!/^[0-9]{6}$/.test(form.authenticatorCode)) {
      toast.error("Enter the six-digit code from your authenticator app");
      return;
    }

    try {
      setLoading(true);

      const response = await adminAxiosInstance.post("/admin/login", {
        mail: form.mail.trim(),
        password: form.password,
        authenticatorCode: form.authenticatorCode,
      });

      const data = response.data;

      if (!data?.token) {
        toast.error(data?.message || "Unable to login");
        return;
      }

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("admin",JSON.stringify({name: data.name,email: data.email,}));

      toast.success(data.message || "Login successful");
      navigate("/admin/dashboard", { replace: true });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        error.response?.data ||
        "Invalid admin credentials"
      );
    } finally {
      setLoading(false);
      setForm((previous) => ({ ...previous, authenticatorCode: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-10 items-center">
        {/* LEFT SIDE */}
        <div className="hidden lg:block px-8">
          <div className="inline-flex items-center gap-2 bg-tan text-primary px-4 py-2 rounded-full text-sm font-bold">
            <ShieldCheck size={17} />
            ADMINISTRATION
          </div>

          <h1 className="mt-7 text-5xl font-black leading-tight text-white">
            Manage the
            <br />
            <span className="text-light-blue">Innovation Hub.</span>
          </h1>

          <p className="mt-6 max-w-lg text-sky text-lg leading-8">
            Manage reviewer applications and maintain the project review process of KL Innovation Hub.
          </p>

          <div className="mt-10 space-y-6">
            <Feature
              number="01"
              title="Review Applications"
              description="Evaluate faculty applications to become project reviewers."
            />
            <Feature
              number="02"
              title="Approve Reviewers"
              description="Give qualified faculty members access to the reviewer platform."
            />
            <Feature
              number="03"
              title="Maintain Quality"
              description="Keep the project review process organized and reliable."
            />
          </div>
        </div>

        {/* LOGIN CARD */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-tan rounded-3xl border border-black shadow-2xl p-7 sm:p-9">
            {/* BACK */}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-primary text-sm font-semibold hover:underline mb-8"
            >
              <ArrowLeft size={17} />
              Back to KL Innovation Hub
            </button>

            {/* ICON */}
            <div className="w-14 h-14 rounded-2xl bg-primary text-tan flex items-center justify-center">
              <ShieldCheck size={28} />
            </div>

            <p className="mt-6 text-xs uppercase tracking-[0.2em] text-accent font-bold">
              Administrator
            </p>

            <h2 className="mt-2 text-3xl font-black text-primary">
              Admin Login
            </h2>

            <p className="mt-2 text-sm text-bloodstone">
              Sign in to manage KL Innovation Hub.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {/* EMAIL */}
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Email
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <input
                    type="email"
                    name="mail"
                    value={form.mail}
                    onChange={handleChange}
                    placeholder="Admin email"
                    autoComplete="username"
                    className="w-full rounded-xl border border-gray-800 bg-white text-black pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-gray-800 bg-white text-black pl-10 pr-11 py-3 outline-none focus:ring-2 focus:ring-primary"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="admin-authenticator-code" className="block text-sm font-semibold text-primary mb-2">
                  Authenticator code
                </label>
                <input
                  id="admin-authenticator-code"
                  name="authenticatorCode"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={form.authenticatorCode}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-800 bg-white text-black px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-tan rounded-xl py-3.5 font-bold flex items-center justify-center gap-2 hover:bg-secondary transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ShieldCheck size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-7 pt-5 border-t border-gray-800">
              <p className="text-xs text-center text-gray-700">
                Restricted administrator access
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Feature = ({ number, title, description }) => {
  return (
    <div className="flex gap-4 items-start">
      <div className="w-10 h-10 shrink-0 rounded-full bg-secondary flex items-center justify-center text-light-blue font-bold text-sm">
        {number}
      </div>

      <div>
        <h3 className="text-light-blue font-bold">
          {title}
        </h3>

        <p className="mt-1 text-sm text-sky leading-6">
          {description}
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;