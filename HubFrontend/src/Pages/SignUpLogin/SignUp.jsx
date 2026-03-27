import { memo,useState } from 'react';
import axios from 'axios';
import {useNavigate } from 'react-router-dom';
import SignUpPage from "../../Images/SignUpPage.png"

const SignUp = () => {
    const [form,setForm] = useState({name:"",mail:"",password:""})
    const handleForm = (e) => {
        setForm({...form,[e.target.name]:e.target.value})
    };
    const handleSendOtp = async (e) => {
        e.preventDefault()
        const res = await axios.post(`http://localhost:8080/api/mail/generateOtp`,form)
        alert(res.data)
    }

    const [otp,setOtp] = useState("")
    const [check,setCheck] = useState("")
    const handleOtp =(e) => {
        setOtp(e.target.value)
    }
    const handleVerify = async (e) => {
       e.preventDefault()
       const res = await axios.post(`http://localhost:8080/api/mail/verify/${form.mail}/${otp}`)
       setCheck(res.data)
       alert(res.data)
    }

    const navigate = useNavigate()
    const handleLoginIn = (e) => {
        e.preventDefault()
        if(check==="Verified You Can LoginIn Now"){
        navigate("/login")
        }
    }

    const handleResend = async (e) => {
        e.preventDefault()
        const res = await axios.post(`http://localhost:8080/api/mail/resend/${form.mail}`)
        alert(res.data)
    }

  return (
   <div className="h-screen w-screen flex ">
        <div className=" w-full h-full bg-white flex ">
            <div className="w-1/2 flex justify-center items-center p-10">
                <img src={SignUpPage} alt="signup"/>
            </div>
            <div className=" w-1/2 flex flex-col justify-center items-center bg-amber-100">
                <h1 className="text-5xl mb-9 font-extrabold text-red-500">JOIN US</h1>
                <form onSubmit={handleLoginIn}>
                    <div className="flex flex-col gap-5">
                        <input className="bg-gray-200 p-2 " onChange={handleForm} name="name"      value={form.name}       type="text" placeholder="Enter Your Name"/>
                        <input className="bg-gray-200 p-2" onChange={handleForm} name="mail"      value={form.mail}       type="email" placeholder="Enter Kl University Mail"/>
                        <input className="bg-gray-200 p-2" onChange={handleForm} name="password"  value={form.password}   type="password" placeholder="Enter Password"/>
                        <div className="flex justify-between p-3 text-white">
                            <button className="bg-red-500 active:scale-95 rounded-2xl p-2"onClick={handleSendOtp}  type="button" disabled={!form.name || !form.mail || !form.password} > Get OTP </button>
                            <button className="bg-red-500 active:scale-95 rounded-2xl p-2"onClick={handleResend}  type="button" disabled={!form.name || !form.mail || !form.password} >Resend</button>
                        </div>                       
                        <input className="bg-gray-200 p-2" onChange={handleOtp} value={otp} placeholder='Enter Otp' />
                        <button className="bg-red-500 active:scale-95 rounded-2xl p-2 text-white"type="button" onClick={handleVerify} disabled={!otp}>Verify Otp</button>

                        {check==="Verified You Can SignIn Now" && (<button className="bg-red-500 active:scale-95 rounded-2xl p-2 text-white"type="submit">Login</button>)}
                    </div>
                </form>
            </div>
        </div>
    </div>            
  );
};

export default memo(SignUp);