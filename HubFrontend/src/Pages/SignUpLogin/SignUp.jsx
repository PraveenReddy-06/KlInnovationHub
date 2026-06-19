import { memo,useState,useEffect } from 'react';
import axios from 'axios';
import {useNavigate } from 'react-router-dom';

const SignUp = () => {

    const passwordRegex =/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;
    const [error,setError] = useState("");
    const [response,setResponse] = useState("");
    const [timer,setTimer] = useState(0);
    const [form,setForm] = useState({name:"",mail:"",password:""})
    const [loading,setLoading] = useState(false);


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
        setError("");
        setResponse("");
        setLoading(true);
        try {
          if (!passwordRegex.test(form.password)) {
            setError( "Password must contain uppercase, lowercase, number, special character and be at least 10 characters long");
            return;
        }
        if(confirmPassword===form.password){
            const res = await axios.post(`http://localhost:8080/mail/generateOtp`,form)
            setResponse(res.data)
            if(res.data === "If the email exists, OTP has been sent") {
                setTimer(180);
                setOtpSent(true);}
        }else {
            setError("Enter same passwords");
        }
    }finally {
      setLoading(false)
    }
  }
    
    const [check,setCheck] = useState(false)

    const handleOtp =(e) => {
      setVerify(prev => ({...prev,otp: e.target.value}));
    }

    const [verify, setVerify] = useState({ mail: "", otp: "" });
    const handleVerify = async (e) => {
       e.preventDefault()
      setError("");
      setResponse("");
       const res = await axios.post(`http://localhost:8080/mail/verifyOtp`,verify)
       setCheck(true)
       if(res.data === "Verified You Can SignIn Now"){
            setCheck(true);
            setResponse(res.data);
        }else{
            setError(res.data);
      }
    }

    const navigate = useNavigate()
    const handleLoginIn = (e) => {
        e.preventDefault()
        if(check){
        navigate("/login")
        }
    }
    const handleResend = async (e) => {
        e.preventDefault()
        setError("");
        setResponse("");
        try {
            const res = await axios.post(`http://localhost:8080/mail/resend?mail=${form.mail}`)
            setResponse(res.data)
            if(res.data === "Check your inbox for otp"){
                setTimer(180);
            }
        }catch(e){
            setError(e);
        }
    }

    const[confirmPassword,setConfirmPassword] = useState("");
    const handleConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
        setError("")
    }

return (
<div className="min-h-screen bg-tan flex">

  <div className="w-1/2 flex flex-col justify-center px-20">
    <h1 className="text-6xl font-black text-primary mb-6">JOIN THE<br />INNOVATION<br />MOVEMENT</h1>
    <p className="text-bloodstone text-xl max-w-lg">Build projects, form teams, showcase your ideas and turn imagination into impact.</p>
  </div>

  <div className="w-1/2 flex justify-center items-center">
    <div className="w-full max-w-xl bg-white/10 backdrop-blur-2xl border border-amber-700 rounded-3xl p-8 shadow-2xl">
      <h1 className="text-4xl font-bold text-primary mb-8 text-center">Create Account</h1>
      <form onSubmit={handleLoginIn}>
        <div className="grid grid-cols-2 gap-4">
          <input className="p-3 rounded-xl  border border-amber-700 text-black placeholder-bloodstone outline-none"
            onChange={handleForm} name="name" value={form.name}
            type="text" placeholder="Full Name"
          />
          <input className="p-3 rounded-xl border border-amber-700 text-black placeholder-bloodstone outline-none"
            onChange={handleForm} name="mail" value={form.mail}
            type="email" placeholder="KL University Email"
          />
          <input className="p-3 rounded-xl border border-amber-700 text-black placeholder-bloodstone outline-none"
            onChange={handleForm} name="password" value={form.password}
            type="password" placeholder="Password"
          />
          <input className="p-3 rounded-xl border border-amber-700 text-black placeholder-bloodstone outline-none"
            onChange={handleConfirmPassword} name="confirmPassword" value={confirmPassword}  type="password" placeholder="Confirm Password"
          />
          {form.password && !passwordRegex.test(form.password) && (
            <div className="col-span-2">
                Minimum 10 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character
            </div>
          )}
        </div>
        <div className="mt-5 flex gap-3">
          {timer === 0 ? (
            <button onClick={otpSent ? handleResend : handleSendOtp} type="button" disabled={loading || !form.name || !form.mail || !form.password}
                    className="flex-1 bg-primary text-tan font-bold py-3 rounded-xl hover:scale-[1.02] transition active:scale-95 "
            >
              {loading? "Sending OTP...": otpSent? "Resend OTP": "Send OTP"}
            </button>
          ) : (
            <button className="flex-1 bg-bloodstone text-white py-3 rounded-xl" disabled>
              Resend in {timer}s
            </button>
          )}
        </div>
        {response && (
          <div className="mt-3 bg-bloodstone/90 border border-amber-700 rounded-xl p-3 text-white text-sm">
            {response}
          </div>
        )}
        {otpSent && !check && (
          <div className="mt-5 flex gap-3">
            <input onChange={handleOtp}  value={verify.otp} placeholder="Enter OTP"
              className="flex-1 p-3 rounded-xl bg-white/10 border border-amber-800 text-black placeholder-bloodstone outline-none" 
            />
            <button className="bg-primary text-tan font-bold px-6 rounded-xl hover:scale-[1.02] transition"
              type="button" onClick={handleVerify} disabled={!verify.otp}>
              Verify
            </button>
          </div>)
        }
        {error && (
          <div className="mt-3 bg-bloodstone border-red-500/30 rounded-xl p-3 text-white">
            {error}
          </div>
        )}
        {check && (
          <a href="/login" className="block text-center mt-5 bg-MydarkGreen text-white font-bold py-3 rounded-xl">
            Continue To Login
          </a>
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