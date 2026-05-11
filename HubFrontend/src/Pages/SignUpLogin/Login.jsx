import { memo,useState } from 'react';
import axios from 'axios';
import {useNavigate } from 'react-router-dom';

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
      const res = await axios.post(`http://localhost:8080/mail/login`,login)
      if(res.data.message==="Welcome To DashBoard"){
        localStorage.setItem("studentId",res.data.studentId)
        localStorage.setItem("student", JSON.stringify(res.data.student))
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
    <div className="h-screen w-screen flex ">
      <div className=" w-1/2 flex flex-col justify-center items-center gap-5 bg-blue-600">
        <h1 className="text-5xl mb-9 font-extrabold text-red-500 px-20">Hey Pal! Great To See You Again</h1>     
          <input className="bg-gray-200 p-2 w-75" onChange={handleChange} name="mail" value={login.mail} type="email" placeholder=" Kl University Mail Here"/>
          <input className="bg-gray-200 p-2 w-75"  onChange={handleChange}name="password" value={login.password} type="password" placeholder="Password Here"/>
            {error && (<p className="text-red-200 text-sm font-medium w-75">{error}</p>)}
          <button className="bg-red-500 active:scale-95 rounded-2xl p-2 w-75" onClick={handleClick} type="button" disabled={!login.mail || !login.password} >Let's Go </button>
          <div className="flex items-center gap-5">
            <h1 className="text-red-500 font-bold">First Time? </h1>
            <button className="bg-red-500 active:scale-95 rounded-2xl p-2 w-30" onClick={handleSignup}>SignUp</button>
          </div>
      </div>
      <div className="w-1/2 flex justify-center items-center">
        <h1>Image</h1>
      </div>
    </div>
  );
};

export default memo(Login);