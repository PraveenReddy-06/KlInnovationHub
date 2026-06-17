import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [mail, setMail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;

  const sendOtp = async () => {
    setError("");
    setMessage("");
    if (!mail.trim()) {
      setError("Please enter your university email");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(`http://localhost:8080/mail/forgotPassword?mail=${mail}`);
      setMessage(res.data);
      setOtpSent(true);
    } catch (err) {
      setError("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setError("");
    setMessage("");
    if (!otp) {
      setError("Please enter OTP");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8080/mail/verifyResetOtp", {mail,otp: Number(otp),});
      if (res.data === "OTP Verified") {
        setOtpVerified(true);
        setMessage("OTP verified successfully");
      } else {
        setError(res.data);
      }
    } catch (err) {
      setError("OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    setError("");
    setMessage("");
    if (!passwordRegex.test(newPassword)) {
      setError("Password must contain uppercase, lowercase, number, symbol and be at least 10 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8080/mail/resetPassword", {mail, newPassword,});
      if (res.data === "Password Updated Successfully") {
        setResetSuccess(true);
        setMessage("Password updated successfully. Redirecting...");
        setTimeout(() => {navigate("/login");}, 2000);
      } else {
        setError(res.data);
      }
    } catch (err) {
      setError("Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-tan text-center mb-2">
          Forgot Password
        </h1>
        <p className="text-gray-300 text-center mb-8">Recover your account securely </p>
        {message && (
          <div className="mb-4 rounded-xl border border-green-500/30 bg-green-500/20 p-4 text-green-300 text-sm">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-lg bg-red-500/20 p-3 text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3 mb-6">
          <label className="text-tan font-medium">KL University Email</label>
          <input type="email" value={mail} onChange={(e) => setMail(e.target.value)} placeholder="2400032662@kluniversity.in"
                className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white outline-none"
          />
          <button onClick={sendOtp} disabled={loading}
            className="bg-tan text-primary font-bold py-3 rounded-xl hover:scale-[1.02] transition active:scale-95">
            Send OTP
          </button>
        </div>
        {otpSent && !otpVerified && (
          <div className="flex flex-col gap-3 mb-6 animate-fade-in">
            <label className="text-tan font-medium">Enter OTP</label>
            <input type="number" value={otp}onChange={(e) => setOtp(e.target.value)} placeholder="4 Digit OTP"
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white outline-none"
            />
            <button onClick={verifyOtp} disabled={loading}
              className="bg-green-600 text-white font-bold py-3 rounded-xl hover:scale-[1.02] transition active:scale-95">
              Verify OTP
            </button>
          </div>
        )}
        {otpVerified && (
          <div className="flex flex-col gap-3">
            <label className="text-tan font-medium">New Password</label>
            <input  type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password"
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white outline-none"
            />
            <label className="text-tan font-medium">Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password"
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white outline-none"
            />
            {newPassword && !passwordRegex.test(newPassword) && (
              <div className="text-yellow-300 text-sm leading-relaxed">
                Password must contain:
                <ul className="list-disc pl-5 mt-1">
                  <li>Minimum 10 characters</li>
                  <li>One uppercase letter</li>
                  <li>One lowercase letter</li>
                  <li>One number</li>
                  <li>One special character</li>
                </ul>
              </div>
            )}
            <button onClick={resetPassword} disabled={loading} className="mt-2 bg-tan text-primary font-bold py-3 rounded-xl hover:scale-[1.02] transition active:scale-95">
              Reset Password
            </button>
          </div>
        )}
        <button onClick={() => navigate("/login")} className="mt-6 w-full text-tan hover:underline">  Back to Login</button>
      </div>
    </div>
  );
};
export default ForgotPassword;