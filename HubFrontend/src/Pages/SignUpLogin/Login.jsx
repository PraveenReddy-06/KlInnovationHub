import { memo,useState } from 'react';
import {useNavigate } from 'react-router-dom';
import axiosInstance from "../../Api/axiosInstance"

const Login = () => {
  
  const navigate = useNavigate()
  const [login,setLogin] = useState({mail:"",password:""})
  const handleChange = (e) => {
    setLogin({...login,[e.target.name]:e.target.value})
  };

  const[error,setError] = useState("");
  const handleClick = async (e) => {
    e.preventDefault()
    try {
      const res = await axiosInstance.post("/mail/login", login)
      if(res.data.message==="Welcome To DashBoard"){
        localStorage.setItem("studentId",res.data.studentId)
        localStorage.setItem("student", JSON.stringify(res.data.student))
        localStorage.setItem("token",res.data.token)
        if (window.gtag) {
          window.gtag("event", "login", {
            method: "email",
          });
        }
        setError("");
        navigate("/dashboard")
      }else {
        setError(res.data.message);
      }}
    catch (error) {
      if (error.response) {
        if (error.response.status === 429) {
          setError(error.response.data.message);
        }
        else {
          setError(error.response.data?.message || "Login failed");
        }
      }
      else {
          setError("Unable to connect to server");
        }
      }
  }

  const handleSignup = (e) => {
    e.preventDefault()
    navigate("/signup")
  }

return (
  
  <div className="min-h-screen relative overflow-hidden" >
    <img src="/LoginBg.png"className="absolute inset-0 w-full h-full object-cover object-[85%_center] lg:object-center"/>
    <div className="absolute inset-0" />

    <div className="relative z-10 flex min-h-screen items-center justify-center lg:justify-start ">
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-10 py-8">
        <div className="w-full max-w-md bg-primary/90 border border-gray-400 rounded-3xl p-5 sm:p-8 shadow-2xl">
          <h1 className="text-3xl sm:text-4xl text-cyan-500 font-bold sm-text-cream mb-2">Welcome Back </h1>
          <p className="text-sm sm:text-base text-amber-50 mb-8"> Sign in to continue your innovation journey</p>
          <div className="flex flex-col gap-4">
            <input type="email" name="mail" value={login.mail} onChange={handleChange}
              placeholder="Enter KL University Email"
              className="w-full p-3 sm:p-3 rounded-xl bg-white/10 border border-white/20 text-amber-50 placeholder-gray-500 outline-none focus:border-tan"
            />
            <input type="password" name="password" value={login.password} onChange={handleChange}
              placeholder="Enter Password"
              className="w-full p-3 sm:p-3 rounded-xl bg-white/10 border border-white/20 text-amber-50 placeholder-gray-500 outline-none focus:border-tan"
            />
            <div className="text-right">
              <button type="button" onClick={() => navigate("/forgotPassword")}
                className="text-cream text-sm hover:underline">
                Forgot Password?
              </button>
            </div>
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-red-300 text-sm">
                {error}
              </div>
            )}
            <button onClick={handleClick} disabled={!login.mail || !login.password}
              className="w-full bg-cyan-800 text-cream font-bold py-3 rounded-xl hover:scale-[1.02] transition active:scale-95 disabled:opacity-90">
              Login
            </button>
            <div className="flex justify-center items-center gap-2 mt-2">
              <span className="text-vanilla-custard">First Time?</span>
              <button onClick={handleSignup}
                className="text-gray-400 font-semibold hover:underline">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
);


};

export default memo(Login);