import { memo,useState } from 'react';
import {useNavigate } from 'react-router-dom';
import axios from "axios";

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
      const res = await axios.post("http://localhost:8080/mail/login",login)
      if(res.data.message==="Welcome To DashBoard"){
        localStorage.setItem("studentId",res.data.studentId)
        localStorage.setItem("student", JSON.stringify(res.data.student))
        localStorage.setItem("token",res.data.token)
        console.log(localStorage.getItem("token"))
        navigate("/dashboard")
      }else {
        setError(res.data.message);
      }}
    catch (error){
      setError("Something went wrong");
    }
  }

  const handleSignup = (e) => {
    e.preventDefault()
    navigate("/signup")
  }

return (
  
  <div className="min-h-screen relative overflow-hidden" >
    <img src="/LoginBg.png" className="absolute inset-0 w-400 h-full object-cover"/>
    <div className="absolute inset-0" />

    <div className="relative z-10 flex min-h-screen">
      <div className="w-1/2 flex items-center justify-center px-10">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          <h1 className="text-4xl font-bold text-tan mb-2">Welcome Back </h1>
          <p className="text-gray-300 mb-8"> Sign in to continue your innovation journey</p>
          <div className="flex flex-col gap-4">
            <input type="email" name="mail" value={login.mail} onChange={handleChange}
              placeholder="KL University Email"
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 outline-none focus:border-tan"
            />
            <input type="password" name="password" value={login.password} onChange={handleChange}
              placeholder="Enter Password"
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 outline-none focus:border-tan"
            />
            <div className="text-right">
              <button type="button" onClick={() => navigate("/forgotPassword")}
                className="text-tan text-sm hover:underline">
                Forgot Password?
              </button>
            </div>
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-red-300 text-sm">
                {error}
              </div>
            )}
            <button onClick={handleClick} disabled={!login.mail || !login.password}
              className="bg-tan text-primary font-bold py-3 rounded-xl hover:scale-[1.02] transition active:scale-95 disabled:opacity-50">
              Login
            </button>
            <div className="flex justify-center items-center gap-2 mt-2">
              <span className="text-gray-300">First Time?</span>
              <button onClick={handleSignup}
                className="text-tan font-semibold hover:underline">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
    <div className="w-1/2"></div>
  </div>
);


};

export default memo(Login);