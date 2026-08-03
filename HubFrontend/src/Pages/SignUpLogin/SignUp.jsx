import { memo,useState,useEffect } from 'react';
import {useNavigate } from 'react-router-dom';
import axiosInstance from '../../Api/axiosInstance';
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

const SignUp = () => {

    const passwordRegex =/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
    const [timer,setTimer] = useState(0);
    const [form,setForm] = useState({name:"",mail:"",password:""})
    const [loading,setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    useEffect(()=>{
        let interval;
        if(timer>0) {interval = setInterval(() => {setTimer(prev => prev-1)},1000);} 
        return () => clearInterval(interval);
    }, [timer]);


    const handleForm = (e) => {
        const updated = {...form,[e.target.name]: e.target.value};
        setForm(updated);
        setVerify(prev => ({...prev,mail: updated.mail}));
    };

    const [otpSent,setOtpSent] = useState(false);
    const handleSendOtp = async (e) => {
        e.preventDefault()
        setLoading(true);
        try {
          if (!passwordRegex.test(form.password)) {
            toast.error("Password must be at least 8 characters with uppercase, lowercase and a number.");
            return;
        }
        if(confirmPassword===form.password){
            const res = await axiosInstance.post(`/mail/generateOtp`,form)
            if(res.data === "If the email exists, OTP has been sent") {
                toast.success("OTP sent successfully");
                setTimer(180);
                setOtpSent(true);
            }else {
              toast.error(res.data)
            }
        }else {
            toast.error("Passwords do not match");
        }
    }catch(err){
      toast.error("Unable to send OTP");
    }
    finally{
      setLoading(false);
    }
  }
    
    const [check,setCheck] = useState(false)

    const handleOtp =(e) => {
      setVerify(prev => ({...prev,otp: e.target.value}));
    }

    const [verify, setVerify] = useState({ mail: "", otp: "" });
    const handleVerify = async (e) => {
       e.preventDefault()
      try{
       const res = await axiosInstance.post(`/mail/verifyOtp`,verify)
       if(res.data === "Verified You Can SignIn Now"){
            setCheck(true);
            if (window.gtag) {
              window.gtag("event", "sign_up", {
                method: "email",
              });
            }
            toast.success("OTP verified successfully");
        }else{
            setCheck(false)
            toast.error(res.data);
      }}catch (err) {
        setCheck(false)
        toast.error(err.response?.data || "Verification failed");
      }
    }

    const navigate = useNavigate()

    const handleResend = async (e) => {
        e.preventDefault()
        if (loading) return;
        setLoading(true);
        try {
            const res = await axiosInstance.post(`/mail/resend?mail=${encodeURIComponent(form.mail)}`)
            if(res.data === "Check your inbox for otp"){
                toast.success("OTP sent successfully");              
                setTimer(180);
            }else {
              toast.error(res.data);
            } 
        }catch(e){
          toast.error(
              e.response?.data ||
              "Failed to resend OTP"
          );
        }finally {
          setLoading(false);
        }
    }

    const[confirmPassword,setConfirmPassword] = useState("");
    const handleConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
    }

return (
<div className="min-h-screen bg-tan flex flex-col lg:flex-row">

  <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-10 lg:px-20 py-10 lg:py-0 text-center lg:text-left">
    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-primary mb-6">JOIN THE<br />INNOVATION<br />MOVEMENT</h1>
    <p className="text-bloodstone text-base sm:text-lg lg:text-xl max-w-lg mx-auto lg:mx-0">Build projects, form teams, showcase your ideas and turn imagination into impact.</p>
  </div>

  <div className="w-full lg:w-1/2 flex justify-center items-center px-4 sm:px-6 lg:px-0 pb-10 lg:pb-0">
    <div className="w-full max-w-xl bg-white/10 backdrop-blur-2xl border border-amber-700 rounded-3xl p-5 sm:p-8 shadow-2xl">
      <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-8 text-center">Create Account</h1>
      <form>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input className="p-3 rounded-xl  border border-amber-700 text-black placeholder-bloodstone outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            onChange={handleForm} name="name" value={form.name}
            type="text" placeholder="Full Name" disabled={otpSent}
          />
          <input className="p-3 rounded-xl border border-amber-700 text-black placeholder-bloodstone outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            onChange={handleForm} name="mail" value={form.mail}
            type="email" placeholder="KL University Email" disabled={otpSent}
          />
          <div className="relative">
              <input  className="w-full p-3 rounded-xl border border-amber-700 text-black placeholder-bloodstone outline-none pr-10 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  onChange={handleForm} name="password"  value={form.password}  type={showPassword ? "text" : "password"}
                  placeholder="Password" disabled={otpSent}
              />
              <button
                  type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 inset-y-0 flex items-center text-bloodstone/70 hover:text-black"
              >
                {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
              </button>
          </div>
          <div className="relative">
              <input className="w-full p-3 rounded-xl border border-amber-700 text-black placeholder-bloodstone outline-none pr-10 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  onChange={handleConfirmPassword}  value={confirmPassword}  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password" disabled={otpSent}
              />
              <button  type="button"  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 inset-y-0 flex items-center text-bloodstone/70 hover:text-black"
              >
                {showConfirmPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
              </button>
          </div>
          {form.password && (
            <div className="col-span-2 text-sm text-red-600 space-y-1">
              {form.password.length < 8 && (<p>• Password must be at least 8 characters</p>)}
              {!/[A-Z]/.test(form.password) && (<p>• Add one uppercase letter</p>)}
              {!/[a-z]/.test(form.password) && (<p>• Add one lowercase letter</p>)}
              {!/\d/.test(form.password) && (<p>• Add one number</p>)}
              {passwordRegex.test(form.password) && (<p className="text-emerald-700">✓ Strong password</p>)}
            </div>
          )}
          {confirmPassword && (
            <p className={`col-span-2 text-sm ${confirmPassword === form.password? "text-emerald-700" : "text-red-600"}`}>
              {confirmPassword === form.password? "✓ Passwords match": "✗ Passwords do not match"}
            </p>
          )}
        </div>
        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          {timer === 0 ? (
            <button onClick={otpSent ? handleResend : handleSendOtp} type="button" disabled={loading || !form.name.trim() || !form.mail.trim() || !passwordRegex.test(form.password) || confirmPassword !== form.password}
                    className="flex-1 bg-primary text-tan font-bold py-3 rounded-xl hover:scale-[1.02] transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading? "Sending OTP...": otpSent? "Resend OTP": "Send OTP"}
            </button>
          ) : (
            <button className="flex-1 bg-bloodstone text-white py-3 rounded-xl" disabled>
              Resend in {timer}s
            </button>
          )}
        </div>
        {otpSent && !check && (
          <div className="mt-5 flex gap-3">
            <input onChange={handleOtp}  value={verify.otp} placeholder="Enter OTP"
              className="flex-1 p-3 rounded-xl bg-white/10 border border-amber-800 text-black placeholder-bloodstone outline-none" 
            />
            <button className="bg-primary text-tan font-bold px-6 rounded-xl hover:scale-[1.02] transition disabled:cursor-not-allowed disabled:opacity-50"
              type="button" onClick={handleVerify} disabled={verify.otp.length !== 4}>
              Verify
            </button>
          </div>)
        }
        {check && (
            <button  type="button"  onClick={() => navigate("/login")}
                className="w-full mt-5 bg-MydarkGreen text-white font-bold py-3 rounded-xl hover:opacity-90"
            >
               Continue To Login
            </button>
        )}
      </form>
        <div className="mt-6 pt-5 border-t border-amber-700 flex justify-center items-center gap-2">
            <span className="text-bloodstone"> Already have an account?</span>
            <button type="button" onClick={() => navigate("/login")} className="text-bloodstone font-semibold hover:underline">
                Login
            </button>
        </div>
    </div>
  </div>
</div>
);
};
export default memo(SignUp);