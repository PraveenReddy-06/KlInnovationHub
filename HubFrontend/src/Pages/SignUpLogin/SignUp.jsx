import { memo,useState,useEffect } from 'react';
import axios from 'axios';
import {useNavigate } from 'react-router-dom';
import SignUpPage from "../../Images/SignUpPage.png"

const SignUp = () => {

    const [timer,setTimer] = useState(0);
    useEffect(()=>{
        let interval;
        if(timer>0) {interval = setInterval(() => {setTimer(prev => prev-1)},1000);} 
        return () => clearInterval(interval);
    }, [timer]);

    const [form,setForm] = useState({name:"",mail:"",password:""})

    const handleForm = (e) => {
        const updated = {...form,[e.target.name]: e.target.value};
        setForm(updated);
        setVerify(prev => ({...prev,mail: updated.mail}));
    };

    const [otpSent,setOtpSent] = useState(false);
    const handleSendOtp = async (e) => {
        e.preventDefault()
        if(confirmPassword===form.password){
            const res = await axios.post(`http://localhost:8080/mail/generateOtp`,form)
            alert(res.data)
            setTimer(180);
            setOtpSent(true)
        }else {
            alert("Enter same passwords");
        }
    }
    
    const [check,setCheck] = useState("")

    const handleOtp =(e) => {
      setVerify(prev => ({...prev,otp: e.target.value}));
    }

    const [verify, setVerify] = useState({ mail: "", otp: "" });
    const handleVerify = async (e) => {
       e.preventDefault()
       const res = await axios.post(`http://localhost:8080/mail/verifyOtp`,verify)
       setCheck(res.data)
       alert(res.data)
    }

    const navigate = useNavigate()
    const handleLoginIn = (e) => {
        e.preventDefault()
        if(check==="Verified You Can SignIn Now"){
        navigate("/login")
        }
    }

    const handleResend = async (e) => {
        e.preventDefault()
        const res = await axios.post(`http://localhost:8080/mail/resend/${form.mail}`)
        alert(res.data)
        setTimer(180);
    }

    const[confirmPassword,setConfirmPassword] = useState("");
    const handleConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
    }

  return (
   <div className="h-screen w-screen flex ">
        <div className=" w-full h-full bg-white flex ">
            <div className="w-1/2 flex justify-center items-center p-10">
                <img src={SignUpPage} alt="signup"/>
            </div>
            <div className=" w-1/2 flex flex-col justify-center items-center bg-blue-600">
                <h1 className="text-5xl mb-9 font-extrabold text-red-500">JOIN US</h1>
                <form onSubmit={handleLoginIn}>
                    <div className="flex gap-5">
                        <div className="flex flex-col gap-3">
                            <input className="bg-gray-200 p-2 " onChange={handleForm} name="name"      value={form.name}       type="text" placeholder="Enter Your Name"/>
                            <input className="bg-gray-200 p-2" onChange={handleForm} name="mail"      value={form.mail}       type="email" placeholder="Enter Kl University Mail"/>
                            <input className="bg-gray-200 p-2" onChange={handleForm} name="password"  value={form.password}   type="password" placeholder="Enter Password"/>
                            <input className="bg-gray-200 p-2" onChange={handleConfirmPassword} name="confirmPassword"  value={confirmPassword}   type="password" placeholder="Confirm Password"/>                        
                        </div>
                        <div className="flex flex-col gap-3 ">   
                            {timer === 0 ? (
                            <button className="bg-red-500 active:scale-95 rounded-2xl p-2" onClick={handleSendOtp}type="button"disabled={!form.name || !form.mail || !form.password}>
                                {otpSent? "Resend Otp":"Send Otp"}
                            </button>
                                ) : (
                            <button
                                className="bg-red-500 rounded-2xl p-2" disabled> Resend in {timer}s
                            </button>
                            )}
                            <input className="bg-gray-200 p-2" onChange={handleOtp} value={verify.otp} placeholder='Enter Otp' />
                            <button className="bg-red-500 active:scale-95 rounded-2xl p-2 text-white" type="button" onClick={handleVerify} disabled={!verify.otp}>Verify Otp</button>
                        </div>
                        {check==="Verified You Can SignIn Now" && (<a href="/login" className="bg-red-500 active:scale-95 rounded-2xl p-2 text-white">Login</a>)}
                    </div>
                </form>
            </div>
        </div>
    </div>            
  );
};

export default memo(SignUp);