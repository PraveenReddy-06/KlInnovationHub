import { memo } from 'react';
import Navbar from "../../Components/Navbar";
import background from "../../Images/dashboardBg.png";

const SubmitProject = () => {
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
                <input type="text" placeholder="Project Title" className="p-2 border rounded"/>
                <select className="p-2 border rounded">
                    <option>AI/ML</option>
                    <option>Web Development</option>
                    <option>IoT</option>
                    <option>Robotics</option>
                </select>
                <div className="flex gap-2">
                    <input type="text" placeholder="Technology (e.g.React)" className="p-2 border rounded"/>
                    <input type="text" placeholder="Technology (e.g.Arduino)" className="p-2 border rounded"/>
                    <input type="text" placeholder="Language (e.g.Python)" className="p-2 border rounded"/>
                </div>
                <textarea placeholder="Detailed Description" className="p-2 border rounded h-28"></textarea>
            </div>

            <div className="w-1/2 flex flex-col gap-4 p-4 border-2 border-amber-950 rounded-xl">
                <h2 className="font-semibold text-lg">Links & Assets</h2>
                <input type="text" placeholder="GitHub Repository URL" className="p-2 border rounded"/>
                <input type="text" placeholder="Live Deployement URL" className="p-2 border rounded"/>
                <div className="border-2 border-dashed p-5 text-center rounded">
                    <p className="text-sm ">Upload Project Thumbnail</p>
                    <input  type="file" className="mt-2 bg-gray-300 rounded p-2"/>
                </div>
                <div className="flex gap-3 mt-3 active:scale-95">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded">Submit Project</button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default memo(SubmitProject);