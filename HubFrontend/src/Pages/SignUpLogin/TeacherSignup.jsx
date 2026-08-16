import { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../../Api/axiosInstance";

const TeacherSignup = () => {
  const navigate = useNavigate();
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;

  const [form, setForm] = useState({
    name: "",
    mail: "",
    password: "",
    department: "",
    designation: "",
    reason: ""
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer(value => value - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (event) => {
    setForm(previous => ({ ...previous, [event.target.name]: event.target.value }));
  };

  const sendOtp = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.mail.trim() || !form.department || !form.designation) {
      toast.error("Please fill all required details");
      return;
    }
    if (!/^[A-Za-z]+(?:\s+[A-Za-z]+)*$/.test(form.name.trim())) {
      toast.error("Name can contain only letters and spaces");
      return;
    }
    if (!passwordRegex.test(form.password)) {
      toast.error("Password must contain uppercase, lowercase, number and at least 8 characters");
      return;
    }
    if (form.password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/reviewer/generateOtp", {
        name: form.name.trim(),
        mail: form.mail.trim(),
        password: form.password
      });
      if (response.data === "OTP sent successfully") {
        setOtpSent(true);
        setTimer(180);
        toast.success("OTP sent successfully");
      } else {
        toast.error(response.data);
      }
    } catch (error) {
      toast.error(error.response?.data || "Unable to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (event) => {
    event.preventDefault();
    if (otp.length !== 4) return;

    setLoading(true);
    try {
      const response = await axiosInstance.post("/reviewer/verifyOtp", {
        mail: form.mail.trim(),
        otp: Number(otp),
        department: form.department,
        designation: form.designation,
        reason: form.reason.trim()
      });
      if (response.data === "Email verified. Your reviewer application is pending admin approval.") {
        setVerified(true);
        toast.success("Application submitted successfully");
      } else {
        toast.error(response.data);
      }
    } catch (error) {
      toast.error(error.response?.data || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async (event) => {
    event.preventDefault();
    if (timer > 0 || loading) return;
    await sendOtp(event);
  };

  if (verified) {
    return (
      <div className="min-h-screen bg-tan flex items-center justify-center px-6">
        <div className="max-w-lg w-full bg-white rounded-3xl border border-amber-700 shadow-2xl p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary text-tan flex items-center justify-center text-2xl font-black">✓</div>
          <h1 className="text-3xl font-black text-primary mt-6">Application submitted</h1>
          <p className="text-bloodstone mt-4 leading-7">
            Your email is verified. Your Project Reviewer application is now waiting for administrator approval.
          </p>
          <p className="text-bloodstone mt-2">You can log in only after your application is approved.</p>
          <button onClick={() => navigate("/reviewer/login")} className="w-full mt-7 bg-primary text-tan font-bold py-3 rounded-xl">
            Go to Reviewer Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tan flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-amber-700 shadow-2xl p-6 sm:p-9">
        <button onClick={() => navigate("/signup")} className="inline-flex items-center gap-2 text-bloodstone font-semibold hover:underline mb-6">
          <ArrowLeft size={18} /> Back
        </button>
        <h1 className="text-3xl sm:text-4xl font-black text-primary">Become a Project Reviewer</h1>
        <p className="text-bloodstone mt-2">Verify your university email and submit your application for admin approval.</p>

        <form className="mt-8 space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <input name="name" value={form.name} onChange={handleChange} disabled={otpSent} maxLength={50} placeholder="Full Name *" className="w-full p-3 rounded-xl border border-amber-700 text-black outline-none disabled:bg-gray-100" />
            <input name="mail" value={form.mail} onChange={handleChange} disabled={otpSent} type="email" placeholder="University Email *" className="w-full p-3 rounded-xl border border-amber-700 text-black outline-none disabled:bg-gray-100" />
            <select name="department" value={form.department} onChange={handleChange} disabled={otpSent} className="w-full p-3 rounded-xl border border-amber-700 text-black outline-none disabled:bg-gray-100">
              <option value="">Department *</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="MECH">MECH</option>
              <option value="CIVIL">CIVIL</option>
              <option value="Other">Other</option>
            </select>
            <input name="designation" value={form.designation} onChange={handleChange} disabled={otpSent} placeholder="Designation *" className="w-full p-3 rounded-xl border border-amber-700 text-black outline-none disabled:bg-gray-100" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <input name="password" value={form.password} onChange={handleChange} disabled={otpSent} type={showPassword ? "text" : "password"} placeholder="Password *" className="w-full p-3 pr-11 rounded-xl border border-amber-700 text-black outline-none disabled:bg-gray-100" />
              <button type="button" onClick={() => setShowPassword(value => !value)} className="absolute right-3 inset-y-0 text-bloodstone">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="relative">
              <input value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} disabled={otpSent} type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password *" className="w-full p-3 pr-11 rounded-xl border border-amber-700 text-black outline-none disabled:bg-gray-100" />
              <button type="button" onClick={() => setShowConfirmPassword(value => !value)} className="absolute right-3 inset-y-0 text-bloodstone">
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <textarea name="reason" value={form.reason} onChange={handleChange} disabled={otpSent} rows="3" maxLength={500} placeholder="Why would you like to review student projects? (Optional)" className="w-full p-3 rounded-xl border border-amber-700 text-black outline-none disabled:bg-gray-100 resize-none" />

          {form.password && !otpSent && (
            <div className="text-sm text-red-600 space-y-1">
              {form.password.length < 8 && <p>• At least 8 characters</p>}
              {!/[A-Z]/.test(form.password) && <p>• One uppercase letter</p>}
              {!/[a-z]/.test(form.password) && <p>• One lowercase letter</p>}
              {!/\d/.test(form.password) && <p>• One number</p>}
              {passwordRegex.test(form.password) && <p className="text-emerald-700">✓ Strong password</p>}
            </div>
          )}

          {!otpSent ? (
            <button onClick={sendOtp} type="button" disabled={loading} className="w-full bg-primary text-tan font-bold py-3 rounded-xl disabled:opacity-50">
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          ) : (
            <>
              <div className="flex gap-3">
                <input value={otp} onChange={event => setOtp(event.target.value.replace(/\D/g, "").slice(0, 4))} inputMode="numeric" placeholder="Enter 4-digit OTP" className="flex-1 p-3 rounded-xl border border-amber-700 text-black outline-none" />
                <button onClick={verifyOtp} type="button" disabled={loading || otp.length !== 4} className="bg-primary text-tan font-bold px-6 rounded-xl disabled:opacity-50">
                  Verify
                </button>
              </div>
              <button onClick={resendOtp} type="button" disabled={timer > 0 || loading} className="w-full text-bloodstone font-semibold disabled:opacity-50">
                {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
              </button>
            </>
          )}
        </form>

        <div className="mt-6 pt-5 border-t border-amber-700 text-center">
          <button onClick={() => navigate("/reviewer/login")} className="text-bloodstone font-semibold hover:underline">Already approved? Reviewer Login</button>
        </div>
      </div>
    </div>
  );
};

export default memo(TeacherSignup);
