import { memo,useState } from 'react';
import Navbar from "../../Components/Navbar";
import axios from "axios";
import background from "../../Images/dashboardBg.png";
import Dashboard from '../Main/Dashboard';
import { useNavigate } from "react-router-dom";


const SubmitProject = () => {
    const id = 2400032662;
    const[project,SetProject] = useState({projectName:"",choice:"",tech1:"",tech2:"",tech3:"",description:"",githubUrl:"",liveUrl:""})

    const handleChange = (e) => {
        SetProject(prev =>({...prev,[e.target.name]:e.target.value}))
    }
    
    const[projectStatus,setProjectStatus] = useState(false)
    const navigate = useNavigate();
    const handleSubmit = async () => {
        try {
            const res = await axios.post(`http://localhost:8080/project/submit/${id}`,project);
            console.log(res.data);
            if (res.data === "Project Submitted Sucessfully") {
                setProjectStatus(true);
                setTimeout(() => { navigate("/dashboard");}, 3000);
            }
        } catch (err) {
            console.error(err);
        }
    };


  return (
    <div>
        <Navbar/>

        <div className ="flex px-10 py-5 gap-5 items-center bg-blue-100 text-black">
            <div className ="w-1/2 flex flex-col gap-3">
            <h1 className =" text-3xl font-bold">Unleash Your Potential at the Hub!</h1>
            <p className="font-serif">Join today to give life to your projects and share your innovation with peers.</p>
            </div>
            <div className="w-1/2 flex justify-center items-center">
            <img src={background} className="h-40 w-100" alt=""/>
            </div>
        </div>

        <div className=" flex w-full py-15 px-5 gap-5">
            <div className="w-1/5 flex flex-col gap-4 p-4 border-2 border-amber-950 rounded-xl">
                <h2 className="font-semibold text-lg">Student Info</h2>
                <div>Profile Pic</div>
                <div className="flex flex-col gap-2 p-2">
                    <div className="rounded p-2  bg-blue-300">Student Name </div>
                    <div className="rounded p-2  bg-blue-300">Student Id </div>
                    <div className="rounded p-2  bg-blue-300">Student year</div>
                    <div className="rounded p-2  bg-blue-300">Student branch</div>
                </div>
            </div>

            <div className="w-1/2 flex flex-col gap-4 p-4 border-2 border-amber-950 rounded-xl">
                <h2 className="font-semibold text-lg">Project Information</h2>
                <input onChange={handleChange} name="projectName" value={project.projectName} type="text" placeholder="Project Title" className="p-2 border rounded"/>
                <select name="choice" value={project.choice} onChange={handleChange} className="p-2 border rounded">
                    <option>AI/ML</option>
                    <option>Web Development</option>
                    <option>IoT</option>
                    <option>Robotics</option>
                </select>
                <div className="flex gap-2">
                    <input onChange={handleChange} name="tech1" value={project.tech1} type="text" placeholder="Technology (e.g.React)" className="p-2 border rounded"/>
                    <input onChange={handleChange} name="tech2" value={project.tech2} type="text" placeholder="Technology (e.g.Arduino)" className="p-2 border rounded"/>
                    <input onChange={handleChange} name="tech3" value={project.tech3} type="text" placeholder="Language (e.g.Python)" className="p-2 border rounded"/>
                </div>
                <textarea onChange={handleChange} name="description" value={project.description} placeholder="Detailed Description" className="p-2 border rounded h-28"></textarea>
            </div>

            <div className="w-1/2 flex flex-col gap-4 p-4 border-2 border-amber-950 rounded-xl">
                <h2 className="font-semibold text-lg">Links & Assets</h2>
                <input onChange={handleChange} name="githubUrl" value={project.githubUrl} type="text" placeholder="GitHub Repository URL" className="p-2 border rounded"/>
                <input onChange={handleChange} name="liveUrl"   value={project.liveUrl}   type="text" placeholder="Live Deployement URL" className="p-2 border rounded"/>
                <div className="flex gap-3 mt-3 active:scale-95">
                    <button onClick={handleSubmit}  className="bg-blue-600 text-white px-4 py-2 rounded" >Submit Project</button>
                </div>
                {projectStatus && (
                    <div>
                        <div className="rounded bg-green-400">Project Submitted Successfully Redirecting...</div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default memo(SubmitProject);