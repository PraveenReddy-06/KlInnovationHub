import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Api/axiosInstance";

const ReviewerForgotPassword = () => {
  const navigate = useNavigate();
  const [mail, setMail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,64}$/;

  const sendOtp = async () => {
    setError("");
    setMessage("");
    if (!mail.trim()) {
      setError("Please enter your university email");
      return;
    }
    try {
      setLoading(true);
      setResetToken("");
      setOtp("");
      const res = await axiosInstance.post(`/reviewer/forgotPassword?mail=${encodeURIComponent(mail.trim())}`);
      if (res.data === "OTP Sent") {
        setOtpSent(true);
        setMessage("If the account is eligible, an OTP has been sent.");
      } else {
        setError(res.data);
      }
    } catch (err) {
      const detail = err.response?.data;
      setError(typeof detail === "string" ? detail : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setError("");
    setMessage("");
    if (otp.length !== 4) {
      setError("Enter the 4 digit OTP");
      return;
    }
    try {
      setLoading(true);
      const res = await axiosInstance.post("/reviewer/verifyResetOtp", {
        mail: mail.trim(),
        otp: Number(otp),
      });
      if (res.data?.resetToken) {
        setResetToken(res.data.resetToken);
        setMessage("OTP verified successfully");
      } else {
        setError(res.data?.message || "OTP verification failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    setError("");
    setMessage("");
    if (!passwordRegex.test(newPassword)) {
      setError("Password needs 10+ characters, uppercase, lowercase, number and symbol");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      const res = await axiosInstance.post("/reviewer/resetPassword", {
        mail: mail.trim(),
        newPassword,
        resetToken,
      });
      if (res.data === "Password Updated Successfully") {
        setResetToken("");
        setNewPassword("");
        setConfirmPassword("");
        setResetSuccess(true);
        setMessage("Password updated successfully. Redirecting to reviewer login...");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(res.data);
      }
    } catch (err) {
      const detail = err.response?.data;
      setError(typeof detail === "string" ? detail : "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl p-6 sm:p-8">
        <h1 className="text-3xl font-bold text-tan text-center mb-2">Reviewer Password Reset</h1>
        <p className="text-gray-300 text-center mb-7">Reset your faculty reviewer account password</p>

        {message && <div className="mb-4 rounded-xl bg-green-500/20 p-3 text-green-300 text-sm">{message}</div>}
        {error && <div className="mb-4 rounded-xl bg-red-500/20 p-3 text-red-300 text-sm">{error}</div>}

        <div className="flex flex-col gap-3">
          <label className="text-tan font-medium">University Email</label>
          <input
            type="email"
            value={mail}
            disabled={otpSent || loading}
            onChange={(e) => setMail(e.target.value)}
            placeholder="faculty@kluniversity.in"
            className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white outline-none disabled:opacity-60"
          />
          {!otpSent && (
            <button onClick={sendOtp} disabled={loading || otpSent || resetSuccess} className="bg-tan text-primary font-bold py-3 rounded-xl disabled:opacity-50">
              {loading ? "Sending..." : "Send OTP"}
            </button>
          )}
        </div>

        {otpSent && !resetToken && !resetSuccess && (
          <div className="mt-6 flex flex-col gap-3">
            <label className="text-tan font-medium">Enter OTP</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="4 digit OTP"
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white outline-none"
            />
            <button onClick={verifyOtp} disabled={loading} className="bg-green-600 text-white font-bold py-3 rounded-xl disabled:opacity-50">
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        )}

        {resetToken && !resetSuccess && (
          <div className="mt-6 flex flex-col gap-3">
            <label className="text-tan font-medium">New Password</label>
            <input
              type="password"
              value={newPassword} maxLength={64}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white outline-none"
            />
            <label className="text-tan font-medium">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white outline-none"
            />
            <button onClick={resetPassword} disabled={loading} className="mt-2 bg-tan text-primary font-bold py-3 rounded-xl disabled:opacity-50">
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </div>
        )}

        {otpSent && !resetSuccess && (
          <button type="button" disabled={loading} onClick={() => {
            setOtpSent(false);
            setOtp("");
            setResetToken("");
            setNewPassword("");
            setConfirmPassword("");
            setError("");
            setMessage("");
          }} className="mt-4 w-full text-tan hover:underline">
            Start over
          </button>
        )}
        <button onClick={() => navigate("/login")} className="mt-6 w-full text-tan hover:underline">
          Back to Reviewer Login
        </button>
      </div>
    </div>
  );
};

export default memo(ReviewerForgotPassword);
